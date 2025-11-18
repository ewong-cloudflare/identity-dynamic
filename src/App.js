import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccessDenied from "./Pages/AccessDenied";
import Information from "./Pages/Information";
import Debug from "./Pages/Debug";
import NavBar from "./components/navbar";
import Setup from "./Pages/Setup";
import useSessionCheck from "./hooks/useSessionCheck";
import PageTitle from "./components/pagetitle";
import GatewayRedirect from "./Pages/GatewayRedirect";

const App = () => {
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [setupEnabled, setSetupEnabled] = useState(false);
  const [setSessionExpired] = useState(false);
  const [theme, setTheme] = useState({
    primaryColor: "#3498db",
    secondaryColor: "#2ecc71",
    tertiaryColor: "#ffffff",
  });



  // Fetch theme and debug status from the API
  useEffect(() => {
    const fetchEnv = async () => {
      try {
        const response = await fetch("/api/env");
        const data = await response.json();
        const themeData = data.theme || {};
        setTheme({
          primaryColor: themeData.primaryColor || "#3498db",
          secondaryColor: themeData.secondaryColor || "#2ecc71",
          tertiaryColor: themeData.tertiaryColor || "#ffffff",
        });

        // Update debugEnabled based on the DEBUG value from the API
        setDebugEnabled(data.DEBUG === "true");
        setSetupEnabled(data.SETUP === "true");
      } catch (error) {
        console.error("Error fetching environment variables:", error);
      }
    };

    fetchEnv();
  }, []);

  // This function will refresh the data when session expires
  const handleSessionExpired = () => {
    setSessionExpired(true);
    window.location.reload(); // Force page reload to refresh session
  };

  // Use the session check hook to detect session expiration
  useSessionCheck(handleSessionExpired);

  return (
    <Router>
      <NavBar
        debugEnabled={debugEnabled}
        setupEnabled={setupEnabled}
        primaryColor={theme.primaryColor}
        secondaryColor={theme.secondaryColor}
        tertiaryColor={theme.tertiaryColor}
      />
      <PageTitle />
      <Routes>
        <Route
          path="/"
          element={
            <AccessDenied
              primaryColor={theme.primaryColor}
              secondaryColor={theme.secondaryColor}
            />
          }
        />
        <Route
          path="/access-denied"
          element={
            <AccessDenied
              primaryColor={theme.primaryColor}
              secondaryColor={theme.secondaryColor}
            />
          }
        />
        <Route path="/information" element={<Information />} />
        {setupEnabled && <Route path="/setup" element={<Setup />} />}
        {debugEnabled && <Route path="/debug" element={<Debug />} />}
        <Route path="/gateway" element={<GatewayRedirect />} />
      </Routes>
    </Router>
  );
};

export default App;
