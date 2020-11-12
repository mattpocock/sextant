# Advanced

## Creating a Plugin

Currently, the easiest way to create a plugin is to follow these steps:

### Setup

1. Clone the [Sextant monorepo](https://github.com/mattpocock/sextant)
2. Run `yarn install` at root to install all package dependencies
3. Create a new package at `packages/package-name`
4. Add a `main` field in your package's `package.json`, targeting `index.js`
5. Create an `index.js`, containing:

```js
const { createSextantPlugin } = require('@sextant-tools/core');

module.exports = createSextantPlugin((context, config) => {
  // Your plugin in here!
});
```

### Developing

1. Run `yarn fe start` to run the Sextant GUI.
2. A `sextant.config.js` and `database.json` will be created at `/sextant-dev` at the root.
3. Run `yarn plugin:dev` from root to print new plugin outputs whenever files in your package change.

> More info is coming here!
