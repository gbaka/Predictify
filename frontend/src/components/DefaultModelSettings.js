export const ARIMA_DEFAULTS = {
    p: 1,
    d: 1,
    q: 1,
    trend: 'c',
    enforceStationarity: false,
    enforceInvertibility: false,
    method: 'css-mle',
    maxiter: 50,
    useExactDiffuse: false,
};

export const SARIMA_DEFAULTS = {
    p: 1,
    d: 1,
    q: 1,
};
