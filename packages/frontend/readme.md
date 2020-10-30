![Sextant](../../assets/sextant-demo-new.gif "Sextant Logo")

## Getting Started

To install:

`npm i -g @sextant-tools/frontend`

To run:

`sextant ./target-directory`

This opens the Sextant GUI, ready for you to start creating flows and services.

Sextant will generate type files in this directory, so choose carefully!

## Using the types

Sextant generates two main types currently:

### SextantEvent

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

### SextantHandler

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

## Suggestions

Got ideas for what else Sextant could be useful for? Open an issue, and let's build what you need.
