import React, { useEffect, useState } from "react";
import "./status.css";

const History = ({ onLoaded }) => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [warpEnabled, setWarpEnabled] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("History: Fetching WARP status...");

        // Fetch WARP status from trace
        const traceResponse = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
        const traceText = await traceResponse.text();
        const warpStatus = traceText.includes("warp=on");
        setWarpEnabled(warpStatus);

        if (!warpStatus) {
          console.warn("History: WARP is not enabled.");
          setLoginHistory(null);
          if (onLoaded) onLoaded();  // send loading status back to accessdenied.js
          return;
        }

        console.log("History: Fetching login history...");
        // Fetch login history
        const response = await fetch("/api/history");
        if (!response.ok) {
          if (response.status >= 400 && response.status < 500) {
            setLoginHistory(null); // No login history available
          } else {
            throw new Error("Failed to fetch login history");
          }
        } else {
          const data = await response.json();
          const historyEntries = data?.loginHistory || [];

          if (historyEntries.length === 0) {
            console.warn("History: No login failures found.");
            setLoginHistory(null); // No login failures
          } else {
            const historyData = historyEntries.slice(-3).map((entry) => ({
              date: new Date(entry.dimensions.datetime).toLocaleDateString(),
              time: new Date(entry.dimensions.datetime).toLocaleTimeString(),
              applicationName: entry.applicationName || "Unknown App",
              reason: getReason(entry.dimensions),
            }));
            setLoginHistory(historyData);
          }
        }

        console.log("History: Data fetch complete.");
      } catch (error) {
        console.error("History: Error fetching data:", error);
        setErrorMessage("Error fetching login history. Please try again later.");
      } finally {
        if (onLoaded) onLoaded();
      }
    };

    const getReason = ({ hasGatewayEnabled, hasWarpEnabled }) => {
      if (hasGatewayEnabled === 0) {
        return { label: "Gateway", color: "bg-red" };
      }
      if (hasWarpEnabled === 0) {
        return { label: "WARP", color: "bg-red" };
      }
      return { label: "Other", color: "bg-red" };
    };

    fetchData();
  }, [onLoaded]);

  return (
    <div className={warpEnabled ? "card-normal" : "card-error"}>
      {warpEnabled ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Recent Access Login Failures</h2>
          {loginHistory ? (
            <div className="overflow-x-auto">
              <table className="table-auto w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-1 text-center text-sm text-roman-silver leading-tight">Date</th>
                    <th className="px-4 py-1 text-center text-sm text-roman-silver leading-tight">Time</th>
                    <th className="px-4 py-1 text-center text-sm text-roman-silver leading-tight">
                      Application Name
                    </th>
                    <th className="px-4 py-1 text-center text-sm text-roman-silver leading-tight">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map((entry, index) => (
                    <tr key={index}>
                      <td className="px-4 py-1 text-center leading-tight">{entry.date}</td>
                      <td className="px-4 py-1 text-center leading-tight">{entry.time}</td>
                      <td className="px-4 py-1 text-center leading-tight">{entry.applicationName}</td>
                      <td className="px-4 py-1 text-center leading-tight">
                        <span
                          className={`inline-block rounded-md px-3 py-1 text-sm text-white ${entry.reason.color}`}
                        >
                          {entry.reason.label}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-black">No recent Access login failures observed.</p>
          )}
        </>
      ) : (
        <div className="text-black p-5 flex items-center h-full">
          <span className="icon cross-icon mr-2"></span>
          {errorMessage || "Please enable WARP to view detailed login history."}
        </div>
      )}
      {errorMessage && <p className="text-black mt-4">{errorMessage}</p>}
    </div>
  );
};

export default History;
