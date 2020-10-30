![Sextant](../../assets/social-card.png "Sextant Logo")

# Sextant

Application logic is getting out of control? Feel like there are corners of your application where no-one knows what's going on?

You should try Sextant.

Sextant lets you chart your application flows, then implement them in code. Just run a simple CLI command, which opens a GUI. You can:

- Build chains of events that span across multiple systems
- Annotate them with descriptions, test cases, and branches
- Fully type all events that pass between systems using GraphQL
- Generate type-safe code right to your IDE

This means you get:

- A tool that stays useful all the way from early planning to long-term maintenance
- Documentation that never goes out of date
- The ability to write type-safe code across languages and domains

## Getting Started

To install:

`npm i -g @sextant-tools/frontend`

To run:

`sextant ./target-directory`

Sextant will generate type files in this directory, so choose carefully!

### Using the types

Sextant generates two main types currently:

#### SextantEvent

```ts
/**
 * This gets the type of any event passed from "fromThisEnvironment"
 * to "toThisEnvironment"
 */
const event: SextantEvent<
  "serviceName",
  "fromThisEnvironment",
  "toThisEnvironment"
>;

/**
 * This gets the type of a specific event passed from
 * "fromThisEnvironment" to "toThisEnvironment"
 */
const specificEvent: SextantEvent<
  "serviceName",
  "fromThisEnvironment",
  "toThisEnvironment",
  "SPECIFIC_EVENT_TYPE"
>;
```

#### SextantHandler

```ts
/**
 * This type describes a function which handles events from
 * "fromThisEnvironment" to "toThisEnvironment"
 */
const handler: SextantHandler<
  "serviceName",
  "fromThisEnvironment",
  "toThisEnvironment"
> = () => {};
```
