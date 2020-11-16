# Test-Driven-Development with Sextant

**TL;DR**: Using Sextant for Test Driven Development (TDD) is heavenly. You can plan and document business requirements visually, generate mock fixtures, and get coverage reports based on desired functionality instead of lines of code.

## What is Sextant?

[Sextant](https://sextant.tools) is a tool that lets you plan your application, then generate code from those plans. This makes app development faster, ensures up-to-date documentation, and makes refactoring simple and visual.

In this article, we'll be building a simple function for fetching a user from our Auth server. We'll be using [Typescript](https://www.typescriptlang.org/) and [Jest](https://jestjs.io/).

Check out the [Sextant docs](https://docs.sextant.tools) for more information on what Sextant can do.

## What are we building?

We're going to build a function to fetch a user from our Auth server. We'll call the Auth server [Cognito](https://aws.amazon.com/cognito/), and our function [Lambda](https://aws.amazon.com/lambda/).

Our lambda needs to handle three scenarios:

1. We successfully fetch a user from Cognito
2. The user can't be found
3. The user who's doing the fetching doesn't have permission

## Setup

1. Create a project of your choice with Typescript and Jest set up. `create-react-app` is a fine choice.
2. Run `yarn add sextant @sextant-tools/plugin-jest` to install Sextant, and a plugin for use with Jest.
3. Run `yarn sextant ./src` to start the Sextant GUI on `http://localhost:3000`.

This will have created a `sextant.config.js` file at the `./src` directory. Change the file to look like this:

```js
// sextant.config.js

module.exports = {
  plugins: ['@sextant-tools/plugin-jest'],
};
```

4. Cancel the terminal running `yarn sextant ./src` and restart it.

Congratulations! You're ready to start building.

## Planning our tests

We now need to plan out our 'Get User' feature in the Sextant GUI.

### Success Case

A successful call happens when the lambda sends a `GET_USER` event to cognito, and Cognito responds with a `USER` event. We can diagram that like this:

![Diagram of a success case in Sextant](/images/get-users-success.png)

### Not Found Case

Things won't always succeed, though. Sometimes, we'll provide some incorrect information, and Cognito will reply with a `NOT_FOUND` event.

> You can press the `Duplicate` button at the top right of the "Success" panel to quickly duplicate a scenario.

![Diagram of a Not Found case](/images/get-users-not-found.png)

### No Permission Case

Things can fail in another way, too. The user who's trying to get the information might not have permission to do so. In that case, Cognito will reply with a `NO_PERMISSION` event.

![Diagram of a No Permission case](/images/get-users-no-permission.png)

### Events

In Sextant, events can carry information. Our `GET_USER` event needs to ask for a specific user, so let's handle that by giving it an `id` payload. These are defined in [GraphQL syntax](https://graphql.org/learn/schema/), in the 'Event Payloads' panel to the right.

```graphql
type GET_USER {
  id: ID!
}
```

Our `USER` event will also need to fire back some information about the user we fetched:

```graphql
type USER {
  id: ID!
  name: String!
  email: String!
}
```

## Setting up our test

Since TDD is all about writing tests before you start writing code, let's start there.

1. Create a `./src/__tests__/getUser.test.ts` file.
2. You'll notice that Sextant has now generated several files inside your `src` directory. Find the file with `jest` in the name, and import it into your test file:

```ts
// getUser.test.ts
import { describeSextantFeature } from '../sextant-jest.generated';
```

3. Let's use that function to describe our Sextant feature, and bootstrap a test for the success case:

```ts
// getUser.test.ts
import { describeSextantFeature } from '../sextant-jest.generated';

describeSextantFeature('getUser', (feature) => {
  feature.test('success', () => {
    // We'll test the success case in here
  });

  feature.test('notFound', () => {
    // We'll test the notFound case in here
  });

  feature.test('noPermission', () => {
    // We'll test the noPermission case in here
  });

  feature.testCoverage();
});
```

### describeSextantFeature

`describeSextantFeature` works like a [describe block](https://jestjs.io/docs/en/api#describename-fn) in Jest. Anything tested within it corresponds to the feature being described.

The `feature` object which `describeSextantFeature` makes available gives you some methods for testing, and testing coverage.

`feature.test()` works like a [test block](https://jestjs.io/docs/en/api#testname-fn-timeout). You can make assertions inside to ensure the scenario described works as expected.

`feature.testCoverage()` gives you coverage reports based on what you've described in Sextant. This fails if it detects a scenario in Sextant which isn't covered by the tests.

## Mocking our function

Let's quickly mock our function so that we have something to test. Create a file at `./src/getUser.ts` containing the following:

```ts
// src/getUser.ts

const getUser = () => {};
```

We can type the file with Typescript to ensure that our function corresponds to what we've declared in Sextant. Let's use the `SextantHandler` type, which is exported from `sextant-types.generated.d.ts`.

```ts
// src/getUser.ts
import { SextantHandler } from './sextant-types.generated';

const getUser: SextantHandler<'getUser', 'lambda', 'cognito'> = () => {};
```

`SextantHandler` is a type that takes in three generics. `getUser` corresponds to which feature it's handling. The last two generics are where the events flow from (`lambda`) and to (`cognito`).

In other words, the getUser function handles events **from** `lambda` **to** `cognito`, and can return a response **from** `cognito` **to** `lambda` at the end.

### Using mockSextantEvent

We can mock our function using fixtures generated by Sextant. For now, let's mock that the function always succeeds by returning a `USER` event:

```ts
// src/getUser.ts
import { SextantHandler } from './sextant-types.generated';
import { mockSextantEvent } from './sextant-fixture-mock.generated';

const getUser: SextantHandler<'getUser', 'lambda', 'cognito'> = () => {
  return mockSextantEvent('getUser', 'USER');
};
```

`mockSextantEvent` returns a javascript object that corresponds to what we declared in our Event Payloads in the Sextant GUI. For instance, this payload declaration:

```graphql
type USER {
  id: ID!
  name: String!
  email: String!
}
```

Results in this object being generated:

```json
{
  "type": "USER",
  "id": "d99c9580-cb80-4518-9d2c-5472fd4ff675",
  "name": "random-string",
  "email": "another-random-string"
}
```

`mockSextantEvent` is exceptionally useful because it stays up to date with what you declare in Sextant. This means you can focus on how your app should work, not maintaining fixture files.

## Writing the tests

Now that our function is mocked, we can start testing it:

```ts
// getUser.test.ts
import { describeSextantFeature } from '../sextant-jest.generated';
import { getUser } from './getUser';

describeSextantFeature('getUser', (feature) => {
  feature.test('success', async () => {
    const result = await getUser(feature.mockEvent('GET_USER'));

    // Expect that the event is of type USER
    expect(result.type).toEqual('USER');
  });

  feature.test('notFound', async () => {
    const result = await getUser(
      feature.mockEvent('GET_USER', { id: 'an-id-which-does-not-exist' }),
    );

    // Expect that the event is of type NOT_FOUND
    expect(result.type).toEqual('NOT_FOUND');
  });

  feature.test('noPermission', async () => {
    const result = await getUser(
      feature.mockEvent('GET_USER', {
        id: 'an-id-which-you-do-not-have-permission-to-view',
      }),
    );

    // Expect that the event is of type NO_PERMISSION
    expect(result.type).toEqual('NO_PERMISSION');
  });

  feature.testCoverage();
});
```

The `notFound` and `noPermission` cases will fail, because we are returning a mocked `USER` event from our function. If we were to continue developing this, we'd need to use a mocker like [jest.mock](https://jestjs.io/docs/en/mock-functions) to test how the function performed when things failed. But let's leave it here for now.

#### feature.mockEvent

`feature.mockEvent` is exactly like `mockSextantEvent`, but scoped only to events in that feature. We're also using a second parameter to override specific attributes of the event: `{ id: 'a-specific-id' }`

## Next steps

Our function is now ready to be implemented!

- We've laid out our test files
- We've worked out the cases we want to test
- We've mocked our function with a success case

But more importantly, we know exactly **why** we're testing each case, and we've documented it visually in Sextant.

## What we've learned

Sextant can supercharge your testing approach in a number of ways.

#### Tests are self-documenting

With Sextant, every test you write has a specific, documented purpose. This helps when scoping how many tests to write - each test **must** apply to a specific scenario, so you can't write useless, or duplicate tests.

#### Meaningful coverage metrics

Using `feature.testCoverage()` means your tests fail when a documented scenario is missing. This gives you confidence that all your app's behaviour is documented, tested and implemented according to an agreed-upon spec.

#### Tests are tied to business requirements

If your business requirements change, your tests need to change too. Without Sextant, this can be difficult to track and often needs manual maintenance.

With Sextant, this process is automatic. When you delete a scenario, any `feature.test` blocks which specify that scenario will fail. When you add or update one, your `testCoverage()` functions fail.

## Thanks for reading!

Sextant is in early days, but I'm excited to bring you more articles about how to use it. The ability to take application charts and turn them into type-safe code has enormous potential. You can learn how to [build your own plugins here](https://docs.sextant.tools/#/advanced?id=creating-a-plugin).

Follow along on [GitHub](https://github.com/mattpocock/sextant), or check out a [live demo of Sextant](https://sextant.tools). I can't wait to see what you do with it.
