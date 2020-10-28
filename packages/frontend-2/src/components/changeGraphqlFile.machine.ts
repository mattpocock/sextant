import { Machine, assign } from "@xstate/compiled";

interface Context {}

type Event = {
  type: "EVENTS_CHANGED";
  newEvents: string[];
  oldEvents: string[];
};

export const changeGraphqlMachine = Machine<
  Context,
  Event,
  "changeGraphQLFile"
>(
  {
    initial: "idle",
    states: {
      idle: {
        on: {
          EVENTS_CHANGED: [
            {
              cond: "eventHasBeenDeleted",
              actions: ["removeEvent"],
              target: "editing",
            },
            {
              cond: "eventHasBeenAdded",
              actions: ["addEventName"],
              target: "editing",
            },
            {
              cond: "eventHasBeenSetToAnEmptyString",
              actions: ["removeEvent"],
              target: "editing",
            },
            {
              cond: "hasANewEventReceivedAName",
              actions: ["addEventName"],
              target: "editing",
            },
            {
              cond: "eventHasBeenEdited",
              actions: ["editEventName"],
              target: "editing",
            },
          ],
        },
      },
      editing: {
        always: {
          target: "idle",
        },
      },
    },
  },
  {
    guards: {
      eventHasBeenDeleted: (_, event) => {
        return event.newEvents.length < event.oldEvents.length;
      },
      eventHasBeenAdded: (_, event) => {
        console.log(event);
        return event.newEvents.length > event.oldEvents.length;
      },
      eventHasBeenEdited: (_, { newEvents, oldEvents }) => {
        return newEvents.some((event, index) => {
          return event !== oldEvents[index];
        });
      },
      hasANewEventReceivedAName: (_, { newEvents, oldEvents }) => {
        return oldEvents.some(
          (event, index) => event === "" && newEvents[index] !== "",
        );
      },
      eventHasBeenSetToAnEmptyString: (_, { newEvents, oldEvents }) => {
        return newEvents.some((event) => event === "");
      },
    },
  },
);
