import React from "react";
import { SubHeading } from "./SubHeading";

interface ServiceProps {
  id: string;
  from: string;
  to: string;
  description?: string;
  receivableEvents: string[];
  sendableEvents: string[];
}

export const Service = (props: ServiceProps) => {
  return (
    <div className="border">
      <SubHeading className="py-4 px-6 flex items-center justify-between space-x-6">
        <span>{props.id}</span>
        <p className="uppercase text-gray-800 text-xs">
          <span className="text-gray-600">Target:</span> {props.to}
        </p>
      </SubHeading>
      <p className="px-6 text-sm text-gray-700 pt-4">{props.description}</p>

      <div className="p-6 pt-4">
        <div className="mb-6">
          <div className="flex space-x-3 items-center mb-2">
            <p className="text-gray-700 font-semibold">Input Events</p>
            <button className="px-3 bg-gray-200 text-gray-700">+</button>
          </div>
          <div className="flex flex-wrap items-center">
            {props.receivableEvents.map((event) => (
              <p className="pr-8 pb-1 text-gray-700 text-sm tracking-wider">
                {event}
              </p>
            ))}
          </div>
          <div className="-mb-1" />
        </div>
        <div>
          <div className="flex space-x-3 items-center mb-2">
            <p className="text-gray-700 font-semibold">Output Events</p>
            <button className="px-3 bg-gray-200 text-gray-700">+</button>
          </div>
          <div className="flex flex-wrap items-center">
            {props.sendableEvents.map((event) => (
              <p className="pr-8 pb-1 text-gray-700 text-sm tracking-wider">
                {event}
              </p>
            ))}
          </div>
          <div className="-mb-1" />
        </div>
      </div>
    </div>
  );
};
