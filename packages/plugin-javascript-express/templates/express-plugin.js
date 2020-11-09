const makeExpressHandlers = (from, to, params) => {
  return Object.entries(params).map(([feature, handler]) => ({
    feature: feature,
    handler: handler,
  }));
};

const makeSextantExpressSdk = (from, to, fetcher) => (feature, event) => {
  return fetcher(feature, event);
};

module.exports = {
  makeExpressHandlers,
  makeSextantExpressSdk,
};
