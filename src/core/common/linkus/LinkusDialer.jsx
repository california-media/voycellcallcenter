import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import api from "../../axios/axiosInstance";
import { setYeastarSignature } from "../../data/redux/slices/ProfileSlice";
import { showToast } from "../../data/redux/slices/ToastSlice";
import "ys-webrtc-sdk-ui/lib/ys-webrtc-sdk-ui.css";

/**
 * Reusable LinkusDialer component that can be used anywhere in the app
 * Uses Yeastar signature from Redux state or fetches it if needed
 */
const LinkusDialer = ({ mode = "full", className = "" }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.profile);

  const [isInitialized, setIsInitialized] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState("disconnected");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingSignature, setIsFetchingSignature] = useState(false);

  const phoneContainerRef = useRef(null);
  const phoneOperatorRef = useRef(null);
  const pbxOperatorRef = useRef(null);
  const cleanupRef = useRef(null);

  /**
   * Fetch Yeastar signature from backend
   */
  const fetchYeastarSignature = async () => {
    if (isFetchingSignature) return; // Prevent duplicate requests

    setIsFetchingSignature(true);
    try {
      console.log("📞 Fetching Yeastar login signature...");
      const response = await api.post("/api/yeastar-login/get-signature");

      if (response.data.status !== "success") {
        throw new Error(
          response.data.message || "Failed to get login signature"
        );
      }

      const { username, secret, pbxURL } = response.data.data;

      // Store in Redux for future use
      dispatch(
        setYeastarSignature({
          signature: secret,
          pbxURL: pbxURL,
        })
      );

      console.log("✅ Signature fetched and stored in Redux");
      return { username, secret, pbxURL };
    } catch (err) {
      console.error("❌ Failed to fetch signature:", err);
      throw err;
    } finally {
      setIsFetchingSignature(false);
    }
  };

  /**
   * Initialize Yeastar WebRTC SDK
   */
  const initializePhone = async (username, secret, pbxURL) => {
    try {
      if (!phoneContainerRef.current) {
        console.warn("Phone container ref not ready");
        return;
      }

      console.log("🔧 Initializing Yeastar SDK with:", { username, pbxURL });

      // Dynamically import the SDK
      const YSWebRTCUI = await import("ys-webrtc-sdk-ui");

      // Initialize the SDK
      const initResult = await YSWebRTCUI.init(phoneContainerRef.current, {
        username: username,
        secret: secret,
        pbxURL: pbxURL,
        enableLog: true,
        deviceIds: {
          volume: 0.8,
        },
        sessionOption: {
          sessionSetting: {
            width: mode === "compact" ? 300 : 400,
            height: mode === "compact" ? 400 : 600,
            x: window.innerWidth - (mode === "compact" ? 320 : 420),
            y: 20,
          },
        },
      });

      console.log("📋 SDK init result:", initResult);

      // Store references
      phoneOperatorRef.current = initResult.phone;
      pbxOperatorRef.current = initResult.pbx;
      cleanupRef.current = initResult.destroy;

      // Listen to phone events
      if (initResult.phone && typeof initResult.phone.on === "function") {
        initResult.phone.on("registered", () => {
          console.log("✅ Extension registered successfully");
          setPhoneStatus("ready");
          setIsInitialized(true);
          setIsLoading(false);
          setError(null);
        });

        initResult.phone.on("unregistered", () => {
          console.log("⚠️ Extension unregistered");
          setPhoneStatus("disconnected");
        });

        initResult.phone.on("registrationFailed", async (error) => {
          console.error("❌ Registration failed:", error);

          // Check if it's a signature/authentication error
          if (
            error.message?.includes("401") ||
            error.message?.includes("403") ||
            error.message?.includes("Unauthorized") ||
            error.message?.includes("signature")
          ) {
            console.log("🔄 Attempting to refresh signature...");
            setError("Authentication expired. Refreshing...");

            try {
              // Fetch new signature
              const credentials = await fetchYeastarSignature();

              // Cleanup old instance
              if (cleanupRef.current) {
                cleanupRef.current();
              }

              // Reinitialize with new signature
              await initializePhone(
                credentials.username,
                credentials.secret,
                credentials.pbxURL
              );
            } catch (refreshError) {
              setError(
                "Failed to refresh authentication: " + refreshError.message
              );
              setPhoneStatus("disconnected");
              setIsLoading(false);
              dispatch(
                showToast({
                  message: "Failed to authenticate with phone system",
                  variant: "danger",
                })
              );
            }
          } else {
            setError("Failed to register extension: " + error.message);
            setPhoneStatus("disconnected");
            setIsLoading(false);
          }
        });

        initResult.phone.on("callStarted", (session) => {
          console.log("📞 Call started:", session);
          setPhoneStatus("calling");
        });

        initResult.phone.on("callEnded", (session) => {
          console.log("📞 Call ended:", session);
          setPhoneStatus("ready");
        });

        initResult.phone.on("incomingCall", (session) => {
          console.log("📞 Incoming call:", session);
          // SDK UI shows incoming call popup automatically
        });
      }

      console.log("✅ Yeastar SDK initialized successfully");
      setPhoneStatus("ready");
      setIsInitialized(true);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      console.error("❌ Failed to initialize phone:", err);

      // Check if it's an authentication error
      if (
        err.message?.includes("401") ||
        err.message?.includes("403") ||
        err.message?.includes("Unauthorized") ||
        err.message?.includes("signature")
      ) {
        setError("Authentication failed. Click to retry.");
      } else {
        setError(err.message || "Failed to initialize phone");
      }

      setIsLoading(false);
      dispatch(
        showToast({
          message: "Failed to initialize phone system",
          variant: "danger",
        })
      );
    }
  };

  /**
   * Start initialization process
   */
  useEffect(() => {
    let mounted = true;

    const startInitialization = async () => {
      try {
        // Check if user has extension configured
        if (!userProfile?.extensionNumber || !userProfile?.yeastarExtensionId) {
          setError("Extension not configured. Please contact support.");
          setIsLoading(false);
          return;
        }

        // Check if we have signature in Redux state
        if (userProfile.yeastarSignature && userProfile.pbxURL) {
          console.log("✅ Using signature from Redux state");
          await initializePhone(
            userProfile.extensionNumber,
            userProfile.yeastarSignature,
            userProfile.pbxURL
          );
        } else {
          // Fetch signature if not available
          console.log("📞 No signature in state, fetching...");
          const credentials = await fetchYeastarSignature();

          if (mounted) {
            await initializePhone(
              credentials.username,
              credentials.secret,
              credentials.pbxURL
            );
          }
        }
      } catch (err) {
        console.error("❌ Failed to start initialization:", err);
        if (mounted) {
          setError(err.message || "Failed to initialize");
          setIsLoading(false);
        }
      }
    };

    startInitialization();

    return () => {
      mounted = false;
      // Cleanup
      if (cleanupRef.current) {
        try {
          cleanupRef.current();
        } catch (err) {
          console.error("Error during cleanup:", err);
        }
      }
    };
  }, [userProfile?.extensionNumber, userProfile?.yeastarExtensionId]);

  /**
   * Handle retry button click
   */
  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Cleanup existing instance
      if (cleanupRef.current) {
        cleanupRef.current();
      }

      // Fetch fresh signature
      const credentials = await fetchYeastarSignature();

      // Reinitialize
      await initializePhone(
        credentials.username,
        credentials.secret,
        credentials.pbxURL
      );
    } catch (err) {
      setError(err.message || "Failed to initialize");
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (phoneStatus) {
      case "ready":
        return "bg-green-500";
      case "calling":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (phoneStatus) {
      case "ready":
        return "Ready";
      case "calling":
        return "On Call";
      case "disconnected":
        return "Offline";
      default:
        return "Connecting...";
    }
  };

  return (
    <div className={`linkus-dialer ${className}`}>
      {/* Status indicator for compact mode */}
      {mode === "compact" && (
        <div className="mb-2 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${getStatusColor()} ${
                phoneStatus === "ready" ? "animate-pulse" : ""
              }`}
            ></div>
            <span className="text-xs text-gray-600">{getStatusText()}</span>
          </div>
          {userProfile?.extensionNumber && (
            <span className="text-xs text-gray-500">
              Ext: {userProfile.extensionNumber}
            </span>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-3 mb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <svg
                className="h-4 w-4 text-red-400 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-2">
                <p className="text-xs text-red-800">{error}</p>
              </div>
            </div>
            <button
              onClick={handleRetry}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="flex flex-col items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
          <p className="text-xs text-gray-600">Connecting...</p>
        </div>
      )}

      {/* Phone Container */}
      <div
        ref={phoneContainerRef}
        className={mode === "compact" ? "min-h-[300px]" : "min-h-[500px]"}
        style={{ backgroundColor: "transparent" }}
      ></div>
    </div>
  );
};

export default LinkusDialer;
