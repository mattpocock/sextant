import produce from "immer";

export const addEvent = (eventPayloads: string, event: string) => {
  return [`# type ${event || ""} {`, `#   `, `# }`, ``, eventPayloads].join(
    "\n",
  );
};

export const editEvent = (
  eventPayloads: string,
  targetEvent: string,
  newEventName: string,
) => {
  const regex = new RegExp(`type ${targetEvent || ""} {`);
  return eventPayloads.replace(regex, `type ${newEventName || ""} {`);
};

export const removeEvent = (eventPayloads: string, targetEvent: string) => {
  return produce(eventPayloads, (draft) => {
    const regex = new RegExp(`type ${targetEvent} {`);

    const payloadsAsArray = draft.split("\n");

    const startIndex = payloadsAsArray.findIndex((line) => regex.test(line));

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
  });
};
