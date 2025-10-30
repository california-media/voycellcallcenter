import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../core/common/imageWithBasePath";
import { Link } from "react-router-dom";
import api from "../../core/axios/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/email/forgot-password", { email });
      setMessage(response.data.message || "Reset link sent successfully");
    } catch (error: any) {
      setMessage(
        error?.response?.data?.message || "Failed to send reset request"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-content">
      <div className="d-flex flex-wrap w-100 vh-100 overflow-hidden account-bg-01">
        <div className="d-flex align-items-center justify-content-center flex-wrap vh-100 overflow-auto p-4 w-100 bg-backdrop">
          <form className="flex-fill" onSubmit={handleForgotPassword}>
            <div className="mx-auto mw-450">
              <div className="text-center mb-4">
                <ImageWithBasePath
                  src="assets/img/logo.svg"
                  className="img-fluid"
                  alt="Logo"
                />
              </div>
              <div className="mb-4">
                <h4 className="mb-2 fs-20">Forgot Password</h4>
                <p>
                  Enter your email address to receive a password reset link.
                </p>
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

              {message && (
                <div className="mb-3">
                  <div
                    className={`alert ${
                      message.includes("success") || message.includes("sent")
                        ? "alert-success"
                        : "alert-danger"
                    } fw-medium`}
                  >
                    {message}
                  </div>
                </div>
              )}

              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>

              <div className="mb-3 text-center">
                <h6>
                  Remember your password?{" "}
                  <Link to="/" className="text-purple link-hover">
                    Back to Login
                  </Link>
                </h6>
              </div>

              <div className="text-center">
                <p className="fw-medium text-gray">Copyright © 2024 - CRMS</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
