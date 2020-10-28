import { assign, Machine } from "@xstate/compiled";

interface Context {
  canvas: {};
  editingNodeId?: string;
  selectedNodeId?: string;
}

type Event =
  | { type: "PRESS_ESC_KEY" }
  | {
      type: "PRESS_CREATE_ENVIRONMENT";
    }
  | {
      type: "PRESS_CREATE_SERVICE";
    }
  | {
      type: "CLICK_EMPTY_CANVAS";
      x: number;
      y: number;
    }
  | {
      type: "BLUR_TEXT_INPUT";
    }
  | {
      type: "CLICK_NODE";
      nodeId: string;
    }
  | {
      type: "MOUSEDOWN_ON_NODE_RESIZER";
      x: number;
      y: number;
    }
  | {
      type: "MOUSE_UP";
      x: number;
      y: number;
    }
  | {
      type: "MOUSE_MOVE";
      x: number;
      y: number;
    };

const machine = Machine<Context, Event, "canvasMachine">(
  {
    initial: "idle",
    states: {
      idle: {
        on: {
          PRESS_CREATE_ENVIRONMENT: "creatingEnvironment",
          PRESS_CREATE_SERVICE: "creatingService",
          CLICK_NODE: {
            target: "nodeSelected",
            actions: ["addNodeToSelected"],
          },
        },
      },
      creatingEnvironment: {
        on: {
          PRESS_ESC_KEY: "idle",
          CLICK_EMPTY_CANVAS: {
            target: "nodeSelected.renaming",
            actions: ["addEnvironmentAtClickAndFocusNewNode"],
          },
        },
      },
      creatingService: {
        initial: "nothingSelected",
        states: {
          nothingSelected: {
            on: {
              CLICK_NODE: {
                target: "oneSideSelected",
              },
            },
          },
          oneSideSelected: {
            on: {
              PRESS_ESC_KEY: {
                actions: "removeFirstSelectedNode",
                target: "nothingSelected",
              },
              CLICK_NODE: [
                {
                  cond: "isNodeAnEnvironment",
                  actions: "addServiceAtClickAndFocusNewNode",
                },
              ],
            },
          },
        },
      },
      nodeSelected: {
        exit: ["clearSelectedNodeId"],
        initial: "idle",
        on: {
          CLICK_EMPTY_CANVAS: "idle",
          PRESS_ESC_KEY: "idle",
        },
        states: {
          idle: {
            on: {
              MOUSEDOWN_ON_NODE_RESIZER: {
                target: "resizing",
              },
            },
          },
          renaming: {
            entry: ["focusNodeTextInput"],
            on: {
              BLUR_TEXT_INPUT: "idle",
            },
          },
          resizing: {
            on: {
              MOUSE_MOVE: {
                actions: "resizeNode",
              },
              MOUSE_UP: {
                target: "idle",
              },
            },
          },
        },
      },
    },
  },
  {
    actions: {},
  },
);
