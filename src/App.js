import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccessDenied from "./Pages/AccessDenied";
import Information from "./Pages/Information";
import Debug from "./Pages/Debug";
import NavBar from "./components/navbar";
import useSessionCheck from "./hooks/useSessionCheck";
import PageTitle from "./components/pagetitle";

const App = () => {
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [setSessionExpired] = useState(false);
  const [theme, setTheme] = useState({
    primaryColor: "#3498db",
    secondaryColor: "#2ecc71",
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
        });

        // Update debugEnabled based on the DEBUG value from the API
        setDebugEnabled(data.DEBUG === "true");
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
        primaryColor={theme.primaryColor}
        secondaryColor={theme.secondaryColor}
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
        {debugEnabled && <Route path="/debug" element={<Debug />} />}
      </Routes>
    </Router>
  );
};

export default App;
