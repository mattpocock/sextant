# Plugins

Plugins are what give Sextant its power. Not only can you diagram an application - you can take those diagrams and turn them into code.

You can [create your own plugins](advanced#creating-a-plugin), or choose from those built by the community.

Most of our plugins currently work with Javascript, but **Sextant plugins can produce any language of code**. Really. The sky's the limit.

> If you've got an idea for a plugin you'd like to see - submit an issue at our [repository](https://github.com/mattpocock/sextant)! We'd love to hear about it.

---

## Javascript

All our Javascript plugins can be used with Typescript. We generate full `.d.ts` files.

### Operations

The `operations` package is a library of utility functions for implementing your application with Sextant.

It also contains various typings that Sextant uses internally for its plugin system.

---

### Test Fixtures

Generate fixtures for tests based on event types declared in Sextant.

#### Installation

`yarn add @sextant-tools/plugin-javascript-fixtures`

```js
// sextant-config.js
module.exports = {
  plugins: ['@sextant-tools/plugin-javascript-fixtures'],
};
```

#### mockSextantEvent

This function allows you to mock any event declared in Sextant. For instance, an event declared like this:

```graphql
type USER {
  name: String!
  phoneNumber: String!
}
```

When called like this:

```js
const event = mockSextantEvent('featureName', 'USER');
```

Will return an object with this shape:

```json
{
  "name": "some-random-string",
  "phoneNumber": "another-random-string",
  "type": "USER"
}
```

##### Overrides

You can also pass overrides into `mockSextantEvent`. This declaration...

```js
const event = mockSextantEvent('featureName', 'USER', {
  name: 'Charles',
});
```

...results in this:

```json
{
  "name": "Charles",
  "phoneNumber": "another-random-strings",
  "type": "USER"
}
```

---

### Jest

Describe and structure your [Jest](https://jestjs.io/) tests based on your features. Get meaningful coverage reports based on actual scenarios, not code coverage.

#### Installation

`yarn add @sextant-tools/plugin-jest`

```js
// sextant-config.js
module.exports = {
  plugins: ['@sextant-tools/plugin-jest'],
};
```

#### describeSextantFeature

`describeSextantFeature` allows you to build a Jest `describe` block from a feature declared in Sextant.

Let's say you have a `getUsers` feature declared in Sextant with two scenarios: `success` and `failure`:

```js
describeSextantFeature('getUsers', (feature) => {
  feature.test('success', () => {
    // Test what happens in the success case
  });

  feature.test('failure', () => {
    // Test what happens in the failure case
  });
});
```

> `describeSextantFeature` is a one-to-one replacement with `describe`, so you can use it to contain `it()` calls too.

#### Feature Context

The test function called by `describeSextantFeature` exposes the `feature` argument, which contains some functions to help you test Sextant features.

##### feature.test

As described above, this tests a scenario of a feature. Tests performed in this way count towards the internal count `testCoverage` uses to check full coverage of Sextant scenarios.

##### feature.testCoverage

This function tests whether you have tested all scenarios specified in Sextant. If one or more is not covered, it will fail the test.

```js
describeSextantFeature('getUsers', (feature) => {
  feature.test('success', () => {
    // Test what happens in the success case
  });

  /**
   * This will fail, because we haven't tested the
   * failure case using feature.test()
   */
  feature.testCoverage();
});
```

`testCoverage` is scoped to the feature you're currently testing, and does not count tests conducted outside of the block it's called in.

##### feature.mockEvent

`mockEvent` is a shorthand for `mockSextantEvent`, declared in the fixtures package above. It allows you to mock events specific to that feature, like so:

```js
describeSextantFeature('getUsers', (feature) => {
  feature.test('success', () => {
    // Mock a GET_USERS event that should be successful
    const getUsers = feature.mockEvent('GET_USERS');
  });

  feature.test('failure', () => {
    // Mock a GET_USERS event that should end in failure
    const getUsers = feature.mockEvent('GET_USERS', {
      id: undefined,
    });
  });
});
```

---

### Express

Generate a full type-safe [Express](https://expressjs.com/) API from events and features declared in Sextant.

#### Installation

`yarn add @sextant-tools/plugin-javascript-express`

```js
// sextant-config.js
module.exports = {
  plugins: [
    [
      '@sextant-tools/plugin-javascript-express',
      {
        // The filename (without extension) you'd like to print
        expressFileName: 'sextant-express',
      },
    ],
  ],
};
```

#### makeExpressHandlers

Builds a list of Express request handlers which can be used in an Express app.

```ts
// Function signature
function makeExpressHandlers(
  fromActor: string,
  toActor: string,
  handlers: {
    [featureName: string]: (req: Request, res: Response) => void;
  },
): { feature: string; handler: Handler }[];
```

##### Example Usage

```js
const app = express();

const handlers = makeExpressHandlers('fromThisActor', 'toThisActor', {
  featureName: (req, res) => {
    // The event is passed on req.body
    const event = req.body;

    // res.json() is typed based on which events can be sent back
    res.json({
      type: 'SUCCESS',
    });
  },
});

handlers.forEach(({ handler, feature }) => {
  /**
   * Attach the generated handlers to your express app
   */
  app.post(`/${feature}`, handler);
});
```

> This documentation is incomplete! Please help us out by requesting more info.
