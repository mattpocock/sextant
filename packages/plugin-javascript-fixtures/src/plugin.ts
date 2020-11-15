import {
  createSextantPlugin,
  getStepsFromScenarios,
  SextantContext,
} from '@sextant-tools/core';
import { GraphQLSchema } from 'graphql';
import * as fs from 'fs';
import * as path from 'path';
// import { isType, parse, GraphQLSchema } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { mockSchema } from './makeMocksFunction';

export interface PluginFixturesConfig {}

export const plugin = createSextantPlugin<PluginFixturesConfig>((context) => {
  createMockFiles(context);
});

export const createMockFiles = (context: SextantContext) => {
  const fullMockMap: Record<string, Record<string, any>> = {};

  context.database.features.forEach((feature) => {
    let schema: GraphQLSchema | undefined = undefined;
    try {
      schema = makeExecutableSchema({
        typeDefs: feature.eventPayloads,
      });
    } catch (e) {}

    const allSteps = getStepsFromScenarios(feature.scenarios);

    const mockMap: Record<string, any> = {};

    allSteps.forEach((step) => {
      const type = schema?.getType(step.event);

      /**
       * If type does not exist or schema is not parseable,
       * return a base { type: 'EVENT_NAME' }
       */
      if (!type || !schema) {
        mockMap[step.event] = { type: step.event };
        return;
      }

      const mockType = mockSchema(schema);

      const mockedType = mockType(type)({}, {}, {}, {} as any);

      mockMap[step.event] = { ...mockedType, type: step.event };
    });
    fullMockMap[feature.name] = mockMap;
  });

  context.writeFileSync(
    'sextant-mocks.generated.json',
    JSON.stringify(fullMockMap, null, 2),
  );

  context.writeFileSync(
    'sextant-fixture-mock.generated.js',
    fs
      .readFileSync(
        path.resolve(__dirname, '../templates/sextant-fixture-mock.js'),
      )
      .toString(),
  );
  context.writeFileSync(
    'sextant-fixture-mock.generated.d.ts',
    fs
      .readFileSync(
        path.resolve(__dirname, '../templates/sextant-fixture-mock.d.ts.hbs'),
      )
      .toString(),
  );
};
