import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// This just changes the browser tab title
// sloppy implementation, but easily customizable
const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/access-denied":
        document.title = "Access Denied";
        break;
      case "/information":
        document.title = "Information";
        break;
      case "/debug":
        document.title = "Debug";
        break;
      default:
        document.title = "Identity and Access Help Page";
    }
  }, [location]);

  return null;
};

export default PageTitle;
