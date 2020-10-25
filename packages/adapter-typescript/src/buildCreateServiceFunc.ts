import Handlebars from "handlebars";
import * as helpers from "handlebars-helpers";
import * as fs from "fs";
import * as path from "path";
import { FlattenedDatabase, getStepsFromSequences } from "@sextant/core";

export const buildCodeForCreateService = (database: FlattenedDatabase) => {
  const services = database.services.map((service) => {
    const allSteps = getStepsFromSequences(service.sequences);
    return {
      ...service,
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
  return result;
};
