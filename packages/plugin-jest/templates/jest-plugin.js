const { sextantScenarios } = require('./sextant-types.generated');

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
