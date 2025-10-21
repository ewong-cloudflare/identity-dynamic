import React, { createContext, useContext, useState, useEffect } from "react";

const EnvContext = createContext();

export function EnvProvider({ children }) {
  const [envVars, setEnvVars] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEnvVars() {
      try {
        const response = await fetch("/api/env");
        if (!response.ok) {
          throw new Error(`Env fetch failed: ${response.status}`);
        }
        const data = await response.json();
        setEnvVars(data);
      } catch (err) {
        setError(err.message || "Failed to load environment variables");
      } finally {
        setLoading(false);
      }
    }
    fetchEnvVars();
  }, []);

  return (
    <EnvContext.Provider value={{ envVars, loading, error }}>
      {children}
    </EnvContext.Provider>
  );
}

export function useEnv() {
  return useContext(EnvContext);
}
