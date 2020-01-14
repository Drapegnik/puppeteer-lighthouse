export const extractDataFromPerformanceTiming = (metrics, keys) => keys.reduce((acc, key) => {
  acc[key] = metrics[key] - metrics.navigationStart;
  return acc;
}, {
  dnsLookup: metrics.domainLookupEnd - metrics.domainLookupStart,
  tcpConnect: metrics.connectEnd - metrics.connectStart,
});

const getTimeFromPerformanceMetrics = (metrics, name) =>
  metrics.metrics.find(x => x.name === name).value * 1000;

export const extractDataFromPerformanceMetrics = (metrics, keys) => {
  const navigationStart = getTimeFromPerformanceMetrics(
    metrics,
    'NavigationStart'
  );

  return keys.reduce((acc, key) => {
    acc[key] = getTimeFromPerformanceMetrics(metrics, key) - navigationStart;
    return acc;
  }, {});
};
