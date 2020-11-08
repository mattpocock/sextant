import { SextantContext } from './createSextantPlugin';
import { DatabaseV1 } from './databaseMigrations';

export interface SextantConfigFile {
  plugins?: SextantPluginDeclaration[];
}

export interface DefaultConfig {}

/**
 * Either an inline string describing a module to be imported,
 * or an inline plugin
 */
export type SextantPluginDeclaration =
  | string
  | [string]
  | [string, DefaultConfig]
  | SextantPlugin
  | [SextantPlugin]
  | [SextantPlugin, DefaultConfig];

export interface DatabaseV2 {
  version: 2;
  features: Record<string, Feature>;
}

export interface Feature {
  scenarios: Record<string, Scenario>;
  actors: Record<string, Actor>;
  eventPayloads: string;
  name: string;
  description: string;
  id: string;
}

export interface FlattenedDatabase {
  features: FlattenedFeature[];
}

export interface FlattenedFeature {
  scenarios: Scenario[];
  actors: Actor[];
  eventPayloads: string;
  name: string;
  id: string;
}

export interface Scenario {
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

export interface Actor {
  id: string;
  name: string;
}

export type Database = DatabaseV2;

export type DatabaseOfUnknownVersion = DatabaseV1 | DatabaseV2;

export type SextantPlugin = <TConfig extends {}>(
  database: Database,
  config: TConfig,
) => void;

export type SextantPluginImplementation<TConfig extends {}> = (
  sextantContext: SextantContext,
  config: TConfig,
) => void;
