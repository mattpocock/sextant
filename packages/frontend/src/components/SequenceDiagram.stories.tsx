import produce from "immer";
import React, { useState } from "react";
import { SequenceDiagram, SequenceDiagramWrapper } from "./SequenceDiagram";

export default {
  title: "Components/Sequence Diagram",
};

export const Default = () => {
  const [sequences, setSequences] = useState<
    {
      name: string;
      steps: { event: string; from: string; to: string }[];
      environments: {
        name: string;
      }[];
    }[]
  >([]);
  return (
    <div className="space-y-6 flex-col">
      {sequences.map((sequence, sequenceIndex) => {
        return (
          <div className="inline-block mr-6">
            <SequenceDiagramWrapper
              title={sequence.name}
              onChangeTitle={(title) => {
                setSequences(
                  produce(sequences, (draft) => {
                    draft[sequenceIndex].name = title;
                  }),
                );
              }}
              onDelete={() => {
                setSequences(
                  produce(sequences, (draft) => {
                    draft.splice(sequenceIndex, 1);
                  }),
                );
              }}
            >
              <SequenceDiagram
                environments={sequence.environments}
                steps={sequence.steps}
                onAddStep={({ index, from, to }) => {
                  setSequences(
                    produce(sequences, (draft) => {
                      draft[sequenceIndex].steps.splice(index, 0, {
                        from,
                        to,
                        event: "EVENT",
                      });
                    }),
                  );
                }}
                onEditEvent={(newEvent, index) => {
                  setSequences(
                    produce(sequences, (draft) => {
                      draft[sequenceIndex].steps[index].event = newEvent;
                    }),
                  );
                }}
                onDeleteStep={(index) => {
                  setSequences(
                    produce(sequences, (draft) => {
                      draft[sequenceIndex].steps.splice(index, 1);
                    }),
                  );
                }}
                onDeleteEnvironment={(index) => {
                  setSequences(
                    produce(sequences, (draft) => {
                      draft[sequenceIndex].environments.splice(index, 1);
                    }),
                  );
                }}
                onCreateEnvironment={() => {
                  setSequences(
                    produce(sequences, (draft) => {
                      draft[sequenceIndex].environments.push({ name: "" });
                    }),
                  );
                }}
                onEditEnvironment={(newName, index) => {
                  setSequences(
                    produce(sequences, (draft) => {
                      draft[sequenceIndex].environments[index].name = newName;
                    }),
                  );
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
            setSequences(
              produce(sequences, (draft) => {
                if (sequences.length === 0) {
                  draft.push({
                    name: "New Sequence",
                    environments: [
                      {
                        name: "ENVIRONMENT",
                      },
                    ],
                    steps: [],
                  });
                } else {
                  draft.push(draft[draft.length - 1]);
                }
              }),
            );
          }}
        >
          New Sequence
        </button>
      </div>
    </div>
  );
};
