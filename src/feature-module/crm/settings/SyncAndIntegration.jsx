import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { EmailAuthContext } from "../../../core/common/context/EmailAuthContext";
import { useSelector } from "react-redux";
const route = all_routes;
const SyncAndIntegration = () => {
  const [modalText, setModalText] = useState("");
  const iconMap = {
    google: "googleLogo.png",
    microsoft: "microsoftLogo.png",
    smtp: "smtpLogo.png",
  };
  const {
    googleSignIn,
    googleSignOut,
    microsoftSignIn,
    microsoftSignOut,
    smtpSignIn,
    smtpSignOut,
  } = useContext(EmailAuthContext);
  const userProfile = useSelector((state) => state.profile);
  console.log(userProfile,"userProfileuserProfile");
  
  const [formData, setFormData] = useState({
    SMTP_HOST: "",
    SMTP_PORT: "",
    SMTP_USER: "",
    SMTP_PASS: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const onGoogleDisconnect = () => {
    googleSignOut();
  };
  const onMicrosoftDisconnect = () => {
    microsoftSignOut();
  };
  const onSmtpDisconnect = () => {
    smtpSignOut();
  };

  const toggleHandlers = (account) => {
    if (account.type === "google") {
      if (account.isConnected) {
        setModalText("Google");
        document.getElementById("open-disconnect-modal").click();
      } else {
        googleSignIn();
      }
    }
    if (account.type === "microsoft") {
      if (account.isConnected) {
        setModalText("Microsoft");
        document.getElementById("open-disconnect-modal").click();
      } else {
        microsoftSignIn();
      }
    }
    if (account.type === "smtp") {
      if (account.isConnected) {
        setModalText("SMTP");
        document.getElementById("open-disconnect-modal").click();
      } else {
        document.getElementById("open-smtp-modal").click();
      }
    }
  };

  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                {/* <div className="col-xl-3 col-lg-12 theiaStickySidebar">
                  <div className="card">
                    <div className="card-body">
                      <div className="settings-sidebar">
                        <h4 className="fw-semibold mb-3">Settings</h4>
                        <div className="list-group list-group-flush settings-sidebar">
                          <Link to={route.profile} className="fw-medium">
                            Profile
                          </Link>
                          <Link to={route.security} className="fw-medium">
                            Security
                          </Link>
                          <Link
                            to={route.emailSetup}
                            className="fw-medium active"
                          >
                            Sync and Integration
                          </Link>
                          <Link
                            to={`${route.scans}#myScans`}
                            className="fw-medium"
                          >
                            My Scans
                          </Link>
                          <Link to={route.upgradePlan} className="fw-medium">
                            Upgrade Plan
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="col-xl-12 col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <h4 className="fw-semibold mb-3">Sync and integration</h4>
                      <div>
                        {/* <div className="row">
                          {userProfile?.accounts?.map((account, index) => {
                            const type = account.type.toLowerCase();
                            const isConnected = account.isConnected;
                            console.log(account, "account");
                            

                            return (
                              <div className="col-md-4 col-sm-6" key={index}>
                                <div className="card border mb-3">
                                  <div className="card-body pb-0">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                      <ImageWithBasePath
                                        src={`assets/img/icons/${iconMap[type]}`}
                                        width={50}
                                        alt={`${account.type} Icon`}
                                      />
                                      <div className="connect-btn">
                                        <Link
                                          to="#"
                                          className="badge badge-soft-success"
                                        >
                                          {isConnected
                                            ? "Connected"
                                            : "Not Connected"}
                                        </Link>
                                      </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between">
                                      <p className="mb-0 text-capitalize">
                                        {account.type}
                                      </p>
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          role="switch"
                                          checked={account.isConnected}
                                          onChange={() =>
                                            toggleHandlers(account)
                                          }
                                        />
                                      </div>
                                    </div>
                                    {account.email &&<p className="mb-0 text-muted mt-3">
                                      ({account.email})
                                    </p>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div> */}
                        <div className="row">
                          {userProfile?.accounts?.map((account, index) => {
                            const type = account.type.toLowerCase();
                            const isConnected = account.isConnected;

                            return (
                              <div
                                className="col-md-4 mb-md-0 mb-2 col-sm-6 d-flex"
                                key={index}
                              >
                                <div className="card border mb-3 h-100 w-100 pb-0">
                                  <div className="card-body pb-0">
                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                      <ImageWithBasePath
                                        src={`assets/img/icons/${iconMap[type]}`}
                                        width={50}
                                        alt={`${account.type} Icon`}
                                      />
                                      <div className="connect-btn">
                                        <Link
                                          to="#"
                                          className="badge badge-soft-success"
                                        >
                                          {isConnected
                                            ? "Connected"
                                            : "Not Connected"}
                                        </Link>
                                      </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between">
                                      <p className="mb-0 text-capitalize">
                                        {account.type}
                                      </p>
                                      <div className="form-check form-switch">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          role="switch"
                                          checked={account.isConnected}
                                          onChange={() =>
                                            toggleHandlers(account)
                                          }
                                        />
                                      </div>
                                    </div>
                                    {account.email && (
                                      <p className="mb-0 text-muted mt-3">
                                        ({account.email})
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        id="open-disconnect-modal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#disconnect_google_modal"
        className="d-none"
      />
      <button
        id="open-smtp-modal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#open_smtp_modal"
        className="d-none"
      />
      <button
        id="disconnect-smtp-modal"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#disconnect_smtp_modal"
        className="d-none"
      />

      <div
        className="modal fade"
        id="disconnect_google_modal"
        tabIndex="-1"
        aria-labelledby="disconnectGoogleLabel"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                  <i className="ti ti-trash-x fs-36 text-danger" />
                </div>
                <h4 className="mb-2 text-capitalize">Remove account?</h4>
                <p className="mb-0">
                  Are you sure you want to disconnect <br /> the {modalText}{" "}
                  account
                </p>
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to={"#"}
                    data-bs-dismiss="modal"
                    className="btn btn-danger"
                    onClick={() => {
                      modalText === "Google"
                        ? onGoogleDisconnect()
                        : modalText === "Microsoft"
                        ? onMicrosoftDisconnect()
                        : onSmtpDisconnect();
                    }}
                  >
                    Yes, Remove it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="open_smtp_modal"
        tabIndex="-1"
        aria-labelledby="smtpModalLabel"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="">
                <h4 className="mb-2 text-capitalize text-center">
                  Connect SMTP
                </h4>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Host Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="SMTP_HOST"
                      value={formData.SMTP_HOST}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Port Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="SMTP_PORT"
                      value={formData.SMTP_PORT}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Username <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="SMTP_USER"
                      value={formData.SMTP_USER}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="SMTP_PASS"
                      value={formData.SMTP_PASS}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link
                    to={"#"}
                    data-bs-dismiss="modal"
                    className="btn btn-primary"
                    onClick={() => {
                      smtpSignIn(formData);
                    }}
                  >
                    Save Info
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncAndIntegration;
