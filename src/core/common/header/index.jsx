import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImageWithBasePath from "../imageWithBasePath";
import { all_routes } from "../../../feature-module/router/all_routes";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpandMenu,
  setMiniSidebar,
  setMobileSidebar,
} from "../../data/redux/commonSlice";
import LinkusDialer from "../linkus/LinkusDialer";
import { useAppSelector } from "../../data/redux/hooks";
import { setPhone } from "../../data/redux/slices/appCommonSlice";
import { resetProfile } from "../../data/redux/slices/ProfileSlice";
import api from "../../axios/axiosInstance";
import FloatingDialer from "../floating-dialer/FloatingDialer";
import { closeDialer, openDialer } from "../../data/redux/slices/FloatingDialerSlice";

const Header = () => {
  const route = all_routes;
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.profile);
  const mobileSidebar = useSelector((state) => state.common.mobileSidebar);
  const miniSidebar = useSelector((state) => state.common.miniSidebar);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [clientPhoneNumber, setClientPhoneNumber] = useState("");
  const [credits, setCredits] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(false);
  const phoneNumber = useAppSelector((state) => state.appCommon.phone);


    const { isOpen } = useSelector(
    (state) => state.floatingDialer
  );


  useEffect(() => {
    setClientPhoneNumber(phoneNumber);
    phoneNumber && showDropdown();
  }, [phoneNumber]);

  // Fetch credits on component mount
  useEffect(() => {
    fetchCredits();
  }, [userProfile.id]);

  const fetchCredits = async () => {
    if (!userProfile.id) return;

    setLoadingCredits(true);
    try {
      // Dummy API call to fetch credits
      const response = await api.get(`/credits/${userProfile.id}`);
      setCredits(response.data.credits || 0);
    } catch (error) {
      console.error("Error fetching credits:", error);
      // Set dummy credits for fallback
      setCredits(1250);
    } finally {
      setLoadingCredits(false);
    }
  };

  const handleRecharge = () => {
    navigate("/");
  };

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
    console.log("toggle dropdown called");

    dispatch(setPhone(""));
  };
  const showDropdown = () => {
    setOpenDropdown(true);
  };

  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  const toggleMiniSidebar = () => {
    dispatch(setMiniSidebar(!miniSidebar));
  };
  const toggleExpandMenu = () => {
    dispatch(setExpandMenu(true));
  };
  const toggleExpandMenu2 = () => {
    dispatch(setExpandMenu(false));
  };

  const handleLogout = async () => {
    try {
      // Clear all localStorage data
      localStorage.removeItem("userId");
      localStorage.removeItem("token");

      // Reset Redux state
      dispatch(resetProfile());

      // Navigate to login
      navigate("/");

      console.log("✅ Logout completed successfully");
    } catch (error) {
      console.error("❌ Logout error:", error);

      // Still proceed with logout even if there's an error
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      dispatch(resetProfile());
      navigate("/");
    }
  };

  const [layoutBs, setLayoutBs] = useState(localStorage.getItem("dataTheme"));
  const isLockScreen = location.pathname === "/lock-screen";

  if (isLockScreen) {
    return null;
  }
  const LayoutDark = () => {
    localStorage.setItem("dataTheme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    setLayoutBs("dark");
  };
  const LayoutLight = () => {
    localStorage.setItem("dataTheme", "light");
    document.documentElement.setAttribute("data-theme", "light");
    setLayoutBs("light");
  };

  return (
    <>
      {/* Header */}
      <div className="header">
        {/* Logo */}
        <div className="header-left active">
          {/* <div className="header-left active" onMouseEnter={toggleExpandMenu} onMouseLeave={toggleExpandMenu2}> */}
          <Link to={route.dashboard} className="logo logo-normal">
            {/* {layoutBs === "dark" ? (
              <>
                <ImageWithBasePath
                  src="assets/img/white-logo.svg"
                  className="white-logo"
                  alt="Logo"
                />
              </>
            ) : (
              <ImageWithBasePath src="assets/img/logo.svg" alt="Logo" />
            )} */}
            <ImageWithBasePath src="assets/img/voycell-logo.webp" alt="Logo" />
            <ImageWithBasePath
              src="assets/img/white-logo.svg"
              className="white-logo"
              alt="Logo"
            />
          </Link>
          <Link to={route.dashboard} className="logo-small">
            <ImageWithBasePath src="assets/img/favicon.ico" alt="Logo" />
          </Link>
          {/* <Link id="toggle_btn" to="#" onClick={toggleMiniSidebar}>
            <i className="ti ti-arrow-bar-to-left" />
          </Link> */}
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#sidebar"
          onClick={toggleMobileSidebar}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        <div className="header-user">
          <ul className="nav user-menu">
            {/* Search */}
            <li className="nav-item nav-search-inputs me-auto">
              <div className="top-nav-search">
                <Link to="#" className="responsive-search">
                  <i className="fa fa-search" />
                </Link>
                <form className="dropdown">
                  <div className="searchinputs" id="dropdownMenuClickable">
                    <input type="text" placeholder="Search" />
                    <div className="search-addon">
                      <button type="submit">
                        <i className="ti ti-command" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </li>
            {/* /Search */}
            {/* Nav List */}
            <li className="nav-item nav-list">
              <ul className="nav">
                <li className="dark-mode-list">
                  <div
                    className="d-flex align-items-center bg-light rounded  me-2"
                    style={{
                      minWidth: "160px",
                      border: "1px solid #e9ecef",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      padding: "0px 8px",
                      paddingRight: "0px",
                    }}
                  >
                    <i
                      className="ti ti-coins text-warning me-2"
                      style={{ fontSize: "16px" }}
                    ></i>
                    <div className="credits-info flex-grow-1">
                      <span
                        className="credits-amount fw-semibold text-dark me-2"
                        style={{ fontSize: "14px" }}
                      >
                        {loadingCredits ? "..." : credits.toLocaleString()}
                      </span>
                      <span
                        className="text-muted"
                        style={{ fontSize: "13px", lineHeight: "1" }}
                      >
                        Credits Available
                      </span>
                    </div>
                    <button
                      className="btn btn-sm btn-primary ms-2 p-0"
                      onClick={handleRecharge}
                      style={{
                        fontSize: "11px",

                        borderRadius: "4px",
                      }}
                      title="Recharge Credits"
                    >
                      <i
                        className="ti ti-plus"
                        style={{ fontSize: "12px" }}
                      ></i>
                    </button>
                  </div>
                </li>



                <li className="nav-item">
                  <div
                    className="d-flex align-items-center bg-light rounded  me-2"
                    style={{
                      // minWidth: "130px",
                      border: "1px solid #e9ecef",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      padding: "0px 0px",
                      paddingRight: "0px",
                    }}
                  >
                    <Link
                      to="#"
                      className="btn btn-header-list"
                      aria-expanded="false"
                      style={{ minWidth: "130px" }}
                      onClick={() => {
                        // toggleDropdown();
                        if(isOpen){
                          dispatch(closeDialer())
                        }
                        else{
                          dispatch(openDialer())
                        }
                      }}
                    >
                      <i className="typcn typcn-phone me-2" />
                      Dialerr
                    </Link>
{isOpen&&<FloatingDialer/>}

                    {/* <div
                      className={`dropdown-menu dropdown-menu-end menus-info ${openDropdown ? "show" : ""
                        }`}
                      style={{
                        minWidth: "250px",
                        maxWidth: "400px",
                        position: "absolute",
                        inset: "0px 0px auto auto",
                        margin: "0px",
                        transform: "translate3d(0px, 38px, 0px)",
                      }}
                    >
                  
                      {userProfile?.isLinkusDialerActive ? (
                        <div className="p-4 text-center">
                          <i
                            className="typcn typcn-phone text-primary"
                            style={{ fontSize: "48px" }}
                          ></i>
                          <p className="text-dark mt-3 mb-1 fw-semibold">
                            Phone System Active
                          </p>
                          <small className="text-muted">
                            You have the full dialer open on another page
                          </small>
                        </div>
                      ) : userProfile?.extensionNumber &&
                        userProfile?.yeastarExtensionId ? (
                        <LinkusDialer />
                        // <FloatingDialer />
                      ) : (
                        <div className="p-4 text-center">
                          <i
                            className="typcn typcn-phone-outline text-muted"
                            style={{ fontSize: "48px" }}
                          ></i>
                          <p className="text-muted mt-3 mb-0">
                            Phone extension not configured
                          </p>
                          <small className="text-muted">
                            Please contact support to set up your phone
                          </small>
                        </div>
                      )}
                    </div> */}
                  </div>
                </li>


                <li className="dark-mode-list align-items-center">
                  <Link
                    to="#"
                    className={`dark-mode-toggle ${layoutBs ? "" : "active"}`}
                    id="dark-mode-toggle"
                  >
                    <i
                      className={`ti ti-sun light-mode ${layoutBs === "dark" ? "" : "active"
                        }`}
                      onClick={LayoutLight}
                    >
                      {" "}
                    </i>
                    <i
                      className={`ti ti-moon dark-mode ${layoutBs === "dark" ? "active" : ""
                        }`}
                      onClick={LayoutDark}
                    ></i>
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link
                    to="#"
                    className="btn btn-header-list"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-layout-grid-add" />
                  </Link>
                  <div className="dropdown-menu dropdown-menu-end menus-info">
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="menu-list">
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-violet">
                                  <i className="ti ti-user-up" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Contacts</p>
                                  <span>Add New Contact</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-green">
                                  <i className="ti ti-timeline-event-exclamation" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Pipline</p>
                                  <span>Add New Pipline</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-pink">
                                  <i className="ti ti-bounce-right" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Activities</p>
                                  <span>Add New Activity</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-info">
                                  <i className="ti ti-analyze" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Analytics</p>
                                  <span>Shows All Information</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-danger">
                                  <i className="ti ti-atom-2" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Projects</p>
                                  <span>Add New Project</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="menu-list">
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-info">
                                  <i className="ti ti-medal" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Deals</p>
                                  <span>Add New Deals</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-secondary">
                                  <i className="ti ti-chart-arcs" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Leads</p>
                                  <span>Add New Leads</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-tertiary">
                                  <i className="ti ti-building-community" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Company</p>
                                  <span>Add New Company</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-success">
                                  <i className="ti ti-list-check" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Tasks</p>
                                  <span>Add New Task</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                          <li>
                            <Link to={route.leads}>
                              <div className="menu-details">
                                <span className="menu-list-icon bg-purple">
                                  <i className="ti ti-brand-campaignmonitor" />
                                </span>
                                <div className="menu-details-content">
                                  <p>Campaign</p>
                                  <span>Add New Campaign</span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>


                {/* <li className="nav-item">
                  <Link to={route.faq} className="btn btn-help">
                    <i className="ti ti-help-hexagon" />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="btn btn-chart-pie">
                    <i className="ti ti-chart-pie" />
                  </Link>
                </li> */}
              </ul>
            </li>
            {/* /Nav List */}
            {/* Email */}
            {/* <li className="nav-item nav-item-email nav-item-box">
              <Link to={route.email}>
                <i className="ti ti-message-circle-exclamation" />
                <span className="badge rounded-pill">14</span>
              </Link>
            </li> */}
            {/* /Email */}
            {/* Notifications */}
            {/* <li className="nav-item dropdown nav-item-box">
              <Link to="#" className="nav-link" data-bs-toggle="dropdown">
                <i className="ti ti-bell" />
                <span className="badge rounded-pill">13</span>
              </Link>
              <div className="dropdown-menu dropdown-menu-end notification-dropdown">
                <div className="topnav-dropdown-header">
                  <h4 className="notification-title">Notifications</h4>
                </div>
                <div className="noti-content">
                  <ul className="notification-list">
                    <li className="notification-message">
                      <Link to={route.leads}>
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-02.jpg"
                              alt="Profile"
                            />
                            <span className="badge badge-info rounded-pill" />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details">
                              Ray Arnold left 6 comments on Isla Nublar SOC2
                              compliance report
                            </p>
                            <p className="noti-time">
                              Last Wednesday at 9:42 am
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="notification-message">
                      <Link to={route.leads}>
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-03.jpg"
                              alt="Profile"
                            />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details">
                              Denise Nedry replied to Anna Srzand
                            </p>
                            <p className="noti-sub-details">
                              “Oh, I finished de-bugging the phones, but the
                              system's compiling for eighteen minutes, or
                              twenty. So, some minor systems may go on and off
                              for a while.”
                            </p>
                            <p className="noti-time">
                              Last Wednesday at 9:42 am
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                    <li className="notification-message">
                      <Link to={route.leads}>
                        <div className="media d-flex">
                          <span className="avatar flex-shrink-0">
                            <ImageWithBasePath
                              alt=""
                              src="assets/img/profiles/avatar-06.jpg"
                            />
                          </span>
                          <div className="media-body flex-grow-1">
                            <p className="noti-details">
                              John Hammond attached a file to Isla Nublar SOC2
                              compliance report
                            </p>
                            <div className="noti-pdf">
                              <div className="noti-pdf-icon">
                                <span>
                                  <i className="ti ti-chart-pie" />
                                </span>
                              </div>
                              <div className="noti-pdf-text">
                                <p>EY_review.pdf</p>
                                <span>2mb</span>
                              </div>
                            </div>
                            <p className="noti-time">
                              Last Wednesday at 9:42 am
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="topnav-dropdown-footer">
                  <Link to={route.leads} className="view-link">
                    View all
                  </Link>
                  <Link to="#" className="clear-link">
                    Clear all
                  </Link>
                </div>
              </div>
            </li> */}
            {/* /Notifications */}
            {/* Profile Dropdown */}
            <li className="nav-item dropdown has-arrow main-drop">
              <Link
                to="#"
                className="nav-link userset"
                data-bs-toggle="dropdown"
              >
                <span className="user-info">
                  <span className="user-letter">
                    {userProfile.profileImageURL ? (
                      <img
                        src={userProfile.profileImageURL}
                        alt="Profile"
                        style={{ objectFit: "cover", height: "100%" }}
                      />
                    ) : (
                      <ImageWithBasePath
                        src="assets/img/profiles/avatar-20.jpg"
                        alt="Profile"
                      />
                    )}
                  </span>
                  <span className="badge badge-success rounded-pill" />
                </span>
              </Link>
              <div className={` dropdown-menu  menu-drop-user `}>
                <div className="profilename">
                  <Link className="dropdown-item" to={route.dashboard}>
                    <i className="ti ti-layout-2" /> Dashboard
                  </Link>
                  <Link className="dropdown-item" to={route.profile}>
                    <i className="ti ti-user-pin" /> My Profile
                  </Link>
                  <Link
                    className="dropdown-item"
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#logoutModal"
                  >
                    <i className="ti ti-lock" /> Logout
                  </Link>
                </div>
              </div>
            </li>
            {/* /Profile Dropdown */}
          </ul>
        </div>
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className={` dropdown-menu `}>
            <Link className="dropdown-item" to={route.leads}>
              <i className="ti ti-layout-2" /> Dashboard
            </Link>
            <Link className="dropdown-item" to={route.leads}>
              <i className="ti ti-user-pin" /> My Profile
            </Link>
            <Link
              className="dropdown-item"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#logoutModal"
            >
              <i className="ti ti-lock" /> Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>

      {/* Logout Modal */}
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        aria-labelledby="logout"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                  <i className="fa-solid fa-right-from-bracket fs-36 text-danger" />
                </div>
                <h4 className="mb-2 text-capitalize">Logout?</h4>
                <p className="mb-0">
                  Are you sure you want to logout from your account?
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
                      handleLogout();
                    }}
                  >
                    Yes, Logout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
