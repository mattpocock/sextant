import React from "react";
import { Environment } from "./Environment";
import { Heading } from "./Heading";
import { Layout } from "./Layout";

export default {
  title: "Components/Environment",
  parameters: {
    layout: "fullscreen",
  },
};

export const Default = () => {
  return (
    <Layout>
      <Heading>Environments</Heading>
      <div className="grid grid-cols-2 gap-8">
        <Environment
          id="lambda"
          services={[
            {
              id: "adminCreateUser",
              from: "frontend",
              to: "lambda",
              description: "Creates a user as an admin",
            },
            {
              id: "createUserInCognito",
              from: "lambda",
              to: "cognito",
              description: "Creates a user in cognito",
            },
          ]}
        />
        <Environment
          id="frontend"
          services={[
            {
              id: "getUser",
              from: "frontend",
              to: "database",
              description: "Gets the user from the database",
            },
            {
              id: "adminCreateUser",
              from: "frontend",
              to: "lambda",
              description: "Creates a user as an admin",
            },
            {
              id: "logIn",
              from: "frontend",
              to: "cognito",
              description: "Logs in the user to cognito",
            },
          ]}
        />
        <Environment
          id="database"
          services={[
            {
              id: "getUser",
              from: "frontend",
              to: "database",
              description: "Gets the user from the database",
            },
          ]}
        />
        <Environment
          id="cognito"
          services={[
            {
              id: "logIn",
              from: "frontend",
              to: "cognito",
              description: "Logs in the user to cognito",
            },
            {
              id: "createUserInCognito",
              from: "lambda",
              to: "cognito",
              description: "Creates a user in cognito",
            },
          ]}
        />
      </div>
    </Layout>
  );
};
