import React, { useEffect, useState, useCallback } from "react";
import Setup from "../components/setup";

const Debug = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [devicePosture, setDevicePosture] = useState(null);
  const [error, setError] = useState(null);
  const [isIdentityExpanded, setIsIdentityExpanded] = useState(false);
  const [isDeviceExpanded, setIsDeviceExpanded] = useState(false);

  const forcePageReload = () => {
    window.location.reload();
  };

  const fetchDebugInfo = useCallback(async (retry = 1) => {
    try {
      const response = await fetch("/api/debug", { cache: "no-store" });
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("text/html")) {
        throw new Error("Session expired or invalid response");
      }

      const data = await response.json();

      setDebugInfo(data);

      if (data && data.devicePosture) {
        setDevicePosture(data.devicePosture);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching debug information:", error.message);

      // Retry logic for invalid session or response error
      if (retry > 0) {
        console.log("Retrying fetch for fresh session...");
        setTimeout(() => fetchDebugInfo(retry - 1), 1000);
      } else {
        setError("Session expired. Refreshing for a new session...");
        setTimeout(() => {
          forcePageReload();
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    fetchDebugInfo();
  }, [fetchDebugInfo]);

  return (
    <div className="bg-steel min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-dark">
          Debug Information
        </h1>

        {/* Collapsible get-identity  */}
        <div className="p-4 border border-gray-light rounded-lg mb-6 bg-white">
          <h2
            className="text-xl font-semibold mb-2 text-gray-dark cursor-pointer"
            onClick={() => setIsIdentityExpanded(!isIdentityExpanded)}
          >
            {isIdentityExpanded ? "▼" : "►"} get-identity response
          </h2>

          {isIdentityExpanded &&
            (error ? (
              <p className="text-red">{error}</p>
            ) : (
              <pre className="bg-gray-light p-4 rounded">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            ))}
        </div>

        {/* Collapsible Device Posture */}
        <div className="p-4 border border-gray-light rounded-lg bg-white">
          <h2
            className="text-xl font-semibold mb-2 text-gray-dark cursor-pointer"
            onClick={() => setIsDeviceExpanded(!isDeviceExpanded)}
          >
            {isDeviceExpanded ? "▼" : "►"} Device Posture Information
          </h2>

          {isDeviceExpanded &&
            (devicePosture ? (
              <div>
                <p className="mb-2 text-gray-dark">Device Posture details:</p>
                <div className="bg-gray-light p-4 rounded">
                  {Object.keys(devicePosture).map((key) => (
                    <div key={key} className="mb-4">
                      <h3 className="font-bold mb-2 text-gray-dark">
                        {devicePosture[key].rule_name || "Unnamed Rule"} (
                        {devicePosture[key].type})
                      </h3>
                      <p>
                        <strong>Success:</strong>{" "}
                        {devicePosture[key].success ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Error:</strong>{" "}
                        {devicePosture[key].error || "No errors"}
                      </p>
                      <p>
                        <strong>Timestamp:</strong>{" "}
                        {new Date(
                          devicePosture[key].timestamp
                        ).toLocaleString()}
                      </p>
                      <pre className="bg-white p-2 rounded mt-2">
                        {JSON.stringify(devicePosture[key].input, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-dark">
                No device posture information available.
              </p>
            ))}
        </div>

        <div className="p-4 border border-gray-light rounded-lg bg-white mt-6">
          <Setup />
        </div>
      </div>
    </div>
  );
};

export default Debug;
