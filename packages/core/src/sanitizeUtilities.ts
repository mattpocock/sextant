import * as camelcase from 'lodash.camelcase';
import { Environment, Sequence, Service, Step } from './types';

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
