import React from "react";
import { Service } from "./Service";
import { Heading } from "./Heading";
import { Layout } from "./Layout";

export default {
  title: "Components/Service",
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => {
  return (
    <Layout>
      <Heading>{"Services > FRONTEND"}</Heading>
      <div className="grid grid-cols-2 gap-8">
        {[
          {
            id: "getUser",
            from: "frontend",
            to: "database",
            description: "Gets the user from the database",
            receivableEvents: ["GET_USER"],
            sendableEvents: [
              "UNKNOWN_ERROR",
              "USER",
              "USER_NOT_FOUND",
              "YOU_DO_NOT_HAVE_PERMISSION",
            ],
          },
          {
            id: "adminCreateUser",
            from: "frontend",
            to: "lambda",
            description: "Creates a user as an admin",
            receivableEvents: ["CREATE_USER"],
            sendableEvents: [
              "UNKNOWN_ERROR",
              "USERNAME_ALREADY_IN_USE",
              "SUCCESS",
            ],
          },
          {
            id: "logIn",
            from: "frontend",
            to: "cognito",
            description: "Logs in the user to cognito",
            receivableEvents: ["LOG_IN"],
            sendableEvents: [
              "INCORRECT_PASSWORD",
              "USERNAME_NOT_FOUND",
              "UNKNOWN_ERROR",
              "YOU_MUST_CONFIRM_YOUR_PASSWORD",
              "USER_IS_DISABLED",
            ],
          },
        ].map((service) => (
          <Service {...service} />
        ))}
      </div>
    </Layout>
  );
};
