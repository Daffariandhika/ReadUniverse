import { lazy } from 'react';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const lazyWithDelay = (importFunc, delayMs = 200) =>
  lazy(() =>
    Promise.all([importFunc(), delay(delayMs)]).then(([moduleExports]) => moduleExports),
  );

export const lazyWithoutDelay = (importFunc) => lazy(importFunc);
