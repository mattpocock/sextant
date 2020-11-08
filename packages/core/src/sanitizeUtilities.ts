import * as camelcase from 'lodash.camelcase';
import { Actor, Scenario, Feature, Step } from './types';

const sanitizeName = (name: string): string => {
  return camelcase(name.trim());
};

export const sanitizeFeature = (feature: Feature): Feature => {
  return {
    ...feature,
    name: sanitizeName(feature.name),
  };
};

export const sanitizeActor = (actor: Actor): Actor => {
  return {
    ...actor,
    name: sanitizeName(actor.name),
  };
};

export const sanitizeScenario = (scenario: Scenario): Scenario => {
  return {
    ...scenario,
    name: sanitizeName(scenario.name),
    steps: scenario.steps.map(sanitizeStep),
  };
};

export const sanitizeStep = (step: Step): Step => {
  return {
    ...step,
  };
};
