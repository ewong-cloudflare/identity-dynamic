import React, { createContext, useContext, useEffect, useState } from "react";

const UserDetailsContext = createContext();

export function UserDetailsProvider({ children }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        console.log("UserDetailsProvider: Fetching /api/userdetails...");
        const res = await fetch("/api/userdetails");
        if (!res.ok) {
          throw new Error(`Failed with status ${res.status}`);
        }
        const data = await res.json();
        setUserDetails(data);
      } catch (err) {
        console.error("UserDetailsProvider:", err);
        setError(err.message || "Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    }

    fetchUserDetails();
  }, []);

  return (
    <UserDetailsContext.Provider value={{ userDetails, loading, error }}>
      {children}
    </UserDetailsContext.Provider>
  );
}

export function useUserDetails() {
  return useContext(UserDetailsContext);
}
