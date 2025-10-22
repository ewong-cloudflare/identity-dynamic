import React, { useEffect, useState } from "react";
import { useTrace } from "../hooks/trace";
import { useUserDetails } from "../hooks/userdetails";
import "./status.css";

const DeviceInfo = ({ onLoaded }) => {
  const [userData, setUserData] = useState({
    device_model: "",
    device_name: "",
    device_os_ver: "",
    device_ID: "",
    is_WARP_enabled: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const { warpEnabled, loading: warpLoading, error: warpError } = useTrace(); // use new trace handling method

  // Use new userdetails fetch 
  const {
    userDetails,
    loading: userLoading,
    error: userError,
  } = useUserDetails();

  useEffect(() => {
    if (warpLoading) return;
    if (warpError || !warpEnabled) {
      if (onLoaded) onLoaded();
      return;
    }
    if (userLoading) return;
    if (userError) {
      console.error("DeviceInfo: Error fetching device data:", userError);
      setErrorMessage("Error fetching device data. Please try again later.");
      if (onLoaded) onLoaded();
      return;
    }

    try {
      const device = userDetails?.device?.result || {};
      setUserData({
        device_model: device.model || "",
        device_name: device.name || "",
        device_os_ver: device.os_version || "",
        device_ID: device.gateway_device_id || "",
        is_WARP_enabled: true,
      });
    } catch (err) {
      console.error("DeviceInfo: Error parsing device data:", err);
      setErrorMessage("Error parsing device data. Please try again later.");
    } finally {
      if (onLoaded) onLoaded();
    }
  }, [
    warpLoading,
    warpEnabled,
    warpError,
    userLoading,
    userError,
    userDetails,
    onLoaded,
  ]);

  if (warpLoading) {
    return (
      <div className="card-normal">
        <p>Checking WARP status...</p>
      </div>
    );
  }

  if (warpError) {
    return (
      <div className="card-error">
        <p>Error checking WARP status: {warpError}</p>
      </div>
    );
  }

  if (!warpEnabled) {
    return (
      <div className="card-error">
        <div className="text-black p-5 flex items-center">
          <span className="icon cross-icon mr-2"></span>
          {errorMessage || "Please enable WARP to view device information."}
        </div>
      </div>
    );
  }

  if (userLoading) {
    return (
      <div className="card-normal">
        <p>Loading device information...</p>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="card-error">
        <p>{errorMessage || `Error loading device info: ${userError}`}</p>
      </div>
    );
  }

  if (!userData.is_WARP_enabled) {
    return (
      <div className="card-error">
        <div className="text-black p-5 flex items-center">
          <span className="icon cross-icon mr-2"></span>
          {errorMessage || "Device information unavailable."}
        </div>
      </div>
    );
  }

  return (
    <div className="card-normal">
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
      {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
    </div>
  );
};

export default DeviceInfo;

// import React, { useEffect, useState } from "react";
// import "./status.css";

// const DeviceInfo = ({ onLoaded }) => {
//   const [userData, setUserData] = useState({
//     device_model: "",
//     device_name: "",
//     device_os_ver: "",
//     device_ID: "",
//     is_WARP_enabled: false,
//   });
//   const [warpEnabled, setWarpEnabled] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const fetchWarpStatus = async () => {
//       try {
//         console.log("DeviceInfo: Fetching WARP status...");
//         const traceResponse = await fetch("https://www.cloudflare.com/cdn-cgi/trace");
//         const traceText = await traceResponse.text();
//         const warpStatus = traceText.includes("warp=on");
//         setWarpEnabled(warpStatus);

//         if (warpStatus) {
//           console.log("DeviceInfo: WARP is enabled, fetching user data...");
//           fetchUserData(); //fetch user data if WARP is enabled
//         } else {
//           // setErrorMessage("WARP is not enabled. Device information is unavailable.");
//           if (onLoaded) onLoaded();
//         }
//       } catch (error) {
//         console.error("DeviceInfo: Error fetching WARP status:", error);
//         setErrorMessage("Error fetching WARP status. Please try again later.");
//         if (onLoaded) onLoaded(); // send loading status back to accessdenied.js
//       }
//     };

//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("/api/userdetails");
//         const data = await response.json();

//         setUserData({
//           device_model: data.device?.result?.model || "",
//           device_name: data.device?.result?.name || "",
//           device_os_ver: data.device?.result?.os_version || "",
//           device_ID: data.device?.result?.gateway_device_id || "",
//           is_WARP_enabled: true,
//         });

//         console.log("DeviceInfo: User data loaded successfully.");
//         if (onLoaded) onLoaded();  // send loading status back to accessdenied.js
//       } catch (error) {
//         console.error("DeviceInfo: Error fetching device data:", error);
//         // setErrorMessage("Error fetching device data. Please refresh the page or try again later.");
//         if (onLoaded) onLoaded();  // send loading status back to accessdenied.js still
//       }
//     };

//     fetchWarpStatus();
//   }, [onLoaded]);

//   return (
//     <div className={warpEnabled ? "card-normal" : "card-error"}>
//       {warpEnabled ? (
//         userData.is_WARP_enabled ? (
//           <>
//             <h2 className="text-xl font-semibold mb-4">Device Information</h2>
//             <ul className="mb-4 space-y-4">
//               <li className="info-item">
//                 <span className="icon info-icon mr-2"></span>
//                 <strong>Device Model: </strong>
//                 {userData.device_model}
//               </li>
//               <li className="info-item">
//                 <span className="icon info-icon mr-2"></span>
//                 <strong>Device Name: </strong>
//                 {userData.device_name}
//               </li>
//               <li className="info-item">
//                 <span className="icon info-icon mr-2"></span>
//                 <strong>OS Version: </strong>
//                 {userData.device_os_ver}
//               </li>
//               <li className="info-item">
//                 <span className="icon info-icon mr-2"></span>
//                 <strong>Serial Number: </strong>
//                 {userData.device_ID}
//               </li>
//             </ul>
//           </>
//         ) : (
//           <div className="text-black p-5 flex items-center">
//             <span className="icon cross-icon mr-2"></span>
//             Device information unavailable.
//           </div>
//         )
//       ) : (
//         <div className="text-black p-5 flex items-center">
//           <span className="icon cross-icon mr-2"></span>
//           {errorMessage || "WARP is not enabled. Please enable WARP to view device information."}
//         </div>
//       )}
//       {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
//     </div>
//   );
// };

// export default DeviceInfo;
