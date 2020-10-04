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
    path: "/services/:serviceId/view",
    params: {
      serviceId: true,
    },
  },
});
