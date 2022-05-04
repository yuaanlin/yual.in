import Router from 'next/router';
import NProgress from 'nprogress';

let timer: any;
let state: any;
let activeRequests = 0;
const delay = 250;

function load() {
  if (state === 'loading') return;
  state = 'loading';
  timer = setTimeout(function () {
    NProgress.start();
  }, delay);
}

function stop() {
  if (activeRequests > 0) {
    return;
  }
  state = 'stop';
  clearTimeout(timer);
  NProgress.done();
}

Router.events.on('routeChangeStart', load);
Router.events.on('routeChangeComplete', stop);
Router.events.on('routeChangeError', stop);

const originalFetch = window.fetch;
window.fetch = async function (...args) {

  // Like don't need progress bar
  if (args && args[0] && typeof args[0] === 'string'
    && args[0].match(/^\/api\/posts\/(.*)\/likes$/)) {
    try {
      return await originalFetch(...args);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  if (activeRequests === 0) {
    load();
  }

  activeRequests++;

  try {
    const response = await originalFetch(...args);
    return response;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    activeRequests -= 1;
    if (activeRequests === 0) {
      stop();
    }
  }
};

export default function () {
  return null;
}
