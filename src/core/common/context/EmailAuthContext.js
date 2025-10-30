import React, { createContext, useEffect, useState } from "react";

import api from "../../axios/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../../data/redux/slices/ProfileSlice";
import { showToast } from "../../data/redux/slices/ToastSlice";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SCOPES =
  "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/calendar";

export const EmailAuthContext = createContext();

export const EmailAuthProvider = ({ children }) => {
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [isMicrosoftSignedIn, setIsMicrosoftSignedIn] = useState(false);
  const userProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  const googleSignIn = async () => {
    try {
      const response = await api.post("connect/google");

      if (response.data.status === "success" && response.data.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const messageHandler = (event) => {
          console.log("origin:", event.origin);
          console.log("data:", event.data);
         
          

          const data = event.data;
          if (data?.status === "success" && data.googleConnected) {
            dispatch(
              showToast({
                message: "Google account connected successfully",
                variant: "success",
              })
            );
            dispatch(fetchProfile());

            window.removeEventListener("message", messageHandler);
            popup?.close();
          }
        };
        window.addEventListener("message", messageHandler);

        const popup = window.open(
          response.data.url,
          "_blank",
          `width=${width},height=${height},left=${left},top=${top}`
        );
        if (!popup) {
          console.error("Popup blocked");
        }
      }
    } catch (error) {
      console.error("Google Sign-In initiation failed", error);
    }
  };

  const googleSignOut = async () => {
    try {
      const response = await api.post("disconnect/google");
      dispatch(fetchProfile());
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
    }
  };

  const microsoftSignIn = async () => {
    try {
      const response = await api.post("connect/microsoft");
      console.log(response.data, "response from microsoft connect");

      if (response.data.status === "success" && response.data.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        console.log("console 1");
        const messageHandler = (event) => {
          const data = event.data;
          console.log("console 2");
          if (data?.status === "success" && data.microsoftConnected) {
            dispatch(
              showToast({
                message: "Microsoft account connected successfully",
                variant: "success",
              })
            );
            dispatch(fetchProfile());
            console.log("console 3");
            window.removeEventListener("message", messageHandler);
            popup?.close();
            console.log("console 4");
          }
        };

        window.addEventListener("message", messageHandler);

        const popup = window.open(
          response.data.url,
          "_blank",
          `width=${width},height=${height},left=${left},top=${top}`
        );
      }
    } catch (error) {
      console.log("console 5");
      console.error("Microsoft Sign-In initiation failed", error);
    }
  };

  const microsoftSignOut = async () => {
    try {
      const response = await api.post("disconnect/microsoft");

      dispatch(fetchProfile());
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
    } catch (error) {
      dispatch(
        showToast({ message: error.response?.data?.message, variant: "danger" })
      );
    }
  };

  const smtpSignIn = async (smtpData) => {
    try {
      console.log(smtpData,"smtp data before going to api");
      
      const response = await api.post("connect/smtp", smtpData);
      console.log(response.data,"responseeeee");
      
      dispatch(fetchProfile());
      console.log(response.data, "response from smtp");
      dispatch(showToast({ message: response.data.message, variant: "success" }));
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
    }
  };

  const smtpSignOut = async () => {
    try {
      const response = await api.post("disconnect/smtp");

      dispatch(fetchProfile());
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
    } catch (error) {
      dispatch(
        showToast({ message: error.response?.data?.message, variant: "danger" })
      );
    }
  };

  return (
    <EmailAuthContext.Provider
      value={{
        isGoogleSignedIn,
        googleSignIn,
        googleSignOut,
        isMicrosoftSignedIn,
        microsoftSignIn,
        microsoftSignOut,
        smtpSignIn,
        smtpSignOut,
      }}
    >
      {children}
    </EmailAuthContext.Provider>
  );
};
