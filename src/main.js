import App from './App.svelte';

const app = new App({
  target: document.getElementById('app'),
  // hydrate: true
});

window.app = app;

export default app;
