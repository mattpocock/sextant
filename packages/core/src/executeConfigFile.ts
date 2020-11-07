import { getTargetDir } from './fileSaveUtilities';
import * as path from 'path';
import * as fs from 'fs';
import {
  DEFAULT_CONFIG_FILE,
  PERMITTED_SEXTANT_CONFIG_FILENAMES,
} from './constants';
import {
  Database,
  DefaultConfig,
  SextantConfigFile,
  SextantPlugin,
  SextantPluginDeclaration,
} from './types';

export const executeConfigFile = (database: Database) => {
  const config = getConfig();

  config.plugins?.forEach((pluginDeclaration, index) => {
    const [plugin, config] = unwrapPluginFromArrayDeclaration(
      pluginDeclaration,
    );

    switch (typeof plugin) {
      case 'function': {
        return plugin(database, config);
      }
      case 'string': {
        let pluginRequireId = plugin;
        if (plugin.startsWith('./') || plugin.startsWith('../')) {
          pluginRequireId = path.resolve(getTargetDir(), plugin);
        }

        const requiredPlugin:
          | SextantPlugin
          | { default: SextantPlugin } = require(pluginRequireId);

        if (typeof requiredPlugin === 'function') {
          return requiredPlugin(database, config);
        }
        return requiredPlugin.default(database, config);
      }
      default:
        console.log(`An incorrect plugin syntax was passed in your config.`);
        console.log(`Path: sextantConfig.plugins[${index}]`);
        console.log(`Plugin passed: ${JSON.stringify(plugin)}`);
    }
  });
};

export const getConfigFileLocation = () => {
  const targetDir = getTargetDir();

  let configFileLocation: string | undefined = undefined;

  for (const filename in PERMITTED_SEXTANT_CONFIG_FILENAMES) {
    const location = path.resolve(targetDir, filename);
    if (fs.existsSync(location)) {
      configFileLocation = location;
      break;
    }
  }
  return (
    configFileLocation ||
    path.resolve(targetDir, PERMITTED_SEXTANT_CONFIG_FILENAMES[0])
  );
};

export const getConfig = (): SextantConfigFile => {
  const configFileLocation = getConfigFileLocation();

  if (!configFileLocation) {
    return {};
  }
  return require(configFileLocation);
};

export const ensureConfigFileExists = () => {
  const configFileLocation = getConfigFileLocation();
  if (!fs.existsSync(configFileLocation)) {
    fs.writeFileSync(configFileLocation, DEFAULT_CONFIG_FILE);
  }
};

export const unwrapPluginFromArrayDeclaration = (
  pluginDeclaration: SextantPluginDeclaration,
): [SextantPlugin | string, DefaultConfig] => {
  if (Array.isArray(pluginDeclaration)) {
    return [pluginDeclaration[0], pluginDeclaration[1] || {}];
  }
  return [pluginDeclaration, {}];
};
