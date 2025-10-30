import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "./helpAndSupport.css";
import api from "../../core/axios/axiosInstance";


const HelpAndSupport = () => {
  const [activeType, setActiveType] = useState("General");
  const [attachment, setAttachment] = useState(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [previewUrl, setPreviewUrl] = useState("");
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAttachment(file);
    if (file && file.type.startsWith("image/")) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("subject", subject);
      formData.append("emailaddresses", JSON.stringify([email]));
      formData.append("phonenumber", phone);
      formData.append("inquiryType", activeType);
      formData.append("message", message);
      formData.append("subscribe", subscribe);
      formData.append("apiType", "web");
      if (attachment) {
        formData.append("helpAndSupportAttachments", attachment);
      }

      const response = await api.post("/help-support/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess("Form submitted successfully!");
      setName("");
      setSubject("");
      setEmail("");
      setPhone("");
      setMessage("");
      setAttachment(null);
      setPreviewUrl("");
      setSubscribe(false);
      setActiveType("General");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to submit. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper" style={{background:"white", minHeight:"100vh"}}>
      <div className="content">
        <div className="row">
            <div className="col-md-12">
              <div className="card ">
                <div className="card-header mb-4">
       
            <div className="text-center mt-5">
              <h1 className="help-heading">You Have Questions, We Have Answers</h1>
              <p className="help-description">
                Discover experiences you won’t find anywhere else — thoughtfully
                designed to immerse you <span className="line-break" /> in the heart
                of the destination. Soulful stories waiting to be lived.
              </p>
            </div>
             </div>
            <div className="help-support-wrapper mb-5">
              <div className="help-right-section">
                {/* <h2>Tell Us What You Need</h2>
                <p>
                  Our team is ready to assist you with every detail, big or small.
                </p> */}
    
                <form className="help-form" onSubmit={handleSubmit}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  <div className="d-sm-flex">
                    <div className="custom-floating-label me-2" style={{ flex: 1 }}>
                      <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        name="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <label htmlFor="name">Name</label>
                    </div>
                    <div className="custom-floating-label" style={{ flex: 1 }}>
                      <input
                        type="text"
                        id="subject"
                        placeholder="I have a question about ..."
                        name="subject"
                        required
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                      <label htmlFor="subject">Subject</label>
                    </div>
                  </div>
                  <div className="d-sm-flex">
                    <div className="custom-floating-label me-2" style={{ flex: 1 }}>
                      <input
                        type="email"
                        id="email"
                        placeholder="john.doe@example.com"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                    <div className="mb-4" style={{ flex: 1 }}>
                      <PhoneInput
                        country={"ae"}
                        value={phone.replace("+", "")}
                        onChange={(value) => setPhone("+" + value)}
                        enableSearch
                        inputProps={{ name: "phone" }}
                        inputStyle={{ background: "#fff", fontSize: 14 }}
                      />
                    </div>
                  </div>
    
                  <div className="help-inquiry">
                    <label style={{ fontWeight: "bold" }}>Type of Inquiry</label>
                    <div className="help-tag-group">
                      {[
                        "General",
                        "Billing & Subscription",
                        "Support",
                        "Bug Report",
                        "Others",
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className={`help-tag-button ${
                            activeType === tag ? "active" : ""
                          }`}
                          onClick={() => setActiveType(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
    
                  <textarea
                    className="help-textarea"
                    placeholder="Message"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
    
                  <div className="help-attachment-wrapper">
                    <label
                      htmlFor="fileUpload"
                      className="help-attachment-btn flex-wrap-none text-nowrap "
                    >
                      Attach File
                    </label>
                    <input
                      id="fileUpload"
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {attachment && (
                      <span className="help-file-name">{attachment.name}</span>
                    )}
                    {previewUrl && (
                      <div className="help-image-preview" style={{ marginTop: 8 }}>
                        <img
                          src={previewUrl}
                          alt="Preview"
                          style={{
                            maxWidth: "120px",
                            maxHeight: "120px",
                            borderRadius: 8,
                            border: "1px solid #eee",
                          }}
                        />
                      </div>
                    )}
                  </div>
    
                  <div className="help-checkbox">
                    <input
                      type="checkbox"
                      id="updates"
                      checked={subscribe}
                      onChange={(e) => setSubscribe(e.target.checked)}
                    />
                    <label htmlFor="updates" className="ms-2">
                      I'd like to receive exclusive offers & updates
                    </label>
                  </div>
    
                  <button
                    type="submit"
                    className="help-submit-btn"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
       
      </div>
    </div>
    </div>
    </div>
    </div>
    
  );
};

export default HelpAndSupport;
