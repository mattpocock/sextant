![Sextant](./assets/sextant-demo-new.gif "Sextant Logo")

# Sextant

Application logic getting out of control?

Feel like there are corners of your app where no-one knows what's going on?

You should try Sextant.

## What is Sextant?

Sextant lets you **chart your application flows, then implement them in code**. Just run a CLI command, which opens a GUI. You can:

- Build chains of events that span across multiple systems
- Annotate them with descriptions, test cases, and branches
- Fully type all events that pass between systems using GraphQL
- Generate type-safe code right to your IDE

This means:

- The same tool you use to plan your app can be used to maintain it
- Your documentation never goes out of date
- You get type-safe code _across languages and domains_

Right now, **Sextant only works with Typescript**. But we're planning to offer a plugin system that can generate code in any language. PR's welcome!

> Sextant is currently in an experimental, proof-of-concept stage. We're looking for feedback, and passionate open-source contributors to help.

## Getting Started

[See the 'frontend' package](./packages/frontend) for more information about using Sextant.

## Local development

1. Install yarn (version 1)
2. Run `yarn install`
3. Run `yarn dev` to build all dependent packages and run Typescript on all repositories except `frontend`
4. Run `yarn fe start` to kick off the frontend dev server
