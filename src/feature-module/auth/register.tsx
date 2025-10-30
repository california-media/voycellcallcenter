import React, { useState } from "react";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../router/all_routes";
import api from "../../core/axios/axiosInstance";

type PasswordField = "password" | "confirmPassword";

const Register = () => {
  const route = all_routes;
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (!password) {
      setMessage({ text: "Password is required", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }

    if (!email) {
      setMessage({ text: "Email is required", type: "error" });
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.post("user/signup/email", {
        email,
        password,
        confirmPassword,
      });

      if (response.data.status === "success") {
        setMessage({ text: response.data.message, type: "success" });
        // Navigate to login after successful registration
        // setTimeout(() => {
        //   navigate("/");
        // }, 2000);
      }
    } catch (err: any) {
      setMessage({
        text: err?.response?.data?.message || "Registration failed",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden ">
        <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-50 bg-backdrop">
          <form className="flex-fill" onSubmit={handleRegister}>
            <div className="mx-auto mw-450">
              <div className="text-center mb-4">
                <ImageWithBasePath
                  src="assets/img/logo.svg"
                  className="img-fluid"
                  alt="Logo"
                />
              </div>
              <div className="mb-4">
                <h4 className="mb-2 fs-20">Register</h4>
                <p>Create a new Voycell account</p>
              </div>

              <div className="mb-3">
                <label className="col-form-label">Email Address</label>
                <div className="position-relative">
                  <span className="input-icon-addon">
                    <i className="ti ti-mail" />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="col-form-label">Password</label>
                <div className="pass-group">
                  <input
                    type={passwordVisibility.password ? "text" : "password"}
                    className="pass-input form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="*********"
                    required
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("password")}
                  ></span>
                </div>
              </div>

              <div className="mb-3">
                <label className="col-form-label">Confirm Password</label>
                <div className="pass-group">
                  <input
                    type={
                      passwordVisibility.confirmPassword ? "text" : "password"
                    }
                    className="pass-input form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="*********"
                    required
                  />
                  <span
                    className={`ti toggle-passwords ${
                      passwordVisibility.confirmPassword
                        ? "ti-eye"
                        : "ti-eye-off"
                    }`}
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  ></span>
                </div>
              </div>

              {message.text && (
                <div className="mb-3">
                  <div
                    className={`alert ${
                      message.type === "success"
                        ? "alert-success"
                        : "alert-danger"
                    } fw-medium`}
                  >
                    {message.text}
                  </div>
                </div>
              )}

              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="form-check form-check-md d-flex align-items-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue=""
                    id="checkebox-md"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="checkebox-md">
                    I agree to the{" "}
                    <Link to="#" className="text-primary link-hover">
                      Terms &amp; Privacy
                    </Link>
                  </label>
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
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </button>
              </div>

              <div className="mb-3">
                <h6>
                  Already have an account?{" "}
                  <Link to="/" className="text-purple link-hover">
                    {" "}
                    Sign In Instead
                  </Link>
                </h6>
              </div>
              {/* <div className="form-set-login or-text mb-3">
                <h4>OR</h4>
              </div>
              <div className="d-flex align-items-center justify-content-center flex-wrap mb-3">
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
            </div>
          </form>
        </div>
        <div className="d-flex flex-wrap w-50 vh-100  account-bg-02"></div>
      </div>
    </div>
  );
};

export default Register;
