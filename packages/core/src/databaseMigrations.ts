import { Actor, Step } from './types';

export interface DatabaseV1 {
  version: undefined;
  services: Record<string, ServiceV1>;
}

export interface ServiceV1 {
  sequences: Record<string, SequenceV1>;
  environments: Record<string, Actor>;
  eventPayloads: string;
  name: string;
  description: string;
  id: string;
}

export interface SequenceV1 {
  id: string;
  name: string;
  description: string;
  order: number;
  steps: Step[];
}
