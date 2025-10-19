import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Alert from "../components/alert";
import Button from "../components/button";
import OriginalUrl from "../components/originalurl";
import Posture from "../components/posture";
import History from "../components/history";
import AccessDeniedInfo from "../content/AccessDeniedInfo";
import DeviceInfo from "../components/deviceinfo";
import WarpInfo from "../components/warpinfo";
import { MutatingDots } from "react-loader-spinner";

const AccessDenied = ({ primaryColor, secondaryColor }) => {
  const [loadingDeviceInfo, setLoadingDeviceInfo] = useState(true);
  const [loadingWarpInfo, setLoadingWarpInfo] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const location = useLocation();

  // Handlers to update loading state
  const handleDeviceInfoLoaded = () => {
    setLoadingDeviceInfo(false);
  };

  const handleWarpInfoLoaded = () => {
    setLoadingWarpInfo(false);
  };

  const handleHistoryLoaded = () => {
    setLoadingHistory(false);
  };

  // Reset state when the route changes, this is needed to force refresh to keep the information up to date.
  useEffect(() => {
    setLoadingDeviceInfo(true);
    setLoadingWarpInfo(true);
    setLoadingHistory(true);
  }, [location.pathname]); // Reset loading states whenever the pathname changes

  const loadingPage = loadingDeviceInfo || loadingWarpInfo || loadingHistory;

  return (
    <div className="bg-steel min-h-screen relative">
      {/* Loading Overlay, this can be customized to your liking */}
      {loadingPage && (
        <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
          <MutatingDots
            height="150"
            width="150"
            color={primaryColor}
            secondaryColor={primaryColor}
            radius="20"
            ariaLabel="mutating-dots-loading"
            visible={true}
          />
          <h2 className="text-xl font-semibold" style={{ color: "black" }}>
            Checking your connection
          </h2>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`max-w-7xl mx-auto p-6 sm:p-10 ${
          loadingPage ? "opacity-0" : "opacity-100"
        } transition-opacity duration-500`}
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Access Denied</h1>
        <div className="flex justify-center">
          <OriginalUrl />
        </div>

        <hr className="my-6 border-gray-light" />
        <h3 className="text-2xl font-bold mb-6">Overview</h3>
        <p className="mb-4">
          One of the following sections describes why you were denied access to
          the site you attempted to visit. Currently, Cloudflare Access does not
          provide the exact reason for denial, therefore, this Access Denied
          page describes the most common reasons for access denials.
        </p>
        <div className="container mx-auto p-4">
          <Alert type="info">
            Please review the provided information in order to troubleshoot any
            potential user, group, or device requirements that are not met.
          </Alert>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 h-full">
          <WarpInfo onLoaded={handleWarpInfoLoaded} />
          <Posture />

          <div className="flex flex-col h-full min-h-[100px]">
            <DeviceInfo onLoaded={handleDeviceInfoLoaded} />
          </div>

          <div className="flex flex-col h-full min-h-[100px]">
            <History onLoaded={handleHistoryLoaded} />
          </div>
        </div>

        <hr className="my-6 border-gray-light" />

        {/* Set this up to be your intended "click to contact" support section (redirect or email).*/}

        <div className="container mx-auto p-4 flex items-center">
          <p className="mr-4">
            Consult the information below for further details surrounding the
            above status information, for further assistance:
          </p>
          <a href="mailto:IT@example.com" className="inline-block">
            <Button variant="secondary" secondaryColor={secondaryColor}>
              Contact Support
            </Button>
          </a>
        </div>

        <hr className="my-6 border-gray-light" />
        <AccessDeniedInfo />
      </div>
    </div>
  );
};

export default AccessDenied;
