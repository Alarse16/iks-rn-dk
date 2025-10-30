import { useEffect, useMemo, useState } from 'react';

type Log = {
  id: string;
  method: string;
  url: string;
  startTs: string;
  endTs?: string;
  durationMs?: number;
  status?: number;
  ok?: boolean;
  responseSnippet?: string;
  error?: { name?: string; message?: string; stack?: string };
};

declare global {
  interface Window {
    __NETWORK_LOGS?: any[];
    DEBUG_PANEL_ENABLED?: boolean;
  }
}

export function DebugPanel() {
  const [open, setOpen] = useState<boolean>(!!window.DEBUG_PANEL_ENABLED);
  const [onlyErrors, setOnlyErrors] = useState<boolean>(false);
  const [logs, setLogs] = useState<Log[]>(window.__NETWORK_LOGS || []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Log;
      setLogs((prev) => [...prev, detail]);
    };
    window.addEventListener('network-log', handler as EventListener);
    return () => window.removeEventListener('network-log', handler as EventListener);
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((l) => (onlyErrors ? (!l.ok || l.error) : true));
  }, [logs, onlyErrors]);

  function clearLogs() {
    window.__NETWORK_LOGS = [];
    setLogs([]);
  }

  function download() {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleDebug() {
    const next = !window.DEBUG_PANEL_ENABLED;
    window.DEBUG_PANEL_ENABLED = next;
    try {
      localStorage.setItem('DEBUG_PANEL', next ? '1' : '0');
    } catch {}
    setOpen(next);
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          right: 12,
          bottom: 12,
          zIndex: 9999,
          padding: '8px 12px',
          borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.2)',
          background: open ? '#1f2937' : '#ffffff',
          color: open ? '#ffffff' : '#111827',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      >
        {open ? 'Close Debug' : 'Open Debug'}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            right: 12,
            bottom: 56,
            width: 'min(720px, 96vw)',
            maxHeight: '60vh',
            zIndex: 9998,
            background: 'rgba(17, 24, 39, 0.98)',
            color: '#e5e7eb',
            borderRadius: 8,
            overflow: 'auto',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
            <strong style={{ fontSize: 14 }}>Network Debug</strong>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" checked={onlyErrors} onChange={(e) => setOnlyErrors(e.target.checked)} />
              Errors only
            </label>
            <button onClick={clearLogs} style={{ marginLeft: 'auto', padding: '6px 10px' }}>Clear</button>
            <button onClick={download} style={{ marginLeft: 8, padding: '6px 10px' }}>Download JSON</button>
            <button onClick={toggleDebug} style={{ marginLeft: 8, padding: '6px 10px' }}>
              {window.DEBUG_PANEL_ENABLED ? 'Disable' : 'Enable'} Persist
            </button>
          </div>
          <div style={{ padding: 8 }}>
            {filtered.slice().reverse().map((l) => (
              <div key={l.id} style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: l.ok ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                    color: l.ok ? '#10b981' : '#ef4444',
                    fontSize: 12,
                  }}>{l.method}</span>
                  <code style={{ fontSize: 12, color: '#93c5fd' }}>{l.url}</code>
                  <span style={{ fontSize: 12, opacity: 0.8 }}>
                    {typeof l.status === 'number' ? `→ ${l.status}` : (l.error ? '→ FAILED' : '')}
                  </span>
                  <span style={{ fontSize: 12, opacity: 0.8 }}>{l.durationMs}ms</span>
                  <span style={{ fontSize: 12, opacity: 0.6 }}>{new Date(l.startTs).toLocaleTimeString()}</span>
                </div>
                {l.responseSnippet && (
                  <pre style={{ marginTop: 6, whiteSpace: 'pre-wrap', fontSize: 12, background: 'rgba(255,255,255,0.06)', padding: 8, borderRadius: 6, color: '#e5e7eb' }}>
                    {l.responseSnippet}
                  </pre>
                )}
                {l.error && (
                  <pre style={{ marginTop: 6, whiteSpace: 'pre-wrap', fontSize: 12, background: 'rgba(239,68,68,0.15)', padding: 8, borderRadius: 6, color: '#fecaca' }}>
                    {l.error.name}: {l.error.message}
                  </pre>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 12, opacity: 0.7, fontSize: 12 }}>No logs yet.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
