import {
  addActor,
  addScenario,
  addFeature,
  addStep,
  Database,
  DEFAULT_EVENT_NAME,
  deleteActor,
  deleteScenario,
  deleteStep,
  duplicateScenario,
  updateActorName,
  updateScenarioDescription,
  updateScenarioName,
  updateFeatureDescription,
  updateFeatureEventPayload,
  updateFeatureEventPayloadWithFunc,
  updateFeatureName,
  updateStepEventName,
} from '@sextant-tools/core';
import { assign, Machine } from '@xstate/compiled';
import {
  clientLoadDatabase,
  getSearchParamsWithSavedDatabase,
} from './clientSaveToDatabase';
import { addEvent, editEvent, removeEvent } from './eventUtilities';
import { copyToUserClipboard } from './useCopyToClipboard';

interface Context {
  database: Database;
}

type Event =
  | { type: 'DELETE_ACTOR'; featureId: string; envId: string }
  | {
      type: 'UPDATE_FEATURE_EVENT_PAYLOAD';
      featureId: string;
      eventPayloadString: string;
    }
  | {
      type: 'UPDATE_SCENARIO_DESCRIPTION';
      featureId: string;
      scenarioId: string;
      description: string;
    }
  | {
      type: 'UPDATE_FEATURE_DESCRIPTION';
      featureId: string;
      description: string;
    }
  | {
      type: 'FEATURE_NOT_FOUND';
    }
  | {
      type: 'UPDATE_FEATURE_NAME';
      featureId: string;
      name: string;
    }
  | {
      type: 'ADD_SCENARIO';
      featureId: string;
    }
  | {
      type: 'DUPLICATE_SCENARIO';
      featureId: string;
      scenarioId: string;
    }
  | {
      type: 'DELETE_SCENARIO';
      featureId: string;
      scenarioId: string;
    }
  | {
      type: 'UPDATE_SCENARIO_NAME';
      featureId: string;
      scenarioId: string;
      name: string;
    }
  | {
      type: 'ADD_FEATURE';
    }
  | {
      type: 'ADD_ACTOR';
      featureId: string;
    }
  | {
      type: 'GET_SHARE_LINK';
    }
  | {
      type: 'UPDATE_ACTOR_NAME';
      featureId: string;
      scenarioId: string;
      envId: string;
      name: string;
    }
  | {
      type: 'ADD_STEP';
      featureId: string;
      scenarioId: string;
      fromEnvId: string;
      toEnvId: string;
      index: number;
    }
  | {
      type: 'UPDATE_STEP_NAME';
      featureId: string;
      scenarioId: string;
      stepIndex: number;
      name: string;
    }
  | {
      type: 'DELETE_STEP';
      featureId: string;
      scenarioId: string;
      stepIndex: number;
    }
  | {
      type: 'done.invoke.loadDatabase';
      data: Database | undefined;
    }
  | {
      type: 'REPORT_SERVER_NOT_RUNNING';
    };

