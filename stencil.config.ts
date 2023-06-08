import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  namespace: 'chat-app',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
  sourceMap: false,
  taskQueue: 'async',
  globalScript: 'src/app.ts',
  globalStyle: 'src/app.css',
};
