import React from "react";
import HeroIconCheveronRight from "./icons/HeroIconCheveronRight";
import ContentEditable from "react-contenteditable";
import Link from "next/link";
import { routeMap } from "./routeMap";

export const EnvironmentTable = (props: {
  environments: { id: string }[];
  services: { id: string; from: string; to: string; description?: string }[];
}) => {
  return (
    <div>
      <div className="flex">
        <div className="w-40 flex-shrink-0 flex flex-col justify-end">
          {props.environments.map((environment) => {
            return (
              <div
                key={environment.id}
                className="h-20 flex items-center justify-center"
              >
                <ContentEditable
                  className="text-gray-800 uppercase bg-gray-200 leading-none px-4 py-3"
                  html={environment.id}
                  onChange={console.log}
                ></ContentEditable>
              </div>
            );
          })}
        </div>
        <div className="flex-grow flex items-end overflow-x-scroll">
          {props.services.map((service) => {
            return (
              <div className="block w-48 flex-shrink-0 flex-grow-0">
                <div className=" flex items-end justify-center">
                  <div className="px-4 py-3 w-full">
                    <ContentEditable
                      className="text-sm text-gray-700"
                      html={service.id}
                      onChange={console.log}
                      tagName="p"
                    />
                    <ContentEditable
                      className="text-gray-600 text-xs"
                      html={service.description || ""}
                      onChange={console.log}
                    ></ContentEditable>
                  </div>
                </div>
                {props.environments.map((env) => {
                  return (
                    <div
                      className={classNames(
                        "w-48 h-20 flex items-center justify-center space-x-2",
                      )}
                    >
                      {env.id === service.from && (
                        <div className="rounded-full bg-indigo-500 text-white flex justify-center items-center pr-1 pl-3 uppercase text-sm">
                          <span>From</span>
                          <HeroIconCheveronRight />
                        </div>
                      )}
                      {env.id === service.to && (
                        <div className="rounded-full bg-green-500 text-white flex justify-center items-center pr-3 pl-1 uppercase text-sm">
                          <HeroIconCheveronRight />
                          <span>To</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
