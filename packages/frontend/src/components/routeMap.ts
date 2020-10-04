import makeRouteMap from "make-route-map";

export const routeMap = makeRouteMap({
  root: {
    path: "/",
  },
  addEnvironment: {
    path: "/enrivonments/add",
  },
  addServiceToEnvironment: {
    path: "/environments/:environmentId/services/add",
    params: {
      environmentId: true,
    },
  },
  viewService: {
    path: "/environments/:environmentId/services/:serviceId/view",
    params: {
      environmentId: true,
      serviceId: true,
    },
  },
});
