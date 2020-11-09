# Plugins

Plugins are what give Sextant its power. Not only can you diagram an application - you can take those diagrams and turn them into code.

You can [create your own plugins](advanced#creating-a-plugin), or choose from those built by the community.

Most of our plugins currently work with Javascript, but **Sextant plugins can produce any language of code**. Really. The sky's the limit.

> If you've got an idea for a plugin you'd like to see - submit an issue at our [repository](https://github.com/mattpocock/sextant)! We'd love to hear about it.

## Javascript

All our Javascript plugins can be used with Typescript. We generate full `.d.ts` files.

### Operations

The `operations` package is a library of utility functions for implementing your application with Sextant.

_TODO - Documentation incoming_

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
        // The filename you'd like to print
        expressFileName: 'sextant-express.generated.ts',
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

### Jest

Describe and structure your [Jest](https://jestjs.io/) tests based on your features. Get meaningful coverage reports based on actual scenarios, not code coverage.

_TODO - Documentation incoming_

### Test Fixtures

Generate fixtures for tests based on event types declared in Sextant.

_TODO - Documentation incoming_
