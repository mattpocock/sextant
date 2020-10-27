import {
  addEnvironment,
  addSequence,
  addService,
  addStep,
  Database,
  DEFAULT_EVENT_NAME,
  deleteEnvironment,
  deleteSequence,
  deleteStep,
  duplicateSequence,
  updateEnvironmentName,
  updateSequenceName,
  updateServiceEventPayload,
  updateServiceEventPayloadWithFunc,
  updateServiceName,
  updateStepEventName,
} from "@sextant-tools/core";
import { assign, Machine } from "@xstate/compiled";
import { addEvent, editEvent, removeEvent } from "./useManageGraphQLFile";

interface Context {
  database: Database;
}

type Event =
  | { type: "DELETE_ENVIRONMENT"; serviceId: string; envId: string }
  | {
      type: "UPDATE_SERVICE_EVENT_PAYLOAD";
      serviceId: string;
      eventPayloadString: string;
    }
  | {
      type: "SERVICE_NOT_FOUND";
    }
  | {
      type: "UPDATE_SERVICE_NAME";
      serviceId: string;
      name: string;
    }
  | {
      type: "ADD_SEQUENCE";
      serviceId: string;
    }
  | {
      type: "DUPLICATE_SEQUENCE";
      serviceId: string;
      sequenceId: string;
    }
  | {
      type: "DELETE_SEQUENCE";
      serviceId: string;
      sequenceId: string;
    }
  | {
      type: "UPDATE_SEQUENCE_NAME";
      serviceId: string;
      sequenceId: string;
      name: string;
    }
  | {
      type: "ADD_SERVICE";
    }
  | {
      type: "ADD_ENVIRONMENT";
      serviceId: string;
    }
  | {
      type: "UPDATE_ENVIRONMENT_NAME";
      serviceId: string;
      sequenceId: string;
      envId: string;
      name: string;
    }
  | {
      type: "ADD_STEP";
      serviceId: string;
      sequenceId: string;
      fromEnvId: string;
      toEnvId: string;
      index: number;
    }
  | {
      type: "UPDATE_STEP_NAME";
      serviceId: string;
      sequenceId: string;
      stepIndex: number;
      name: string;
    }
  | {
      type: "DELETE_STEP";
      serviceId: string;
      sequenceId: string;
      stepIndex: number;
    }
  | {
      type: "done.invoke.loadDatabase";
      data: Database;
    };

