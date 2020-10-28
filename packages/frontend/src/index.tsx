import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import classNames from "classnames";
import { BrowserRouter, Route } from "react-router-dom";

// @ts-ignore
global.classNames = classNames;

ReactDOM.render(
  <BrowserRouter>
    <Route path="*">
      <App />
    </Route>
  </BrowserRouter>,
  document.getElementById("root"),
);
