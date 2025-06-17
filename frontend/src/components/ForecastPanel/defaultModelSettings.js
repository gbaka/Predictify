export const SARIMA_DEFAULTS = {
    steps: 10,
    p: 1,
    d: 0,
    q: 0,
    P: 0,
    D: 0,
    Q: 0,
    s: 0,
    trend: 'c',
    significanceLevel: 0.05,
    enforceStationarity: true,
    enforceInvertibility: true,
};

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

export const ARMA_DEFAULTS = {
    steps: 10,
    p: 1,
    q: 0,
    trend: 'c',
    significanceLevel: 0.05,
    enforceStationarity: true,
    enforceInvertibility: true,
};

export const AR_DEFAULTS = {
    steps: 10,
    p: 1,
    trend: 'c',
    significanceLevel: 0.05,
    enforceStationarity: true,
    enforceInvertibility: true,
};

export const MA_DEFAULTS = {
    steps: 10,
    q: 1,
    trend: 'c',
    significanceLevel: 0.05,
    enforceStationarity: true,
    enforceInvertibility: true,
};

// Simple Exponential Smoothing
export const SES_DEFAULTS = {
    steps: 10,
    initializationMethod: 'estimated',
    initialLevel: 1
};

// Holt's Exponential Smoothing
export const HES_DEFAULTS = {
    steps: 10,
    initializationMethod: 'estimated',
    initialLevel: 1,
    initialTrend: 1,
    exponential: false,
    dampedTrend: false
};

// Holt-Winter's Exponential Smoothing
export const HWES_DEFAULTS = {
    steps: 10,
    initializationMethod: 'estimated',
    trend: 'add',
    seasonal: 'add',
    seasonalPeriods: 4,
    dampedTrend: false
};

