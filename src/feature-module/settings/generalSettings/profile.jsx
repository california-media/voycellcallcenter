import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import {
  editProfile,
  changePassword,
} from "../../../core/data/redux/slices/ProfileSlice";
import AvatarInitialStyles from "../../../core/common/nameInitialStyles/AvatarInitialStyles";
import { SlPhone } from "react-icons/sl";

const route = all_routes;

const Profile = () => {
  const userProfile = useSelector((state) => state.profile);

  console.log(userProfile, "userProfile");

  const dispatch = useDispatch();

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumbers: "",
    profileImage: null,
    instagram: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    telegram: "",
    designation: "",
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [changeSignin, setChangeSignin] = useState({
    email: "",
    phone: "",
    phonePassword: "",
    emailPassword: "",
  });
  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };
  const handleOnPhoneChange = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phoneNumbers: value,
    }));
  };
  console.log(formData, "formDataa");

  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstname: userProfile.firstname || "",
        lastname: userProfile.lastname || "",
        email: userProfile.email || "",
        phoneNumbers: userProfile?.phonenumbers[0] || "",
        profileImage: userProfile.profileImageURL || null,
        instagram: userProfile.instagram || "",
        twitter: userProfile.twitter || "",
        linkedin: userProfile.linkedin || "",
        facebook: userProfile.facebook || "",
        telegram: userProfile.telegram || "",
        designation: userProfile.designation || "",
      });
    }
  }, [userProfile]);
  console.log(formData.profileImage, "formData image");

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setIsProfileLoading(true);

    const data = new FormData();
    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("email", formData.email);
    data.append("phonenumber", formData.phoneNumbers);
    // data.append("profileImage", formData.profileImage);
    if (formData.profileImage === null) {
      data.append("profileImage", null);
    } else if (formData.profileImage instanceof File) {
      data.append("profileImage", formData.profileImage);
    }
    // if (formData.profileImage instanceof File) {
    //   data.append("profileImage", formData.profileImage);
    // }
    data.append("instagram", formData.instagram);
    data.append("twitter", formData.twitter);
    data.append("linkedin", formData.linkedin);
    data.append("facebook", formData.facebook);
    data.append("telegram", formData.telegram);
    data.append("designation", formData.designation);
    console.log(Object.fromEntries(data.entries()), "formData before dispatch");

    try {
      await dispatch(editProfile(data));
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeSignin = (e) => {
    const { name, value } = e.target;
    setChangeSignin((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeSignInMethod = () => {
    document.getElementById("open-change-signin-method-modal").click();
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({
        text: "New password and confirm password are required",
        type: "error",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        text: "New password must be at least 6 characters long",
        type: "error",
      });
      return;
    }

    setIsPasswordLoading(true);
    try {
      await dispatch(
        changePassword({
          newPassword: passwordData.newPassword,
        })
      );

      // Reset form on success
      setPasswordData({
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({ text: "", type: "" });
    } catch (error) {
      // Error handling is done in the Redux slice
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-xl-12 col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <h4 className="fw-semibold mb-3">Personal Details</h4>
                    <form onSubmit={handleEditProfile}>
                      <div className="mb-3 d-flex justify-content-between align-items-center">
                        <div className="profile-upload">
                          {/* <div className="profile-upload-img">
                            {!formData.profileImage && (
                              <span>
                                <i className="ti ti-photo" />
                              </span>
                            )}
                            <img
                              // id="ImgPreview"
                              src={
                                formData.profileImage instanceof File
                                  ? URL.createObjectURL(formData.profileImage)
                                  : formData.profileImage
                              }
                              alt="Profile"
                              // className="preview1"
                            />
                            <button
                              type="button"
                              id="removeImage1"
                              className="profile-remove"
                            >
                              <i className="feather-x" />
                            </button>
                          </div> */}

                          <div
                            className="profile-upload-img position-relative"
                            style={{
                              border: formData.profileImage
                                ? ""
                                : "2px dashed #E8E8E8",
                            }}
                          >
                            {console.log(
                              formData.profileImage,
                              "formData.profileImage"
                            )}
                            {formData.profileImage && (
                              <Link
                                style={{
                                  width: 20,
                                  height: 20,
                                  top: -5,
                                  right: -5,
                                }}
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    profileImage: null,
                                  }))
                                }
                                id="removeImage1"
                                className="position-absolute p-1 bg-danger text-white d-flex justify-content-center align-items-center rounded-circle"
                              >
                                <i className="feather-x" />
                              </Link>
                            )}
                            {!formData.profileImage ? (
                              <AvatarInitialStyles
                                name={`${formData.firstname} ${formData.lastname}`}
                                divStyles={{ width: 80, height: 80 }}
                              />
                            ) : (
                              <img
                                src={
                                  formData.profileImage instanceof File
                                    ? URL.createObjectURL(formData.profileImage)
                                    : formData.profileImage
                                }
                                alt="Profile"
                              />
                            )}
                          </div>
                          <div className="profile-upload-content">
                            <label className="profile-upload-btn">
                              <i className="ti ti-file-broken" /> Upload Photo
                              <input
                                type="file"
                                id="imag"
                                className="input-img"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setFormData((prev) => ({
                                      ...prev,
                                      profileImage: file,
                                    }));
                                  }
                                }}
                              />
                            </label>
                            <p>Supported file types PNG, JPG</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-bottom mb-3">
                        <div className="row">
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">
                                First Name{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Last Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Designation{" "}
                                <span className="text-grey">
                                  <i>(job profile)</i>
                                </span>
                              </label>
                              <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="mb-3 ">
                              <div className="d-flex justify-content-between align-items-center">
                                <label className="form-label">
                                  Phone Number{" "}
                                  <span className="text-danger">*</span>
                                </label>
                                {/* {userProfile.signupMethod === "phoneNumber" && (
                                  <p className="mb-0">Change signin method</p>
                                )} */}
                              </div>
                              <PhoneInput
                                country={"ae"}
                                value={formData.phoneNumbers}
                                onChange={handleOnPhoneChange}
                                enableSearch
                                inputProps={{
                                  name: "phone",
                                  required: true,
                                  autoFocus: true,
                                }}
                                inputStyle={{
                                  height: "40px",
                                  border: "1px solid #e9ecef",
                                  borderRadius: "4px",
                                  width: "100%",
                                  paddingLeft: "48px",
                                  boxSizing: "border-box",
                                }}
                                buttonStyle={{
                                  border: "1px solid #e9ecef",
                                  borderRight: "none",
                                  height: "40px",
                                  backgroundColor: "transparent",
                                }}
                                containerStyle={{ width: "100%" }}
                              />

                              {/* <PhoneInput
  country={"ae"}
  value={formData.phoneNumbers}
  onChange={handleOnPhoneChange}
  enableSearch
  inputProps={{
    name: "phone",
    required: true,
    autoFocus: true,
  }}
  inputStyle={{
    height: "40px",
    border: "1px solid #1890ff", // ✅ border color
    borderRadius: "6px",
    width: "100%",
    paddingLeft: "48px",
    fontSize: "14px",
    boxShadow: "0px 4px 4px 0px rgba(219, 219, 219, 0.25)", // ✅ box shadow
    outline: "none",
  }}
  buttonStyle={{
    border: "none",
    backgroundColor: "transparent",
  }}
  containerStyle={{
    width: "100%",
  }}
/> */}
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="mb-3">
                              <div className="d-flex justify-content-between align-items-center">
                                <label className="form-label">
                                  Email <span className="text-danger">*</span>
                                </label>
                                {/* {(userProfile.signupMethod === "google" ||
                                  userProfile.signupMethod === "email") && (
                                  <Link
                                    className="mb-0 text-primary"
                                    onClick={handleChangeSignInMethod}
                                  >
                                    Change signin method
                                  </Link>
                                )} */}
                              </div>
                              <input
                                type="text"
                                name="email"
                                value={formData.email}
                                disabled={userProfile.signupMethod === "google"}
                                onChange={handleChange}
                                className="form-control"
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="mb-3">
                              <label className="form-label">User Role</label>
                              <input
                                type="text"
                                value={userProfile.role || "user"}
                                disabled
                                className="form-control"
                                style={{
                                  backgroundColor: "#f8f9fa",
                                  cursor: "not-allowed",
                                }}
                              />
                              <small className="text-muted">
                                This field cannot be modified
                              </small>
                            </div>
                          </div>
                        </div>
                        <div className="row mt-4">
                          <h4 className="fw-semibold mb-3">Social Profiles</h4>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/instagramIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Instagram"
                                  name="instagram"
                                  value={formData.instagram}
                                  onChange={handleChange}
                                  aria-label="Instagram"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/twitterIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Twitter"
                                  name="twitter"
                                  value={formData.twitter}
                                  onChange={handleChange}
                                  aria-label="Twitter"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/linkedinIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Linkedin"
                                  name="linkedin"
                                  value={formData.linkedin}
                                  onChange={handleChange}
                                  aria-label="Linkedin"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/facebookIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Facebook"
                                  value={formData.facebook}
                                  onChange={handleChange}
                                  name="facebook"
                                  aria-label="Facebook"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="mb-3 row">
                              <div className="input-group">
                                <span
                                  className="input-group-text"
                                  id="basic-addon1"
                                >
                                  <img
                                    src="/assets/img/icons/telegramIcon.png"
                                    alt="Instagram"
                                    style={{ width: 20, height: 20 }}
                                  />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Telegram"
                                  value={formData.telegram}
                                  onChange={handleChange}
                                  name="telegram"
                                  aria-label="Telegram"
                                  aria-describedby="basic-addon1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {message.text && (
                        <p
                          className={`fw-medium ${
                            message.type === "success"
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {message.text}
                        </p>
                      )}

                      <div>
                        <Link to="#" className="btn btn-light me-2">
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ width: 150 }}
                          disabled={isProfileLoading}
                        >
                          {isProfileLoading ? "Saving..." : "Save Changes"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* /Settings Info */}
              <button
                id="open-change-signin-method-modal"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#open_change_signin_method_modal"
                className="d-none"
              />
              <div
                className="modal fade"
                id="open_change_signin_method_modal"
                tabIndex="-1"
                aria-labelledby="change-signin-method"
                role="dialog"
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="">
                        <h4 className="mb-2 text-capitalize text-center">
                          Change Signin Method
                        </h4>
                        <ul
                          className="nav nav-tabs nav-tabs-bottom mb-3"
                          role="tablist"
                        >
                          <li className="nav-item" role="presentation">
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#email"
                              className="nav-link active"
                            >
                              <i className="ti ti-mail me-2"></i>
                              Email
                            </Link>
                          </li>
                          <li className="nav-item" role="presentation">
                            <Link
                              to="#"
                              data-bs-toggle="tab"
                              data-bs-target="#phone"
                              className="nav-link"
                            >
                              <SlPhone className="me-2" />
                              Phone
                            </Link>
                          </li>
                        </ul>
                        <div className="tab-content pt-0">
                          <div className="tab-pane fade active show" id="email">
                            <div className="mb-3">
                              <div className="position-relative">
                                <span className="input-icon-addon">
                                  <i className="ti ti-mail"></i>
                                </span>
                                <input
                                  type="text"
                                  name="email"
                                  value={changeSignin.email}
                                  onChange={handleChangeSignin}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Password </label>
                              <div className="pass-group">
                                <input
                                  type={
                                    passwordVisibility.password
                                      ? "text"
                                      : "password"
                                  }
                                  className="pass-input form-control"
                                  name="emailPassword"
                                  value={changeSignin.emailPassword}
                                  onChange={handleChangeSignin}
                                />
                                <span
                                  className={`ti toggle-passwords ${
                                    passwordVisibility.password
                                      ? "ti-eye"
                                      : "ti-eye-off"
                                  }`}
                                  onClick={() =>
                                    togglePasswordVisibility("password")
                                  }
                                ></span>
                              </div>
                            </div>
                          </div>
                          <div className="tab-pane fade" id="phone">
                            <div className="mb-3">
                              <PhoneInput
                                country={"ae"}
                                value={changeSignin.phone}
                                onChange={handleOnPhoneChange}
                                enableSearch
                                disabled={
                                  userProfile.signupMethod === "phoneNumber"
                                }
                                inputProps={{
                                  name: "phone",
                                  required: true,
                                  autoFocus: true,
                                }}
                                inputStyle={{
                                  height: "40px",
                                  border: "1px solid #e9ecef",
                                  borderRadius: "4px",
                                  width: "100%",
                                  paddingLeft: "48px",
                                  boxSizing: "border-box",
                                }}
                                buttonStyle={{
                                  border: "1px solid #e9ecef",
                                  borderRight: "none",
                                  height: "40px",
                                  backgroundColor: "transparent",
                                }}
                                containerStyle={{ width: "100%" }}
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Password </label>
                              <input
                                type="text"
                                name="phonePassword"
                                value={changeSignin.phonePassword}
                                onChange={handleChangeSignin}
                                className="form-control"
                              />
                            </div>
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
                          >
                            Send
                          </Link>
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
    </div>
  );
};

export default Profile;
