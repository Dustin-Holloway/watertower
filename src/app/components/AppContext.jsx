"use client";
import React, { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const appContext = createContext();

export function AppContextProvider({ children }) {
  const router = useRouter();

  const [user, setUser] = useState({ Default: true });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/check_session");
        if (response.ok) {
          const user = await response.json();
          setUser(user);
          setIsAuthenticated(true);
        } else if (response.status === 401) {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      }
    };

    checkSession();
  }, []);

  const contextValue = {
    user,
    setUser,
    isAuthenticated,
  };

  return (
    <appContext.Provider value={contextValue}>{children}</appContext.Provider>
  );
}
