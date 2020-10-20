import React from "react";
import Link from "next/link";
import { routeMap } from "./routeMap";

const linkClasses = classNames(
  "px-6 py-4 block text-gray-700 tracking-tight text-base",
);

export const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="border-b h-12 flex items-center px-6 flex-shrink-0"></header>
      <div className="flex flex-grow overflow-hidden">
        <nav className="flex-shrink-0 border-r h-full w-48">
          {/* <Link href={routeMap.root()}>
            <a className={linkClasses}>Home</a>
          </Link>
          <Link href={routeMap.addEnvironment()}>
            <a className={linkClasses}>Add Environment</a>
          </Link> */}
        </nav>
        <div className="flex-grow overflow-y-auto">
          <main className="container p-6">{children}</main>
        </div>
      </div>
    </div>
  );
};
