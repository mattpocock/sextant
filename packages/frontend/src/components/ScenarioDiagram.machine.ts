import { Machine, assign } from '@xstate/compiled';

interface Context {
  indexChosen: number;
  actorChosen: string;
}

type Event = { type: 'CLICK_PLUS_ICON'; index: number; actor: string };

export const scenarioDiagramMachine = Machine<
  Context,
  Event,
  'scenarioDiagram'
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
          context.actorChosen === event.actor &&
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
          actorChosen: event.actor,
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
