import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Avatar,
  Statistic,
  Space,
  Progress,
  Modal,
  Input,
  Button,
  message as antMessage,
} from "antd";
import {
  IoCall,
  IoCallOutline,
  IoCard,
  IoPerson,
  IoTrendingUp,
  IoTrendingDown,
  IoAlertCircle,
  IoTime,
} from "react-icons/io5";
import ReactApexChart from "react-apexcharts";
import { useSelector, useDispatch } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import api from "../../../core/axios/axiosInstance";
import { fetchProfile } from "../../../core/data/redux/slices/ProfileSlice";
import "./UserDashboard.css";

const { Title, Text } = Typography;

const UserDashboard = () => {
  // Get user data from Redux ProfileSlice
  const profile = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  // Welcome modal state
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [welcomeFormData, setWelcomeFormData] = useState({
    firstname: "",
    lastname: "",
    phonenumber: "",
  });

  // Check if profile is incomplete (any of the three fields missing)
  useEffect(() => {
    const hasFirstname = profile.firstname && profile.firstname.trim() !== "";
    const hasLastname = profile.lastname && profile.lastname.trim() !== "";
    const hasPhone = profile.phonenumbers && profile.phonenumbers.length > 0;

    // Show modal if ANY of the three are missing
    if ((!hasFirstname || !hasLastname || !hasPhone) && !profile.isLoading) {
      setShowWelcomeModal(true);

      // Pre-fill existing values
      let phoneValue = "";
      if (hasPhone) {
        const phoneData = profile.phonenumbers[0];
        // Check if it's an object with countryCode and number, or just a string
        if (
          typeof phoneData === "object" &&
          phoneData.countryCode &&
          phoneData.number
        ) {
          phoneValue = `${phoneData.countryCode}${phoneData.number}`;
        } else if (typeof phoneData === "string") {
          phoneValue = phoneData;
        }
      }

      setWelcomeFormData({
        firstname: profile.firstname || "",
        lastname: profile.lastname || "",
        phonenumber: phoneValue,
      });
    }
  }, [profile]);

  // User information from Redux with fallback
  const userInfo = {
    name:
      profile.firstname && profile.lastname
        ? `${profile.firstname} ${profile.lastname}`
        : profile.email || "User",
    firstname: profile.firstname || "",
    lastname: profile.lastname || "",
    email: profile.email || "",
    avatar: profile.profileImageURL || null,
    yeastarExtensionId: profile.yeastarExtensionId, // This could come from profile or separate API
    role: profile.role || "User",
  };

  // Dashboard metrics state
  const [dashboardData, setDashboardData] = useState({
    inboundCalls: 127,
    outboundCalls: 89,
    creditsUsed: 456,
    totalCredits: 1000,
    inboundChange: 12.5,
    outboundChange: -3.2,
    creditsChange: 8.7,
  });

  // Monthly call data for charts
  const [monthlyCallData, setMonthlyCallData] = useState([
    { day: "1", inbound: 12, outbound: 8, credits: 25 },
    { day: "2", inbound: 15, outbound: 12, credits: 32 },
    { day: "3", inbound: 8, outbound: 15, credits: 28 },
    { day: "4", inbound: 18, outbound: 9, credits: 35 },
    { day: "5", inbound: 22, outbound: 14, credits: 42 },
    { day: "6", inbound: 19, outbound: 11, credits: 38 },
    { day: "7", inbound: 25, outbound: 16, credits: 45 },
    { day: "8", inbound: 14, outbound: 13, credits: 31 },
    { day: "9", inbound: 17, outbound: 10, credits: 34 },
    { day: "10", inbound: 21, outbound: 18, credits: 41 },
    { day: "11", inbound: 16, outbound: 7, credits: 29 },
    { day: "12", inbound: 20, outbound: 15, credits: 40 },
    { day: "13", inbound: 13, outbound: 12, credits: 30 },
    { day: "14", inbound: 24, outbound: 19, credits: 47 },
    { day: "15", inbound: 18, outbound: 14, credits: 36 },
    { day: "16", inbound: 16, outbound: 11, credits: 33 },
  ]);

  // Chart configurations
  const lineChartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: ["#52c41a", "#1890ff"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    xaxis: {
      categories: monthlyCallData.map((item) => `Oct ${item.day}`),
      title: {
        text: "October 2024",
      },
    },
    yaxis: {
      title: {
        text: "Number of Calls",
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 250,
          },
        },
      },
    ],
  };

  const lineChartSeries = [
    {
      name: "Inbound Calls",
      data: monthlyCallData.map((item) => item.inbound),
    },
    {
      name: "Outbound Calls",
      data: monthlyCallData.map((item) => item.outbound),
    },
  ];

  const areaChartOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: {
        show: false,
      },
    },
    colors: ["#fa8c16"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    xaxis: {
      categories: monthlyCallData.map((item) => `Oct ${item.day}`),
    },
    yaxis: {
      title: {
        text: "Credits Used",
      },
    },
  };

  const areaChartSeries = [
    {
      name: "Credits Used",
      data: monthlyCallData.map((item) => item.credits),
    },
  ];

  const pieChartOptions = {
    chart: {
      type: "pie",
      height: 350,
    },
    colors: ["#52c41a", "#ff4d4f", "#faad14"],
    labels: ["Successful Calls", "Missed Calls", "Busy/No Answer"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const pieChartSeries = [65, 20, 15];

  // Get current date and time
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate total credits percentage
  const creditsPercentage = Math.round(
    (dashboardData.creditsUsed / dashboardData.totalCredits) * 100
  );

  // Handle welcome form input changes
  const handleWelcomeFormChange = (e) => {
    const { name, value } = e.target;
    setWelcomeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle phone input change
  const handleWelcomePhoneChange = (value) => {
    setWelcomeFormData((prev) => ({
      ...prev,
      phonenumber: value,
    }));
  };

  // Submit welcome form
  const handleWelcomeFormSubmit = async () => {
    // Validate fields
    if (!welcomeFormData.firstname.trim()) {
      antMessage.error("Please enter your first name");
      return;
    }
    if (!welcomeFormData.lastname.trim()) {
      antMessage.error("Please enter your last name");
      return;
    }
    if (
      !welcomeFormData.phonenumber ||
      welcomeFormData.phonenumber.length < 10
    ) {
      antMessage.error("Please enter a valid phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.put("/editProfile", {
        firstname: welcomeFormData.firstname,
        lastname: welcomeFormData.lastname,
        phonenumber: welcomeFormData.phonenumber,
        apiType: "web",
      });

      if (response.data.status === "success") {
        antMessage.success("Profile completed successfully!");
        // Refresh profile data
        await dispatch(fetchProfile({}));
        setShowWelcomeModal(false);
      } else {
        antMessage.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      antMessage.error(
        error.response?.data?.message ||
          "Error updating profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Welcome Modal */}
      <Modal
        title={
          <div style={{ textAlign: "center", paddingTop: "10px" }}>
            <h3 style={{ margin: 0, color: "#1890ff" }}>
              👋 Welcome to VoycellCallCenter!
            </h3>
          </div>
        }
        open={showWelcomeModal}
        closable={false}
        maskClosable={false}
        keyboard={false}
        footer={null}
        width={500}
        zIndex={10000}
      >
        <div style={{ padding: "20px 0" }}>
          <Text
            style={{
              display: "block",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Let's complete your profile to get started
          </Text>

          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                First Name <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                size="large"
                name="firstname"
                value={welcomeFormData.firstname}
                onChange={handleWelcomeFormChange}
                placeholder="Enter your first name"
                maxLength={50}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Last Name <span style={{ color: "red" }}>*</span>
              </label>
              <Input
                size="large"
                name="lastname"
                value={welcomeFormData.lastname}
                onChange={handleWelcomeFormChange}
                placeholder="Enter your last name"
                maxLength={50}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "500",
                }}
              >
                Phone Number <span style={{ color: "red" }}>*</span>
              </label>
              <PhoneInput
                country={"ae"}
                value={welcomeFormData.phonenumber}
                onChange={handleWelcomePhoneChange}
                enableSearch
                inputProps={{
                  name: "phone",
                  required: true,
                }}
                inputStyle={{
                  height: "40px",
                  border: "1px solid #d9d9d9",
                  borderRadius: "4px",
                  width: "100%",
                  paddingLeft: "48px",
                  fontSize: "14px",
                }}
                buttonStyle={{
                  border: "1px solid #d9d9d9",
                  borderRight: "none",
                  height: "40px",
                  backgroundColor: "transparent",
                }}
                containerStyle={{ width: "100%" }}
              />
            </div>

            <Button
              type="primary"
              size="large"
              block
              onClick={handleWelcomeFormSubmit}
              loading={isSubmitting}
              style={{ marginTop: "10px" }}
            >
              Continue to Dashboard
            </Button>
          </Space>
        </div>
      </Modal>

      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  {/* Header Section */}
                  <div className="row align-items-center">
                    <div className="col-sm-12">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="page-header mb-0">
                          <div className="row align-items-center">
                            <h4 className="page-title mb-0">Dashboard</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body">
                  <div className="user-dashboard">
                    {/* Data Cards Row */}
                    <Row gutter={[34, 34]} className="data-cards-row mb-4">
                      <Col xs={24} sm={24} lg={24}>
                        <div className="d-flex align-items-center">
                          <Space size="middle" align="start">
                            <Avatar
                              size={48}
                              style={{
                                backgroundColor: "#1890ff",
                                fontSize: "18px",
                                fontWeight: "bold",
                              }}
                            >
                              {userInfo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </Avatar>
                            <div className="user-info">
                              <Text className="welcome-text">
                                Welcome back,{" "}
                                {userInfo.firstname || userInfo.name}!
                              </Text>

                              <Text
                                type="secondary"
                                style={{
                                  fontSize: "14px",
                                  marginBottom: "5px",
                                }}
                              >
                                Yeastar Extension ID:{" "}
                                <span className=" fw-bold text-purple">
                                  {userInfo.yeastarExtensionId}
                                </span>
                              </Text>
                              <Text type="secondary" className="current-date">
                                {currentDate} • {currentTime}
                              </Text>
                            </div>
                          </Space>

                          <Space direction="vertical" size="small"></Space>
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={[24, 24]} className="data-cards-row mb-4">
                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          className="metric-card inbound-card"
                          hoverable
                          styles={{
                            body: { padding: "24px" },
                          }}
                        >
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            <div className="metric-header">
                              <IoCall
                                size={24}
                                className="metric-icon inbound-icon"
                              />
                              <Text type="secondary" className="metric-label">
                                Inbound Calls
                              </Text>
                            </div>
                            <Statistic
                              value={dashboardData.inboundCalls}
                              precision={0}
                              className="metric-value"
                              valueStyle={{
                                color: "#52c41a",
                                fontSize: "28px",
                              }}
                            />
                            <div className="metric-change">
                              <IoTrendingUp
                                size={16}
                                className="trend-icon positive"
                              />
                              <Text className="change-text positive">
                                +{dashboardData.inboundChange}% from last month
                              </Text>
                            </div>
                          </Space>
                        </Card>
                      </Col>

                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          className="metric-card outbound-card"
                          hoverable
                          styles={{
                            body: { padding: "24px" },
                          }}
                        >
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            <div className="metric-header">
                              <IoCallOutline
                                size={24}
                                className="metric-icon outbound-icon"
                              />
                              <Text type="secondary" className="metric-label">
                                Outbound Calls
                              </Text>
                            </div>
                            <Statistic
                              value={dashboardData.outboundCalls}
                              precision={0}
                              className="metric-value"
                              valueStyle={{
                                color: "#1890ff",
                                fontSize: "28px",
                              }}
                            />
                            <div className="metric-change">
                              <IoTrendingDown
                                size={16}
                                className="trend-icon negative"
                              />
                              <Text className="change-text negative">
                                {dashboardData.outboundChange}% from last month
                              </Text>
                            </div>
                          </Space>
                        </Card>
                      </Col>

                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          className="metric-card credits-card"
                          hoverable
                          styles={{
                            body: { padding: "24px" },
                          }}
                        >
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            <div className="metric-header">
                              <IoCard
                                size={24}
                                className="metric-icon credits-icon"
                              />
                              <Text type="secondary" className="metric-label">
                                Credits Used
                              </Text>
                            </div>
                            <div className="credits-display">
                              <Statistic
                                value={dashboardData.creditsUsed}
                                precision={0}
                                className="metric-value"
                                valueStyle={{
                                  color: "#fa8c16",
                                  fontSize: "28px",
                                }}
                              />
                              <Text type="secondary" className="credits-total">
                                / {dashboardData.totalCredits}
                              </Text>
                            </div>
                            <div className="metric-change">
                              <Progress
                                percent={creditsPercentage}
                                showInfo={false}
                                strokeColor="#fa8c16"
                                trailColor="#f0f0f0"
                                size="small"
                              />
                              <Text className="change-text">
                                {creditsPercentage}% utilized
                              </Text>
                            </div>
                          </Space>
                        </Card>
                      </Col>

                      <Col xs={24} sm={12} lg={6}>
                        <Card
                          className="metric-card total-card"
                          hoverable
                          styles={{
                            body: { padding: "24px" },
                          }}
                        >
                          <Space
                            direction="vertical"
                            size="small"
                            style={{ width: "100%" }}
                          >
                            <div className="metric-header">
                              <IoAlertCircle
                                size={24}
                                className="metric-icon total-icon"
                              />
                              <Text type="secondary" className="metric-label">
                                Total Calls
                              </Text>
                            </div>
                            <Statistic
                              value={
                                dashboardData.inboundCalls +
                                dashboardData.outboundCalls
                              }
                              precision={0}
                              className="metric-value"
                              valueStyle={{
                                color: "#722ed1",
                                fontSize: "28px",
                              }}
                            />
                            <div className="metric-change">
                              <IoTrendingUp
                                size={16}
                                className="trend-icon positive"
                              />
                              <Text className="change-text positive">
                                +
                                {Math.round(
                                  (dashboardData.inboundChange +
                                    Math.abs(dashboardData.outboundChange)) /
                                    2
                                )}
                                % overall growth
                              </Text>
                            </div>
                          </Space>
                        </Card>
                      </Col>
                    </Row>

                    {/* Charts Section */}
                    <Row gutter={[24, 24]} className="charts-section">
                      {/* Daily Calls Over Time */}
                      <Col xs={24} lg={16}>
                        <Card
                          title="Daily Activity Overview"
                          className="chart-card"
                          extra={
                            <Text type="secondary" className="chart-period">
                              October 2024
                            </Text>
                          }
                        >
                          <ReactApexChart
                            options={lineChartOptions}
                            series={lineChartSeries}
                            type="line"
                            height={350}
                          />
                        </Card>
                      </Col>

                      {/* Call Distribution */}
                      <Col xs={24} lg={8}>
                        <Card title="Call Success Rate" className="chart-card">
                          <ReactApexChart
                            options={pieChartOptions}
                            series={pieChartSeries}
                            type="pie"
                            height={350}
                          />
                        </Card>
                      </Col>

                      {/* Credits Usage Over Time */}
                      <Col xs={24}>
                        <Card
                          title="Credits Usage Trend"
                          className="chart-card"
                        >
                          <ReactApexChart
                            options={areaChartOptions}
                            series={areaChartSeries}
                            type="area"
                            height={300}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
