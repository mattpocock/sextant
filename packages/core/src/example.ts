import { createEnvironment } from "./test";

createEnvironment("database").createService("getUser", async (event, send) => {
  fetch("/getUser", {
    body: JSON.stringify(event),
    method: "POST",
  })
    .then((res) => res.json())
    .then((user) => {
      if (user) {
        send({
          type: "NO_USER_FOUND",
        });
      } else {
        send({
          type: "USER",
        });
      }
    })
    .catch((e) => {
      send({
        type: "UNKNOWN_ERROR",
      });
    });
});
