import { Machine, assign } from '@xstate/compiled';

interface Context {
  indexChosen: number;
  environmentChosen: string;
}

type Event = { type: 'CLICK_PLUS_ICON'; index: number; environment: string };

export const sequenceDiagramMachine = Machine<
  Context,
  Event,
  'sequenceDiagram'
>(
  {
    initial: 'idle',
    states: {
      idle: {
        on: {
          CLICK_PLUS_ICON: {
            target: 'chosenFrom',
            actions: ['assignFirstItemChosen'],
          },
        },
      },
      chosenFrom: {
        on: {
          CLICK_PLUS_ICON: [
            {
              cond: 'isSameAsChosen',
              target: 'idle',
              actions: ['clearChoices'],
            },
            {
              cond: 'isSameIndexAsChosen',
              actions: ['clearChoices', 'registerNewEvent'],
              target: 'idle',
            },
            {
              actions: ['assignFirstItemChosen'],
            },
          ],
        },
      },
    },
  },
  {
    guards: {
      isSameAsChosen: (context, event) => {
        return (
          context.environmentChosen === event.environment &&
          context.indexChosen === event.index
        );
      },
      isSameIndexAsChosen: (context, event) => {
        return context.indexChosen === event.index;
      },
    },
    actions: {
      assignFirstItemChosen: assign((context, event) => {
        return {
          environmentChosen: event.environment,
          indexChosen: event.index,
        };
      }),
      clearChoices: assign((context) => {
        return {
          indexChosen: undefined,
        };
      }),
    },
  },
);
