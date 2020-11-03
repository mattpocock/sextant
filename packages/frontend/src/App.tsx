import { Service } from '@sextant-tools/core';
import { useMachine } from '@xstate/compiled/react';
import AceEditor from 'react-ace';
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
  SequenceDiagram,
  SequenceDiagramWrapper,
} from './components/SequenceDiagram';
import { useSearchParams } from './components/useSearchParams';

const HomePage = () => {
  const history = useHistory();
  const params = useSearchParams<{ serviceId: string }>();

  const [state, dispatch] = useMachine(keepDataInSyncMachine, {
    actions: {
      goToInitialService() {
        history.replace(
          `/?${assignToSearchParams(window.location.search, {
            serviceId: 'initial',
          })}`,
        );
      },
      goToFirstService(context) {
        const targetServiceId = Object.values(context.database.services)[0].id;

        history.replace(
          `/?${assignToSearchParams(window.location.search, {
            serviceId: targetServiceId,
          })}`,
        );
      },
      saveToDatabase: (context) => {
        return clientSaveToDatabase(context.database, history);
      },
    },
  });

  const selectedServiceId = params?.serviceId as string;

  const service: Service | undefined =
    state.context.database.services[selectedServiceId || ''];

  const sequences = useMemo(() => Object.values(service?.sequences || {}), [
    service,
  ]);

  useEffect(() => {
    if (!service) {
      dispatch({
        type: 'SERVICE_NOT_FOUND',
      });
    }
    // eslint-disable-next-line
  }, [service, state.value]);

  switch (true) {
    case state.matches('errored'):
      return <div>Something went wrong</div>;
    case Boolean(state.matches('editing') && service): {
      return (
        <div className="flex flex-col h-screen overflow-hidden">
          <div className="flex items-center justify-between flex-shrink-0 h-12 px-4 border-t-4 border-primary-600">
            <h1 className="flex items-center font-bold tracking-widest uppercase text-primary-800">
              sextant
            </h1>
            <button
              className="flex items-center mr-4 space-x-2 text-sm tracking-wider text-gray-700"
              onClick={() => dispatch('GET_SHARE_LINK')}
            >
              <HeroIconGlobe className="w-5 h-5 text-gray-600" />
              <span>Share</span>
            </button>
          </div>
          <div className="flex flex-grow overflow-hidden border-t-2">
            <div className="flex-shrink-0 w-48 h-full px-4 py-4 border-r-2">
              <h1 className="mb-2">Services</h1>
              <div className="mb-4 space-y-2">
                {Object.values(state.context.database.services).map(
                  (service) => {
                    return (
                      <Link
                        to={`/?${assignToSearchParams(window.location.search, {
                          serviceId: service.id,
                        })}`}
                        className="block text-sm text-gray-700"
                      >
                        {service?.name}
                      </Link>
                    );
                  },
                )}
              </div>
              <button
                onClick={() => {
                  dispatch({
                    type: 'ADD_SERVICE',
                  });
                }}
                className="px-3 py-1 text-sm text-gray-700 bg-gray-200"
              >
                Add Service
              </button>
            </div>
            <div className="flex flex-grow overflow-hidden">
              <div className="flex-col flex-1 p-6 space-y-6 overflow-y-auto">
                <div>
                  <ContentEditable
                    className="inline-block text-2xl"
                    html={service?.name}
                    tagName="h1"
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_SERVICE_NAME',
                        name: e.target.value,
                        serviceId: selectedServiceId,
                      });
                    }}
                  ></ContentEditable>
                  <ContentEditable
                    html={service?.description || ''}
                    tagName="p"
                    onChange={(e) => {
                      dispatch({
                        type: 'UPDATE_SERVICE_DESCRIPTION',
                        description: e.target.value,
                        serviceId: selectedServiceId,
                      });
                    }}
                    className="mt-1 text-xs leading-relaxed text-gray-700"
                  ></ContentEditable>
                </div>
                {sequences.map((sequence, sequenceIndex) => {
                  return (
                    <SequenceDiagramWrapper
                      title={sequence.name}
                      onChangeTitle={(title) => {
                        dispatch({
                          type: 'UPDATE_SEQUENCE_NAME',
                          name: title,
                          sequenceId: sequence.id,
                          serviceId: selectedServiceId,
                        });
                      }}
                      description={sequence.description}
                      onChangeDescription={(description) => {
                        dispatch({
                          type: 'UPDATE_SEQUENCE_DESCRIPTION',
                          description,
                          sequenceId: sequence.id,
                          serviceId: service.id,
                        });
                      }}
                      onDuplicate={() => {
                        dispatch({
                          type: 'DUPLICATE_SEQUENCE',
                          sequenceId: sequence.id,
                          serviceId: selectedServiceId,
                        });
                      }}
                      onDelete={() => {
                        dispatch({
                          type: 'DELETE_SEQUENCE',
                          sequenceId: sequence.id,
                          serviceId: selectedServiceId,
                        });
                      }}
                    >
                      <SequenceDiagram
                        environments={Object.values(
                          service?.environments || {},
                        )}
                        steps={sequence.steps}
                        onAddStep={({ index, from, to }) => {
                          dispatch({
                            type: 'ADD_STEP',
                            index,
                            fromEnvId: from,
                            toEnvId: to,
                            sequenceId: sequence.id,
                            serviceId: selectedServiceId,
                          });
                        }}
                        onEditEvent={(newEvent, index) => {
                          dispatch({
                            type: 'UPDATE_STEP_NAME',
                            name: newEvent,
                            sequenceId: sequence.id,
                            serviceId: selectedServiceId,
                            stepIndex: index,
                          });
                        }}
                        onDeleteStep={(index) => {
                          dispatch({
                            type: 'DELETE_STEP',
                            sequenceId: sequence.id,
                            serviceId: selectedServiceId,
                            stepIndex: index,
                          });
                        }}
                        onDeleteEnvironment={(id) => {
                          dispatch({
                            type: 'DELETE_ENVIRONMENT',
                            envId: id,
                            serviceId: selectedServiceId,
                          });
                        }}
                        onCreateEnvironment={() => {
                          dispatch({
                            type: 'ADD_ENVIRONMENT',
                            serviceId: selectedServiceId,
                          });
                        }}
                        onEditEnvironment={(newName, id) => {
                          dispatch({
                            type: 'UPDATE_ENVIRONMENT_NAME',
                            envId: id,
                            name: newName,
                            sequenceId: sequence.id,
                            serviceId: selectedServiceId,
                          });
                        }}
                      ></SequenceDiagram>
                    </SequenceDiagramWrapper>
                  );
                })}
                <div>
                  <button
                    className="h-12 px-4 bg-gray-200"
                    onClick={() => {
                      dispatch({
                        type: 'ADD_SEQUENCE',
                        serviceId: selectedServiceId,
                      });
                    }}
                  >
                    New Sequence
                  </button>
                </div>
              </div>
              <div className="flex-shrink-0 p-6 space-y-6 overflow-y-auto border-l-2">
                <h1 className="text-2xl">Event Payloads</h1>
                <AceEditor
                  mode="graphqlschema"
                  theme="xcode"
                  tabSize={2}
                  value={service?.eventPayloads || ''}
                  onChange={(eventPayloads) => {
                    dispatch({
                      type: 'UPDATE_SERVICE_EVENT_PAYLOAD',
                      eventPayloadString: eventPayloads,
                      serviceId: selectedServiceId,
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
