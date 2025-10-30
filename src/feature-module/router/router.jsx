import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";
import { authRoutes, publicRoutes, adminRoutes } from "./router.link";
import Feature from "../feature";
import AuthFeature from "../authFeature";
import Login from "../auth/login";
import { Helmet } from "react-helmet-async";
import { all_routes } from "./all_routes";
import { fetchProfile } from "../../core/data/redux/slices/ProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import { hideToast } from "../../core/data/redux/slices/ToastSlice";
import UserVerification from "../otherPages/UserVerification";
import AdminFeature from "../AdminFeature";

const ALLRoutes = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { toasts } = useSelector((state) => state.toast);
  const userProfile = useSelector((state) => state.profile);
  const route = all_routes;

  // Find the current route in either public or auth routes
  const currentRoute =
    publicRoutes.find((route) => route.path === location.pathname) ||
    authRoutes.find((route) => route.path === location.pathname);

  // Construct the full title
  const fullTitle = currentRoute?.title
    ? `${currentRoute.title} | CRMS - Advanced Bootstrap 5 Admin Template for Customer Management`
    : "CRMS - Advanced Bootstrap 5 Admin Template for Customer Management";

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);
  useEffect(() => {
    document.documentElement.setAttribute("data-color", "blue");
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("token found");
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  // Auto-hide toasts after their delay
  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(hideToast(toast.id));
      }, toast.delay);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  return (
    <>
      <Helmet>
        <title>{fullTitle}</title>
      </Helmet>
      <Routes>
        {/* Public Route - Login */}
        <Route path="/" element={<Login />} />
        <Route path="/user-verification" element={<UserVerification />} />

        <Route element={<AuthFeature />}>
          {authRoutes.map((route, index) => (
            <Route path={route.path} element={route.element} key={index} />
          ))}
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <AdminRoute>
              <Routes>
                {adminRoutes.map((route, index) => {
                  // Skip routes with undefined paths
                  if (!route.path) return null;

                  return (
                    <Route element={<AdminFeature />} key={index}>
                      <Route path={route.path} element={route.element} />
                    </Route>
                  );
                })}
              </Routes>
            </AdminRoute>
          }
        >
          {adminRoutes.map((route, index) => {
            if (!route.path) return null;

            return (
              <Route element={<Feature />} key={index}>
                <Route path={route.path} element={route.element} />
              </Route>
            );
          })}
        </Route>

        {/* Private Routes */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Routes>
                {publicRoutes.map((route, index) => {
                  // Skip routes with undefined paths
                  if (!route.path) return null;

                  return (
                    <Route element={<Feature />} key={index}>
                      <Route path={route.path} element={route.element} />
                    </Route>
                  );
                })}
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Toast Notifications */}
      <div className="toast-container position-fixed top-0 end-0 p-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast show align-items-center text-white bg-${toast.variant} border-0 mb-2`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {toast.heading && (
              <div className={`toast-header bg-${toast.variant} text-white`}>
                <strong className="me-auto">{toast.heading}</strong>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  aria-label="Close"
                  onClick={() => dispatch(hideToast(toast.id))}
                ></button>
              </div>
            )}
            <div className="toast-body d-flex justify-content-between align-items-start">
              <span>{toast.message}</span>
              {!toast.heading && (
                <button
                  type="button"
                  className="btn-close btn-close-white ms-3"
                  aria-label="Close"
                  onClick={() => dispatch(hideToast(toast.id))}
                ></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ALLRoutes;
