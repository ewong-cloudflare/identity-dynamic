import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ debugEnabled, setupEnabled, primaryColor }) => {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch('/assets/logo'); // use the logo uploaded in debug - QoL
        if (!response.ok) {
          throw new Error('Failed to fetch logo from KV');
        }
        const blob = await response.blob();
        const logoUrl = URL.createObjectURL(blob);
        setLogoUrl(logoUrl);
      } catch (error) {
        console.error('Error fetching logo from KV:', error);
      }
    };

    fetchLogo();
  }, []);

  const getNavLinkClass = ({ isActive }) =>
    isActive
      ? 'bg-steel text-black px-4 h-full flex items-center rounded-t-md'
      : 'text-white no-underline px-4 h-full flex items-center hover:bg-white hover:bg-opacity-20 rounded-t-md';

  return (
    <nav
      className="flex justify-between items-center h-[4rem] px-4 pt-2 w-full"
      style={{ backgroundColor: primaryColor }} // Use the primary color set in the debug
    >
      <div className="flex items-center">
        <NavLink to="/access-denied" className="shrink-0">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-full w-auto max-h-[3rem] min-h-[2rem] p-2" // Padding to accomidate logo sizes
            />
          ) : (
            <span>Loading Logo...</span>
          )}
        </NavLink>
        <span className="ml-14 text-2xl text-white font-medium">Identity and Access Help Page</span>
      </div>
      <ul className="flex space-x-4 h-full">
        <li className="list-none">
          <NavLink to="/access-denied" className={getNavLinkClass}>
            Access Denied
          </NavLink>
        </li>
        <li className="list-none">
          <NavLink to="/information" className={getNavLinkClass}>
            Information
          </NavLink>
        </li>
        {setupEnabled && (
          <li className="list-none">
            <NavLink to="/setup" className={getNavLinkClass}>
              Setup
            </NavLink>
          </li>
        )}
        {debugEnabled && (
          <li className="list-none">
            <NavLink to="/debug" className={getNavLinkClass}>
              Debug
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