export const keepDataInSyncMachine = Machine<Context, Event, "keepDataInSync">(
  {
    initial: "loading",
    context: {
      database: {
        services: {
          initial: {
            id: "initial",
            name: "Initial",
            environments: {},
            sequences: {},
            eventPayloads: "",
          },
        },
      },
    },

    states: {
      loading: {
        invoke: {
          src: "loadDatabase",
          onDone: [
            {
              cond: "databaseHasAtLeastOneService",
              actions: ["saveDatabaseToContext"],
              target: "editing",
            },
            {
              actions: ["saveDefaultDatabaseToContext", "goToInitialService"],
              target: "editing",
            },
          ],
          onError: {
            target: "errored",
          },
        },
      },
      errored: {
        always: [
          {
            cond: "databaseFromContextHasAtLeastOneService",
            actions: ["goToFirstService"],
            target: "editing",
          },
          {
            actions: ["saveDefaultDatabaseToContext", "goToInitialService"],
            target: "editing",
          },
        ],
      },
      editing: {
        initial: "idle",
        on: {
          SERVICE_NOT_FOUND: [
            {
              cond: "databaseFromContextHasAtLeastOneService",
              actions: ["goToFirstService"],
              target: "editing",
            },
            {
              actions: ["saveDefaultDatabaseToContext", "goToInitialService"],
              target: "editing",
            },
          ],
          UPDATE_SERVICE_EVENT_PAYLOAD: {
            actions: assign((context, event) => {
              return {
                database: updateServiceEventPayload(
                  context.database,
                  event.serviceId,
                  event.eventPayloadString,
                ),
              };
            }),
            target: ".throttling",
          },
          ADD_ENVIRONMENT: {
            actions: assign((context, event) => {
              return {
                database: addEnvironment(context.database, event.serviceId),
              };
            }),
            target: ".throttling",
          },
          DELETE_ENVIRONMENT: [
            {
              cond: "canDeleteEnvironment",
              actions: ["deleteEnvironment"],
              target: ".throttling",
            },
            {
              actions: ["tellUserWeCannotDeleteTheEnvironment"],
            },
          ],
          ADD_SEQUENCE: {
            actions: assign((context, event) => {
              return {
                database: addSequence(context.database, event.serviceId),
              };
            }),
            target: ".throttling",
          },
          DELETE_SEQUENCE: {
            actions: assign((context, event) => {
              return {
                database: deleteSequence(
                  context.database,
                  event.serviceId,
                  event.sequenceId,
                ),
              };
            }),
            target: ".throttling",
          },
          UPDATE_SERVICE_NAME: {
            target: ".throttling",
            actions: [
              assign((context, event) => {
                return {
                  database: updateServiceName(
                    context.database,
                    event.serviceId,
                    event.name,
                  ),
                };
              }),
            ],
          },
          DUPLICATE_SEQUENCE: {
            target: ".throttling",
            actions: [
              assign((context, event) => {
                return {
                  database: duplicateSequence(
                    context.database,
                    event.serviceId,
                    event.sequenceId,
                  ),
                };
              }),
            ],
          },
          ADD_SERVICE: {
            target: ".throttling",
            actions: [
              assign((context) => {
                return {
                  database: addService(context.database),
                };
              }),
            ],
          },
          ADD_STEP: {
            actions: [
              assign((context, event) => {
                return {
                  database: updateServiceEventPayloadWithFunc(
                    context.database,
                    event.serviceId,
                    (eventPayload) => {
                      return addEvent(eventPayload, DEFAULT_EVENT_NAME);
                    },
                  ),
                };
              }),
              assign((context, event) => {
                return {
                  database: addStep({
                    database: context.database,
                    fromEnvId: event.fromEnvId,
                    index: event.index,
                    sequenceId: event.sequenceId,
                    serviceId: event.serviceId,
                    toEnvId: event.toEnvId,
                  }),
                };
              }),
            ],
            target: ".throttling",
          },
          DELETE_STEP: {
            actions: [
              assign((context, event) => {
                const eventName =
                  context.database.services[event.serviceId].sequences[
                    event.sequenceId
                  ].steps[event.stepIndex].event;

                return {
                  database: updateServiceEventPayloadWithFunc(
                    context.database,
                    event.serviceId,
                    (eventString) => {
                      return removeEvent(eventString, eventName);
                    },
                  ),
                };
              }),
              assign((context, event) => {
                return {
                  database: deleteStep(
                    context.database,
                    event.serviceId,
                    event.sequenceId,
                    event.stepIndex,
                  ),
                };
              }),
            ],
            target: ".throttling",
          },
          UPDATE_STEP_NAME: {
            actions: [
              assign((context, event) => {
                const targetEvent =
                  context.database.services[event.serviceId].sequences[
                    event.sequenceId
                  ].steps[event.stepIndex].event;
                return {
                  database: updateServiceEventPayloadWithFunc(
                    context.database,
                    event.serviceId,
                    (currentEventPayloads) => {
                      if (event.name === "") {
                        return removeEvent(currentEventPayloads, targetEvent);
                      }

                      if (!currentEventPayloads.includes(targetEvent)) {
                        return addEvent(currentEventPayloads, event.name);
                      }

                      return editEvent(
                        currentEventPayloads,
                        targetEvent,
                        event.name,
                      );
                    },
                  ),
                };
              }),
              assign((context, event) => {
                return {
                  database: updateStepEventName(
                    context.database,
                    event.serviceId,
                    event.sequenceId,
                    event.stepIndex,
                    event.name,
                  ),
                };
              }),
            ],
            target: ".throttling",
          },
          UPDATE_ENVIRONMENT_NAME: {
            actions: assign((context, event) => {
              return {
                database: updateEnvironmentName(
                  context.database,
                  event.serviceId,
                  event.sequenceId,
                  event.envId,
                  event.name,
                ),
              };
            }),
            target: ".throttling",
          },
          UPDATE_SEQUENCE_NAME: {
            actions: assign((context, event) => {
              return {
                database: updateSequenceName(
                  context.database,
                  event.serviceId,
                  event.sequenceId,
                  event.name,
                ),
              };
            }),
            target: ".throttling",
          },
        },
        states: {
          idle: {},
          throttling: {
            after: {
              800: "saving",
            },
          },
          saving: {
            always: {
              target: "idle",
              actions: "saveToDatabase",
            },
          },
        },
      },
    },
  },
  {
    services: {
      loadDatabase: async () => {
        return fetch("/api/getDatabase").then((res) => res.json());
      },
    },
    guards: {
      databaseFromContextHasAtLeastOneService: (context) => {
        return Object.keys(context.database).length > 0;
      },
      databaseHasAtLeastOneService: (context, event) => {
        return Object.keys(event.data.services).length > 0;
      },
      canDeleteEnvironment: ({ database }, { envId, serviceId }) => {
        try {
          Object.values(database.services[serviceId].sequences).forEach(
            (service) => {
              service.steps.forEach((step) => {
                if (step.from === envId || step.to === envId) {
                  throw new Error(
                    "This environment cannot be deleted because steps depend on it.",
                  );
                }
              });
            },
          );
          return true;
        } catch (e) {
          return false;
        }
      },
    },
    actions: {
      tellUserWeCannotDeleteTheEnvironment: () => {
        alert(
          "You cannot delete this environment because it has steps associated with it.",
        );
      },
      saveDefaultDatabaseToContext: assign((context) => {
        return {
          database: {
            services: {
              initial: {
                environments: {},
                eventPayloads: "",
                id: "initial",
                name: "Your First Service",
                sequences: {},
              },
            },
          },
        };
      }),
      saveDatabaseToContext: assign((context, event) => {
        if (event.data?.services) {
          return {
            database: event.data,
          };
        }
        return {};
      }),
      saveToDatabase: (context) => {
        fetch(`/api/saveToDatabase`, {
          method: "POST",
          body: JSON.stringify(context.database),
        });
      },
      deleteEnvironment: assign((context, event) => {
        return {
          database: deleteEnvironment(
            context.database,
            event.serviceId,
            event.envId,
          ),
        };
      }),
    },
  },
);
