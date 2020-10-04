import React, { useEffect, useRef } from "react";
import HeroIconX from "./icons/HeroIconX";
import ContentEditable from "react-contenteditable";
import HeroIconPlus from "./icons/HeroIconPlus";
import produce from "immer";

export const PillList = (props: {
  value: string[];
  className?: string;
  onChange: (value: string[]) => void;
}) => {
  return (
    <div>
      <div className={classNames("flex flex-wrap", props.className)}>
        {props.value.map((val, index) => {
          return (
            <div className="pb-3 pr-6">
              <Pill
                value={val}
                onChange={(newVal) => {
                  props.onChange(
                    produce(props.value, (draft) => {
                      draft[index] = newVal;
                    }),
                  );
                }}
                onDelete={() => {
                  props.onChange(
                    produce(props.value, (draft) => {
                      draft.splice(index, 1);
                    }),
                  );
                }}
              ></Pill>
            </div>
          );
        })}
        <div className="pb-3 pr-6">
          <button
            className="px-2 py-1 bg-gray-300 rounded-full"
            onClick={() => props.onChange([...props.value, ""])}
          >
            <HeroIconPlus className="text-gray-700" />
          </button>
        </div>
      </div>
      <div className="-mt-3" />
    </div>
  );
};

const Pill = (props: {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
}) => {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (props.value === "") {
      ref.current?.focus();
    }
  }, [ref.current]);
  return (
    <div>
      <div className="inline-flex items-stretch text-sm h-8">
        <div className="h-full flex items-center bg-gray-200 rounded-l-full pl-1">
          <ContentEditable
            innerRef={ref}
            html={props.value}
            contentEditable
            className="px-2 text-gray-700"
            onChange={(e) => {
              props.onChange(e.target.value);
            }}
            tagName="p"
          ></ContentEditable>
        </div>
        <button
          className="bg-gray-300 rounded-r-full pr-1"
          onClick={() => props.onDelete()}
        >
          <HeroIconX className="text-gray-700" />
        </button>
      </div>
    </div>
  );
};
