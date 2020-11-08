import { Feature } from '@sextant-tools/core';
import { useMachine } from '@xstate/compiled/react';
import AceEditor from 'react-ace';
import { useInterval } from './components/useInterval';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-graphqlschema';
import 'ace-builds/src-noconflict/theme-xcode';
import React, { useEffect, useMemo } from 'react';
import ContentEditable from 'react-contenteditable';
import { Link, useHistory } from 'react-router-dom';
import {
  assignToSearchParams,
  clientSaveToDatabase,
} from './components/clientSaveToDatabase';
import HeroIconGlobe from './components/icons/HeroIconGlobe';
import { keepDataInSyncMachine } from './components/keepDataInSync.machine';
import {
  ScenarioDiagram,
  ScenarioDiagramWrapper,
} from './components/ScenarioDiagram';
import { useSearchParams } from './components/useSearchParams';
import { getDatabaseSaveMode } from './components/getDatabaseSaveMode';

const HomePage = () => {
  const history = useHistory();
  const params = useSearchParams<{ featureId: string }>();

  const [state, dispatch] = useMachine(keepDataInSyncMachine, {
    actions: {
      goToInitialFeature() {
        history.replace(
          `/?${assignToSearchParams(window.location.search, {
            featureId: 'initial',
          })}`,
        );
      },
      goToFirstFeature(context) {
        const targetFeatureId = Object.values(context.database.features)[0].id;

        history.replace(
          `/?${assignToSearchParams(window.location.search, {
            featureId: targetFeatureId,
          })}`,
        );
      },
      saveToDatabase: (context) => {
        return clientSaveToDatabase(context.database, history);
      },
    },
  });

  const selectedFeatureId = params?.featureId as string;

  const feature: Feature | undefined =
    state.context.database.features[selectedFeatureId || ''];

  const scenarios = useMemo(() => Object.values(feature?.scenarios || {}), [
    feature,
  ]);

  useInterval(
    () => {
      if (state.matches('editing') && getDatabaseSaveMode() === 'cli') {
        fetch(`/api/ping`).catch((e) => {
          dispatch({
            type: 'REPORT_SERVER_NOT_RUNNING',
          });
        });
      }
    },
    2500,
    [state.matches('editing')],
  );

  useEffect(() => {
    if (!feature) {
      dispatch({
        type: 'FEATURE_NOT_FOUND',
      });
    }
    // eslint-disable-next-line
  }, [feature, state.value]);

  switch (true) {
    case state.matches('serverNotRunning'):
      return (
        <div className="max-w-lg p-6 text-gray-700">
          <p>
            Sextant couldn't reach the terminal where the application is
            running. Try restarting it.
          </p>
        </div>
      );
    case state.matches('recoveringFromError'):
      return <div>Something went wrong</div>;
    case Boolean(state.matches('editing') && feature): {
      return (
        <div className="flex flex-col h-screen overflow-hidden">
          <div className="flex items-center justify-between flex-shrink-0 h-12 px-4 border-t-4 border-primary-600">
            <h1 className="flex items-center font-bold tracking-widest uppercase text-primary-800">
              sextant
            </h1>
            <div className="flex items-center mr-4 space-x-10 text-sm tracking-wider text-gray-700">
              <a href="https://github.com/mattpocock/sextant" target="_blank">
                GitHub
              </a>
              <a href="https://docs.sextant.tools" target="_blank">
                Docs
              </a>
              <button
                className="flex items-center space-x-2 text-primary-800"
                onClick={() => dispatch('GET_SHARE_LINK')}
              >
                <HeroIconGlobe className="w-5 h-5 text-primary-600" />
                <span>Share</span>
              </button>
            </div>
          </div>
          <div className="flex flex-grow overflow-hidden border-t-2">
            <div className="flex-shrink-0 w-48 h-full px-4 py-4 border-r-2">
              <h1 className="mb-2">Features</h1>
              <div className="mb-4 space-y-2">
                {Object.values(state.context.database.features).map(
                  (feature) => {
                    return (
                      <Link
                        to={`/?${assignToSearchParams(window.location.search, {
                          featureId: feature.id,
                        })}`}
                        className="block text-sm text-gray-700"
                      >
                        {feature?.name}
                      </Link>
                    );
                  },
                )}
              </div>
              <button
                onClick={() => {
                  dispatch({
                    type: 'ADD_FEATURE',
                  });
                }}
                className="px-3 py-1 text-sm text-gray-700 bg-gray-200"
              >
                Add Feature
              </button>
            </div>
            <div className="flex flex-grow overflow-hidden">
              <div className="flex-col flex-1 p-6 space-y-6 overflow-y-auto">
                <div>
                  <ContentEditable
                    className="inline-block text-2xl"
                    html={feature?.name}
                    tagName="h1"
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FEATURE_NAME',
                        name: e.target.value,
                        featureId: selectedFeatureId,
                      });
                    }}
                  ></ContentEditable>
                  <ContentEditable
                    html={feature?.description || ''}
                    tagName="p"
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_FEATURE_DESCRIPTION',
                        description: e.target.value,
                        featureId: selectedFeatureId,
                      });
                    }}
                    className="mt-1 text-xs leading-relaxed text-gray-700"
                  ></ContentEditable>
                </div>
                {scenarios.map((scenario, scenarioIndex) => {
                  return (
                    <ScenarioDiagramWrapper
                      title={scenario.name}
                      onChangeTitle={(title) => {
                        dispatch({
                          type: 'UPDATE_SCENARIO_NAME',
                          name: title,
                          scenarioId: scenario.id,
                          featureId: selectedFeatureId,
                        });
                      }}
                      description={scenario.description}
                      onChangeDescription={(description) => {
                        dispatch({
                          type: 'UPDATE_SCENARIO_DESCRIPTION',
                          description,
                          scenarioId: scenario.id,
                          featureId: feature.id,
                        });
                      }}
                      onDuplicate={() => {
                        dispatch({
                          type: 'DUPLICATE_SCENARIO',
                          scenarioId: scenario.id,
                          featureId: selectedFeatureId,
                        });
                      }}
                      onDelete={() => {
                        dispatch({
                          type: 'DELETE_SCENARIO',
                          scenarioId: scenario.id,
                          featureId: selectedFeatureId,
                        });
                      }}
                    >
                      <ScenarioDiagram
                        actors={Object.values(feature?.actors || {})}
                        steps={scenario.steps}
                        onAddStep={({ index, from, to }) => {
                          dispatch({
                            type: 'ADD_STEP',
                            index,
                            fromEnvId: from,
                            toEnvId: to,
                            scenarioId: scenario.id,
                            featureId: selectedFeatureId,
                          });
                        }}
                        onEditEvent={(newEvent, index) => {
                          dispatch({
                            type: 'UPDATE_STEP_NAME',
                            name: newEvent,
                            scenarioId: scenario.id,
                            featureId: selectedFeatureId,
                            stepIndex: index,
                          });
                        }}
                        onDeleteStep={(index) => {
                          dispatch({
                            type: 'DELETE_STEP',
                            scenarioId: scenario.id,
                            featureId: selectedFeatureId,
                            stepIndex: index,
                          });
                        }}
                        onDeleteActor={(id) => {
                          dispatch({
                            type: 'DELETE_ACTOR',
                            envId: id,
                            featureId: selectedFeatureId,
                          });
                        }}
                        onCreateActor={() => {
                          dispatch({
                            type: 'ADD_ACTOR',
                            featureId: selectedFeatureId,
                          });
                        }}
                        onEditActor={(newName, id) => {
                          dispatch({
                            type: 'UPDATE_ACTOR_NAME',
                            envId: id,
                            name: newName,
                            scenarioId: scenario.id,
                            featureId: selectedFeatureId,
                          });
                        }}
                      ></ScenarioDiagram>
                    </ScenarioDiagramWrapper>
                  );
                })}
                <div>
                  <button
                    className="h-12 px-4 bg-gray-200"
                    onClick={() => {
                      dispatch({
                        type: 'ADD_SCENARIO',
                        featureId: selectedFeatureId,
                      });
                    }}
                  >
                    New Scenario
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0 p-6 space-y-6 overflow-y-auto border-l-2">
                <h1 className="text-2xl">Event Payloads</h1>
                <AceEditor
                  mode="graphqlschema"
                  theme="xcode"
                  tabSize={2}
                  value={feature?.eventPayloads || ''}
                  onChange={(eventPayloads) => {
                    dispatch({
                      type: 'UPDATE_FEATURE_EVENT_PAYLOAD',
                      eventPayloadString: eventPayloads,
                      featureId: selectedFeatureId,
                    });
                  }}
                  enableBasicAutocompletion
                  enableLiveAutocompletion
                  enableSnippets
                  setOptions={{
                    showLineNumbers: false,
                    highlightGutterLine: false,
                  }}
                  width="420px"
                  highlightActiveLine={false}
                  height="calc(100% - 80px)"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
};

export default HomePage;
