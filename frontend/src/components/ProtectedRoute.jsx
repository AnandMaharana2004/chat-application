import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ element }) {
  const { authUser } = useSelector((store) => store.user);
  return authUser ? element : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
