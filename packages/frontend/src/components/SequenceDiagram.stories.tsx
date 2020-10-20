import { useMachine } from "@xstate/compiled/react";
import produce from "immer";
import React, { useState } from "react";
import ContentEditable from "react-contenteditable";
import HeroIconCheveronLeft from "./icons/HeroIconCheveronLeft";
import HeroIconCheveronRight from "./icons/HeroIconCheveronRight";
import HeroIconPlus from "./icons/HeroIconPlus";
import { sequenceDiagramMachine } from "./SequenceDiagram.machine";

export default {
  title: "Components/Sequence Diagram",
};

export const Default = () => {
  const [steps, setSteps] = useState<
    { event: string; from: string; to: string }[]
  >([]);
  return (
    <div className="space-y-6">
      <h1 className="text-gray-800 text-xl font-bold">Create Contact</h1>
      <div className="border-2 inline-block">
        <h2 className="text-gray-700 font-bold text-lg px-3 py-2 border-b-2 bg-gray-100">
          Success Case
        </h2>
        <div className="px-3 py-3">
          <SequenceDiagram
            environments={[
              {
                name: "Frontend",
              },
              {
                name: "Lambda",
              },
              {
                name: "TCC",
              },
              {
                name: "Hasura",
              },
            ]}
            steps={steps}
            onAddStep={({ index, from, to }) => {
              setSteps(
                produce(steps, (draft) => {
                  draft.splice(index, 0, {
                    from,
                    to,
                    event: "EVENT",
                  });
                }),
              );
            }}
            onEditEvent={(newEvent, index) => {
              setSteps(
                produce(steps, (draft) => {
                  draft[index].event = newEvent;
                }),
              );
            }}
            onDeleteStep={(index) => {
              console.log({ index });
              setSteps(
                produce(steps, (draft) => {
                  draft.splice(index, 1);
                }),
              );
            }}
          ></SequenceDiagram>
        </div>
      </div>
    </div>
  );
};

const SequenceDiagramWrapper: React.FC<{ title: string }> = ({
  children,
  title,
}) => {
  return (
    <div className="border-2 inline-block">
      <h2 className="text-gray-700 font-bold text-lg px-3 py-2 border-b-2 bg-gray-100">
        {title}
      </h2>
      <div className="px-3 py-3">{children}</div>
    </div>
  );
};

