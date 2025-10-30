import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Select, Card, Badge, Divider } from "antd";
import {
  CreditCardOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import api from "../../../core/axios/axiosInstance";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
// Embedded checkout components removed - using hosted checkout for Payment Options Modal
import "./upgradePlan.css";

const { Option } = Select;

// Load Stripe
// const stripePromise = loadStripe(
//   "pk_test_51JM78KBtOBT8b78eKkjaaXWTEBvsBvmV1VYV3kaRXVgjCYNVLUPK7MNPQEpHgdihSUOtPEfG8WPsVqoHgBBsev2600RynHqIML"
// );

// CheckoutForm component removed - using hosted checkout redirect for Payment Options Modal

const UpgradePlan = () => {
  const route = all_routes;
  const userProfile = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showNewSubscriptionModal, setShowNewSubscriptionModal] =
    useState(false);
  const [upgradePreview, setUpgradePreview] = useState(null);
  const [newSubscriptionPreview, setNewSubscriptionPreview] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [showCancelConfirmationModal, setShowCancelConfirmationModal] =
    useState(false);
  const [showDowngradeConfirmationModal, setShowDowngradeConfirmationModal] =
    useState(false);
  const [selectedDowngradePlan, setSelectedDowngradePlan] = useState(null);

  // Coupon-related state
  const [couponCode, setCouponCode] = useState("");
  const [couponValidation, setCouponValidation] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState(null);
  const [isRemovingCoupon, setIsRemovingCoupon] = useState(false);

  // Fetch plans on component mount
  useEffect(() => {
    fetchPlans();
    fetchPaymentMethods();
  }, []);
  console.log(subscriptionDetails, "sub details");
  console.log(userProfile, "user profile plan");

  // Fetch subscription details when user has a paid plan
  useEffect(() => {
    if (userProfile?.plan && userProfile.plan.name !== "Starter") {
      fetchSubscriptionDetails();
    }
  }, [userProfile]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await api.get("/plans/get");
      if (response.data.success) {
        setPlans(response.data.plans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      dispatch(
        showToast({
          type: "error",
          message: "Failed to load plans",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = () => {
    return userProfile?.plan;
  };

  const getCurrentPlanPrice = () => {
    return getCurrentPlan()?.price || 0;
  };

  const isCurrentPlan = (plan) => {
    const currentPlan = getCurrentPlan();
    return currentPlan && currentPlan._id === plan._id;
  };

  const canUpgrade = (plan) => {
    const currentPrice = getCurrentPlanPrice();
    return plan.price > currentPrice;
  };

  const isDowngrade = (plan) => {
    const currentPrice = getCurrentPlanPrice();
    return plan.price < currentPrice && plan.price > 0;
  };

  const isStarterPlan = (plan) => {
    return plan.price === 0 || plan.name.toLowerCase().includes("starter");
  };

  const isOnFreeTrial = () => {
    const currentPlan = getCurrentPlan();

    // Check if user is on Stripe subscription trial
    if (currentPlan?.isTrialing) {
      return true;
    }

    return false;
  };

  const isScheduledForDowngrade = (plan) => {
    // Check if this plan is already scheduled by comparing with scheduled plan info
    return subscriptionDetails?.scheduledPlan?.name === plan.name;
  };

  const fetchUpgradePreview = async (plan, couponCode = null) => {
    try {
      const payload = { planId: plan._id };
      if (couponCode) payload.couponCode = couponCode;

      const response = await api.post("/user/payment/preview-upgrade", payload);

      if (response.data.success) {
        return response.data.preview;
      } else {
        throw new Error(response.data.message || "Failed to fetch preview");
      }
    } catch (error) {
      console.error("Error fetching upgrade preview:", error);
      throw error;
    }
  };

  const fetchNewSubscriptionPreview = async (plan, couponCode = null) => {
    try {
      const payload = { planId: plan._id };
      if (couponCode) payload.couponCode = couponCode;

      const response = await api.post(
        "/user/payment/preview-new-subscription",
        payload
      );

      if (response.data.success) {
        return response.data.preview;
      } else {
        throw new Error(
          response.data.message || "Failed to fetch new subscription preview"
        );
      }
    } catch (error) {
      console.error("Error fetching new subscription preview:", error);
      throw error;
    }
  };

  const validateCouponCode = async (code) => {
    if (!code.trim()) {
      setCouponValidation(null);
      setCouponError(null);
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError(null);

      const response = await api.post("/user/payment/validate-coupon", {
        couponCode: code.trim(),
      });

      if (response.data.success) {
        setCouponValidation(response.data.coupon);
        setCouponError(null);
        return response.data.coupon;
      } else {
        setCouponValidation(null);
        setCouponError(response.data.message || "Invalid coupon code");
        return null;
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponValidation(null);
      setCouponError(
        error.response?.data?.message || "Failed to validate coupon"
      );
      return null;
    } finally {
      setCouponLoading(false);
    }
  };

  // Internal validation function that doesn't manage loading state
  const validateCouponCodeInternal = async (code) => {
    if (!code.trim()) {
      setCouponValidation(null);
      setCouponError(null);
      return null;
    }

    try {
      setCouponError(null);

      const response = await api.post("/user/payment/validate-coupon", {
        couponCode: code.trim(),
      });

      if (response.data.success) {
        setCouponValidation(response.data.coupon);
        setCouponError(null);
        return response.data.coupon;
      } else {
        setCouponValidation(null);
        setCouponError(response.data.message || "Invalid coupon code");
        return null;
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setCouponValidation(null);
      setCouponError(
        error.response?.data?.message || "Failed to validate coupon"
      );
      return null;
    }
  };

  const handleCouponChange = (value) => {
    setCouponCode(value);
    // Clear validation when user types (they need to click apply)
    if (couponValidation || couponError) {
      setCouponValidation(null);
      setCouponError(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      setCouponLoading(true);

      // First validate the coupon (without managing loading state)
      const couponData = await validateCouponCodeInternal(couponCode);

      if (couponData && selectedPlan) {
        // If valid, refresh the preview with coupon
        if (showNewSubscriptionModal) {
          const preview = await fetchNewSubscriptionPreview(
            selectedPlan,
            couponCode
          );
          console.log("New subscription preview with coupon:", preview);
          setNewSubscriptionPreview(preview);
        } else if (showUpgradeModal) {
          const preview = await fetchUpgradePreview(selectedPlan, couponCode);
          setUpgradePreview(preview);
        }
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      setCouponError("Failed to apply coupon. Please try again.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setCouponCode("");
    setCouponValidation(null);
    setCouponError(null);

    // Refresh preview without coupon
    if (selectedPlan) {
      try {
        setIsRemovingCoupon(true);
        setCouponLoading(true);
        if (showNewSubscriptionModal) {
          const preview = await fetchNewSubscriptionPreview(selectedPlan, null);
          console.log("New subscription preview without coupon:", preview);
          setNewSubscriptionPreview(preview);
        } else if (showUpgradeModal) {
          const preview = await fetchUpgradePreview(selectedPlan, null);
          setUpgradePreview(preview);
        }
      } catch (error) {
        console.error("Error refreshing preview:", error);
      } finally {
        setCouponLoading(false);
        setIsRemovingCoupon(false);
      }
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const response = await api.get("/user/payment/status");
      if (response.data.success) {
        return response.data.data.hasActiveSubscription;
      }
      return false;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  };

  const fetchCreditBalance = async () => {
    try {
      setLoadingCredits(true);
      const response = await api.get("/user/payment/credit-balance");

      if (response.data.success) {
        setCreditBalance(response.data.creditBalance);
      }
    } catch (error) {
      console.error("Error fetching credit balance:", error);
      dispatch(
        showToast({
          type: "error",
          message: "Failed to load credit balance",
        })
      );
    } finally {
      setLoadingCredits(false);
    }
  };

  const fetchPaymentMethods = async () => {
    setLoadingPaymentMethods(true);
    try {
      const response = await api.get("/user/payment/payment-methods");
      if (response.data.success) {
        setPaymentMethods(response.data.paymentMethods);
        // Set default payment method as selected
        const defaultMethod = response.data.paymentMethods.find(
          (pm) => pm.isDefault
        );
        if (defaultMethod) {
          setSelectedPaymentMethod(defaultMethod.id);
        } else if (response.data.paymentMethods.length > 0) {
          // If no default, select the first one
          setSelectedPaymentMethod(response.data.paymentMethods[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const fetchSubscriptionDetails = async () => {
    try {
      setLoadingSubscription(true);
      const response = await api.get("/user/payment/status");

      if (response.data.success) {
        setSubscriptionDetails(response.data.data.subscription);
      }
    } catch (error) {
      console.error("Error fetching subscription details:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const handleShowCancelConfirmation = () => {
    setShowCancelConfirmationModal(true);
  };

  const handleCancelConfirmationClose = () => {
    setShowCancelConfirmationModal(false);
  };

  const handleConfirmCancellation = async () => {
    try {
      setLoadingSubscription(true);
      setShowCancelConfirmationModal(false);

      const response = await api.post("/user/payment/toggle-auto-renewal");

      if (response.data.success) {
        dispatch(
          showToast({
            type: "success",
            message:
              response.data.message || "Subscription cancelled successfully",
          })
        );

        // Refresh subscription details
        await fetchSubscriptionDetails();
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      dispatch(
        showToast({
          type: "error",
          message:
            error.response?.data?.message || "Failed to cancel subscription",
        })
      );
    } finally {
      setLoadingSubscription(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString); // Convert from Unix timestamp
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatBillingPeriod = (period) => {
    if (!period) return "month"; // fallback

    // Handle different duration formats
    const periodMap = {
      monthly: "month",
      yearly: "year",
      annual: "year",
      weekly: "week",
      daily: "day",
      1: "month", // if period is just a number
      12: "year",
    };

    return periodMap[period.toLowerCase()] || period;
  };

  const isSubscriptionActive = () => {
    return subscriptionDetails && subscriptionDetails.status === "active";
  };

  const isCancelAtPeriodEnd = () => {
    return subscriptionDetails?.cancelAtPeriodEnd === true;
  };

  const formatScheduledDate = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to Date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleShowDowngradeConfirmation = (plan) => {
    setSelectedDowngradePlan(plan);
    setShowDowngradeConfirmationModal(true);
  };

  const handleDowngradeConfirmationClose = () => {
    setShowDowngradeConfirmationModal(false);
    setSelectedDowngradePlan(null);
  };

  const handleCancelUpgrade = () => {
    setShowUpgradeModal(false);
    setUpgradePreview(null);
    setSelectedPlan(null);
    setPaymentLoading(false);
    // Clear coupon state
    setCouponCode("");
    setCouponValidation(null);
    setCouponError(null);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
    // Refresh user profile to get updated plan
    // window.location.reload();
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedPlan(null);
  };

  const handleCancelNewSubscription = () => {
    setShowNewSubscriptionModal(false);
    setNewSubscriptionPreview(null);
    setSelectedPlan(null);
    setPaymentLoading(false);
    // Clear coupon state
    setCouponCode("");
    setCouponValidation(null);
    setCouponError(null);
  };

  const handleUpgrade = async (plan) => {
    try {
      setPaymentLoading(true);
      setSelectedPlan(plan);

      // Clear coupon state when selecting a new plan
      setCouponCode("");
      setCouponValidation(null);
      setCouponError(null);

      // Check if user has an active subscription via API
      const hasActiveSubscription = await checkSubscriptionStatus();
      const currentPlan = getCurrentPlan();
      const isOnTrial = isOnFreeTrial();

      // console.log("Detailed subscription check:", {
      //   currentPlan,
      //   currentPlanName: currentPlan?.name,
      //   hasActiveSubscription,
      //   isOnTrial,
      //   paymentMethodsCount: paymentMethods.length,
      //   subscriptionDetails: subscriptionDetails,
      //   subscriptionStatus: subscriptionDetails?.status,
      //   isSubscriptionActive: isSubscriptionActive(),
      //   hasActiveSubscriptionFromAPI: hasActiveSubscription,
      // });

      try {
        let preview;
        // Treat trialing subscriptions as new purchases, not upgrades
        if (hasActiveSubscription && !isOnTrial) {
          // Existing paid subscriber - use upgrade preview
          // console.log("Existing paid subscriber, fetching upgrade preview...");
          // console.log("Calling fetchUpgradePreview for plan:", plan.name);
          preview = await fetchUpgradePreview(plan);
          setUpgradePreview(preview);
          setShowUpgradeModal(true);
        } else {
          // New subscriber or trialing subscriber - check payment methods
          console.log(
            isOnTrial
              ? "Trialing subscriber, treating as new subscription..."
              : "New subscriber, fetching subscription preview from API..."
          );

          // Ensure payment methods are loaded
          let currentPaymentMethods = paymentMethods;
          if (paymentMethods.length === 0 && !loadingPaymentMethods) {
            console.log("Payment methods not loaded, fetching...");
            await fetchPaymentMethods();
            // After fetching, we need to get the updated payment methods from the API response
            // Since state update is async, let's fetch them directly here
            try {
              const pmResponse = await api.get("/user/payment/payment-methods");
              if (pmResponse.data.success) {
                currentPaymentMethods = pmResponse.data.paymentMethods;
                console.log(
                  "Fetched payment methods directly:",
                  currentPaymentMethods.length
                );
              }
            } catch (pmError) {
              console.error(
                "Error fetching payment methods directly:",
                pmError
              );
            }
          }

          // If user has no payment methods, use embedded checkout
          if (currentPaymentMethods.length === 0) {
            console.log(
              "No payment methods found, creating embedded checkout session..."
            );

            // Create embedded checkout session
            const checkoutResponse = await api.post(
              "/user/payment/create-checkout-session",
              {
                planId: plan._id,
                autoRenewal: true,
              }
            );

            if (checkoutResponse.data.success) {
              console.log(
                "Navigating to embedded checkout page with session:",
                checkoutResponse.data.sessionId
              );

              // Navigate directly with session ID in URL
              navigate(
                `/embedded-checkout?session_id=${checkoutResponse.data.sessionId}`
              );
              return; // Exit the function as we're navigating
            } else {
              throw new Error(
                checkoutResponse.data.message ||
                  "Failed to create checkout session"
              );
            }
          } else {
            // User has payment methods, use new subscription modal
            console.log(
              "Payment methods available, using subscription modal..."
            );
            console.log(
              "Calling fetchNewSubscriptionPreview for plan:",
              plan.name
            );
            preview = await fetchNewSubscriptionPreview(plan);
            console.log(
              "New subscription preview fetched outside useEffect:",
              preview
            );
            setNewSubscriptionPreview(preview);
            setShowNewSubscriptionModal(true);
          }
        }

        setPaymentLoading(false); // Stop loading since we're showing modal
        return; // Exit here, actual upgrade happens after confirmation
      } catch (previewError) {
        console.error("Error fetching preview:", previewError);

        // If it's a "NO_ACTIVE_SUBSCRIPTION" error and we thought they had an active paid subscription,
        // fall back to fetching a new subscription preview
        if (
          previewError.response?.data?.code === "NO_ACTIVE_SUBSCRIPTION" &&
          hasActiveSubscription &&
          !isOnTrial
        ) {
          console.log(
            "Falling back to new subscription preview due to no active subscription found"
          );
          try {
            const preview = await fetchNewSubscriptionPreview(plan);
            setNewSubscriptionPreview(preview);
            setShowNewSubscriptionModal(true);
            setPaymentLoading(false);
            return;
          } catch (fallbackError) {
            console.error("Fallback preview also failed:", fallbackError);
          }
        }

        dispatch(
          showToast({
            type: "error",
            message:
              previewError.response?.data?.message ||
              "Failed to calculate upgrade cost",
          })
        );
        setPaymentLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error handling plan upgrade:", error);

      // Check if the error suggests we should use upgrade instead
      if (error.response?.data?.redirectToUpgrade) {
        dispatch(
          showToast({
            type: "info",
            message: "Detected existing subscription. Upgrading directly...",
          })
        );
        // Retry with different approach (this prevents infinite loops)
        try {
          const response = await api.post(
            "/user/payment/upgrade-subscription",
            {
              planId: plan._id,
              autoRenewal: true,
            }
          );

          if (response.data.success) {
            dispatch(
              showToast({
                type: "success",
                message:
                  response.data.message ||
                  `Successfully upgraded to ${plan.name}!`,
              })
            );
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        } catch (upgradeError) {
          console.error("Error with direct upgrade:", upgradeError);
          dispatch(
            showToast({
              type: "error",
              message:
                upgradeError.response?.data?.message ||
                "Failed to upgrade subscription",
            })
          );
        }
      } else {
        dispatch(
          showToast({
            type: "error",
            message:
              error.response?.data?.message || "Failed to process upgrade",
          })
        );
      }
    } finally {
      setPaymentLoading(false);
    }
  };
  const handleConfirmDowngrade = async () => {
    if (!selectedDowngradePlan) return;

    try {
      setPaymentLoading(true);
      setShowDowngradeConfirmationModal(false);

      const response = await api.post("/user/payment/downgrade-subscription", {
        planId: selectedDowngradePlan._id,
      });

      if (response.data.success) {
        dispatch(
          showToast({
            type: "success",
            message:
              response.data.message ||
              `Successfully scheduled downgrade to ${selectedDowngradePlan.name}. Change will take effect at the end of your current billing period.`,
          })
        );

        // Refresh page to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        dispatch(
          showToast({
            type: "error",
            message: response.data.message || "Failed to schedule downgrade",
          })
        );
      }
    } catch (error) {
      console.error("Error scheduling downgrade:", error);
      dispatch(
        showToast({
          type: "error",
          message:
            error.response?.data?.message || "Failed to schedule downgrade",
        })
      );
    } finally {
      setPaymentLoading(false);
      setSelectedDowngradePlan(null);
    }
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;

    try {
      setPaymentLoading(true);
      setShowUpgradeModal(false);

      let response;

      // Check if this is a new subscription or an upgrade
      if (upgradePreview && upgradePreview.isNewSubscription) {
        // New subscription - create subscription with payment method
        console.log("Creating new subscription with payment method...");

        // Need to charge payment method - use upgrade endpoint as it handles payment methods
        response = await api.post("/user/payment/upgrade-subscription", {
          planId: selectedPlan._id,
          autoRenewal: true,
          paymentMethodId: selectedPaymentMethod,
          ...(couponCode && { couponCode: couponCode.trim() }),
        });
      } else {
        // Existing subscription - upgrade
        console.log("Upgrading existing subscription...");
        response = await api.post("/user/payment/upgrade-subscription", {
          planId: selectedPlan._id,
          autoRenewal: true,
          paymentMethodId: selectedPaymentMethod,
          ...(couponCode && { couponCode: couponCode.trim() }),
        });
      }

      if (response.data.success) {
        const actionType =
          upgradePreview && upgradePreview.isNewSubscription
            ? "subscribed"
            : "upgraded";
        dispatch(
          showToast({
            type: "success",
            message:
              response.data.message ||
              `Successfully ${actionType} to ${selectedPlan.name}!`,
          })
        );

        // Refresh user profile to show updated plan
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        dispatch(
          showToast({
            type: "error",
            message: response.data.message || "Failed to process subscription",
          })
        );
      }
    } catch (error) {
      console.error("Error confirming upgrade:", error);
      dispatch(
        showToast({
          type: "error",
          message:
            error.response?.data?.message || "Failed to process subscription",
        })
      );
    } finally {
      setPaymentLoading(false);
      setUpgradePreview(null);
      setSelectedPlan(null);
    }
  };

  const handleConfirmNewSubscription = async () => {
    if (!selectedPlan || !selectedPaymentMethod || !newSubscriptionPreview) {
      showToast({
        type: "error",
        message: "Missing required information for subscription",
      });
      return;
    }

    try {
      setPaymentLoading(true);

      const response = await api.post(
        "/user/payment/create-subscription-with-payment-method",
        {
          planId: selectedPlan._id,
          paymentMethodId: selectedPaymentMethod,
          autoRenewal: true, // Default to true for new subscriptions
          ...(couponCode && { couponCode: couponCode.trim() }),
        }
      );

      if (response.data.success) {
        dispatch(
          showToast({
            type: "success",
            message:
              response.data.message ||
              `Successfully subscribed to ${selectedPlan.name}!`,
          })
        );

        // Close modal and refresh
        setShowNewSubscriptionModal(false);
        setNewSubscriptionPreview(null);
        setSelectedPlan(null);
        setPaymentLoading(false);

        // Refresh user profile to get updated plan
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        dispatch(
          showToast({
            type: "error",
            message: response.data.message || "Failed to subscribe to plan",
          })
        );
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
      dispatch(
        showToast({
          type: "error",
          message:
            error.response?.data?.message ||
            "An error occurred while subscribing to the plan",
        })
      );
    } finally {
      setPaymentLoading(false);
    }
  };
  const renderPlanCard = (plan) => (
    <div key={plan._id} className="col-lg-6 mb-4 overflow-visible">
      <div
        className={`card custom-card border overflow-visible ${
          isCurrentPlan(plan) ? "plan-card-current" : ""
        }`}
      >
        {isCurrentPlan(plan) && (
          <div className="ribbon ribbon-top-right z-2">
            <span>Current Plan</span>
          </div>
        )}

        <div className="card-body pb-0">
          <div className="text-center border-bottom pb-3 mb-3">
            <span className="fw-semibold">{plan.name}</span>
            <h5 className="d-flex align-items-end justify-content-center fw-bold mt-1">
              {plan.price === 0 ? (
                "FREE"
              ) : (
                <>
                  ${(plan.price / 100).toFixed(2)}
                  <span className="fs-14 fw-medium ms-2">
                    / {formatBillingPeriod(plan.pricePeriod || plan.duration)}
                  </span>
                </>
              )}
            </h5>
            <span className="text-muted">{plan.description}</span>
          </div>

          {/* Subscription Details for Current Plan */}
          {isCurrentPlan(plan) && plan.name !== "Starter" && (
            <div className="mb-3">
              {loadingSubscription ? (
                <div className="text-center py-3">
                  <Spinner size="sm" className="me-2" />
                  <small className="text-muted">Loading subscription...</small>
                </div>
              ) : subscriptionDetails ? (
                <Card
                  size="small"
                  className="subscription-info-card"
                  style={{
                    background:
                      "linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)",
                    border: "1px solid #e6f7ff",
                    borderRadius: "8px",
                  }}
                >
                  <div className="d-flex align-items-center mb-3">
                    <CalendarOutlined
                      className="text-primary me-2"
                      style={{ fontSize: "16px" }}
                    />
                    <span className="fw-semibold text-primary">
                      Subscription Status
                    </span>
                  </div>

                  <div className="row g-3">
                    {isCancelAtPeriodEnd() ? (
                      <>
                        <div className="col-12">
                          <div className="d-flex align-items-baseline">
                            <p className="text-muted me-2">Expires:</p>
                            <span
                              className="fw-semibold text-warning"
                              style={{ fontSize: "13px" }}
                            >
                              {formatDate(subscriptionDetails.currentPeriodEnd)}
                            </span>
                          </div>
                        </div>
                        <div className="col-12">
                          <div
                            className="d-flex align-items-center p-2 rounded"
                            style={{
                              background: "#fff7e6",
                              border: "1px solid #ffd591",
                            }}
                          >
                            <CloseCircleOutlined className="text-warning me-2" />
                            <small className="text-warning mb-0">
                              {subscriptionDetails.scheduledPlan
                                ? `Plan will downgrade to ${subscriptionDetails.scheduledPlan.name} at the end of this period.`
                                : "Plan will expire at the end of this period. Renew to continue premium features."}
                            </small>
                          </div>
                        </div>
                      </>
                    ) : (
                      // For card-paid subscriptions (auto-renewal)
                      <>
                        <div className="col-12">
                          <div className="d-flex align-items-baseline">
                            <p className="text-muted me-2">Next billing:</p>
                            <span
                              className="fw-semibold text-success"
                              style={{ fontSize: "13px" }}
                            >
                              {formatDate(subscriptionDetails.currentPeriodEnd)}
                            </span>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-baseline">
                              <p className="text-muted me-2">Auto-renewal:</p>
                              <Badge
                                status={
                                  !subscriptionDetails.cancelAtPeriodEnd
                                    ? "success"
                                    : "error"
                                }
                                text={
                                  !subscriptionDetails.cancelAtPeriodEnd
                                    ? "ENABLED"
                                    : "DISABLED"
                                }
                              />
                            </div>
                          </div>

                          {subscriptionDetails.cancelAtPeriodEnd && (
                            <div
                              className="d-flex align-items-center p-2 rounded mt-2"
                              style={{
                                background: "#e6f7ff",
                                border: "1px solid #91d5ff",
                              }}
                            >
                              <CheckCircleOutlined className="text-info me-2" />
                              <small className="text-info mb-0">
                                Auto-renewal is disabled. Your subscription will
                                end on{" "}
                                {formatDate(
                                  subscriptionDetails.currentPeriodEnd
                                )}
                                .
                              </small>
                            </div>
                          )}
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-baseline">
                              <p className="text-muted me-2">Status:</p>
                              <Badge
                                status={
                                  subscriptionDetails.status === "active"
                                    ? "success"
                                    : "warning"
                                }
                                text={subscriptionDetails.status?.toUpperCase()}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              ) : (
                <Card size="small" className="alert-card">
                  <div className="d-flex align-items-center">
                    <CheckCircleOutlined className="text-info me-2" />
                    <small className="mb-0">
                      No active subscription found.
                    </small>
                  </div>
                </Card>
              )}
            </div>
          )}

          <div className="d-block">
            <div>
              {plan.features?.map((feature, index) => (
                <p
                  key={index}
                  className="d-flex fs-12 fw-medium text-dark mb-2"
                >
                  <span
                    className={`mt-1 d-flex align-items-center justify-content-center fs-12 wh-14 me-1 rounded ${
                      feature.isAvailable ? "bg-success" : "bg-danger"
                    }`}
                  >
                    <i
                      className={`ti ${
                        feature.isAvailable ? "ti-check" : "ti-x"
                      }`}
                    />
                  </span>
                  {feature.text}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mb-3">
          {isCurrentPlan(plan) ? (
            isOnFreeTrial() ? (
              <Button variant="primary" disabled className="px-4">
                <CheckCircleOutlined className="me-1" />
                Free Trial
              </Button>
            ) : plan.name !== "Starter" &&
              subscriptionDetails &&
              !subscriptionDetails.cancelAtPeriodEnd ? (
              <Button
                variant="outline-danger"
                onClick={handleShowCancelConfirmation}
                disabled={loadingSubscription}
                className="px-4"
              >
                {loadingSubscription ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CloseCircleOutlined className="me-1" />
                    Cancel Subscription
                  </>
                )}
              </Button>
            ) : (
              <Button variant="success" disabled className="px-4">
                <CheckCircleOutlined className="me-1" />
                Current Plan
              </Button>
            )
          ) : isStarterPlan(plan) ? (
            <Button variant="outline-secondary" disabled className="px-4">
              Basic Plan
            </Button>
          ) : isDowngrade(plan) ? (
            isScheduledForDowngrade(plan) ? (
              <Button variant="outline-success" disabled className="px-4">
                <CheckCircleOutlined className="me-1" />
                {subscriptionDetails.scheduledPlan.startDate
                  ? `Starts ${formatScheduledDate(
                      subscriptionDetails.scheduledPlan.startDate
                    )}`
                  : "Scheduled"}
              </Button>
            ) : (
              <Button
                variant="outline-warning"
                onClick={() => handleShowDowngradeConfirmation(plan)}
                disabled={paymentLoading}
                className="px-4"
              >
                {paymentLoading && selectedDowngradePlan?._id === plan._id ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ArrowDownOutlined className="me-1" />
                    Downgrade
                  </>
                )}
              </Button>
            )
          ) : canUpgrade(plan) ? (
            <Button
              variant="primary"
              onClick={() => handleUpgrade(plan)}
              disabled={paymentLoading}
              className="px-4"
            >
              {paymentLoading && selectedPlan?._id === plan._id ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Loading...
                </>
              ) : (
                "Upgrade"
              )}
            </Button>
          ) : (
            <Button variant="outline-secondary" disabled className="px-4">
              Not Available
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div
            className="d-flex flex-column justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <Spinner animation="border" role="status" className="mb-3">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="text-muted">{"Loading..."}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
              

                <div className="col-xl-12 col-lg-12">
                  {/* Settings Info */}
                  <div className="card">
                    <div className="card-body pb-0">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-semibold mb-0">Upgrade Plan</h5>
                        {getCurrentPlan() && (
                          <div className="text-end">
                            <small className="text-muted">
                              {isOnFreeTrial()
                                ? "Current Trial:"
                                : "Current Plan:"}
                            </small>
                            <div
                              className={`fw-semibold ${
                                isOnFreeTrial()
                                  ? "text-warning"
                                  : "text-success"
                              }`}
                            >
                              {isOnFreeTrial() && "Free Trial: "}
                              {getCurrentPlan().name}
                            </div>
                            {isOnFreeTrial() && userProfile?.trialEndDate && (
                              <small className="text-muted d-block">
                                {(() => {
                                  const now = new Date();
                                  const trialEnd = new Date(
                                    userProfile.trialEndDate
                                  );
                                  const daysLeft = Math.max(
                                    0,
                                    Math.ceil(
                                      (trialEnd - now) / (1000 * 60 * 60 * 24)
                                    )
                                  );
                                  return daysLeft > 0
                                    ? `${daysLeft} days left`
                                    : "Expired";
                                })()}
                              </small>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="row justify-content-center">
                        {plans.map(renderPlanCard)}
                      </div>
                    </div>
                  </div>
                  {/* /Settings Info */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Options Modal */}
      <Modal
        show={showPaymentModal}
        onHide={handlePaymentCancel}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Choose Payment Method</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlan && (
            <div>
              <div className="mb-3 d-flex justify-content-between align-items-start">
                <div>
                  <h5>Subscribe to {selectedPlan.name}</h5>
                  <p className="text-muted mb-0">
                    Amount: ${(selectedPlan.price / 100).toFixed(2)}/month
                  </p>
                </div>
                <div className="text-end">
                  <p className="text-muted d-block mb-1">
                    Current Credits:{" "}
                    <span className="fw-semibold text-primary">
                      ${(creditBalance / 100).toFixed(2)}
                    </span>
                  </p>

                  <p className="text-muted d-block mb-1">
                    Credits Deduction:{" "}
                    <span className="fw-semibold text-danger">
                      -$
                      {creditBalance < selectedPlan.price
                        ? creditBalance?.toFixed(2)
                        : (selectedPlan.price / 100).toFixed(2)}
                    </span>
                  </p>

                  <p className="text-muted mb-0">
                    Credit Balance after: {"  "}
                    {(creditBalance - selectedPlan.price) / 100 >= 0 ? (
                      <span className="fw-semibold text-success">
                        $
                        {((creditBalance - selectedPlan.price) / 100).toFixed(
                          2
                        )}
                      </span>
                    ) : (
                      <span className="fw-semibold ">
                        $
                        {Math.max(
                          (creditBalance - selectedPlan.price) / 100,
                          0
                        ).toFixed(2)}{" "}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {isOnFreeTrial() && (
                <div className="alert alert-warning mb-3">
                  <i className="ti ti-alert-triangle me-2"></i>
                  <strong>Important:</strong> Your current free trial will be
                  cancelled and replaced with this paid subscription.
                </div>
              )}

              {/* Tab Content */}
              <div className="tab-content">
                {/* This modal should not show for users without payment methods anymore */}
                {/* Users without payment methods will be redirected to hosted checkout */}
                <div className="text-center py-4">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  >
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-muted">
                    Redirecting to secure checkout...
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* New Subscription Modal */}
      <Modal
        show={showNewSubscriptionModal}
        onHide={handleCancelNewSubscription}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Subscribe to {selectedPlan?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {newSubscriptionPreview && selectedPlan && (
            <div>
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Subscription Summary</h6>
                <div className="row">
                  <div className="col-12">
                    <div className="card border border-primary">
                      <div className="card-body">
                        <h6 className="card-title text-muted">Selected Plan</h6>
                        <p className="mb-1 fw-semibold">{selectedPlan.name}</p>
                        <p className="mb-1 text-primary">
                          ${newSubscriptionPreview.plan.price.toFixed(2)}/month
                        </p>
                        <small className="text-muted">Billed monthly</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">
                  <i className="ti ti-ticket me-2"></i>
                  Promo Code
                </h6>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${
                      couponError
                        ? "is-invalid"
                        : couponValidation
                        ? "is-valid"
                        : ""
                    }`}
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => handleCouponChange(e.target.value)}
                    disabled={couponLoading || couponValidation}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleApplyCoupon();
                      }
                    }}
                  />
                  {couponValidation ? (
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={handleRemoveCoupon}
                      disabled={couponLoading}
                      title="Remove coupon"
                    >
                      <i className="ti ti-x"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                    >
                      {couponLoading ? (
                        <>
                          <div
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          {isRemovingCoupon ? "Removing..." : "Applying..."}
                        </>
                      ) : (
                        <>
                          <i className="ti ti-check me-1"></i>
                          Apply
                        </>
                      )}
                    </button>
                  )}
                </div>

                {couponError && (
                  <div className="text-danger mt-2 small">
                    <i className="ti ti-alert-circle me-1"></i>
                    {couponError}
                  </div>
                )}

                {couponValidation && (
                  <div className="alert alert-success mt-2 py-2 px-3">
                    <div className="d-flex align-items-center">
                      <i className="ti ti-check me-2"></i>
                      <div>
                        <strong>{couponValidation.name || couponCode}</strong>
                        <div className="small">
                          {couponValidation.discountType === "percentage"
                            ? `${couponValidation.discountValue}% off`
                            : `$${couponValidation.discountValue.toFixed(
                                2
                              )} off`}
                          {couponValidation.validUntil && (
                            <span className="text-muted">
                              {" "}
                              • Valid until{" "}
                              {new Date(
                                couponValidation.validUntil
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Billing Details</h6>
                {couponLoading ? (
                  <div className="border rounded p-3 bg-light text-center">
                    <div
                      className="spinner-border spinner-border-sm text-primary mb-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="text-muted small">
                      Updating pricing with coupon...
                    </div>
                  </div>
                ) : (
                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>
                        Remaining time on {selectedPlan.name}
                        {newSubscriptionPreview?.coupon &&
                          newSubscriptionPreview?.coupon?.isApplied && (
                            <span className="text-success">
                              {" "}
                              (with{" "}
                              {newSubscriptionPreview?.coupon?.discountType ===
                              "percentage"
                                ? `${newSubscriptionPreview?.coupon?.discountValue}%`
                                : `$${newSubscriptionPreview?.coupon?.discountValue.toFixed(
                                    2
                                  )}`}{" "}
                              off)
                            </span>
                          )}
                        {newSubscriptionPreview?.billing?.nextBillingDate && (
                          <span className="text-muted">
                            {" "}
                            after{" "}
                            {new Date().toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        :
                      </span>
                      <span className="fw-semibold text-dark">
                        ${newSubscriptionPreview?.plan?.finalPrice.toFixed(2)}
                      </span>
                    </div>

                    {newSubscriptionPreview.credits && (
                      <>
                        {newSubscriptionPreview.credits.availableCredits >
                          0 && (
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Available Stripe credits:</span>
                            <span className="fw-semibold text-info">
                              $
                              {newSubscriptionPreview.credits.availableCredits.toFixed(
                                2
                              )}
                            </span>
                          </div>
                        )}

                        {newSubscriptionPreview.credits.creditsToUse > 0 && (
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Stripe credits used:</span>
                            <span className="fw-semibold text-warning">
                              -$
                              {newSubscriptionPreview.credits.creditsToUse.toFixed(
                                2
                              )}
                            </span>
                          </div>
                        )}

                        <hr className="my-2" />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-semibold">Final charge:</span>
                          <span className="fw-bold text-primary fs-5">
                            $
                            {newSubscriptionPreview.credits.finalChargeAfterCredits.toFixed(
                              2
                            )}
                          </span>
                        </div>

                        {newSubscriptionPreview.credits
                          .finalChargeAfterCredits === 0 && (
                          <div className="alert alert-success py-2 px-3 mb-2">
                            <small>
                              <i className="ti ti-check me-1"></i>
                              Your subscription will be fully covered by
                              available credits!
                            </small>
                          </div>
                        )}

                        {newSubscriptionPreview.credits.creditsToUse > 0 &&
                          newSubscriptionPreview.credits
                            .remainingCreditsAfterPurchase >= 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>Stripe credits after purchase:</span>
                              <span className="fw-semibold text-info">
                                $
                                {newSubscriptionPreview.credits.remainingCreditsAfterPurchase.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          )}
                      </>
                    )}

                    <hr className="my-2" />

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Next billing date:</span>
                      <span>
                        {new Date(
                          newSubscriptionPreview.billing.nextBillingDate
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span>Next billing amount:</span>
                      <span className="fw-semibold">
                        $
                        {newSubscriptionPreview.billing.nextBillingAmount.toFixed(
                          2
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Method Selection for New Subscriptions */}

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">
                  <CreditCardOutlined className="me-2" />
                  Payment Method
                </h6>
                {loadingPaymentMethods ? (
                  <div className="text-center py-3">
                    <Spinner size="sm" className="me-2" />
                    Loading payment methods...
                  </div>
                ) : paymentMethods.length > 0 ? (
                  <div>
                    <Select
                      value={selectedPaymentMethod}
                      onChange={setSelectedPaymentMethod}
                      style={{ width: "100%" }}
                      size="large"
                      placeholder="Select a payment method"
                      suffixIcon={<CreditCardOutlined />}
                    >
                      {paymentMethods.map((method) => (
                        <Option key={method.id} value={method.id}>
                          <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="d-flex align-items-center">
                              <CreditCardOutlined className="me-2 text-primary" />
                              <div className="d-flex gap-3">
                                <span
                                  className="fw-semibold"
                                  style={{ fontSize: "12px" }}
                                >
                                  {method.card.brand.toUpperCase()} ••••{" "}
                                  {method.card.last4}
                                </span>
                                <span
                                  className="text-muted"
                                  style={{ fontSize: "11px" }}
                                >
                                  {method.card.exp_month
                                    .toString()
                                    .padStart(2, "0")}
                                  /{method.card.exp_year}
                                </span>
                                {method.isDefault && (
                                  <span
                                    className="text-success fw-semibold"
                                    style={{ fontSize: "11px" }}
                                  >
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </Option>
                      ))}
                    </Select>
                    <div className="mt-2">
                      <Link
                        to={route.biilingInfo}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <CreditCardOutlined className="me-1" />
                        Manage Payment Methods
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <i className="ti ti-alert-triangle me-2"></i>
                    No payment methods found. Please add a payment method to
                    continue.
                    <div className="mt-2">
                      <Link
                        to={route.biilingInfo}
                        className="btn btn-primary btn-sm"
                      >
                        <i className="ti ti-plus me-1"></i>
                        Add Payment Method
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {isOnFreeTrial() && (
                <div className="alert alert-warning mb-3">
                  <i className="ti ti-alert-triangle me-2"></i>
                  <strong>Important:</strong> Your current free trial will be
                  cancelled and replaced with this paid subscription.
                </div>
              )}
              {newSubscriptionPreview?.billing?.isFirstPurchase && (
                <div className="alert alert-info mb-3">
                  <i className="ti ti-alert-triangle me-2"></i>
                  <strong>First Purchase Notice:</strong> Credits cannot be used
                  on your first purchase. You'll be able to use credits for
                  future transactions.
                </div>
              )}

              <div className="alert alert-info">
                <i className="ti ti-info-circle me-2"></i>
                <strong>What happens next?</strong>
                <ul className="mb-0 mt-2">
                  {isOnFreeTrial() && (
                    <li>Your free trial will be cancelled immediately</li>
                  )}
                  <li>Your subscription will be activated immediately</li>
                  {newSubscriptionPreview.credits &&
                  newSubscriptionPreview.credits.finalChargeAfterCredits > 0 ? (
                    <li>
                      You'll be charged $
                      {newSubscriptionPreview.credits.finalChargeAfterCredits.toFixed(
                        2
                      )}{" "}
                      today (after applying available credits)
                    </li>
                  ) : newSubscriptionPreview.credits &&
                    newSubscriptionPreview.credits.finalChargeAfterCredits ===
                      0 ? (
                    <li>
                      No charge today - your subscription is fully covered by
                      available credits
                    </li>
                  ) : null}
                  <li>
                    Future billing will be $
                    {newSubscriptionPreview.billing.nextBillingAmount.toFixed(
                      2
                    )}
                    /month
                  </li>
                  <li>You can cancel or change your plan anytime</li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelNewSubscription}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmNewSubscription}
            disabled={
              paymentLoading ||
              (newSubscriptionPreview &&
                newSubscriptionPreview.credits &&
                newSubscriptionPreview.credits.finalChargeAfterCredits > 0 &&
                (!selectedPaymentMethod || paymentMethods.length === 0))
            }
          >
            {paymentLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              `Confirm Subscription${` - $${newSubscriptionPreview?.credits?.finalChargeAfterCredits?.toFixed(
                2
              )}`}`
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Upgrade Confirmation Modal */}
      <Modal
        show={showUpgradeModal}
        onHide={handleCancelUpgrade}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Upgrade to {selectedPlan?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {upgradePreview && selectedPlan && (
            <div>
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Upgrade Summary</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card border">
                      <div className="card-body">
                        <h6 className="card-title text-muted">Current Plan</h6>
                        <p className="mb-1 fw-semibold">
                          {upgradePreview.currentPlan.name}
                        </p>
                        <p className="mb-1 text-success">
                          ${upgradePreview.currentPlan.price.toFixed(2)}/month
                        </p>
                        <small className="text-muted">
                          Remaining value: $
                          {upgradePreview.currentPlan.remainingValue.toFixed(2)}
                        </small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border border-primary">
                      <div className="card-body">
                        <h6 className="card-title text-muted">New Plan</h6>
                        <p className="mb-1 fw-semibold">{selectedPlan.name}</p>
                        <p className="mb-1 text-primary">
                          ${upgradePreview.newPlan.price.toFixed(2)}/month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="mb-4">
                <h6 className="fw-semibold mb-3">
                  <i className="ti ti-ticket me-2"></i>
                  Promo Code
                </h6>
                <div className="input-group">
                  <input
                    type="text"
                    className={`form-control ${
                      couponError
                        ? "is-invalid"
                        : couponValidation
                        ? "is-valid"
                        : ""
                    }`}
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => handleCouponChange(e.target.value)}
                    disabled={couponLoading || couponValidation}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleApplyCoupon();
                      }
                    }}
                  />
                  {couponValidation ? (
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={handleRemoveCoupon}
                      disabled={couponLoading}
                      title="Remove coupon"
                    >
                      <i className="ti ti-x"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                    >
                      {couponLoading ? (
                        <>
                          <div
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          {isRemovingCoupon ? "Removing..." : "Applying..."}
                        </>
                      ) : (
                        <>
                          <i className="ti ti-check me-1"></i>
                          Apply
                        </>
                      )}
                    </button>
                  )}
                </div>

                {couponError && (
                  <div className="text-danger mt-2 small">
                    <i className="ti ti-alert-circle me-1"></i>
                    {couponError}
                  </div>
                )}

                {couponValidation && (
                  <div className="alert alert-success mt-2 py-2 px-3">
                    <div className="d-flex align-items-center">
                      <i className="ti ti-check me-2"></i>
                      <div>
                        <strong>{couponValidation.name || couponCode}</strong>
                        <div className="small">
                          {couponValidation.discountType === "percentage"
                            ? `${couponValidation.discountValue}% off`
                            : `$${couponValidation.discountValue.toFixed(
                                2
                              )} off`}
                          {couponValidation.validUntil && (
                            <span className="text-muted">
                              {" "}
                              • Valid until{" "}
                              {new Date(
                                couponValidation.validUntil
                              ).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <h6 className="fw-semibold mb-3">Billing Details</h6>
                {couponLoading ? (
                  <div className="border rounded p-3 bg-light text-center">
                    <div
                      className="spinner-border spinner-border-sm text-primary mb-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="text-muted small">
                      Updating pricing with coupon...
                    </div>
                  </div>
                ) : (
                  <div className="border rounded p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>
                        Remaining time on {selectedPlan.name}
                        {upgradePreview.coupon &&
                          upgradePreview.coupon.isApplied && (
                            <span className="text-success">
                              {" "}
                              (with{" "}
                              {upgradePreview.coupon.discountType ===
                              "percentage"
                                ? `${upgradePreview.coupon.discountValue}%`
                                : `$${upgradePreview.coupon.discountValue.toFixed(
                                    2
                                  )}`}{" "}
                              off)
                            </span>
                          )}
                        {upgradePreview.billing?.nextBillingDate && (
                          <span className="text-muted">
                            {" "}
                            after{" "}
                            {new Date().toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        :
                      </span>
                      <span className="fw-semibold text-dark">
                        ${upgradePreview.newPlan.immediateCharge.toFixed(2)}
                      </span>
                    </div>

                    {upgradePreview.billing.creditApplied > 0 && (
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Plan credit applied:</span>
                        <span className="fw-semibold text-success">
                          -${upgradePreview.billing.creditApplied.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {upgradePreview.credits && (
                      <>
                        {upgradePreview.credits.availableCredits > 0 && (
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Available Stripe credits:</span>
                            <span className="fw-semibold text-info">
                              $
                              {upgradePreview.credits.availableCredits.toFixed(
                                2
                              )}
                            </span>
                          </div>
                        )}

                        {upgradePreview.credits.creditsToUse > 0 && (
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Stripe credits used:</span>
                            <span className="fw-semibold text-warning">
                              -${upgradePreview.credits.creditsToUse.toFixed(2)}
                            </span>
                          </div>
                        )}

                        <hr className="my-2" />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="fw-semibold">Final charge:</span>
                          <span className="fw-bold text-primary fs-5">
                            $
                            {upgradePreview.credits.finalChargeAfterCredits.toFixed(
                              2
                            )}
                          </span>
                        </div>

                        {upgradePreview.credits.finalChargeAfterCredits ===
                          0 && (
                          <div className="alert alert-success py-2 px-3 mb-2">
                            <small>
                              <i className="ti ti-check me-1"></i>
                              Your upgrade will be fully covered by available
                              credits!
                            </small>
                          </div>
                        )}

                        {upgradePreview.credits.creditsToUse > 0 &&
                          upgradePreview.credits
                            .remainingCreditsAfterPurchase >= 0 && (
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span>Stripe credits after purchase:</span>
                              <span className="fw-semibold text-info">
                                $
                                {upgradePreview.credits.remainingCreditsAfterPurchase.toFixed(
                                  2
                                )}
                              </span>
                            </div>
                          )}
                      </>
                    )}

                    <hr className="my-2" />

                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>Next billing date:</span>
                      <span>
                        {new Date(
                          upgradePreview.billing.nextBillingDate
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <span>Next billing amount:</span>
                      <span className="fw-semibold">
                        ${upgradePreview.billing.nextBillingAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {!upgradePreview.isNewSubscription && upgradePreview.period && (
                <div className="mb-4">
                  <h6 className="fw-semibold mb-3">Billing Period</h6>
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted">
                        Days remaining in period:
                      </small>
                      <p className="mb-0 fw-semibold">
                        {upgradePreview.period.daysRemaining} days
                      </p>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">Period used:</small>
                      <p className="mb-0 fw-semibold">
                        {upgradePreview.period.percentUsed}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method Selection */}
              {upgradePreview.credits &&
                upgradePreview.credits.finalChargeAfterCredits > 0 && (
                  <div className="mb-4">
                    <h6 className="fw-semibold mb-3">
                      <CreditCardOutlined className="me-2" />
                      Payment Method
                    </h6>
                    {loadingPaymentMethods ? (
                      <div className="text-center py-3">
                        <Spinner size="sm" className="me-2" />
                        Loading payment methods...
                      </div>
                    ) : paymentMethods.length > 0 ? (
                      <div>
                        <Select
                          value={selectedPaymentMethod}
                          onChange={setSelectedPaymentMethod}
                          style={{ width: "100%" }}
                          size="large"
                          placeholder="Select a payment method"
                          suffixIcon={<CreditCardOutlined />}
                        >
                          {paymentMethods.map((method) => (
                            <Option key={method.id} value={method.id}>
                              <div className="d-flex align-items-center justify-content-between w-100">
                                <div className="d-flex align-items-center">
                                  <CreditCardOutlined className="me-2 text-primary" />
                                  <div className="d-flex gap-3">
                                    <span
                                      className="fw-semibold"
                                      style={{ fontSize: "12px" }}
                                    >
                                      {method.card.brand.toUpperCase()} ••••{" "}
                                      {method.card.last4}
                                    </span>
                                    <div
                                      className="text-muted"
                                      style={{ fontSize: "12px" }}
                                    >
                                      Expires{" "}
                                      {String(method.card.exp_month).padStart(
                                        2,
                                        "0"
                                      )}
                                      /{method.card.exp_year}
                                    </div>
                                  </div>
                                </div>
                                {method.isDefault && (
                                  <Badge
                                    color="green"
                                    text="Default"
                                    style={{ marginLeft: "auto" }}
                                  />
                                )}
                              </div>
                            </Option>
                          ))}
                        </Select>
                        <div className="mt-3">
                          <Link
                            to={route.biilingInfo}
                            className="btn btn-outline-primary btn-sm"
                          >
                            <CreditCardOutlined className="me-1" />
                            Manage Payment Methods
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-warning">
                        <i className="ti ti-alert-triangle me-2"></i>
                        No payment methods found. Please add a payment method to
                        continue.
                        <div className="mt-2">
                          <Link
                            to={route.biilingInfo}
                            className="btn btn-primary btn-sm"
                          >
                            <i className="ti ti-plus me-1"></i>
                            Add Payment Method
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              <div className="alert alert-info">
                <i className="ti ti-info-circle me-2"></i>
                <strong>What happens next?</strong>
                <ul className="mb-0 mt-2">
                  <li>Your plan will be upgraded immediately</li>
                  {upgradePreview.credits &&
                  upgradePreview.credits.finalChargeAfterCredits > 0 ? (
                    <li>
                      You'll be charged $
                      {upgradePreview.credits.finalChargeAfterCredits.toFixed(
                        2
                      )}{" "}
                      today (after applying available credits)
                    </li>
                  ) : upgradePreview.credits &&
                    upgradePreview.credits.finalChargeAfterCredits === 0 ? (
                    <li>
                      No charge today - your upgrade is fully covered by
                      available credits
                    </li>
                  ) : (
                    upgradePreview.billing.immediateCharge > 0 && (
                      <li>
                        You'll be charged $
                        {upgradePreview.billing.immediateCharge.toFixed(2)}{" "}
                        today for the prorated amount
                      </li>
                    )
                  )}
                  <li>
                    Future billing will be $
                    {upgradePreview.billing.nextBillingAmount.toFixed(2)}/month
                  </li>
                  <li>You can cancel or change your plan anytime</li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelUpgrade}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmUpgrade}
            disabled={
              paymentLoading ||
              (upgradePreview &&
                upgradePreview.credits &&
                upgradePreview.credits.finalChargeAfterCredits > 0 &&
                (!selectedPaymentMethod || paymentMethods.length === 0))
            }
          >
            {paymentLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Processing...
              </>
            ) : (
              `Confirm Upgrade${` - $${upgradePreview?.credits?.finalChargeAfterCredits?.toFixed(
                2
              )}`}`
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Cancel Subscription Confirmation Modal */}
      <Modal
        show={showCancelConfirmationModal}
        onHide={handleCancelConfirmationClose}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <CloseCircleOutlined className="me-2" />
            Cancel Subscription
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="mb-3">
              <CloseCircleOutlined
                style={{ fontSize: "48px", color: "#dc3545" }}
              />
            </div>
            <h5 className="mb-3">
              Are you sure you want to cancel your subscription?
            </h5>
            <p className="text-muted mb-4">
              This action will disable auto-renewal for your current plan.
              You'll continue to have access to premium features until your
              current billing period ends.
            </p>

            {subscriptionDetails && (
              <Card
                className="mb-4"
                style={{ background: "#f8f9fa" }}
                bodyStyle={{ padding: "12px 16px" }}
              >
                <div className="row text-start">
                  <div className="col-6">
                    <small className="text-muted">Current Plan:</small>
                    <div className="fw-semibold">{getCurrentPlan()?.name}</div>
                  </div>
                  <div className="col-6">
                    <small className="text-muted">Access Until:</small>
                    <div className="fw-semibold text-warning">
                      {formatDate(subscriptionDetails.currentPeriodEnd)}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <div className="alert alert-warning text-start">
              <strong>What happens after cancellation:</strong>
              <ul className="mb-0 mt-2">
                <li>
                  Your subscription will remain active until{" "}
                  {subscriptionDetails &&
                    formatDate(subscriptionDetails.currentPeriodEnd)}
                </li>
                <li>You won't be charged for the next billing cycle</li>

                <li>After expiration, you'll be moved to the Starter plan</li>
              </ul>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCancelConfirmationClose}
            disabled={loadingSubscription}
          >
            Keep Subscription
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmCancellation}
            disabled={loadingSubscription}
          >
            {loadingSubscription ? (
              <>
                <Spinner size="sm" className="me-2" />
                Cancelling...
              </>
            ) : (
              <>
                <CloseCircleOutlined className="me-1" />
                Yes, Cancel Subscription
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Downgrade Confirmation Modal */}
      <Modal
        show={showDowngradeConfirmationModal}
        onHide={handleDowngradeConfirmationClose}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-warning">
            <ArrowDownOutlined className="me-2" />
            Schedule Plan Downgrade
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDowngradePlan && (
            <div className="text-center mb-4">
              <div className="mb-3">
                <ArrowDownOutlined
                  style={{ fontSize: "48px", color: "#faad14" }}
                />
              </div>
              <h5 className="mb-3">
                Downgrade to {selectedDowngradePlan.name}?
              </h5>
              <p className="text-muted mb-4">
                Your plan will be downgraded at the end of your current billing
                period. You'll continue to have access to your current plan
                features until then.
              </p>

              {subscriptionDetails && (
                <Card
                  className="mb-4"
                  style={{ background: "#f8f9fa" }}
                  bodyStyle={{ padding: "12px 16px" }}
                >
                  <div className="row text-start">
                    <div className="col-6">
                      <small className="text-muted">Current Plan:</small>
                      <div className="fw-semibold">
                        {getCurrentPlan()?.name}
                      </div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">New Plan (from):</small>
                      <div className="fw-semibold text-warning">
                        {formatDate(subscriptionDetails.currentPeriodEnd)}
                      </div>
                    </div>
                  </div>
                  <div className="row text-start mt-2">
                    <div className="col-6">
                      <small className="text-muted">Current Price:</small>
                      <div className="fw-semibold text-success">
                        ${(getCurrentPlan()?.price / 100 || 0).toFixed(2)}/month
                      </div>
                    </div>
                    <div className="col-6">
                      <small className="text-muted">New Price:</small>
                      <div className="fw-semibold text-warning">
                        ${(selectedDowngradePlan.price / 100).toFixed(2)}/month
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <div className="alert alert-info text-start">
                <strong>What happens after scheduling downgrade:</strong>
                <ul className="mb-0 mt-2">
                  <li>
                    Your current plan remains active until{" "}
                    {subscriptionDetails &&
                      formatDate(subscriptionDetails.currentPeriodEnd)}
                  </li>
                  <li>
                    No immediate charges or changes to your current features
                  </li>
                  <li>
                    On{" "}
                    {subscriptionDetails &&
                      formatDate(subscriptionDetails.currentPeriodEnd)}
                    , you'll automatically switch to{" "}
                    {selectedDowngradePlan.name}
                  </li>
                  <li>
                    Future billing will be $
                    {(selectedDowngradePlan.price / 100).toFixed(2)}/month
                  </li>
                  <li>
                    You can upgrade again at any time before the change takes
                    effect
                  </li>
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleDowngradeConfirmationClose}
            disabled={paymentLoading}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handleConfirmDowngrade}
            disabled={paymentLoading}
          >
            {paymentLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Scheduling...
              </>
            ) : (
              <>
                <ArrowDownOutlined className="me-1" />
                Schedule Downgrade
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* /Page Wrapper */}
    </>
  );
};

export default UpgradePlan;
