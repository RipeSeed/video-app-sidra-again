import React from "react";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
const queryParams = new URLSearchParams(window.location.search);
const roomName = queryParams.get("roomName");

function ProtectedRoute({ isSignedIn }) {
  return isSignedIn ? (
    <Outlet />
  ) : (
    <Navigate to={roomName ? `/login/?roomName=${roomName}` : "/login"} />
  );
}

export default ProtectedRoute;
