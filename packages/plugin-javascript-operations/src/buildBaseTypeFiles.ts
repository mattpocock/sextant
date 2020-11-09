import { TsVisitor } from '@graphql-codegen/typescript';
import {
  FlattenedDatabase,
  getActorsWithSteps,
  getStepsFromScenarios,
  Step,
} from '@sextant-tools/core';
import * as fs from 'fs';
import * as path from 'path';
import { buildSchema, parse, printSchema, visit } from 'graphql';
import Handlebars from 'handlebars';
import * as camelcase from 'lodash.camelcase';
import * as upperFirst from 'lodash.upperfirst';

Handlebars.registerHelper('pascalcase', (str) => {
  return upperFirst(camelcase(str));
});

export const buildBaseTypeFiles = (
  database: FlattenedDatabase,
  // TODO - implement this
  _fileName?: string,
): { filename: string; content: string }[] => {
  const features = database.features.map((feature) => {
    const allSteps = getStepsFromScenarios(feature.scenarios);

    const typescriptDef = getTypescriptedEventPayloads(
      feature.eventPayloads,
      upperFirst(camelcase(feature.name)),
      allSteps,
    );

    return {
      ...feature,
      typescriptDef,
      actorsWithSteps: getActorsWithSteps(feature.actors, allSteps),
    };
  });

  const actorIdMap: Record<string, string> = database.features.reduce(
    (map, feature) => {
      feature.actors.forEach((env) => {
        map[env.id] = env.name;
      });
      return map;
    },
    {} as Record<string, string>,
  );

  const allStepsWithFeatureNamePrefix: (Step & {
    featureName: string;
    rawEvent: string;
  })[] = database.features.reduce(
    (steps, feature) => {
      return steps.concat(
        getStepsFromScenarios(feature.scenarios).map((step) => {
          return {
            ...step,
            event: `${feature.name}.${step.event}`,
            to: actorIdMap[step.to],
            from: actorIdMap[step.from],
            rawEvent: step.event,
            featureName: feature.name,
          };
        }),
      );
    },
    [] as (Step & {
      featureName: string;
      rawEvent: string;
    })[],
  );

  const uniqueActorNameSet = new Set<string>();

  Object.values(actorIdMap).forEach((name) => uniqueActorNameSet.add(name));

  const uniqueActorNames = Array.from(uniqueActorNameSet);

  const actors = uniqueActorNames.map((sourceName) => {
    return {
      name: sourceName,
      from: uniqueActorNames
        .map((fromName) => {
          return {
            env: fromName,
            in: allStepsWithFeatureNamePrefix.filter((step) => {
              return step.to === sourceName && step.from === fromName;
            }),
            out: allStepsWithFeatureNamePrefix.filter((step) => {
              return step.from === sourceName && step.to === fromName;
            }),
          };
        })
        .filter((fromEnv) => {
          return fromEnv.in.length > 0 || fromEnv.out.length > 0;
        }),
      to: uniqueActorNames
        .map((toName) => {
          return {
            env: toName,
            in: allStepsWithFeatureNamePrefix.filter((step) => {
              return step.from === sourceName && step.to === toName;
            }),
            out: allStepsWithFeatureNamePrefix.filter((step) => {
              return step.to === sourceName && step.from === toName;
            }),
          };
        })
        .filter((fromEnv) => {
          return fromEnv.in.length > 0 || fromEnv.out.length > 0;
        }),
    };
  });

  const declarationTemplate = Handlebars.compile(
    fs
      .readFileSync(
        path.resolve(__dirname, '../templates/sextant-types.d.ts.hbs'),
      )
      .toString(),
  );

  const declarationResult = declarationTemplate({
    features,
    actors,
  });

  const jsFileTemplate = Handlebars.compile(
    fs
      .readFileSync(
        path.resolve(__dirname, '../templates/sextant-types.js.hbs'),
      )
      .toString(),
  );

  return [
    {
      content: [
        features?.find((feature) => Boolean(feature.typescriptDef.prepend))
          ?.typescriptDef?.prepend || '',
        ...features.map((feature) => {
          return feature.typescriptDef.content;
        }),
        declarationResult,
      ].join('\n\n'),
      filename: 'sextant-types.generated.d.ts',
    },
    {
      content: jsFileTemplate({
        features,
        actors,
      }),
      filename: 'sextant-types.generated.js',
    },
  ];
};

const getTypescriptedEventPayloads = (
  untransformedEventPayloads: string,
  featureId: string,
  steps: Step[],
) => {
  let toReturn: { prepend: string; content: string } = {
    content: '',
    prepend: '',
  };
  try {
    const eventPayloads = appendFeatureIdToEventPayloads(
      untransformedEventPayloads,
      featureId,
    );

    const schema = buildSchema(eventPayloads);
    const visitor = new TsVisitor(schema, {
      namingConvention: 'keep',
      skipTypename: true,
      scalars: {},
    });
    const printedSchema = printSchema(schema);
    const astNode = parse(printedSchema);
    const visitorResult = visit(astNode, { leave: visitor });

    // const scalars = visitor.scalarsDefinition;

    const result = {
      prepend: [
        ...visitor.getEnumsImports(),
        ...visitor.getScalarsImports(),
        ...visitor.getWrapperDefinitions(),
        visitor.scalarsDefinition,
      ],
      content: [...visitorResult.definitions].join('\n'),
    };

    toReturn = {
      prepend: result.prepend.join('\n\n'),
      content: result.content,
    };
  } catch (e) {}
  const typeDefSet = new Set<string>();

  const emptyTypeDefs = steps
    .filter((step) => {
      const shouldFilterOut = toReturn.content.includes(
        `export type ${featureId}__${step.event}`,
      );

      if (typeDefSet.has(step.event)) {
        return false;
      }

      typeDefSet.add(step.event);

      return !shouldFilterOut;
    })
    .map((step) => {
      return `export type ${featureId}__${step.event} = {};`;
    });
  return {
    prepend: toReturn.prepend,
    content: [toReturn.content, ...emptyTypeDefs].join('\n\n'),
  };
};

const typeRegex = /^type ([A-Z|_]{1,}) \{/gm;

const appendFeatureIdToEventPayloads = (
  eventPayloads: string,
  featureId: string,
) => {
  return eventPayloads.replace(typeRegex, (match) => {
    return match.replace(/^type /, `type ${featureId}__`);
  });
};
