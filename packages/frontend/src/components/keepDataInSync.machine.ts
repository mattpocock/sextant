import { assign, Machine } from "@xstate/compiled";
import produce from "immer";
import { v4 as uuid } from "uuid";
import { addEvent, editEvent, removeEvent } from "./useManageGraphQLFile";

export interface Database {
  services: Record<string, Service>;
}

export interface Service {
  sequences: Record<string, Sequence>;
  environments: Record<string, Environment>;
  eventPayloads: string;
  name: string;
  id: string;
}

export interface Sequence {
  id: string;
  name: string;
  order: number;
  steps: Step[];
}

export interface Step {
  id: string;
  event: string;
  from: string;
  to: string;
}

export interface Environment {
  id: string;
  name: string;
}

interface Context {
  database: Database;
}

/** Sequences */
const addSequence = (database: Database, serviceId: string): Database => {
  return produce(database, (draft) => {
    const service = draft.services[serviceId];
    const id = uuid();
    service.sequences[id] = {
      id,
      name: "New Sequence",
      order: Object.keys(service.sequences).length,
      steps: [],
    };
  });
};

const updateSequenceName = (
  database: Database,
  serviceId: string,
  sequenceId: string,
  name: string,
): Database => {
  return produce(database, (draft) => {
    draft.services[serviceId].sequences[sequenceId].name = name;
  });
};

const deleteSequence = (
  database: Database,
  serviceId: string,
  sequenceId: string,
): Database =>
  produce(database, (draft) => {
    delete draft.services[serviceId].sequences[sequenceId];
  });

const duplicateSequence = (
  database: Database,
  serviceId: string,
  sequenceId: string,
): Database =>
  produce(database, (draft) => {
    const newId = uuid();
    draft.services[serviceId].sequences[newId] = {
      ...draft.services[serviceId].sequences[sequenceId],
      id: newId,
    };
  });

const DEFAULT_EVENT_NAME = "EVENT";

/** Steps */
const addStep = ({
  database,
  fromEnvId,
  index,
  sequenceId,
  serviceId,
  toEnvId,
}: {
  database: Database;
  serviceId: string;
  sequenceId: string;
  fromEnvId: string;
  toEnvId: string;
  index: number;
}): Database =>
  produce(database, (draft) => {
    draft.services[serviceId].sequences[sequenceId].steps.splice(index, 0, {
      event: DEFAULT_EVENT_NAME,
      id: uuid(),
      from: fromEnvId,
      to: toEnvId,
    });
  });

const updateStepEventName = (
  database: Database,
  serviceId: string,
  sequenceId: string,
  stepIndex: number,
  name: string,
): Database =>
  produce(database, (draft) => {
    draft.services[serviceId].sequences[sequenceId].steps[
      stepIndex
    ].event = name;
  });

const deleteStep = (
  database: Database,
  serviceId: string,
  sequenceId: string,
  stepIndex: number,
): Database => {
  return produce(database, (draft) => {
    draft.services[serviceId].sequences[sequenceId].steps.splice(stepIndex, 1);
  });
};

/** Environment */
const addEnvironment = (database: Database, serviceId: string) => {
  return produce(database, (draft) => {
    const newId = uuid();
    draft.services[serviceId].environments[newId] = {
      id: newId,
      name: "New Environment",
    };
  });
};

const updateEnvironmentName = (
  database: Database,
  serviceId: string,
  sequenceId: string,
  envId: string,
  name: string,
) => {
  return produce(database, (draft) => {
    draft.services[serviceId].sequences[sequenceId];
    console.log(envId);
    draft.services[serviceId].environments[envId].name = name;
  });
};

const deleteEnvironment = (
  database: Database,
  serviceId: string,
  envId: string,
) => {
  Object.values(database.services[serviceId].sequences).forEach((service) => {
    service.steps.forEach((step) => {
      if (step.from === envId || step.to === envId) {
        throw new Error(
          "This environment cannot be deleted because steps depend on it.",
        );
      }
    });
  });

  return produce(database, (draft) => {
    delete draft.services[serviceId].environments[envId];
  });
};

export const getEventsFromSequences = (sequences: Sequence[]): string[] => {
  return sequences.reduce((accum, sequence) => {
    return accum.concat(
      sequence.steps.reduce((stepAccum, step) => {
        return stepAccum.concat(step.event);
      }, [] as string[]),
    );
  }, [] as string[]);
};

const updateServiceEventPayload = (
  database: Database,
  serviceId: string,
  eventPayloads: string,
) => {
  return produce(database, (draft) => {
    draft.services[serviceId].eventPayloads = eventPayloads;
  });
};

const updateServiceName = (
  database: Database,
  serviceId: string,
  name: string,
) => {
  return produce(database, (draft) => {
    draft.services[serviceId].name = name;
  });
};

const updateServiceEventPayloadWithFunc = (
  database: Database,
  serviceId: string,
  func: (eventPayload: string) => string,
) => {
  return produce(database, (draft) => {
    draft.services[serviceId].eventPayloads = func(
      draft.services[serviceId].eventPayloads,
    );
  });
};

type Event =
  | { type: "DELETE_ENVIRONMENT"; serviceId: string; envId: string }
  | {
      type: "UPDATE_SERVICE_EVENT_PAYLOAD";
      serviceId: string;
      eventPayloadString: string;
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
          onDone: {
            actions: ["saveDatabaseToContext"],
            target: "editing",
          },
          onError: {
            target: "errored",
          },
        },
      },
      errored: {},
      editing: {
        initial: "idle",
        on: {
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
              assign((context, event) => {
                return {
                  database: produce(context.database, (draft) => {
                    const id = uuid();
                    draft.services[id] = {
                      id,
                      environments: {},
                      eventPayloads: "",
                      name: "New Service",
                      sequences: {},
                    };
                  }),
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
