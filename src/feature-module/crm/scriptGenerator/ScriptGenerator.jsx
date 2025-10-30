import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Space,
  message,
  ColorPicker,
} from "antd";
import { CopyOutlined, CodeOutlined, PhoneOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import api from "../../../core/axios/axiosInstance";
import "./ScriptGenerator.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ScriptGenerator = () => {
  const profile = useSelector((state) => state.profile);

  // Form state
  const [formData, setFormData] = useState({
    themeColor: "#4CAF50",
    headingColor: "#000000",
    floatingButtonColor: "#ffd2c4",
    popupHeading: "📞 Request a Call Back",
    popupText: "Enter your phone number and we'll call you back in 30 seconds!",
    calltoaction: "📞 Call Me",
    allowedOrigin:"",
  });

  // Generated script state
  const [generatedScript, setGeneratedScript] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle color change from ColorPicker
  const handleColorChange = (field, color) => {
    // The color parameter from ColorPicker is an object, get hex value
    const hexColor = color.toHexString();
    setFormData((prev) => ({
      ...prev,
      [field]: hexColor,
    }));
  };

  // Generate script
  const handleGenerateScript = async () => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/script/generate", formData);
      if (response.data) {
        const scriptText =
          typeof response.data === "string"
            ? response.data
            : response.data.script || response.data.scriptTag || "";

        if (scriptText) {
          setGeneratedScript(scriptText);
          message.success("Script generated successfully!");
        } else {
          message.error("Failed to generate script");
        }
      } else {
        message.error("Failed to generate script");
      }
    } catch (error) {
      console.error("Error generating script:", error);
      message.error("Error generating script. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy script to clipboard
  const handleCopyScript = () => {
    if (generatedScript) {
      navigator.clipboard.writeText(generatedScript);
      message.success("Script copied to clipboard!");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-sm-12">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="page-header mb-0">
                        <div className="row align-items-center">
                          <h4 className="page-title mb-0">
                            <CodeOutlined /> Script Generator
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <Row gutter={[24, 24]}>
                  {/* Left Column - Form */}
                  <Col xs={24} lg={12}>
                    <Card
                      title={
                        <Space>
                          <CodeOutlined />
                          <span>Script Configuration</span>
                        </Space>
                      }
                      bordered={false}
                    >
                      <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                      >
                        {/* Popup Heading */}
                        <div>
                          <Text strong>Popup Heading</Text>
                          <Input
                            size="large"
                            value={formData.popupHeading}
                            onChange={(e) =>
                              handleInputChange("popupHeading", e.target.value)
                            }
                            placeholder="Enter popup heading"
                            maxLength={100}
                            style={{ marginTop: 8 }}
                          />
                        </div>

                        {/* Popup Text */}
                        <div>
                          <Text strong>Popup Text</Text>
                          <TextArea
                            size="large"
                            value={formData.popupText}
                            onChange={(e) =>
                              handleInputChange("popupText", e.target.value)
                            }
                            placeholder="Enter popup description"
                            maxLength={200}
                            rows={3}
                            style={{ marginTop: 8 }}
                          />
                        </div>

                        {/* Call to Action */}
                        <div>
                          <Text strong>Call to Action Button</Text>
                          <Input
                            size="large"
                            value={formData.calltoaction}
                            onChange={(e) =>
                              handleInputChange("calltoaction", e.target.value)
                            }
                            placeholder="Enter button text"
                            maxLength={50}
                            style={{ marginTop: 8 }}
                          />
                        </div>
                        <div>
                          <Text strong>Website URL</Text>
                          <Input
                            size="large"
                            value={formData.allowedOrigin}
                            onChange={(e) =>
                              handleInputChange("allowedOrigin", e.target.value)
                            }
                            placeholder="https://example.com"
                            maxLength={50}
                            style={{ marginTop: 8 }}
                          />
                        </div>

                        {/* Theme Color */}
                        <div className="d-flex justify-content-around">
                          <div>
                          <Text strong>Theme Color</Text>
                          <div style={{ marginTop: 8 }}>
                            <ColorPicker
                              value={formData.themeColor}
                              onChange={(color) => handleColorChange("themeColor", color)}
                              showText
                              size="large"
                            />
                          </div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Selected: {formData.themeColor}
                          </Text>
                        </div>

                          <div>
                            <Text strong>Popup Heading Text Color</Text>
                            <div style={{ marginTop: 8 }}>
                              <ColorPicker
                                value={formData.headingColor}
                                onChange={(color) => handleColorChange("headingColor", color)}
                                showText
                                size="large"
                              />
                            </div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              Selected: {formData.headingColor}
                            </Text>
                          </div>
                          <div>
                            <Text strong>Floating Button Color</Text>
                            <div style={{ marginTop: 8 }}>
                              <ColorPicker
                                value={formData.floatingButtonColor}
                                onChange={(color) => handleColorChange("floatingButtonColor", color)}
                                showText
                                size="large"
                              />
                            </div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              Selected: {formData.floatingButtonColor}
                            </Text>
                          </div>
                        </div>

                        {/* Generate Button */}
                        <Button
                          type="primary"
                          size="large"
                          block
                          onClick={handleGenerateScript}
                          loading={isLoading}
                          icon={<CodeOutlined />}
                        >
                          Generate Script
                        </Button>

                        {/* Generated Script Display */}
                        {generatedScript && (
                          <div style={{ marginTop: 16 }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 8,
                              }}
                            >
                              <Text strong>Generated Script</Text>
                              <Button
                                type="default"
                                icon={<CopyOutlined />}
                                onClick={handleCopyScript}
                              >
                                Copy
                              </Button>
                            </div>
                            <TextArea
                              value={generatedScript}
                              readOnly
                              rows={6}
                              style={{
                                fontFamily: "monospace",
                                fontSize: "12px",
                                backgroundColor: "#f5f5f5",
                              }}
                            />
                          </div>
                        )}
                      </Space>
                    </Card>
                  </Col>

                  {/* Right Column - Preview */}
                  <Col xs={24} lg={12}>
                    <Card
                      title={
                        <Space>
                          <PhoneOutlined />
                          <span>Live Preview</span>
                        </Space>
                      }
                      bordered={false}
                    >
                      <div className="preview-container">
                        {/* Floating Button Preview */}
                        <div className="preview-description">
                          <Text type="secondary">
                            This is how the call button will appear on your
                            website:
                          </Text>
                        </div>

                        <div className="preview-button-wrapper">
                          <button
                            className="callme-btn-preview"
                            style={{
                              backgroundColor: formData.floatingButtonColor,
                            }}
                          >
                            📞
                          </button>
                        </div>

                        {/* Popup Modal Preview */}
                        <div
                          className="preview-description"
                          style={{ marginTop: 24 }}
                        >
                          <Text type="secondary">
                            This is how the popup will look when users click the
                            button:
                          </Text>
                        </div>

                        <div className="preview-popup">
                          <div className="callme-popup-preview">
                            <button
                              className="preview-close-btn"
                              style={{
                                position: "absolute",
                                right: "12px",
                                top: "10px",
                                border: "none",
                                background: "none",
                                fontSize: "22px",
                                color: "#999",
                                cursor: "pointer",
                                lineHeight: 1,
                              }}
                            >
                              ×
                            </button>
                            <h3
                              style={{
                                color: formData.headingColor,
                                fontSize: "22px",
                                margin: "0 0 8px",
                                fontWeight: "700",
                                marginBottom: "10px",
                              }}
                            >
                              {formData.popupHeading}
                            </h3>
                            <p
                              style={{
                                color: "#555",
                                margin: "0 0 18px",
                                fontSize: "15px",
                              }}
                            >
                              {formData.popupText}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                borderRadius: "10px",
                                border: "2px solid #eee",
                                overflow: "hidden",
                                marginBottom: "18px",
                              }}
                            >
                              <select
                                className="preview-select"
                                style={{
                                  padding: "12px",
                                  background: "#f7f7f7",
                                  border: "none",
                                  minWidth: "90px",
                                  cursor: "pointer",
                                }}
                              >
                                <option value="+971">🇦🇪 +971</option>
                              </select>
                              <input
                                type="tel"
                                className="preview-input"
                                placeholder="Enter phone number"
                                readOnly
                                style={{
                                  flex: 1,
                                  padding: "12px",
                                  border: "none",
                                  fontSize: "15px",
                                  outline: "none",
                                }}
                              />
                            </div>
                            <button
                              className="preview-action-btn"
                              style={{
                                width: "100%",
                                padding: "14px",
                                borderRadius: "10px",
                                border: "none",
                                backgroundColor: formData.themeColor,
                                color: "#fff",
                                fontWeight: "700",
                                fontSize: "16px",
                                cursor: "pointer",
                              }}
                            >
                              {formData.calltoaction}
                            </button>
                            <div
                              style={{
                                marginTop: "10px",
                                fontSize: "12px",
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                src="/favicon.ico"
                                alt="Voycell Logo"
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  marginRight: "5px",
                                  marginTop: "2px",
                                }}
                              />
                              Powered by Voycell.com
                            </div>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div style={{ marginTop: 24 }}>
                          <Text
                            strong
                            style={{ display: "block", marginBottom: 8 }}
                          >
                            How to Use:
                          </Text>
                          <ol style={{ paddingLeft: 20, margin: 0 }}>
                            <li>
                              <Text type="secondary">
                                Configure your popup settings above
                              </Text>
                            </li>
                            <li>
                              <Text type="secondary">
                                Click "Generate Script" to create the code
                              </Text>
                            </li>
                            <li>
                              <Text type="secondary">
                                Copy the generated script snippet
                              </Text>
                            </li>
                            <li>
                              <Text type="secondary">
                                Paste it in your website's HTML before the
                                closing <code>&lt;/body&gt;</code> tag
                              </Text>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptGenerator;
