import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import "ys-webrtc-sdk-ui/lib/ys-webrtc-sdk-ui.css";
import { setYeastarSignature } from '../../data/redux/slices/ProfileSlice';
import { showToast } from '../../data/redux/slices/ToastSlice';
import api from '../../axios/axiosInstance';
import { closeDialer } from '../../data/redux/slices/FloatingDialerSlice';

export default function FloatingDialer({ mode = "full", className = "" }) {
  const [isOpen, setIsOpen] = useState(true);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showDialpad, setShowDialpad] = useState(false);
  const [dialpadNumber, setDialpadNumber] = useState('');
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

















































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















































































  // --- DRAGGABLE LOGIC ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    setPosition({
      x: Math.min(Math.max(newX, 0), window.innerWidth - 320),
      y: Math.min(Math.max(newY, 0), window.innerHeight - 100),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // --- DIALPAD FUNCTIONS ---
  const handleDialpadClick = (num) => setDialpadNumber((prev) => prev + num);
  const handleDialpadClear = () => {
    setDialpadNumber((prev) => prev.slice(0, -1));
  };
  const handleEndCall = () => {
    setCallStatus('Call Ended');
    setTimeout(() => setIsOpen(false), 800);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const styles = {
    floatingDialer: {
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: '320px',
      height: '480px',
      background: '#1a1a1a',
      borderRadius: '16px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      overflow: 'hidden',
      zIndex: 1000,
      userSelect: 'none',
      cursor: isDragging ? 'grabbing' : 'default',
    },
    dialerHeader: {
      background: '#2d2d2d',
      padding: '12px 16px',
      cursor: 'grab',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerTitle: {
      color: 'white',
      margin: 0,
      fontWeight: 500,
      fontSize: '16px',
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '28px',
      lineHeight: 1,
      padding: 0,
      cursor: 'pointer',
    },
    dialerBody: {
      padding: '24px',
      textAlign: 'center',
      position: 'relative', // to contain absolute dialpad
      height: 'calc(100% - 56px)',
      overflow: 'hidden',
    },
    avatar: {
      width: '64px',
      height: '64px',
      background: '#3a3a3a',
      borderRadius: '50%',
      margin: '0 auto 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#888',
    },
    callerName: {
      color: 'white',
      fontSize: '20px',
      fontWeight: 600,
      marginBottom: '4px',
    },
    callerNumber: {
      color: '#888',
      fontSize: '14px',
      marginBottom: '16px',
    },
    callStatus: {
      color: '#888',
      fontSize: '14px',
      marginBottom: '4px',
    },
    callDuration: {
      color: '#4ade80',
      fontSize: '18px',
      fontFamily: 'monospace',
      marginBottom: '24px',
    },
    actionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '16px',
    },
    actionBtn: {
      background: 'transparent',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background 0.2s',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    },
    actionBtnActive: {
      background: '#3a3a3a',
    },
    actionBtnMuted: {
      background: '#dc2626',
    },
    actionEmoji: {
      fontSize: '24px',
    },
    actionLabel: {
      color: 'white',
      fontSize: '12px',
    },
    dialpadOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#2d2d2d',
      padding: '16px',
      borderRadius: '8px',
      transition: 'opacity 0.3s ease',
      opacity: showDialpad ? 1 : 0,
      pointerEvents: showDialpad ? 'auto' : 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    dialpadDisplay: {
      background: '#1a1a1a',
      padding: '12px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '18px',
      fontFamily: 'monospace',
      textAlign: 'center',
      minHeight: '48px',
      marginBottom: '12px',
    },
    dialpadGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
    },
    dialpadBtn: {
      background: '#3a3a3a',
      border: 'none',
      padding: '16px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '18px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    clearBtn: {
      width: '100%',
      marginTop: '8px',
      background: '#dc2626',
      border: 'none',
      padding: '8px',
      borderRadius: '8px',
      color: 'white',
      cursor: 'pointer',
      fontSize: '14px',
    },
    endCallBtn: {
      width: '64px',
      height: '64px',
      background: '#dc2626',
      border: 'none',
      borderRadius: '50%',
      fontSize: '32px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)',
      margin: '0 auto',
      display: 'block',
    },
  };

  if (!isOpen) return null;

  return (
    <div style={styles.floatingDialer}>
      <div
        className="drag-handle"
        style={styles.dialerHeader}
        onMouseDown={handleMouseDown}
      >
        <h6 style={styles.headerTitle}>Outgoing Call</h6>
        <button style={styles.closeBtn} onClick={() =>  dispatch(closeDialer())}>
          ×
        </button>
      </div>





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


      <div style={styles.dialerBody}>
        {/* MAIN CONTENT */}
        <div style={{ opacity: showDialpad ? 0.2 : 1, transition: 'opacity 0.3s' }}>
          <div style={styles.avatar}>VC</div>
          <div style={styles.callerName}>Vipul Chavda</div>
          <div style={styles.callerNumber}>+91 82009 16223</div>
          <div style={styles.callStatus}>{callStatus}</div>
          <div style={styles.callDuration}>{formatTime(callDuration)}</div>

          <div style={styles.actionGrid}>
            <button
              style={{ ...styles.actionBtn, ...(isMuted ? styles.actionBtnMuted : {}) }}
              onClick={() => setIsMuted(!isMuted)}
            >
              <span style={styles.actionEmoji}>{isMuted ? '🔇' : '🎤'}</span>
              <span style={styles.actionLabel}>Mute</span>
            </button>

            <button
              style={{
                ...styles.actionBtn,
                ...(showDialpad ? styles.actionBtnActive : {}),
              }}
              onClick={() => setShowDialpad(!showDialpad)}
            >
              <span style={styles.actionEmoji}>🔢</span>
              <span style={styles.actionLabel}>Dialpad</span>
            </button>
          </div>

          <button style={styles.endCallBtn} onClick={handleEndCall}>
            📞
          </button>
        </div>

        {/* OVERLAY DIALPAD */}

        <div style={styles.dialpadOverlay}>
          <div style={styles.dialpadDisplay}>{dialpadNumber || ''}</div>
          <div style={styles.dialpadGrid}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
              <button
                key={num}
                style={styles.dialpadBtn}
                onClick={() => handleDialpadClick(num)}
              >
                {num}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            {/* Clear button (only shown if there’s input) */}
            {dialpadNumber && (
              <button
                style={{ ...styles.clearBtn, flex: 1 }}
                onClick={handleDialpadClear}
              >
                ← Clear
              </button>
            )}

            {/* Dial button */}
            <button
              style={{
                ...styles.clearBtn,
                flex: 1,
                background: dialpadNumber ? '#4ade80' : '#3a3a3a',
                color: dialpadNumber ? 'black' : '#888',
                fontWeight: 600,
                cursor: dialpadNumber ? 'pointer' : 'not-allowed',
              }}
              disabled={!dialpadNumber}
              onClick={() => {
                if (dialpadNumber) {
                  setCallStatus(`Dialing ${dialpadNumber}...`);
                  setShowDialpad(false);
                }
              }}
            >
              📞 Dial
            </button>

          </div>


          {/* 🆕 BACK BUTTON */}
          <button
            style={{ ...styles.clearBtn, background: '#3a3a3a', marginTop: '8px' }}
            onClick={() => setShowDialpad(false)}
          >
            ⬅ Back
          </button>
        </div>

      </div>
    </div>
  );
}
