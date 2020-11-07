import humanId from 'human-id';
import produce from 'immer';
import * as camelcase from 'lodash/camelCase';
import {
  Database,
  Environment,
  FlattenedDatabase,
  Sequence,
  Service,
  Step,
} from './types';

const uuid = () => humanId();

export const flattenDatabase = (database: Database): FlattenedDatabase => {
  return {
    services: Object.values(database.services).map((service) => {
      return {
        ...sanitizeService(service),
        environments: Object.values(service.environments).map(
          sanitizeEnvironment,
        ),
        sequences: Object.values(service.sequences).map(sanitizeSequence),
      };
    }),
  };
};

const sanitizeName = (name: string): string => {
  return camelcase(name.trim());
};

export const sanitizeService = (service: Service): Service => {
  return {
    ...service,
    name: sanitizeName(service.name),
  };
};

export const sanitizeEnvironment = (environment: Environment): Environment => {
  return {
    ...environment,
    name: sanitizeName(environment.name),
  };
};

export const sanitizeSequence = (sequence: Sequence): Sequence => {
  return {
    ...sequence,
    name: sanitizeName(sequence.name),
    steps: sequence.steps.map(sanitizeStep),
  };
};

export const sanitizeStep = (step: Step): Step => {
  return {
    ...step,
  };
};

export interface StepDescriptor {
  env: string;
  in: Step[];
  out: Step[];
}

export type EnvironmentWithStep = Environment & {
  from: StepDescriptor[];
  to: StepDescriptor[];
};

export const getEnvironmentsWithSteps = (
  environments: Environment[],
  steps: Step[],
): EnvironmentWithStep[] => {
  return environments.map((env) => {
    return {
      ...env,
      from: environments
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
      to: environments
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

/** Sequences */
export const addSequence = (
  database: Database,
  serviceId: string,
): Database => {
  return produce(database, (draft) => {
    const service = draft.services[serviceId];
    const id = uuid();
    service.sequences[id] = {
      id,
      description: 'Description',
      name: 'New Sequence',
      order: Object.keys(service.sequences).length,
      steps: [],
    };
  });
};

export const addService = (database: Database) => {
  return produce(database, (draft) => {
    const id = uuid();
    draft.services[id] = {
      id,
      environments: {},
      description: 'Description',
      eventPayloads: '',
      name: 'New Service',
      sequences: {},
    };
  });
};

export const updateSequenceName = (
  database: Database,
  serviceId: string,
  sequenceId: string,
  name: string,
): Database => {
  return produce(database, (draft) => {
    draft.services[serviceId].sequences[sequenceId].name = name;
  });
};

export const updateSequenceDescription = (
  database: Database,
  serviceId: string,
  sequenceId: string,
  description: string,
): Database => {
  return produce(database, (draft) => {
    draft.services[serviceId].sequences[sequenceId].description = description;
  });
};

export const deleteSequence = (
  database: Database,
  serviceId: string,
  sequenceId: string,
): Database =>
  produce(database, (draft) => {
    delete draft.services[serviceId].sequences[sequenceId];
  });

export const duplicateSequence = (
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

export const DEFAULT_EVENT_NAME = 'EVENT';

/** Steps */
export const addStep = ({
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

export const updateStepEventName = (
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

export const deleteStep = (
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
export const addEnvironment = (database: Database, serviceId: string) => {
  return produce(database, (draft) => {
    const newId = uuid();
    draft.services[serviceId].environments[newId] = {
      id: newId,
      name: 'New Environment',
    };
  });
};

export const updateEnvironmentName = (
  database: Database,
  serviceId: string,
  sequenceId: string,
  envId: string,
  name: string,
) => {
  return produce(database, (draft) => {
    draft.services[serviceId].sequences[sequenceId];
    draft.services[serviceId].environments[envId].name = name;
  });
};

export const deleteEnvironment = (
  database: Database,
  serviceId: string,
  envId: string,
) => {
  Object.values(database.services[serviceId].sequences).forEach((service) => {
    service.steps.forEach((step) => {
      if (step.from === envId || step.to === envId) {
        throw new Error(
          'This environment cannot be deleted because steps depend on it.',
        );
      }
    });
  });

  return produce(database, (draft) => {
    delete draft.services[serviceId].environments[envId];
  });
};

export const getStepsFromSequences = (sequences: Sequence[]): Step[] => {
  return sequences.reduce((accum, sequence) => {
    return accum.concat(
      sequence.steps.reduce((stepAccum, step) => {
        return stepAccum.concat(step);
      }, [] as Step[]),
    );
  }, [] as Step[]);
};

export const updateServiceEventPayload = (
  database: Database,
  serviceId: string,
  eventPayloads: string,
) => {
  return produce(database, (draft) => {
    draft.services[serviceId].eventPayloads = eventPayloads;
  });
};

export const updateServiceName = (
  database: Database,
  serviceId: string,
  name: string,
) => {
  return produce(database, (draft) => {
    draft.services[serviceId].name = name;
  });
};

export const updateServiceDescription = (
  database: Database,
  serviceId: string,
  description: string,
) => {
  return produce(database, (draft) => {
    draft.services[serviceId].description = description;
  });
};

export const updateServiceEventPayloadWithFunc = (
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
