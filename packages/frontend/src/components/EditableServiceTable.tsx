import React from "react";
import HeroIconCheveronRight from "./icons/HeroIconCheveronRight";
import Link from "next/link";

export const EditableServiceTable = (props: {
  environments: { id: string }[];
  service: { id: string; from: string; to: string; description?: string };
  setServiceFrom: (from: string) => void;
  setServiceTo: (to: string) => void;
}) => {
  const service = props.service;
  return (
    <div className="border inline-block">
      <div className="flex">
        <div className="w-40 flex-shrink-0 flex flex-col justify-end">
          {props.environments.map((environment) => {
            return (
              <div
                key={environment.id}
                className="h-20 flex items-center justify-center"
              >
                <h2 className="text-gray-800 uppercase bg-gray-200 leading-none px-4 py-3">
                  {environment.id}
                </h2>
              </div>
            );
          })}
        </div>
        <div className="flex-grow flex items-end overflow-x-scroll">
          <div className="block w-48 flex-shrink-0 flex-grow-0">
            {props.environments.map((env) => {
              return (
                <div
                  className={classNames(
                    "w-48 h-20 flex items-center justify-center space-x-2",
                  )}
                >
                  {env.id === service.from ? (
                    <div className="rounded-full bg-indigo-500 text-white flex justify-center items-center pr-1 pl-3 uppercase text-sm">
                      <span>From</span>
                      <HeroIconCheveronRight />
                    </div>
                  ) : (
                    <button
                      className="rounded-full bg-gray-100 text-gray-600 flex justify-center items-center pr-1 pl-3 uppercase text-sm"
                      onClick={() => {
                        props.setServiceFrom(env.id);
                      }}
                    >
                      <span>From</span>
                      <HeroIconCheveronRight />
                    </button>
                  )}
                  {env.id === service.to ? (
                    <div className="rounded-full bg-green-500 text-white flex justify-center items-center pr-3 pl-1 uppercase text-sm">
                      <HeroIconCheveronRight />
                      <span>To</span>
                    </div>
                  ) : (
                    <button
                      className="rounded-full bg-gray-100 text-gray-600 flex justify-center items-center pr-3 pl-1 uppercase text-sm"
                      onClick={() => {
                        props.setServiceTo(env.id);
                      }}
                    >
                      <HeroIconCheveronRight />
                      <span>To</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
