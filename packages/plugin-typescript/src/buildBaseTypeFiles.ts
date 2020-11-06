import { TsVisitor } from '@graphql-codegen/typescript';
import {
  FlattenedDatabase,
  getStepsFromSequences,
  Step,
} from '@sextant-tools/core';
import * as fs from 'fs';
import { buildSchema, parse, printSchema, visit } from 'graphql';
import Handlebars from 'handlebars';
import * as helpers from 'handlebars-helpers';
import * as path from 'path';

export const buildBaseTypeFiles = (
  database: FlattenedDatabase,
): { filename: string; content: string } => {
  const services = database.services.map((service) => {
    const allSteps = getStepsFromSequences(service.sequences);

    const typescriptDef = getTypescriptedEventPayloads(
      service.eventPayloads,
      service.id,
      allSteps,
    );

    return {
      ...service,
      typescriptDef,
      environmentsWithSteps: service.environments.map((env) => {
        return {
          ...env,
          from: service.environments
            .map((fromEnv) => {
              return {
                env: fromEnv.name,
                in: allSteps.filter((step) => {
                  return step.to === env.id && step.from === fromEnv.id;
                }),
                out: allSteps.filter((step) => {
                  return step.from === env.id && step.to === fromEnv.id;
                }),
              };
            })
            .filter((fromEnv) => {
              return fromEnv.in.length > 0 || fromEnv.out.length > 0;
            }),
          to: service.environments
            .map((toEnv) => {
              return {
                env: toEnv.name,
                in: allSteps.filter((step) => {
                  return step.from === env.id && step.to === toEnv.id;
                }),
                out: allSteps.filter((step) => {
                  return step.to === env.id && step.from === toEnv.id;
                }),
              };
            })
            .filter((fromEnv) => {
              return fromEnv.in.length > 0 || fromEnv.out.length > 0;
            }),
        };
      }),
    };
  });

  helpers({
    handlebars: Handlebars,
  });

  const template = Handlebars.compile(
    fs
      .readFileSync(
        path.resolve(__dirname, '../templates/sextant-types.ts.hbs'),
      )
      .toString(),
  );

  const result = template({
    services,
  });

  return {
    content: [
      services?.[0]?.typescriptDef?.prepend || '',
      ...services.map((service) => {
        return service.typescriptDef.content;
      }),
      result,
    ].join('\n\n'),
    filename: 'sextant-types.generated.ts',
  };
};

const getTypescriptedEventPayloads = (
  untransformedEventPayloads: string,
  serviceId: string,
  steps: Step[],
) => {
  try {
    const eventPayloads = appendServiceIdToEventPayloads(
      untransformedEventPayloads,
      serviceId,
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

    const typeDefSet = new Set<string>();

    const emptyTypeDefs = steps
      .filter((step) => {
        const shouldFilterOut = result.content.includes(
          `export type ${serviceId.toUpperCase()}__${step.event}`,
        );

        if (typeDefSet.has(step.event)) {
          return false;
        }

        typeDefSet.add(step.event);

        return !shouldFilterOut;
      })
      .map((step) => {
        return `export type ${serviceId.toUpperCase()}__${step.event} = {};`;
      });

    return {
      prepend: result.prepend.join('\n\n'),
      content: [result.content, ...emptyTypeDefs].join('\n\n'),
    };
  } catch (e) {}
  return {
    prepend: '',
    content: '',
  };
};

const typeRegex = /^type ([A-Z|a-z|_]{1,}) \{/gm;

const appendServiceIdToEventPayloads = (
  eventPayloads: string,
  serviceId: string,
) => {
  return eventPayloads.replace(typeRegex, (match) => {
    return match.replace(/^type /, `type ${serviceId.toUpperCase()}__`);
  });
};
