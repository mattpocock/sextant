import { Database, FlattenedDatabase, Sequence, Step } from './types';
import produce from 'immer';
import humanId from 'human-id';

const uuid = () => humanId();

export const flattenDatabase = (database: Database): FlattenedDatabase => {
  return {
    services: Object.values(database.services).map((service) => {
      return {
        ...service,
        environments: Object.values(service.environments),
        sequences: Object.values(service.sequences),
      };
    }),
  };
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
