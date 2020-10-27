import Handlebars from "handlebars";
import * as helpers from "handlebars-helpers";
import * as camelcase from "lodash/camelCase";
import * as upperFirst from "lodash/upperFirst";
import * as fs from "fs";
import * as path from "path";
import { FlattenedDatabase, getStepsFromSequences } from "@sextant-tools/core";
import { TsVisitor } from "@graphql-codegen/typescript";
import { buildSchema, printSchema, parse, visit } from "graphql";

export const buildCodeForCreateService = (
  database: FlattenedDatabase,
): { filename: string; content: string }[] => {
  const services = database.services.map((service) => {
    const allSteps = getStepsFromSequences(service.sequences);

    const typescriptDefText = getTypescriptedEventPayloads(
      service.eventPayloads,
    );

    const typeDefSet = new Set<string>();

    const emptyTypeDefs = allSteps
      .filter((step) => {
        const shouldFilterIn = !typescriptDefText.includes(
          `export type ${step.event} = {`,
        );

        if (typeDefSet.has(step.event)) {
          return false;
        }

        typeDefSet.add(step.event);

        return shouldFilterIn;
      })
      .map((step) => {
        return `export type ${step.event} = {};`;
      })
      .join("\n\n");

    return {
      ...service,
      typescriptDefText: [typescriptDefText, emptyTypeDefs]
        .filter(Boolean)
        .join("\n\n"),
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
        path.resolve(__dirname, "../templates/createService.ts.hbs"),
      )
      .toString(),
  );

  const result = template({
    services,
  });

  const typeFiles = services
    .filter((service) => {
      return Boolean(service.typescriptDefText);
    })
    .map((service) => {
      return {
        content: service.typescriptDefText,
        filename: `${camelcase(service.name)}.generated.ts`,
        importName: upperFirst(camelcase(service.name)),
      };
    });

  const importStatementText = typeFiles
    .map(
      (file) =>
        `import * as ${file.importName} from './${camelcase(
          file.importName,
        )}.generated';`,
    )
    .join("\n");

  return [
    {
      content: [importStatementText, result].join("\n\n"),
      filename: "createActor.generated.ts",
    },
    ...typeFiles,
  ];
};

const getTypescriptedEventPayloads = (eventPayloads: string) => {
  try {
    const schema = buildSchema(eventPayloads);
    const visitor = new TsVisitor(schema, {
      namingConvention: "keep",
      skipTypename: true,
    });
    const printedSchema = printSchema(schema);
    const astNode = parse(printedSchema);
    const visitorResult = visit(astNode, { leave: visitor });

    const scalars = visitor.scalarsDefinition;

    const result = {
      prepend: [
        ...visitor.getEnumsImports(),
        ...visitor.getScalarsImports(),
        ...visitor.getWrapperDefinitions(),
      ],
      content: [scalars, ...visitorResult.definitions].join("\n"),
    };

    return `${result.prepend.join("\n")}\n\n${result.content}`;
  } catch (e) {}
  return "";
};
