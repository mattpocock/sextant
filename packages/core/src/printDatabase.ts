import { DatabaseHandler } from "./DatabaseHandler";
import * as Handlebars from "handlebars";
import { createEnvironmentTemplate } from "./createEnvironmentTemplate";

export const printDatabase = (database: DatabaseHandler) => {
  const environments = database.listEnvironments();
  const services = database.listServices();
  const events = database.listEvents();

  const template = Handlebars.compile(createEnvironmentTemplate)({
    environments,
    services,
    events,
  });

  console.log(template);
};

const handler = new DatabaseHandler(
  {
    environments: {
      database: {
        id: "database",
      },
      frontend: {
        id: "frontend",
      },
    },
    events: {
      GET_USER: {
        id: "GET_USER",
        payload: "",
      },
      USER: {
        id: "USER",
        payload: "",
      },
      NO_USER_FOUND: {
        id: "NO_USER_FOUND",
        payload: "",
      },
    },
    services: {
      getUser: {
        from: "frontend",
        to: "database",
        id: "getUser",
        receivableEvents: ["GET_USER"],
        sendableEvents: ["USER", "NO_USER_FOUND"],
      },
    },
  },
  async () => {},
);

printDatabase(handler);
