import React, { useState } from "react";
import { EditableServiceTable } from "./EditableServiceTable";
import { Environment } from "./Environment";
import { EnvironmentTable } from "./EnvironmentTable";
import { Heading } from "./Heading";
import { Layout } from "./Layout";
import { PillList } from "./PillList";
import { TextInput } from "./TextInput";

export default {
  title: "Components",
  parameters: {
    layout: "fullscreen",
  },
};

export const GridOfEnvironments = () => {
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

export const TableOfServices = () => {
  return (
    <Layout>
      <Heading>Services</Heading>
      <EnvironmentTable
        services={[
          {
            id: "validateUser",
            from: "frontend",
            to: "frontend",
            description: "Validates that the user has required attributes",
          },
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
          // {
          //   id: "logIn",
          //   from: "frontend",
          //   to: "cognito",
          //   description: "Logs in the user to cognito",
          // },
          // {
          //   id: "signUp",
          //   from: "frontend",
          //   to: "cognito",
          //   description: "Signs up the user to cognito",
          // },
          // {
          //   id: "getUser",
          //   from: "frontend",
          //   to: "database",
          //   description: "Gets the user from the database",
          // },
          {
            id: "createUserInDatabase",
            from: "cognito",
            to: "database",
            description: "Adds the cognito user to the database",
          },
        ]}
        environments={[
          {
            id: "frontend",
          },
          {
            id: "lambda",
          },
          {
            id: "cognito",
          },
          {
            id: "database",
          },
        ]}
      />
    </Layout>
  );
};

export const EditableService = () => {
  const [serviceFrom, setServiceFrom] = useState("cognito");
  const [serviceTo, setServiceTo] = useState("database");
  const [inEvents, setInEvents] = useState(["GET_USER"]);
  const [outEvents, setOutEvents] = useState(["USER", "UNKNOWN_ERROR"]);
  return (
    <Layout>
      <div className="space-y-6">
        <Heading>Details</Heading>
        <div className="max-w-sm space-y-4">
          <TextInput label="Name" hint="The name we'll use for this service." />
          <TextInput label="Description" rows={3} />
        </div>
        <Heading>Environments</Heading>
        <EditableServiceTable
          environments={[
            {
              id: "frontend",
            },
            {
              id: "lambda",
            },
            {
              id: "cognito",
            },
            {
              id: "database",
            },
          ]}
          service={{
            id: "createUserInDatabase",
            from: serviceFrom,
            to: serviceTo,
            description: "Adds the cognito user to the database",
          }}
          setServiceFrom={setServiceFrom}
          setServiceTo={setServiceTo}
        />
        <Heading>Events</Heading>
        <div>
          <h3 className="mb-3 text-gray-700">In Events</h3>
          <PillList
            value={inEvents}
            className="max-w-md"
            onChange={setInEvents}
          ></PillList>
        </div>
        <div>
          <h3 className="mb-3 text-gray-700">Out Events</h3>
          <PillList
            value={outEvents}
            className="max-w-md"
            onChange={setOutEvents}
          ></PillList>
        </div>
      </div>
    </Layout>
  );
};
