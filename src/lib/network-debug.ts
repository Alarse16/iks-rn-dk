declare global {
  interface Window {
    __NETWORK_LOGS?: any[];
    __FETCH_INSTRUMENTED?: boolean;
    DEBUG_PANEL_ENABLED?: boolean;
  }
}

function isDebugEnabled(): boolean {
  try {
    const inQuery = new URLSearchParams(window.location.search).get('debug') === '1';
    const inStorage = localStorage.getItem('DEBUG_PANEL') === '1';
    const enabled = inQuery || inStorage;
    window.DEBUG_PANEL_ENABLED = enabled;
    return enabled;
  } catch {
    return false;
  }
}

function addQueryParam(url: string, key: string, value: string) {
  try {
    if (!url.startsWith('/')) return url;
    const u = new URL(url, window.location.origin);
    u.searchParams.set(key, value);
    return u.pathname + u.search;
  } catch {
    return url;
  }
}

(function instrumentFetch() {
  if (typeof window === 'undefined') return;
  if (window.__FETCH_INSTRUMENTED) return;
  window.__FETCH_INSTRUMENTED = true;
  window.__NETWORK_LOGS = window.__NETWORK_LOGS || [];

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const debug = isDebugEnabled();
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
    let url = (typeof input === 'string' || input instanceof URL)
      ? String(input)
      : (input instanceof Request ? input.url : '');

    // Only append dbg param for same-origin, relative URLs
    let actualInput = input;
    if (debug && typeof input === 'string' && url.startsWith('/')) {
      url = addQueryParam(url, 'dbg', id);
      actualInput = url;
    } else if (debug && input instanceof Request && input.url.startsWith(window.location.origin)) {
      const rel = input.url.replace(window.location.origin, '');
      const newUrl = addQueryParam(rel, 'dbg', id);
      actualInput = new Request(newUrl, init ?? input);
      url = newUrl;
    }

    const start = performance.now();
    let log: any = {
      id,
      method,
      url,
      startTs: new Date().toISOString(),
      startPerf: start,
    };

    try {
      const res = await originalFetch(actualInput as any, init);
      const end = performance.now();

      // Clone before reading text for logging
      const clone = res.clone();
      let responseSnippet = '';
      try {
        const ct = clone.headers.get('content-type') || '';
        const shouldPeek = !res.ok || ct.includes('text') || ct.includes('html') || ct.includes('json');
        if (shouldPeek) {
          const text = await clone.text();
          responseSnippet = text.slice(0, 500);
        }
      } catch {}

      const respHeaders: Record<string, string> = {};
      res.headers.forEach((v, k) => (respHeaders[k] = v));

      log = {
        ...log,
        endTs: new Date().toISOString(),
        endPerf: end,
        durationMs: Math.round(end - start),
        status: res.status,
        ok: res.ok,
        redirected: res.redirected,
        type: res.type,
        responseHeaders: respHeaders,
        responseSnippet,
      };

      // Push log and notify listeners
      window.__NETWORK_LOGS!.push(log);
      window.dispatchEvent(new CustomEvent('network-log', { detail: log }));

      // Also print a compact console line
      // eslint-disable-next-line no-console
      console.debug(
        `NET ${method} ${url} -> ${res.status} (${log.durationMs}ms)`,
        { id, ok: res.ok, redirected: res.redirected, type: res.type }
      );

      if (!res.ok) {
        // eslint-disable-next-line no-console
        console.error(`NET error body (first 500 chars):`, responseSnippet);
      }

      return res;
    } catch (err: any) {
      const end = performance.now();
      log = {
        ...log,
        endTs: new Date().toISOString(),
        endPerf: end,
        durationMs: Math.round(end - start),
        error: {
          name: err?.name,
          message: err?.message,
          stack: err?.stack,
        },
        online: navigator.onLine,
        visibility: document.visibilityState,
      };
      window.__NETWORK_LOGS!.push(log);
      window.dispatchEvent(new CustomEvent('network-log', { detail: log }));
      // eslint-disable-next-line no-console
      console.error(`NET ${method} ${url} -> FETCH FAILED (${log.durationMs}ms)`, log.error);
      throw err;
    }
  };

  // Global error listeners
  window.addEventListener('unhandledrejection', (e) => {
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection:', e.reason);
  });
  window.addEventListener('error', (e) => {
    // eslint-disable-next-line no-console
    console.error('Window error:', e.error || e.message);
  });
})();
