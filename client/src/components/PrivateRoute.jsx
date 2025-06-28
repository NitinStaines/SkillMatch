import React from "react";
import { Navigate } from "react-router-dom";
import useServerStatus from "../hooks/useServerStatus";
import ServerDown from "./ServerDown";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const { isServerOnline, isChecking, checkServerStatus } = useServerStatus();

  // If no token, redirect to home
  if (!token) {
    return <Navigate to="/" />;
  }

  // If server is down, show server down page
  if (!isServerOnline) {
    return <ServerDown onRetry={checkServerStatus} isChecking={isChecking} />;
  }

  // If checking server status, show loading
  if (isChecking) {
    return (
      <div style={{
        background: "linear-gradient(270deg, rgba(17,0,38,1) 7%, rgba(0,9,66,1) 100%)",
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Checking server connection...</div>
      </div>
    );
  }

  // Server is online, show the protected content
  return children;
};

export default PrivateRoute;
