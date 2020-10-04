import React from "react";
import HeroIconCheveronRight from "./icons/HeroIconCheveronRight";
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
                <h2 className="text-gray-800 uppercase bg-gray-200 leading-none px-4 py-3">
                  {environment.id}
                </h2>
              </div>
            );
          })}
        </div>
        <div className="flex-grow flex items-end overflow-x-scroll">
          {props.services.map((service) => {
            return (
              <Link
                href={routeMap.viewService({
                  params: {
                    serviceId: service.id,
                  },
                })}
              >
                <a className="block w-48 flex-shrink-0 flex-grow-0 group">
                  <div className=" flex items-end justify-center">
                    <div className="px-4 py-3 w-full group-hover:bg-gray-200">
                      <p className="text-sm text-gray-700 group-hover:text-gray-800">
                        {service.id}
                      </p>
                      <p className="text-gray-600 text-xs group-hover:text-gray-700">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  {props.environments.map((env) => {
                    return (
                      <div
                        className={classNames(
                          "w-48 h-20 flex items-center justify-center group-hover:bg-gray-200 space-x-2",
                        )}
                      >
                        {env.id === service.from && (
                          <div className="rounded-full bg-indigo-500 text-white flex justify-center items-center pr-1 pl-3 uppercase text-sm group-hover:bg-gray-800">
                            <span>From</span>
                            <HeroIconCheveronRight />
                          </div>
                        )}
                        {env.id === service.to && (
                          <div className="rounded-full bg-green-500 text-white flex justify-center items-center pr-3 pl-1 uppercase text-sm group-hover:bg-gray-800">
                            <HeroIconCheveronRight />
                            <span>To</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
