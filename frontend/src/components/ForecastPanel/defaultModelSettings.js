export const ARIMA_DEFAULTS = {
    steps: 10,
    p: 1,
    d: 0,
    q: 0,
    trend: 'c',
    significanceLevel: 0.05,
    enforceStationarity: true,
    enforceInvertibility: true,
};

export const SARIMA_DEFAULTS = {
    steps: 10,
    p: 1,
    d: 1,
    q: 1,
};
