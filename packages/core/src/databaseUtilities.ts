import humanId from 'human-id';
import produce from 'immer';
import {
  sanitizeActor,
  sanitizeScenario,
  sanitizeFeature,
} from './sanitizeUtilities';
import { Database, Actor, FlattenedDatabase, Scenario, Step } from './types';

const uuid = () => humanId();

/**
 * Flattens the database into a series of arrays, instead
 * of keyed objects.
 *
 * Also sanitizes various names by camelcasing them
 */
export const flattenDatabase = (database: Database): FlattenedDatabase => {
  return {
    features: Object.values(database.features).map((feature) => {
      return {
        ...sanitizeFeature(feature),
        actors: Object.values(feature.actors).map(sanitizeActor),
        scenarios: Object.values(feature.scenarios).map(sanitizeScenario),
      };
    }),
  };
};

export interface StepDescriptor {
  env: string;
  in: Step[];
  out: Step[];
}

export type ActorWithStep = Actor & {
  from: StepDescriptor[];
  to: StepDescriptor[];
};

export const getActorsWithSteps = (
  actors: Actor[],
  steps: Step[],
): ActorWithStep[] => {
  return actors.map((env) => {
    return {
      ...env,
      from: actors
        .map((fromEnv) => {
          return {
            env: fromEnv.name,
            in: steps.filter((step) => {
              return step.to === env.id && step.from === fromEnv.id;
            }),
            out: steps.filter((step) => {
              return step.from === env.id && step.to === fromEnv.id;
            }),
          };
        })
        .filter((fromEnv) => {
          return fromEnv.in.length > 0 || fromEnv.out.length > 0;
        }),
      to: actors
        .map((toEnv) => {
          return {
            env: toEnv.name,
            in: steps.filter((step) => {
              return step.from === env.id && step.to === toEnv.id;
            }),
            out: steps.filter((step) => {
              return step.to === env.id && step.from === toEnv.id;
            }),
          };
        })
        .filter((fromEnv) => {
          return fromEnv.in.length > 0 || fromEnv.out.length > 0;
        }),
    };
  });
};

/** Scenarios */
export const addScenario = (
  database: Database,
  featureId: string,
): Database => {
  return produce(database, (draft) => {
    const feature = draft.features[featureId];
    const id = uuid();
    feature.scenarios[id] = {
      id,
      description: 'Description',
      name: 'New Scenario',
      order: Object.keys(feature.scenarios).length,
      steps: [],
    };
  });
};

export const addFeature = (database: Database) => {
  return produce(database, (draft) => {
    const id = uuid();
    draft.features[id] = {
      id,
      actors: {},
      description: 'Description',
      eventPayloads: '',
      name: 'New Feature',
      scenarios: {},
    };
  });
};

export const updateScenarioName = (
  database: Database,
  featureId: string,
  scenarioId: string,
  name: string,
): Database => {
  return produce(database, (draft) => {
    draft.features[featureId].scenarios[scenarioId].name = name;
  });
};

export const updateScenarioDescription = (
  database: Database,
  featureId: string,
  scenarioId: string,
  description: string,
): Database => {
  return produce(database, (draft) => {
    draft.features[featureId].scenarios[scenarioId].description = description;
  });
};

export const deleteScenario = (
  database: Database,
  featureId: string,
  scenarioId: string,
): Database =>
  produce(database, (draft) => {
    delete draft.features[featureId].scenarios[scenarioId];
  });

export const duplicateScenario = (
  database: Database,
  featureId: string,
  scenarioId: string,
): Database =>
  produce(database, (draft) => {
    const newId = uuid();
    draft.features[featureId].scenarios[newId] = {
      ...draft.features[featureId].scenarios[scenarioId],
      id: newId,
    };
  });

export const DEFAULT_EVENT_NAME = 'EVENT';

/** Steps */
export const addStep = ({
  database,
  fromEnvId,
  index,
  scenarioId,
  featureId,
  toEnvId,
}: {
  database: Database;
  featureId: string;
  scenarioId: string;
  fromEnvId: string;
  toEnvId: string;
  index: number;
}): Database =>
  produce(database, (draft) => {
    draft.features[featureId].scenarios[scenarioId].steps.splice(index, 0, {
      event: DEFAULT_EVENT_NAME,
      id: uuid(),
      from: fromEnvId,
      to: toEnvId,
    });
  });

export const updateStepEventName = (
  database: Database,
  featureId: string,
  scenarioId: string,
  stepIndex: number,
  name: string,
): Database =>
  produce(database, (draft) => {
    draft.features[featureId].scenarios[scenarioId].steps[
      stepIndex
    ].event = name;
  });

export const deleteStep = (
  database: Database,
  featureId: string,
  scenarioId: string,
  stepIndex: number,
): Database => {
  return produce(database, (draft) => {
    draft.features[featureId].scenarios[scenarioId].steps.splice(stepIndex, 1);
  });
};

/** Actor */
export const addActor = (database: Database, featureId: string) => {
  return produce(database, (draft) => {
    const newId = uuid();
    draft.features[featureId].actors[newId] = {
      id: newId,
      name: 'New Actor',
    };
  });
};

export const updateActorName = (
  database: Database,
  featureId: string,
  scenarioId: string,
  envId: string,
  name: string,
) => {
  return produce(database, (draft) => {
    draft.features[featureId].scenarios[scenarioId];
    draft.features[featureId].actors[envId].name = name;
  });
};

export const deleteActor = (
  database: Database,
  featureId: string,
  envId: string,
) => {
  Object.values(database.features[featureId].scenarios).forEach((feature) => {
    feature.steps.forEach((step) => {
      if (step.from === envId || step.to === envId) {
        throw new Error(
          'This actor cannot be deleted because steps depend on it.',
        );
      }
    });
  });

  return produce(database, (draft) => {
    delete draft.features[featureId].actors[envId];
  });
};

export const getStepsFromScenarios = (scenarios: Scenario[]): Step[] => {
  return scenarios.reduce((accum, scenario) => {
    return accum.concat(
      scenario.steps.reduce((stepAccum, step) => {
        return stepAccum.concat(step);
      }, [] as Step[]),
    );
  }, [] as Step[]);
};

export const updateFeatureEventPayload = (
  database: Database,
  featureId: string,
  eventPayloads: string,
) => {
  return produce(database, (draft) => {
    draft.features[featureId].eventPayloads = eventPayloads;
  });
};

export const updateFeatureName = (
  database: Database,
  featureId: string,
  name: string,
) => {
  return produce(database, (draft) => {
    draft.features[featureId].name = name;
  });
};

export const updateFeatureDescription = (
  database: Database,
  featureId: string,
  description: string,
) => {
  return produce(database, (draft) => {
    draft.features[featureId].description = description;
  });
};

export const updateFeatureEventPayloadWithFunc = (
  database: Database,
  featureId: string,
  func: (eventPayload: string) => string,
) => {
  return produce(database, (draft) => {
    draft.features[featureId].eventPayloads = func(
      draft.features[featureId].eventPayloads,
    );
  });
};
