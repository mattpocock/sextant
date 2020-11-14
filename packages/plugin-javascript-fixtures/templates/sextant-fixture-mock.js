const mocks = require('./sextant-mocks.generated.json');

const mockSextantEvent = (featureName, eventName, event = {}) => {
  if (mocks[featureName] && mocks[featureName][eventName]) {
    // Create a new object to prevent mutable errors
    return Object.assign({}, { ...mocks[featureName][eventName], event });
  }
  throw new Error(`Event ${eventName} not found in ${featureName}`);
};

module.exports = {
  mockSextantEvent,
};
