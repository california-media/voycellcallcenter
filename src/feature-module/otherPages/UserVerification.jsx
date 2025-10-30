import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import api from "../../core/axios/axiosInstance";
import { fetchProfile } from "../../core/data/redux/slices/ProfileSlice";
import { useDispatch } from "react-redux";

const UserVerification = () => {
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get("verificationToken");
  const [message, setMessage] = useState("We’re setting up your account");
  const [subMessage, setSubMessage] = useState(
    "This should just take a few moments…"
  );
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        if (verificationToken) {
          const response = await api.post("/user/signup/email", {
            verifyToken: verificationToken,
          });
          console.log(response.data, "response from the verification api");

          localStorage.setItem("token", response.data.data.token);
          setMessage(response.data.message || "Verification successful!");
          setSubMessage("Redirecting shortly...");
          setLoading(false);
          ///fetch profile before navigating
          await dispatch(fetchProfile());

          setTimeout(() => {
            navigate("/", {
              replace: true,
              state: response.data.data,
            });
          }, 2000);
        }
      } catch (error) {
        console.error("Signup failed:", error.response?.data || error.message);
        setMessage(
          error.response?.data?.message ||
            "Verification failed. Please try again."
        );
        setSubMessage("");
        setLoading(false);
      }
    };

    verifyUser();
  }, [verificationToken]);

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      {/* <img
        src="/assets/img/logo.svg"
        alt="Logo"
        className=" m-4"
        style={{ height: "40px", width: "auto" }}
      /> */}

      {loading && (
        <div className="spinner-border text-primary mb-4" role="status" />
      )}
      <h5 className="fw-semibold">{message}</h5>
      {subMessage && <p className="text-muted mb-0">{subMessage}</p>}
    </div>
  );
};

export default UserVerification;