export const keepDataInSyncMachine = Machine<Context, Event, 'keepDataInSync'>(
  {
    initial: 'loading',
    context: {
      database: {
        version: 2,
        features: {
          initial: {
            id: 'initial',
            description: 'Description',
            name: 'Initial',
            actors: {},
            scenarios: {},
            eventPayloads: '',
          },
        },
      },
    },
    on: {
      REPORT_SERVER_NOT_RUNNING: '.serverNotRunning',
    },
    states: {
      loading: {
        invoke: {
          src: 'loadDatabase',
          onDone: [
            {
              cond: 'databaseHasAtLeastOneFeature',
              actions: ['saveDatabaseToContext'],
              target: 'editing',
            },
            {
              actions: ['saveDefaultDatabaseToContext', 'goToInitialFeature'],
              target: 'editing',
            },
          ],
          onError: {
            target: 'recoveringFromError',
          },
        },
      },
      serverNotRunning: {},
      recoveringFromError: {
        always: [
          {
            cond: 'databaseFromContextHasAtLeastOneFeature',
            actions: ['goToFirstFeature'],
            target: 'editing',
          },
          {
            actions: ['saveDefaultDatabaseToContext', 'goToInitialFeature'],
            target: 'editing',
          },
        ],
      },
      editing: {
        initial: 'idle',
        on: {
          FEATURE_NOT_FOUND: [
            {
              cond: 'databaseFromContextHasAtLeastOneFeature',
              actions: ['goToFirstFeature'],
              target: 'editing',
            },
            {
              actions: ['saveDefaultDatabaseToContext', 'goToInitialFeature'],
              target: 'editing',
            },
          ],
          UPDATE_FEATURE_EVENT_PAYLOAD: {
            actions: assign((context, event) => {
              return {
                database: updateFeatureEventPayload(
                  context.database,
                  event.featureId,
                  event.eventPayloadString,
                ),
              };
            }),
            target: '.throttling',
          },
          ADD_ACTOR: {
            actions: assign((context, event) => {
              return {
                database: addActor(context.database, event.featureId),
              };
            }),
            target: '.throttling',
          },
          DELETE_ACTOR: [
            {
              cond: 'canDeleteActor',
              actions: ['deleteActor'],
              target: '.throttling',
            },
            {
              actions: ['tellUserWeCannotDeleteTheActor'],
            },
          ],
          ADD_SCENARIO: {
            actions: assign((context, event) => {
              return {
                database: addScenario(context.database, event.featureId),
              };
            }),
            target: '.throttling',
          },
          DELETE_SCENARIO: {
            actions: assign((context, event) => {
              return {
                database: deleteScenario(
                  context.database,
                  event.featureId,
                  event.scenarioId,
                ),
              };
            }),
            target: '.throttling',
          },
          UPDATE_FEATURE_NAME: {
            target: '.throttling',
            actions: [
              assign((context, event) => {
                return {
                  database: updateFeatureName(
                    context.database,
                    event.featureId,
                    event.name,
                  ),
                };
              }),
            ],
          },
          GET_SHARE_LINK: {
            actions: 'copyShareLinkToClipboard',
          },
          DUPLICATE_SCENARIO: {
            target: '.throttling',
            actions: [
              assign((context, event) => {
                return {
                  database: duplicateScenario(
                    context.database,
                    event.featureId,
                    event.scenarioId,
                  ),
                };
              }),
            ],
          },
          ADD_FEATURE: {
            target: '.throttling',
            actions: [
              assign((context) => {
                return {
                  database: addFeature(context.database),
                };
              }),
            ],
          },
          UPDATE_SCENARIO_DESCRIPTION: {
            target: '.throttling',
            actions: [
              assign((context, event) => {
                return {
                  database: updateScenarioDescription(
                    context.database,
                    event.featureId,
                    event.scenarioId,
                    event.description,
                  ),
                };
              }),
            ],
          },
          UPDATE_FEATURE_DESCRIPTION: {
            target: '.throttling',
            actions: [
              assign((context, event) => {
                return {
                  database: updateFeatureDescription(
                    context.database,
                    event.featureId,
                    event.description,
                  ),
                };
              }),
            ],
          },
          ADD_STEP: {
            actions: [
              assign((context, event) => {
                return {
                  database: updateFeatureEventPayloadWithFunc(
                    context.database,
                    event.featureId,
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
                    scenarioId: event.scenarioId,
                    featureId: event.featureId,
                    toEnvId: event.toEnvId,
                  }),
                };
              }),
            ],
            target: '.throttling',
          },
          DELETE_STEP: {
            actions: [
              assign((context, event) => {
                const eventName =
                  context.database.features[event.featureId].scenarios[
                    event.scenarioId
                  ].steps[event.stepIndex].event;

                return {
                  database: updateFeatureEventPayloadWithFunc(
                    context.database,
                    event.featureId,
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
                    event.featureId,
                    event.scenarioId,
                    event.stepIndex,
                  ),
                };
              }),
            ],
            target: '.throttling',
          },
          UPDATE_STEP_NAME: {
            actions: [
              assign((context, event) => {
                const targetEvent =
                  context.database.features[event.featureId].scenarios[
                    event.scenarioId
                  ].steps[event.stepIndex].event;
                return {
                  database: updateFeatureEventPayloadWithFunc(
                    context.database,
                    event.featureId,
                    (currentEventPayloads) => {
                      if (event.name === '') {
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
                    event.featureId,
                    event.scenarioId,
                    event.stepIndex,
                    event.name,
                  ),
                };
              }),
            ],
            target: '.throttling',
          },
          UPDATE_ACTOR_NAME: {
            actions: assign((context, event) => {
              return {
                database: updateActorName(
                  context.database,
                  event.featureId,
                  event.scenarioId,
                  event.envId,
                  event.name,
                ),
              };
            }),
            target: '.throttling',
          },
          UPDATE_SCENARIO_NAME: {
            actions: assign((context, event) => {
              return {
                database: updateScenarioName(
                  context.database,
                  event.featureId,
                  event.scenarioId,
                  event.name,
                ),
              };
            }),
            target: '.throttling',
          },
        },
        states: {
          idle: {},
          throttling: {
            after: {
              800: 'saving',
            },
          },
          saving: {
            always: {
              target: 'idle',
              actions: 'saveToDatabase',
            },
          },
        },
      },
    },
  },
  {
    services: {
      loadDatabase: async () => {
        return clientLoadDatabase();
      },
    },
    guards: {
      databaseFromContextHasAtLeastOneFeature: (context) => {
        return Object.keys(context.database).length > 0;
      },
      databaseHasAtLeastOneFeature: (context, event) => {
        return Object.keys(event.data?.features || {}).length > 0;
      },
      canDeleteActor: ({ database }, { envId, featureId }) => {
        try {
          Object.values(database.features[featureId].scenarios).forEach(
            (feature) => {
              feature.steps.forEach((step) => {
                if (step.from === envId || step.to === envId) {
                  throw new Error(
                    'This actor cannot be deleted because steps depend on it.',
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
      tellUserWeCannotDeleteTheActor: () => {
        alert(
          'You cannot delete this actor because it has steps associated with it.',
        );
      },
      copyShareLinkToClipboard(context) {
        copyToUserClipboard(
          `https://demo.sextant.tools/?${getSearchParamsWithSavedDatabase(
            context.database,
          )}`,
        );
        alert('Copied share link to clipboard!');
      },
      saveDefaultDatabaseToContext: assign((context) => {
        return {
          database: {
            version: 2,
            features: {
              initial: {
                description: 'Description',
                actors: {},
                eventPayloads: '',
                id: 'initial',
                name: 'Your First Feature',
                scenarios: {},
              },
            },
          },
        };
      }),
      saveDatabaseToContext: assign((context, event) => {
        if (event.data?.features) {
          return {
            database: event.data,
          };
        }
        return {};
      }),
      deleteActor: assign((context, event) => {
        return {
          database: deleteActor(context.database, event.featureId, event.envId),
        };
      }),
    },
  },
);
