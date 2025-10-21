import React, { createContext, useState, useEffect, useContext } from "react";

const TraceContext = createContext(null);

export function useTrace() {
  return useContext(TraceContext);
}

export function TraceProvider({ children }) {
  const [warpEnabled, setWarpEnabled] = useState(null);
  const [traceText, setTraceText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTraceOnce() {
      try {

        const envRes = await fetch("/api/env");
        if (!envRes.ok) {
          throw new Error(`/api/env failed with status ${envRes.status}`);
        }
        const envData = await envRes.json();
        const workerDomain = envData.WORKER_DOMAIN; // e.g. "myworker.example.workers.dev"

        if (!workerDomain) {
          throw new Error("No WORKER_DOMAIN in /api/env response");
        }

        const traceUrl = `https://${workerDomain}/cdn-cgi/trace`;
        const traceRes = await fetch(traceUrl);
        if (!traceRes.ok) {
          throw new Error(
            `Trace request failed: ${traceRes.status} ${traceRes.statusText}`
          );
        }
        const text = await traceRes.text();

        setTraceText(text);

        const hasWarp = text.includes("warp=on");
        setWarpEnabled(hasWarp);
      } catch (err) {
        console.error("TraceProvider error:", err);
        setError(err.message);
        setWarpEnabled(false);
      } finally {
        setLoading(false);
      }
    }

    fetchTraceOnce();
  }, []);

  const value = {
    warpEnabled,
    traceText,
    loading,
    error,
  };

  return <TraceContext.Provider value={value}>{children}</TraceContext.Provider>;
}