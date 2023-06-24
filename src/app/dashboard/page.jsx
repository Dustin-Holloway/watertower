"use client";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";
import PDFViewer from "../components/PdfViewer";
// import { AppContextProvider } from "./AppContext";

export default function Home() {
  const [currentUser, setCurrentUser] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   // auto-login
  //   fetch("/api/check_session").then((r) => {
  //     if (r.ok) {
  //       r.json().then((user) => {
  //         setCurrentUser(user);
  //         setIsAuthenticated(true);
  //       });
  //     }
  //   });
  // }, []);

  return (
    <div className="bg-white">
      {/* <AppContextProvider> */}
      <Dashboard
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isAuthenticated={isAuthenticated}
      />
      {/* </AppContextProvider> */}
    </div>
  );
}
