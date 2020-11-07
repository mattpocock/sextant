# Getting Started

## What is Sextant?

Sextant lets you **chart your application flows, then implement them with generated code**. Using our GUI, you can:

- Build chains of events that span across multiple systems
- Annotate them with descriptions, test cases, and branches
- Fully type all events that pass between systems using GraphQL
- Generate type-safe code right to your IDE

This means:

- The same tool you use to plan your app can be used to maintain it
- Your documentation never goes out of date
- You get type-safe code across languages and domains

> Sextant is currently under development. We'd love your help finding issues and thinking about features at our [repository](https://github.com/mattpocock/sextant)

<!-- ## Recipes

### Build an Express API

Using our ``

### Get test cove -->

## Installation

Install Sextant globally via npm or yarn:

`npm i -g sextant`

`yarn global add sextant`

## Running via CLI

Once installed, run `sextant ./target-directory` to run Sextant pointing at the `./target-directory`.

This will:

1. Print a `sextant.config.js` file
2. Open the GUI
3. Any changes made inside the GUI will be saved to `./target-directory/database.json`

## Installing your first plugin

Once you've started building some features and scenarios, we can start using

Let's install the `@sextant-tools/plugin-express` plugin, which can be used to build a type-safe [ExpressJS](https://expressjs.com/) API using Sextant.

1. Run `npm install @sextant-tools/plugin-express express` to install the plugin, and the `express` package.
2. Change your `sextant.config.js` file so it looks like this:

```js
module.exports = {
  plugins: ['@sextant-tools/plugin-express'],
};
```

3. Stop the terminal running `sextant` and restart it.

You should now see some generated files - one which contains mainly Typescript declarations, and one which contains some functions to do with `express`.

You can use these functions, such as `makeSextantExpressRoutes`, to implement your code based on what's in your Sextant documentation.

Check out the plugin's [documentation](plugins#express) to learn how to use these functions.
