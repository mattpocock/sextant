import "../src/styles/tailwind.css";
import classNames from "classnames";

global.classNames = classNames;

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
