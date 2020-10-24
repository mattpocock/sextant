import { Machine, assign } from "@xstate/compiled";
import produce from "immer";
import { v4 as uuid } from "uuid";

export interface Database {
  services: Record<string, Service>;
}

export interface Service {
  sequences: Record<string, Sequence>;
  environments: Record<string, Environment>;
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
      event: "EVENT",
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

type Event =
  | { type: "DELETE_ENVIRONMENT"; serviceId: string; envId: string }
  | {
      type: "ADD_SEQUENCE";
      serviceId: string;
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
            environments: {},
            sequences: {},
          },
        },
      },
    },

    states: {
      loading: {
        invoke: {
          src: "loadDatabase",
          onDone: {
            actions: assign((context, event) => {
              return {
                database: event.data as Database,
              };
            }),
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
          ADD_STEP: {
            actions: assign((context, event) => {
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
            target: ".throttling",
          },
          DELETE_STEP: {
            actions: assign((context, event) => {
              return {
                database: deleteStep(
                  context.database,
                  event.serviceId,
                  event.sequenceId,
                  event.stepIndex,
                ),
              };
            }),
            target: ".throttling",
          },
          UPDATE_STEP_NAME: {
            actions: assign((context, event) => {
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
