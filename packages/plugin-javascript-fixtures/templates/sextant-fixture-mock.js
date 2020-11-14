const mocks = require('./sextant-mocks.generated.json');

const mockSextantEvent = (featureName, eventName) => {
  if (mocks[featureName] && mocks[feature][eventName]) {
    return mocks[featureName][eventName];
  }
  throw new Error(`Event ${eventName} not found in ${featureName}`);
};

module.exports = {
  mockSextantEvent,
};
