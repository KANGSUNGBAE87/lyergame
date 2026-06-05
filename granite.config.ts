import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'liar-game',
  brand: {
    displayName: '라이어 게임',
    primaryColor: '#8338ec',
    icon: '',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite dev',
      build: 'vite build',
    },
  },
  webViewProps: {
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: 'never',
    allowsBackForwardNavigationGestures: false,
  },
  permissions: [],
  outdir: 'dist',
});
