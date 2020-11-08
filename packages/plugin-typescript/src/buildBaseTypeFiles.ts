import { TsVisitor } from '@graphql-codegen/typescript';
import {
  FlattenedDatabase,
  getEnvironmentsWithSteps,
  getStepsFromSequences,
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
): { filename: string; content: string } => {
  const services = database.services.map((service) => {
    const allSteps = getStepsFromSequences(service.sequences);

    const typescriptDef = getTypescriptedEventPayloads(
      service.eventPayloads,
      upperFirst(camelcase(service.name)),
      allSteps,
    );

    return {
      ...service,
      typescriptDef,
      environmentsWithSteps: getEnvironmentsWithSteps(
        service.environments,
        allSteps,
      ),
    };
  });

  const environmentIdMap: Record<string, string> = database.services.reduce(
    (map, service) => {
      service.environments.forEach((env) => {
        map[env.id] = env.name;
      });
      return map;
    },
    {} as Record<string, string>,
  );

  const allStepsWithServiceNamePrefix: (Step & {
    serviceName: string;
    rawEvent: string;
  })[] = database.services.reduce(
    (steps, service) => {
      return steps.concat(
        getStepsFromSequences(service.sequences).map((step) => {
          return {
            ...step,
            event: `${service.name}.${step.event}`,
            to: environmentIdMap[step.to],
            from: environmentIdMap[step.from],
            rawEvent: step.event,
            serviceName: service.name,
          };
        }),
      );
    },
    [] as (Step & {
      serviceName: string;
      rawEvent: string;
    })[],
  );

  const uniqueEnvironmentNameSet = new Set<string>();

  Object.values(environmentIdMap).forEach((name) =>
    uniqueEnvironmentNameSet.add(name),
  );

  const uniqueEnvironmentNames = Array.from(uniqueEnvironmentNameSet);

  const environments = uniqueEnvironmentNames.map((sourceName) => {
    return {
      name: sourceName,
      from: uniqueEnvironmentNames
        .map((fromName) => {
          return {
            env: fromName,
            in: allStepsWithServiceNamePrefix.filter((step) => {
              return step.to === sourceName && step.from === fromName;
            }),
            out: allStepsWithServiceNamePrefix.filter((step) => {
              return step.from === sourceName && step.to === fromName;
            }),
          };
        })
        .filter((fromEnv) => {
          return fromEnv.in.length > 0 || fromEnv.out.length > 0;
        }),
      to: uniqueEnvironmentNames
        .map((toName) => {
          return {
            env: toName,
            in: allStepsWithServiceNamePrefix.filter((step) => {
              return step.from === sourceName && step.to === toName;
            }),
            out: allStepsWithServiceNamePrefix.filter((step) => {
              return step.to === sourceName && step.from === toName;
            }),
          };
        })
        .filter((fromEnv) => {
          return fromEnv.in.length > 0 || fromEnv.out.length > 0;
        }),
    };
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
    environments,
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
          `export type ${serviceId}__${step.event}`,
        );

        if (typeDefSet.has(step.event)) {
          return false;
        }

        typeDefSet.add(step.event);

        return !shouldFilterOut;
      })
      .map((step) => {
        return `export type ${serviceId}__${step.event} = {};`;
      });

    return {
      prepend: result.prepend.join('\n\n'),
      content: [result.content, ...emptyTypeDefs].join('\n\n'),
    };
  } catch (e) {
    console.log(e);
  }
  return {
    prepend: '',
    content: '',
  };
};

const typeRegex = /^type ([A-Z|_]{1,}) \{/gm;

const appendServiceIdToEventPayloads = (
  eventPayloads: string,
  serviceId: string,
) => {
  return eventPayloads.replace(typeRegex, (match) => {
    return match.replace(/^type /, `type ${serviceId}__`);
  });
};
