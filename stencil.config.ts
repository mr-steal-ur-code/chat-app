import { Config } from '@stencil/core';

// https://stenciljs.com/docs/config

export const config: Config = {
  namespace: 'chat-app',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: {
        swSrc: "src/sw.js",
        globPatterns: [
          '**/*.{js,css,json,html,ico,png}'
        ]
      }
    },
  ],
  sourceMap: false,
  taskQueue: 'async',
  globalScript: 'src/app.ts',
  globalStyle: 'src/app.css',
};
