import React, { ChangeEvent, useEffect, useState } from "react";
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
import HeroIconCheveronDown from "./icons/HeroIconCheveronDown";
import { fromService } from "@xstate/react/lib/useService";

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
  if (!template) return undefined;
  try {
    buildSchema(template, {});
  } catch (e) {
    return e.message;
  }
};

// export const EditableService = () => {
//   const [serviceFrom, setServiceFrom] = useState("cognito");
//   const [serviceTo, setServiceTo] = useState("database");
//   const [inEvents, setInEvents] = useState(["GET_USER"]);
//   const [outEvents, setOutEvents] = useState(["USER", "UNKNOWN_ERROR"]);
//   const [eventPayloads, _setEventPayloads] = useState(`type GET_USER {
//   id: ID!
// }

// type USER {
//   id: ID!
//   name: String!
// }
// `);

//   const setEventPayloads = (newString: string) => {
//     _setEventPayloads(newString.trim());
//   };

//   const [, dispatch] = useMachine(changeGraphqlMachine, {
//     actions: {
//       addEventName: (context, { newEvents, oldEvents }) => {
//         const eventToTarget = newEvents.find((ev, index) => {
//           return oldEvents[index] !== ev;
//         });
//         setEventPayloads(
//           [
//             `# type ${eventToTarget || ""} {`,
//             `#   `,
//             `# }`,
//             ``,
//             eventPayloads,
//           ].join("\n"),
//         );
//       },
//       editEventName: (_, { newEvents, oldEvents }) => {
//         const eventIndex = oldEvents.findIndex((ev, index) => {
//           return newEvents[index] !== ev;
//         });
//         if (eventIndex === -1) return;

//         const regex = new RegExp(`type ${oldEvents[eventIndex] || ""}`);
//         setEventPayloads(
//           eventPayloads.replace(regex, `type ${newEvents[eventIndex] || ""}`),
//         );
//       },
//       removeEvent: (_, { newEvents, oldEvents }) => {
//         setEventPayloads(
//           produce(eventPayloads, (draft) => {
//             const eventToTarget = oldEvents.find((ev) => {
//               return !newEvents.includes(ev);
//             });

//             const regex = new RegExp(`type ${eventToTarget} \{`);

//             const payloadsAsArray = draft.split("\n");

//             const startIndex = payloadsAsArray.findIndex((line) =>
//               regex.test(line),
//             );

//             if (startIndex === -1) {
//               return draft;
//             }

//             const sliceOfPayloads = payloadsAsArray.slice(startIndex);

//             const endRegex = /\}/;

//             const deleteCount = sliceOfPayloads.findIndex((line) =>
//               endRegex.test(line),
//             );

//             if (deleteCount === -1) {
//               return draft;
//             }

//             payloadsAsArray.splice(startIndex, deleteCount + 1);

//             return payloadsAsArray.join("\n");
//           }),
//         );
//       },
//     },
//   });

//   const gqlError = getGraphQLError(eventPayloads);

//   return (
//     <Layout>
//       <div className="space-y-6">
//         <Heading>Details</Heading>
//         <div className="max-w-sm space-y-4">
//           <TextInput label="Name" hint="The name we'll use for this service." />
//           <TextInput label="Description" rows={3} />
//         </div>
//         <Heading>Environments</Heading>
//         <EditableServiceTable
//           environments={[
//             {
//               id: "frontend",
//             },
//             {
//               id: "lambda",
//             },
//             {
//               id: "cognito",
//             },
//             {
//               id: "database",
//             },
//           ]}
//           service={{
//             id: "createUserInDatabase",
//             from: serviceFrom,
//             to: serviceTo,
//             description: "Adds the cognito user to the database",
//           }}
//           setServiceFrom={setServiceFrom}
//           setServiceTo={setServiceTo}
//         />
//         <Heading>Events</Heading>
//         <div>
//           <h3 className="mb-3 text-gray-700">Events In</h3>
//           <PillList
//             value={inEvents}
//             className="max-w-md"
//             onChange={(events) => {
//               dispatch({
//                 type: "EVENTS_CHANGED",
//                 oldEvents: [...inEvents, ...outEvents],
//                 newEvents: [...events, ...outEvents],
//               });
//               setInEvents(events);
//             }}
//           />
//         </div>
//         <div>
//           <h3 className="mb-3 text-gray-700">Events Out</h3>
//           <PillList
//             value={outEvents}
//             className="max-w-md"
//             onChange={(events) => {
//               dispatch({
//                 type: "EVENTS_CHANGED",
//                 oldEvents: [...inEvents, ...outEvents],
//                 newEvents: [...inEvents, ...events],
//               });
//               setOutEvents(events);
//             }}
//           />
//         </div>
//         <div>
//           <div className="mb-4">
//             <h3 className=" text-gray-700">Event Payloads</h3>
//             {gqlError ? (
//               <p className="text-xs text-red-800 mt-1">{gqlError}</p>
//             ) : (
//               <p className="text-xs text-gray-600 mt-1 max-w-sm">
//                 Edit this GraphQL file to describe the event types for each
//                 event this service handles
//               </p>
//             )}
//           </div>

