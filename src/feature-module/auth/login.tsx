import React, { useEffect, useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";
import { fetchProfile } from "../../core/data/redux/slices/ProfileSlice";
import { useDispatch, useSelector } from "react-redux";
import ThemeSettings from "../../core/common/theme-settings/themeSettings";

const Login = () => {
  const navigate = useNavigate();
  const route = all_routes;
  const dispatch = useDispatch();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  // OTP resend logic removed

  // Redux selectors
  const {
    id,
    role,
    error: fetchUserError,
  } = useSelector((state: any) => state.profile);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  useEffect(() => {
    localStorage.setItem("menuOpened", "Dashboard");
    const token = localStorage.getItem("token");
    console.log("Checking user authentication status", fetchUserError);
    if (token && !fetchUserError) navigate(route.dashboard);
  }, []);

  // OTP resend logic removed

  // OTP resend logic removed
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const payload = { email, password };
      console.log(payload, "payload");

      const response = await api.post("user/login", payload);

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.data.token);
        setMessage(response.data.message);

        // Fetch profile before navigating
        await dispatch(fetchProfile() as any);
        // Navigate based on role
        response.data.data.role === "superadmin"
          ? navigate(route.adminDashboard) // Change this to admin route when available
          : navigate(route.dashboard);
      }
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "Login failed");
      if (error?.response?.data?.message?.toLowerCase().includes("verify")) {
        setMessage(error?.response?.data?.message);
      } else {
        setMessage(error?.response?.data?.message || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden ">
        <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
          <form className="flex-fill" onSubmit={handleLogin}>
            <div className="mx-auto mw-450">
              <div className="text-center mb-4">
                <ImageWithBasePath
                  src="assets/img/voycell-logo.webp"
                  className="img-fluid"
                  alt="Logo"
                />
              </div>
              <div className="mb-4">
                <h4>Sign In</h4>
                <p>Access the Voycell panel using your email and passcode.</p>
              </div>
              <div className="mb-3">
                <label className="col-form-label">Email Address</label>
                <div className="position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-mail"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="col-form-label">Password</label>
                <div className="pass-group">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className="pass-input form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*********"
                    required
                  />
                  <span
                    className={`ti toggle-password ${
                      isPasswordVisible ? "ti-eye" : "ti-eye-off"
                    }`}
                    onClick={togglePasswordVisibility}
                  ></span>
                </div>
              </div>
              {message && (
                <div className="mb-3">
                  <div
                    className={`alert ${
                      message.toLowerCase().includes("success")
                        ? "alert-success"
                        : "alert-danger"
                    } fw-medium`}
                  >
                    {message}
                  </div>
                </div>
              )}
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="form-check form-check-md d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value=""
                    id="checkebox-md"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="checkebox-md">
                    Remember Me
                  </label>
                </div>
                <div className="text-end">
                  <Link
                    to="/forgot-password"
                    className="text-primary fw-medium link-hover"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
              <div className="mb-3">
                <h6>
                  New on our platform?
                  <Link to="/register" className="text-purple link-hover">
                    {" "}
                    Create an account
                  </Link>
                </h6>
              </div>
              {/* <div className="form-set-login or-text mb-3">
                <h4>OR</h4>
              </div> */}
              <>
                {/* <div className="d-flex align-items-center justify-content-center flex-wrap mb-3">
                  <div className="text-center me-2 flex-fill">
                    <Link
                      to="#"
                      className="br-10 p-2 px-4 btn bg-pending  d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid m-1"
                        src="assets/img/icons/facebook-logo.svg"
                        alt="Facebook"
                      />
                    </Link>
                  </div>
                  <div className="text-center me-2 flex-fill">
                    <Link
                      to="#"
                      className="br-10 p-2 px-4 btn bg-white d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid  m-1"
                        src="assets/img/icons/google-logo.svg"
                        alt="Facebook"
                      />
                    </Link>
                  </div>
                  <div className="text-center flex-fill">
                    <Link
                      to="#"
                      className="bg-dark br-10 p-2 px-4 btn btn-dark d-flex align-items-center justify-content-center"
                    >
                      <ImageWithBasePath
                        className="img-fluid  m-1"
                        src="assets/img/icons/apple-logo.svg"
                        alt="Apple"
                      />
                    </Link>
                  </div>
                </div> */}
                <div className="text-center">
                  <p className="fw-medium text-gray">
                    Copyright © 2025 - Voycell
                  </p>
                </div>
              </>
            </div>
          </form>
        </div>
        <div className="d-flex flex-wrap w-50 vh-100  account-bg-01"></div>
      </div>
      {/* <ThemeSettings/> */}

      {/* {showCallingComponent && <Calling />} */}
    </div>
  );
};

export default Login;
