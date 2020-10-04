import classNames from "classnames";
import Link from "next/link";
import React from "react";
import { routeMap } from "./routeMap";
import { SubHeading } from "./SubHeading";

const linkClasses = classNames(
  "px-6 py-4 block text-gray-700 tracking-tight text-base",
);

interface EnvironmentProps {
  id: string;
  services?: {
    id: string;
    from: string;
    to: string;
    description?: string;
  }[];
  activeServiceId?: string;
}

export const Environment = (props: EnvironmentProps) => {
  return (
    <div className="border">
      <div className="">
        <SubHeading className="uppercase px-6 py-4">{props.id}</SubHeading>
      </div>
      <div className="grid grid-cols-2 p-6 gap-x-8 gap-y-10">
        {props.services?.map((service) => {
          return (
            <Link
              href={routeMap.viewService({
                params: {
                  environmentId: props.id,
                  serviceId: service.id,
                },
              })}
            >
              <a key={service.id}>
                <h3 className="text-gray-700 font-bold">{service.id}</h3>
                <div className="flex items-center space-x-2">
                  <p className="uppercase text-gray-600 text-xs">
                    {service.from}
                  </p>
                  <p className="flex-shrink-0 text-gray-600">{"->"}</p>
                  <p className="uppercase text-gray-600 text-xs">
                    {service.to}
                  </p>
                </div>
                {service.description && (
                  <p className="text-sm text-gray-700 mt-2">
                    {service.description}
                  </p>
                )}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
