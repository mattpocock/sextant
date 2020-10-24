import { useMachine } from "@xstate/compiled/react";
import produce from "immer";
import { useState } from "react";
import { changeGraphqlMachine } from "./changeGraphqlFile.machine";

export const useManageGraphQLFile = (defaultEvents?: string) => {
  const [eventPayloads, setEventPayloads] = useState(defaultEvents || "");
  const [events, setEvents] = useState<string[]>([]);
  const [, dispatch] = useMachine(changeGraphqlMachine, {
    actions: {
      addEventName: (context, { newEvents, oldEvents }) => {
        const eventToTarget = newEvents.find((ev, index) => {
          return oldEvents[index] !== ev;
        });
        setEventPayloads(
          [
            `# type ${eventToTarget || ""} {`,
            `#   `,
            `# }`,
            ``,
            eventPayloads,
          ].join("\n"),
        );
      },
      editEventName: (_, { newEvents, oldEvents }) => {
        const eventIndex = oldEvents.findIndex((ev, index) => {
          return newEvents[index] !== ev;
        });
        if (eventIndex === -1) return;

        const regex = new RegExp(`type ${oldEvents[eventIndex] || ""}`);
        setEventPayloads(
          eventPayloads.replace(regex, `type ${newEvents[eventIndex] || ""}`),
        );
      },
      removeEvent: (_, { newEvents, oldEvents }) => {
        setEventPayloads(
          produce(eventPayloads, (draft) => {
            const eventToTarget = oldEvents.find((ev) => {
              return !newEvents.includes(ev);
            });

            const regex = new RegExp(`type ${eventToTarget} \{`);

            const payloadsAsArray = draft.split("\n");

            const startIndex = payloadsAsArray.findIndex((line) =>
              regex.test(line),
            );

            if (startIndex === -1) {
              return draft;
            }

            const sliceOfPayloads = payloadsAsArray.slice(startIndex);

            const endRegex = /\}/;

            const deleteCount = sliceOfPayloads.findIndex((line) =>
              endRegex.test(line),
            );

            if (deleteCount === -1) {
              return draft;
            }

            payloadsAsArray.splice(startIndex, deleteCount + 1);

            return payloadsAsArray.join("\n");
          }),
        );
      },
    },
  });

  return {
    reportEventsChanged: (newEvents: string[]) => {
      dispatch({
        type: "EVENTS_CHANGED",
        newEvents: Array.from(new Set(newEvents)),
        oldEvents: Array.from(new Set(events)),
      });
      setEvents(Array.from(new Set(newEvents)));
    },
    value: eventPayloads,
    setValue: setEventPayloads,
  };
};
