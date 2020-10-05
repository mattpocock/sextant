import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { EditableServiceTable } from "./EditableServiceTable";
import { Environment } from "./Environment";
import { EnvironmentTable } from "./EnvironmentTable";
import { Heading } from "./Heading";
import { Layout } from "./Layout";
import { PillList } from "./PillList";
import { TextInput } from "./TextInput";
import { useMachine } from "@xstate/compiled/react";
import "ace-builds/src-noconflict/mode-graphqlschema";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/ext-language_tools";
import { changeGraphqlMachine } from "./changeGraphqlFile.machine";
import produce from "immer";
import { buildSchema } from "graphql";

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
      <div className="space-y-6">
        <Heading>Services</Heading>
        <TextInput label="Search" className="max-w-sm" />
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
      </div>
    </Layout>
  );
};

const getGraphQLError = (template: string) => {
  try {
    buildSchema(template, {});
  } catch (e) {
    return e.message;
  }
};

export const EditableService = () => {
  const [serviceFrom, setServiceFrom] = useState("cognito");
  const [serviceTo, setServiceTo] = useState("database");
  const [inEvents, setInEvents] = useState(["GET_USER"]);
  const [outEvents, setOutEvents] = useState(["USER", "UNKNOWN_ERROR"]);
  const [eventPayloads, _setEventPayloads] = useState(`type GET_USER {
  id: ID!
}

type USER {
  id: ID!
  name: String!
}
`);

  const setEventPayloads = (newString: string) => {
    _setEventPayloads(newString.trim());
  };

  const [, dispatch] = useMachine(changeGraphqlMachine, {
    actions: {
      addEventName: (context, { newEvents, oldEvents }) => {
        const eventToTarget = newEvents.find((ev, index) => {
          return oldEvents[index] !== ev;
        });
        setEventPayloads(
          [
            `# type ${eventToTarget || ""} {`,
            `#   `,
            `# }`,
            ``,
            eventPayloads,
          ].join("\n"),
        );
      },
      editEventName: (_, { newEvents, oldEvents }) => {
        const eventIndex = oldEvents.findIndex((ev, index) => {
          return newEvents[index] !== ev;
        });
        if (eventIndex === -1) return;

        const regex = new RegExp(`type ${oldEvents[eventIndex] || ""}`);
        setEventPayloads(
          eventPayloads.replace(regex, `type ${newEvents[eventIndex] || ""}`),
        );
      },
      removeEvent: (_, { newEvents, oldEvents }) => {
        setEventPayloads(
          produce(eventPayloads, (draft) => {
            const eventToTarget = oldEvents.find((ev) => {
              return !newEvents.includes(ev);
            });

            const regex = new RegExp(`type ${eventToTarget} \{`);

            const payloadsAsArray = draft.split("\n");

            const startIndex = payloadsAsArray.findIndex((line) =>
              regex.test(line),
            );

            if (startIndex === -1) {
              return draft;
            }

            const sliceOfPayloads = payloadsAsArray.slice(startIndex);

            const endRegex = /\}/;

            const deleteCount = sliceOfPayloads.findIndex((line) =>
              endRegex.test(line),
            );

            if (deleteCount === -1) {
              return draft;
            }

            payloadsAsArray.splice(startIndex, deleteCount + 1);

            return payloadsAsArray.join("\n");
          }),
        );
      },
    },
  });

  const gqlError = getGraphQLError(eventPayloads);

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
          <h3 className="mb-3 text-gray-700">Events In</h3>
          <PillList
            value={inEvents}
            className="max-w-md"
            onChange={(events) => {
              dispatch({
                type: "EVENTS_CHANGED",
                oldEvents: [...inEvents, ...outEvents],
                newEvents: [...events, ...outEvents],
              });
              setInEvents(events);
            }}
          />
        </div>
        <div>
          <h3 className="mb-3 text-gray-700">Events Out</h3>
          <PillList
            value={outEvents}
            className="max-w-md"
            onChange={(events) => {
              dispatch({
                type: "EVENTS_CHANGED",
                oldEvents: [...inEvents, ...outEvents],
                newEvents: [...inEvents, ...events],
              });
              setOutEvents(events);
            }}
          />
        </div>
        <div>
          <div className="mb-4">
            <h3 className=" text-gray-700">Event Payloads</h3>
            {gqlError ? (
              <p className="text-xs text-red-800 mt-1">{gqlError}</p>
            ) : (
              <p className="text-xs text-gray-600 mt-1 max-w-sm">
                Edit this GraphQL file to describe the event types for each
                event this service handles
              </p>
            )}
          </div>

          <AceEditor
            mode="graphqlschema"
            theme="xcode"
            tabSize={2}
            value={eventPayloads}
            onChange={_setEventPayloads}
            enableBasicAutocompletion
            enableLiveAutocompletion
            enableSnippets
            setOptions={{
              showLineNumbers: false,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};