const SequenceDiagram = (props: {
  steps: {
    from: string;
    to: string;
    event: string;
  }[];
  environments: {
    name: string;
  }[];
  onAddStep: (step: { from: string; to: string; index: number }) => void;
  onEditEvent: (newEvent: string, index: number) => void;
  onDeleteStep: (index: number) => void;
}) => {
  const [state, dispatch] = useMachine(sequenceDiagramMachine, {
    actions: {
      registerNewEvent: (context, event) => {
        props.onAddStep({
          from: context.environmentChosen,
          to: event.environment,
          index: event.index,
        });
      },
    },
  });
  return (
    <div className="inline-block">
      <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="p-4 bg-gray-200 text-gray-800 uppercase w-48 flex justify-center">
              {env.name}
            </div>
          );
        })}
      </div>
      {/* <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="flex justify-center items-center w-48 h-6">
              <div className="border-r-2"></div>
            </div>
          );
        })}
      </div> */}
      {props.steps.map((step, index, array) => {
        return (
          <>
            <div className="flex space-x-6">
              {props.environments.map((env) => {
                return (
                  <div className="flex justify-center w-48 h-10 relative">
                    <div className="border-r-2"></div>

                    <button
                      className={classNames(
                        "absolute h-6 w-24 mt-2 top-0 flex justify-center group",
                      )}
                      onClick={() => {
                        dispatch({
                          type: "CLICK_PLUS_ICON",
                          environment: env.name,
                          index,
                        });
                      }}
                    >
                      <div
                        className={classNames(
                          "w-6 h-6 rounded-full bg-gray-200 text-gray-600 opacity-0 group-hover:opacity-100 group-focus:opacity-100",
                          env.name === state.context.environmentChosen &&
                            index === state.context.indexChosen &&
                            "opacity-100 bg-blue-200 text-blue-800",
                        )}
                      >
                        <HeroIconPlus />
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
            <StepArrow
              step={step}
              onDelete={() => props.onDeleteStep(index)}
              environments={props.environments}
              onChangeEvent={(event) => props.onEditEvent(event, index)}
            />
          </>
        );
      })}
      <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="flex justify-center w-48 h-6">
              <div className="border-r-2"></div>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="flex justify-center w-48">
              <button
                className={classNames(
                  "bg-gray-200 rounded-full h-10 w-10 flex justify-center items-center text-gray-600",
                  env.name === state.context.environmentChosen &&
                    props.steps.length === state.context.indexChosen &&
                    "bg-blue-200 text-blue-800",
                )}
                onClick={() => {
                  dispatch({
                    type: "CLICK_PLUS_ICON",
                    environment: env.name,
                    index: props.steps.length,
                  });
                }}
              >
                <HeroIconPlus />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="flex justify-center w-48 h-6">
              <div className="border-r-2"></div>
            </div>
          );
        })}
      </div>
      <div className="flex space-x-6">
        {props.environments.map((env) => {
          return (
            <div className="p-4 bg-gray-200 text-gray-800 uppercase w-48 flex justify-center">
              {env.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StepArrow = (props: {
  step: {
    from: string;
    to: string;
    event: string;
  };
  environments: {
    name: string;
  }[];
  onChangeEvent: (eventName: string) => void;
  onDelete: () => void;
}) => {
  const startIndex = props.environments.findIndex(
    (env) => env.name === props.step.from,
  );

  const endIndex = props.environments.findIndex(
    (env) => env.name === props.step.to,
  );

  const doesTheArrowGoRight = endIndex > startIndex;

  if (doesTheArrowGoRight) {
    return (
      <div
        className={classNames(
          "h-4 flex items-center",
          !doesTheArrowGoRight && "justify-end",
        )}
      >
        <div className="w-24"></div>

        {[...new Array(startIndex)].map(() => {
          return (
            <>
              <div className="w-24"></div>
              <div className="w-24"></div>
              <div className="w-6"></div>
            </>
          );
        })}
        <div className="rounded-full w-4 h-4 bg-gray-600 -ml-2"></div>
        <div className="flex items-center -ml-2">
          <div className="relative flex items-center">
            {[...new Array(endIndex - startIndex)].map(() => {
              return (
                <>
                  <div className="border-b-2 border-gray-600 w-48"></div>
                  <div className="border-b-2 border-gray-600 w-6"></div>
                </>
              );
            })}
            <div className="absolute top-0 left-0 w-full flex items-center justify-center">
              <ContentEditable
                className="bg-white border-2 border-gray-600 px-2 h-6 text-xs text-gray-800 flex items-center"
                style={{ transform: "translateY(calc(-50% + 1px))" }}
                html={props.step.event}
                onChange={(e) => props.onChangeEvent(e.target.value)}
              ></ContentEditable>
            </div>
          </div>
          <HeroIconCheveronRight className="-ml-5 h-8 w-8 text-gray-600" />
        </div>
      </div>
    );
  }

  return (
    <div className={classNames("h-4 flex items-center")}>
      <div className="w-24"> </div>
      {[...new Array(endIndex)].map(() => {
        return (
          <>
            <div className="w-24"></div>
            <div className="w-24"></div>
            <div className="w-6"></div>
          </>
        );
      })}
      <div className="flex items-center -mr-2 relative">
        <HeroIconCheveronLeft className=" text-gray-600 absolute left-0 -ml-3 w-8 h-8" />
        <div className="flex items-center relative">
          {[...new Array(startIndex - endIndex)].map(() => {
            return (
              <>
                <div className="border-b-2 border-gray-600 w-48"></div>
                <div className="border-b-2 border-gray-600 w-6"></div>
              </>
            );
          })}
          <div className="absolute top-0 left-0 w-full flex items-center justify-center">
            <div
              className="relative"
              style={{ transform: "translateY(calc(-50% + 1px))" }}
            >
              <ContentEditable
                className="bg-white border-2 border-gray-600 px-2 h-6 text-xs text-gray-800 flex items-center"
                html={props.step.event}
                onChange={(e) => props.onChangeEvent(e.target.value)}
              ></ContentEditable>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-full w-4 h-4 bg-gray-600 -mr-2"></div>
    </div>
  );
};
