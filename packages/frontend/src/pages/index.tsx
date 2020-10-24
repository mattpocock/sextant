import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-graphqlschema";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";
import {
  SequenceDiagram,
  SequenceDiagramWrapper,
} from "components/SequenceDiagram";
import { useManageGraphQLFile } from "components/useManageGraphQLFile";
import produce from "immer";
import { useEffect, useMemo, useState } from "react";
import { useMachine } from "@xstate/compiled/react";
import { keepDataInSyncMachine } from "components/keepDataInSync.machine";

export default () => {
  const [state, dispatch] = useMachine(keepDataInSyncMachine, {
    actions: {
      tellUserWeCannotDeleteTheEnvironment: () => {
        alert(
          "You cannot delete this environment because it has steps associated with it.",
        );
      },
    },
    services: {
      loadDatabase: async () => {
        return fetch("/api/getDatabase").then((res) => res.json());
      },
    },
  });

  const service = state.context.database.services.initial;

  const sequences = useMemo(() => Object.values(service.sequences), [service]);

  const { value, setValue, reportEventsChanged } = useManageGraphQLFile();

  useEffect(() => {
    const events = sequences.reduce((accum, sequence) => {
      return accum.concat(
        sequence.steps.reduce((stepAccum, step) => {
          return stepAccum.concat(step.event);
        }, [] as string[]),
      );
    }, [] as string[]);
    reportEventsChanged(events);
  }, [sequences]);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="space-y-6 flex-col p-6 flex-1 overflow-y-auto">
        <h1 className="text-2xl">Sequences</h1>
        {sequences.map((sequence, sequenceIndex) => {
          return (
            <div className="inline-block mr-6">
              <SequenceDiagramWrapper
                title={sequence.name}
                onChangeTitle={(title) => {
                  dispatch({
                    type: "UPDATE_SEQUENCE_NAME",
                    name: title,
                    sequenceId: sequence.id,
                    serviceId: "initial",
                  });
                }}
                onDelete={() => {
                  dispatch({
                    type: "DELETE_SEQUENCE",
                    sequenceId: sequence.id,
                    serviceId: "initial",
                  });
                }}
              >
                <SequenceDiagram
                  environments={Object.values(service.environments)}
                  steps={sequence.steps}
                  onAddStep={({ index, from, to }) => {
                    dispatch({
                      type: "ADD_STEP",
                      index,
                      fromEnvId: from,
                      toEnvId: to,
                      sequenceId: sequence.id,
                      serviceId: "initial",
                    });
                  }}
                  onEditEvent={(newEvent, index) => {
                    dispatch({
                      type: "UPDATE_STEP_NAME",
                      name: newEvent,
                      sequenceId: sequence.id,
                      serviceId: "initial",
                      stepIndex: index,
                    });
                  }}
                  onDeleteStep={(index) => {
                    dispatch({
                      type: "DELETE_STEP",
                      sequenceId: sequence.id,
                      serviceId: "initial",
                      stepIndex: index,
                    });
                  }}
                  onDeleteEnvironment={(id) => {
                    dispatch({
                      type: "DELETE_ENVIRONMENT",
                      envId: id,
                      serviceId: "initial",
                    });
                  }}
                  onCreateEnvironment={() => {
                    dispatch({
                      type: "ADD_ENVIRONMENT",
                      serviceId: "initial",
                    });
                  }}
                  onEditEnvironment={(newName, id) => {
                    dispatch({
                      type: "UPDATE_ENVIRONMENT_NAME",
                      envId: id,
                      name: newName,
                      sequenceId: sequence.id,
                      serviceId: "initial",
                    });
                  }}
                ></SequenceDiagram>
              </SequenceDiagramWrapper>
            </div>
          );
        })}
        <div>
          <button
            className="px-4 bg-gray-200 h-12"
            onClick={() => {
              dispatch({
                type: "ADD_SEQUENCE",
                serviceId: "initial",
              });
            }}
          >
            New Sequence
          </button>
        </div>
      </div>
      <div className="p-6 space-y-6 flex-shrink-0 overflow-y-auto">
        <h1 className="text-2xl">Event Payloads</h1>
        <AceEditor
          mode="graphqlschema"
          theme="xcode"
          tabSize={2}
          value={value}
          onChange={setValue}
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
  );
};
