import { Machine, assign } from "@xstate/compiled";

interface Context {
  scale: number;
  x: number;
  y: number;
  sequences: {
    name: string;
    steps: { event: string; from: string; to: string }[];
    environments: {
      name: string;
    }[];
    x: number;
    y: number;
  }[];

  temporary?: {
    x: number;
    y: number;
  };
}

type Event =
  | { type: "MOUSE_DOWN_INSIDE_CHART"; x: number; y: number }
  | { type: "MOUSE_MOVE_INSIDE_CHART"; x: number; y: number }
  | {
      type: "MOUSE_UP_INSIDE_CHART";
    }
  | {
      type: "SCROLL_WHEEL";
      deltaY: number;
    }
  | {
      type: "SET_SEQUENCES";
      sequences: {
        name: string;
        steps: { event: string; from: string; to: string }[];
        environments: {
          name: string;
        }[];
        x: number;
        y: number;
      }[];
    }
  | {
      type: "SPACE_BAR_DOWN";
    }
  | {
      type: "SPACE_BAR_UP";
    };

export const movableChartMachine = Machine<Context, Event, "movableChart">(
  {
    context: {
      scale: 1,
      sequences: [],
      x: 0,
      y: 0,
    },
    initial: "idle",
    states: {
      idle: {
        on: {
          SPACE_BAR_DOWN: "canDragChart",
          SET_SEQUENCES: {
            actions: [
              assign((context, event) => {
                return {
                  sequences: event.sequences,
                };
              }),
            ],
          },
        },
      },
      canDragChart: {
        initial: "notDragging",
        on: {
          SPACE_BAR_UP: "idle",
        },
        states: {
          notDragging: {
            on: {
              MOUSE_DOWN_INSIDE_CHART: {
                target: "isDraggingChart",
                actions: ["mouseDownXAndY"],
              },
            },
          },
          isDraggingChart: {
            on: {
              MOUSE_MOVE_INSIDE_CHART: {
                actions: ["mouseMoveXAndY"],
              },
              MOUSE_UP_INSIDE_CHART: {
                target: "notDragging",
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {
      mouseMoveXAndY: assign((context, event) => {
        const changeX = event.x - (context.temporary?.x || event.x);
        const changeY = event.y - (context.temporary?.y || event.y);
        return {
          temporary: {
            x: event.x,
            y: event.y,
          },
          x: context.x + changeX,
          y: context.y + changeY,
        };
      }),
      mouseDownXAndY: assign((context, event) => {
        return {
          temporary: {
            x: event.x,
            y: event.y,
          },
        };
      }),
    },
  },
);
