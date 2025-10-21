import React, { useEffect, useState } from "react";

const WarpInfo = ({ onLoaded }) => {
  const [userData, setUserData] = useState({
    user_name: "",
    user_email: "",
    is_WARP_enabled: false,
    account_id: "",
    is_in_org: null,
  });
  const [envVars, setEnvVars] = useState({
    ORGANIZATION_ID: "",
    ORGANIZATION_NAME: "",
  });
  const [warpEnabled, setWarpEnabled] = useState(null);
  const [errorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("WarpInfo: Starting data fetch...");

        // Fetch WARP status
        const traceResponse = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
        const traceText = await traceResponse.text();
        const warpStatus = traceText.includes("warp=on");
        setWarpEnabled(warpStatus);

        // Fetch environment variables
        const envResponse = await fetch("/api/env");
        const envData = await envResponse.json();
        setEnvVars({
          ORGANIZATION_ID: envData.ORGANIZATION_ID,
          ORGANIZATION_NAME: envData.ORGANIZATION_NAME,
        });

        // Fetch user data
        const userResponse = await fetch("/api/userdetails");
        const userData = await userResponse.json();

        // Calculate is_in_org
        const isInOrg = userData.identity.account_id === envData.ORGANIZATION_ID;

        // Update userData state with fetched data and calculated `is_in_org`
        setUserData({
          user_name: userData.identity.name,
          user_email: userData.identity.email,
          is_WARP_enabled: userData.identity.is_warp,
          account_id: userData.identity.account_id,
          is_in_org: isInOrg,
        });

        console.log("WarpInfo: Data fetch complete, is_in_org:", isInOrg);
      } catch (error) {
        // console.error("WarpInfo: Error fetching data:", error);
        // setErrorMessage("Error fetching WARP or user data. Please try again later.");
      } finally {
        if (onLoaded) onLoaded(); // send loading status back to accessdenied.js
      }
    };

    fetchData();
  }, [onLoaded]);

  return (
    <div className={warpEnabled ? "card-normal" : "card-error"}>
      {warpEnabled ? (
        <>
          <h2 className="text-xl font-semibold mb-4">WARP Information</h2>
          <ul className="mb-4 space-y-4">
            <li className="info-item">
              <span className="icon info-icon mr-2"></span>
              {userData.user_name}
            </li>
            <li className="info-item">
              <span className="icon info-icon mr-2"></span>
              {userData.user_email}
            </li>
            <li className="info-item">
              <span className="icon check-icon mr-2"></span>WARP is enabled
            </li>
            <li className="info-item">
              <span
                className={`icon ${
                  userData.is_in_org ? "check-icon" : "cross-icon"
                } mr-2`}
              ></span>
              {userData.is_in_org
                ? `User is in the "${envVars.ORGANIZATION_NAME}" organization`
                : `User is not in the "${envVars.ORGANIZATION_NAME}" organization`}
            </li>
          </ul>
        </>
      ) : (
        <div className="text-black p-5">
          <span className="icon cross-icon mr-2"></span>
          Please enable WARP to view detailed user information.
        </div>
      )}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default WarpInfo;
