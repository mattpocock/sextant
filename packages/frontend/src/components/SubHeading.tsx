import React, { HTMLAttributes } from "react";
import classNames from "classnames";

export const SubHeading: React.FC<HTMLAttributes<HTMLHeadingElement>> = (
  props,
) => {
  return (
    <h2
      {...props}
      className={classNames(
        "text-gray-800 bg-gray-200 leading-none px-3 py-2 tracking-wider text-lg",
        props.className,
      )}
    ></h2>
  );
};
