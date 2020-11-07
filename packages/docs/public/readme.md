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

> Sextant is currently under development. Please do report any issues you find at our [repository](https://github.com/mattpocock/sextant)

## Installation

Install Sextant globally via npm or yarn:

`npm i -g sextant`

`yarn global add sextant`

## Running it locally

Once installed, run `sextant ./target-directory` to run Sextant pointing at the `./target-directory`.

This will:

1. Print a `sextant.config.js` file
2. Open the GUI
3. Any changes made inside the GUI will be saved to `./target-directory/database.json`

## Installing your first plugin

Let's install the
