import React from "react";
import ContentEditable from "react-contenteditable";
import HeroIconCheveronLeft from "./icons/HeroIconCheveronLeft";
import HeroIconCheveronRight from "./icons/HeroIconCheveronRight";
import HeroIconX from "./icons/HeroIconX";

export const StepArrow = (props: {
  step: {
    from: string;
    to: string;
    event: string;
  };
  environments: {
    id: string;
    name: string;
  }[];
  onChangeEvent: (eventName: string) => void;
  onDelete: () => void;
}) => {
  const startIndex = props.environments.findIndex(
    (env) => env.id === props.step.from,
  );

  const endIndex = props.environments.findIndex(
    (env) => env.id === props.step.to,
  );

  const doesTheArrowGoRight = endIndex > startIndex;

  if (doesTheArrowGoRight) {
    return (
      <div
        className={classNames(
          "flex items-center",
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
            <EventLabel
              value={props.step.event}
              onChange={props.onChangeEvent}
              onDelete={props.onDelete}
            />
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
          <div className="absolute top-0 left-0 w-full flex items-center justify-center z-10">
            <EventLabel
              value={props.step.event}
              onChange={props.onChangeEvent}
              onDelete={props.onDelete}
            />
          </div>
        </div>
      </div>
      <div className="rounded-full w-4 h-4 bg-gray-600 -mr-2"></div>
    </div>
  );
};

export const EventLabel = (props: {
  value: string;
  onChange: (val: string) => void;
  onDelete: () => void;
}) => {
  return (
    <div className="absolute top-0 left-0 w-full flex items-center justify-center z-10">
      <div
        className="relative flex space-x-2 items-center"
        style={{ transform: "translateY(calc(-50% + 1px))" }}
      >
        <div className="w-4" />
        <ContentEditable
          className="bg-white border-2 border-gray-600 px-2 text-xs text-gray-800 text-center flex items-center appearance-none break-all"
          html={props.value}
          style={{ maxWidth: "8rem" }}
          onChange={(e) => props.onChange(e.target.value)}
        ></ContentEditable>
        <button
          className="w-4 h-4 bg-gray-600 flex justify-center items-center text-white rounded-full"
          onClick={props.onDelete}
        >
          <HeroIconX />
        </button>
      </div>
    </div>
  );
};
