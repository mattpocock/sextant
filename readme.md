![Sextant](./assets/social-card.png "Sextant Logo")

# Sextant

Application logic is getting out of control? Feel like there are corners of your application where no-one knows what's going on?

You should try Sextant.

## What is Sextant?

Sextant lets you **chart your application flows, then implement them in code**. Just run a CLI command, which opens a GUI. You can:

- Build chains of events that span across multiple systems
- Annotate them with descriptions, test cases, and branches
- Fully type all events that pass between systems using GraphQL
- Generate type-safe code right to your IDE

This means you get:

- A tool that stays useful all the way from early planning to long-term maintenance
- Documentation that never goes out of date
- The ability to write type-safe code across languages and domains

Right now, **Sextant only works with Typescript**. But we're planning to offer a plugin system that can generate code in any language. PR's welcome!

> Sextant is currently in an experimental, proof-of-concept stage. We're looking for feedback, and passionate open-source contributors to help.

## Getting Started

[See the 'frontend' package](./packages/frontend) for more information about using Sextant.

## Local development

1. Install yarn (version 1)
2. Run `yarn install`
3. Run `yarn dev` to build all dependent packages and run Typescript on all repositories except `frontend`
4. Run `yarn fe start` to kick off the frontend dev server
