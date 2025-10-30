// src/feature-module/router/AdminRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const { id, role, error } = useSelector((state) => state.profile); ////if id  = "" then it is default user
  const location = useLocation();

  if (error || !token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Show loading spinner while profile is being fetched
  if (id === "") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ); // Or your custom loading component
  }

  if (role !== "superadmin") {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  console.log("now rendering children");
  return children;
};

export default AdminRoute;
