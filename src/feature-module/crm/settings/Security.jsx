import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { all_routes } from "../../router/all_routes";
// import CollapseHeader from "../../../core/common/collapse-header";

import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import api from "../../../core/axios/axiosInstance";
import { all_routes } from "../../router/all_routes";

// import { resetProfile } from "../../../core/data/redux/slices/ProfileSlice";
// import { resetSelectedContact } from "../../../core/data/redux/slices/SelectedContactSlice";
// import { resetSelectedTemplate } from "../../../core/data/redux/slices/SelectedTemplateSlice";
const route = all_routes;
const Security = () => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.profile);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("changePassword", {
        newPassword: password,
      });
      console.log(response.data, "response from change password");
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
    }
  };
  const handleDeleteAccount = async () => {
    try {
      const response = await api.delete("deleteUser");
      console.log(response.data, "response from delete profile");

      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // dispatch(resetProfile());
      // dispatch(resetSelectedContact());
      // dispatch(resetSelectedTemplate());
      navigate(route.login);
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
    }
  };
  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-xl-12 col-lg-12">
                  {/* Settings Info */}
                  <div className="card" style={{ height: "100%" }}>
                    <div className="card-body pb-0">
                      <h4 className="fw-semibold mb-3">Security Settings</h4>
                      <div className="row">
                        {userProfile.signupMethod !== "google" && (
                          <div className="col-lg-4 col-md-6 d-flex">
                            <div className="card border shadow-none flex-fill mb-3">
                              <div className="card-body d-flex justify-content-between flex-column">
                                <div className="mb-3">
                                  <div className="d-flex align-items-center justify-content-between mb-1">
                                    <h6 className="fw-semibold">Password</h6>
                                  </div>
                                </div>
                                <div>
                                  <Link
                                    to="#"
                                    className="btn btn-light"
                                    data-bs-toggle="modal"
                                    data-bs-target="#change_password"
                                  >
                                    Change Password
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="col-lg-4 col-md-6 d-flex">
                          <div className="card border shadow-none flex-fill mb-3">
                            <div className="card-body d-flex justify-content-between flex-column">
                              <div className="mb-3">
                                <div className="d-flex align-items-center justify-content-between mb-1">
                                  <h6 className="fw-semibold">
                                    Delete Account
                                  </h6>
                                </div>
                                <p>Note: You will lose all your data</p>
                              </div>
                              <div>
                                <Link
                                  to="#"
                                  className="btn btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#delete_two_factor"
                                >
                                  Delete Account
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
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
      {/* /Page Wrapper */}
      <>
        {/* Change Password */}
        <div className="modal fade" id="change_password" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  className="btn-close custom-btn-close border p-1 me-0 text-dark"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <form onSubmit={handleChangePassword}>
                <div className="modal-body">
                  {/* <div className="mb-3">
                    <label className="col-form-label">
                      Current Password <span className="text-danger">*</span>
                    </label>
                    <input type="password" className="form-control" />
                  </div> */}
                  {/* <div className="mb-3">
                    <label className="col-form-label">
                      New Password <span className="text-danger">*</span>
                    </label>
                    <input type="password" className="form-control" />
                  </div> */}
                  {/* <div className="mb-0">
                    <label className="col-form-label">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <input type="password" className="form-control" />
                  </div> */}

                  <div className="mb-3">
                    <label className="col-form-label">New Password</label>
                    <div className="pass-group">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span
                        className={`ti toggle-password ${isPasswordVisible ? "ti-eye" : "ti-eye-off"
                          }`}
                        onClick={togglePasswordVisibility}
                      ></span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <div className="d-flex align-items-center">
                    <Link
                      to="#"
                      className="btn btn-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Change Password */}
        {/* Delete Account */}
        <div
          className="modal custom-modal fade"
          id="delete_account"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <form>
                  <div className="text-center">
                    <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                      <i className="ti ti-trash-x fs-36 text-danger" />
                    </div>
                    <h4 className="mb-2">Delete Account</h4>
                    <p className="mb-0">Are you sure you want to remove it.</p>
                    <div className="d-flex align-items-center justify-content-center mt-4">
                      <Link
                        to="#"
                        className="btn btn-light me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </Link>
                      <button
                        type="button"
                        data-bs-dismiss="modal"
                        className="btn btn-danger"
                      >
                        Yes, Delete it
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Delete Account */}
        {/* Delete Account */}
        <div
          className="modal custom-modal fade"
          id="delete_two_factor"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <div className="text-center">
                  <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                    <i className="ti ti-trash-x fs-36 text-danger" />
                  </div>
                  <h4 className="mb-2">Delete Account</h4>
                  <p className="mb-0">
                    {" "}
                    ⚠️ This action is irreversible. All your data will be
                    permanently deleted. Are you sure you want to continue?
                  </p>
                  <div className="d-flex align-items-center justify-content-center mt-4">
                    <Link
                      to="#"
                      className="btn btn-light me-2"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-danger"
                      onClick={handleDeleteAccount}
                    >
                      Yes, Delete it
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* /Delete Account */}
      </>
    </div>
  );
};

export default Security;
