import { SextantPlugin } from './createSextantPlugin';

export interface SextantConfigFile {
  plugins?: SextantPluginDeclaration[];
}

/**
 * Either an inline string describing a module to be imported,
 * or an inline plugin
 */
export type SextantPluginDeclaration = string | SextantPlugin;

export interface Database {
  services: Record<string, Service>;
}

export interface Service {
  sequences: Record<string, Sequence>;
  environments: Record<string, Environment>;
  eventPayloads: string;
  name: string;
  description: string;
  id: string;
}

export interface FlattenedDatabase {
  services: FlattenedService[];
}

export interface FlattenedService {
  sequences: Sequence[];
  environments: Environment[];
  eventPayloads: string;
  name: string;
  id: string;
}

export interface Sequence {
  id: string;
  name: string;
  description: string;
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
