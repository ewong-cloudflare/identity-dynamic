import React, { useEffect, useState } from "react";
import "./status.css";

const DeviceInfo = ({ onLoaded }) => {
  const [userData, setUserData] = useState({
    device_model: "",
    device_name: "",
    device_os_ver: "",
    device_ID: "",
    is_WARP_enabled: false,
  });
  const [warpEnabled, setWarpEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchWarpStatus = async () => {
      try {
        console.log("DeviceInfo: Fetching WARP status...");
        const traceResponse = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
        const traceText = await traceResponse.text();
        const warpStatus = traceText.includes("warp=on");
        setWarpEnabled(warpStatus);

        if (warpStatus) {
          console.log("DeviceInfo: WARP is enabled, fetching user data...");
          fetchUserData(); //fetch user data if WARP is enabled
        } else {
          // setErrorMessage("WARP is not enabled. Device information is unavailable.");
          if (onLoaded) onLoaded();
        }
      } catch (error) {
        console.error("DeviceInfo: Error fetching WARP status:", error);
        setErrorMessage("Error fetching WARP status. Please try again later.");
        if (onLoaded) onLoaded(); // send loading status back to accessdenied.js
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/userdetails");
        const data = await response.json();

        setUserData({
          device_model: data.device?.result?.model || "",
          device_name: data.device?.result?.name || "",
          device_os_ver: data.device?.result?.os_version || "",
          device_ID: data.device?.result?.gateway_device_id || "",
          is_WARP_enabled: true,
        });

        console.log("DeviceInfo: User data loaded successfully.");
        if (onLoaded) onLoaded();  // send loading status back to accessdenied.js
      } catch (error) {
        console.error("DeviceInfo: Error fetching device data:", error);
        // setErrorMessage("Error fetching device data. Please refresh the page or try again later.");
        if (onLoaded) onLoaded();  // send loading status back to accessdenied.js still
      }
    };

    fetchWarpStatus();
  }, [onLoaded]);

  return (
    <div className={warpEnabled ? "card-normal" : "card-error"}>
      {warpEnabled ? (
        userData.is_WARP_enabled ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Device Information</h2>
            <ul className="mb-4 space-y-4">
              <li className="info-item">
                <span className="icon info-icon mr-2"></span>
                <strong>Device Model: </strong>
                {userData.device_model}
              </li>
              <li className="info-item">
                <span className="icon info-icon mr-2"></span>
                <strong>Device Name: </strong>
                {userData.device_name}
              </li>
              <li className="info-item">
                <span className="icon info-icon mr-2"></span>
                <strong>OS Version: </strong>
                {userData.device_os_ver}
              </li>
              <li className="info-item">
                <span className="icon info-icon mr-2"></span>
                <strong>Serial Number: </strong>
                {userData.device_ID}
              </li>
            </ul>
          </>
        ) : (
          <div className="text-black p-5 flex items-center">
            <span className="icon cross-icon mr-2"></span>
            Device information unavailable.
          </div>
        )
      ) : (
        <div className="text-black p-5 flex items-center">
          <span className="icon cross-icon mr-2"></span>
          {errorMessage || "WARP is not enabled. Please enable WARP to view device information."}
        </div>
      )}
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default DeviceInfo;
