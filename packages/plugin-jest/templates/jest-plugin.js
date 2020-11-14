const { sextantScenarios } = require('./sextant-types.generated');
const { mockSextantEvent } = require('./sextant-fixture-mock.generated');

/**
 * Describe a feature of Sextant in a jest describe block
 */
export const describeSextantFeature = (featureName, testFunc) => {
  const testsRegistered = [];
  const desiredScenarios = sextantScenarios[featureName] || [];

  describe(featureName, () => {
    testFunc({
      test: (name, ...args) => {
        testsRegistered.push(name);
        test(name, ...args);
      },
      mockEvent: (eventName) => mockSextantEvent(featureName, eventName),
      testCoverage: () => {
        test('Coverage of all Sextant scenarios', () => {
          desiredScenarios.forEach((scenarioName) => {
            expect(testsRegistered).toContain(scenarioName);
          });
        });
      },
    });
  });
};