//           <AceEditor
//             mode="graphqlschema"
//             theme="xcode"
//             tabSize={2}
//             value={eventPayloads}
//             onChange={_setEventPayloads}
//             enableBasicAutocompletion
//             enableLiveAutocompletion
//             enableSnippets
//             setOptions={{
//               showLineNumbers: false,
//             }}
//           />
//         </div>
//       </div>
//     </Layout>
//   );
// };

const EnvironmentSelectBox = (props: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
  iconClassName?: string;
  label?: string;
}) => {
  return (
    <div className={classNames("flex items-center space-x-3")}>
      {props.label && (
        <label className="block text-xs text-gray-700 uppercase">
          {props.label}
        </label>
      )}
      <div className={classNames("relative", props.className)}>
        <select
          value={props.value}
          onChange={props.onChange}
          className={classNames(
            "px-4 pr-8 py-2 appearance-none text-center uppercase bg-transparent",
          )}
        >
          {props.options.map((opt) => {
            return (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            );
          })}
        </select>
        <div className="pointer-events-none flex absolute right-0 top-0 h-full items-center">
          <HeroIconCheveronDown
            className={classNames(props.iconClassName, "mr-1")}
          />
        </div>
      </div>
      {props.label && (
        <label className="block text-xs text-transparent pointer-events-none uppercase">
          {props.label}
        </label>
      )}
    </div>
  );
};

const environmentOptions = ["lambda", "cognito", "frontend", "database"].map(
  (o) => ({
    value: o,
    label: o,
  }),
);

export const EditableService2 = () => {
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
        <Heading>Sequence</Heading>
        <div className="max-w-md pb-2">
          <div className="w-full flex justify-center uppercase">
            <EnvironmentSelectBox
              className="bg-blue-200 text-blue-800"
              iconClassName="text-blue-700"
              label="Source:"
              value={serviceFrom}
              onChange={(e) => setServiceFrom(e.target.value)}
              options={environmentOptions}
            ></EnvironmentSelectBox>
          </div>

          <div className="flex justify-center">
            <div className="border-l border-dashed border-gray-400 h-10"></div>
          </div>

          <div className="border border-dashed border-gray-400">
            <p className="px-6 py-2 text-xs uppercase tracking-wider text-gray-600 border-b border-dashed border-gray-400">
              Sendable Events
            </p>
            <div className="p-6">
              <h3 className="mb-4 text-gray-700 text-sm leading-none">
                From{" "}
                <span className="uppercase text-blue-700">{serviceFrom}</span>{" "}
                to{" "}
                <span className="uppercase text-orange-700">{serviceTo}</span>:
              </h3>
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
          </div>

          <div className="flex justify-center">
            <div className="border-l border-dashed border-gray-400 h-10"></div>
          </div>

          <div className="w-full flex justify-center uppercase">
            <EnvironmentSelectBox
              label="Target:"
              className="bg-orange-200 text-orange-800"
              iconClassName="text-orange-700"
              value={serviceTo}
              onChange={(e) => setServiceTo(e.target.value)}
              options={environmentOptions}
            ></EnvironmentSelectBox>
          </div>

          <div className="flex justify-center">
            <div className="border-l border-dashed border-gray-400 h-10"></div>
          </div>

          <div className="border border-dashed border-gray-400">
            <p className="px-6 py-2 text-xs uppercase tracking-wider text-gray-600 border-b border-dashed border-gray-400">
              Returnable Events
            </p>
            <div className="p-6">
              <h3 className="mb-4 text-gray-700 text-sm leading-none">
                From{" "}
                <span className="text-orange-700 uppercase">{serviceTo}</span>{" "}
                to{" "}
                <span className="text-blue-700 uppercase">{serviceFrom}</span>:
              </h3>
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
          </div>

          <div className="flex justify-center">
            <div className="border-l border-dashed border-gray-400 h-10"></div>
          </div>

          <div className="w-full flex justify-center uppercase">
            <EnvironmentSelectBox
              label="Source:"
              className="bg-blue-200 text-blue-800"
              iconClassName="text-blue-700"
              value={serviceFrom}
              onChange={(e) => setServiceFrom(e.target.value)}
              options={environmentOptions}
            ></EnvironmentSelectBox>
          </div>
        </div>
        <div>
          <Heading>Event Payload Editor</Heading>
          <div className="mb-6">
            {gqlError ? (
              <p className="text-xs text-red-800 mt-1">{gqlError}</p>
            ) : (
              <div className="text-xs text-gray-600 max-w-sm mt-2 space-y-2 leading-relaxed">
                <p>
                  Edit this GraphQL file to describe the event types for each
                  event this service handles.
                </p>
                <p>
                  Any events not described here (or commented out) will still
                  work, but pass an empty payload.
                </p>
              </div>
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
              highlightGutterLine: false,
            }}
            highlightActiveLine={false}
            height="320px"
          />
        </div>
      </div>
    </Layout>
  );
};
