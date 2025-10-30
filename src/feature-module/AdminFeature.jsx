import { useDispatch, useSelector } from "react-redux";
import { setThemeSettings } from "../core/data/redux/commonSlice";

import { Outlet } from "react-router";
import AdminSidebar from "../core/common/admin-sidebar";
import AdminHeader from "../core/common/admin-header";
import ThemeSettings from "../core/common/theme-settings/themeSettings";

// Global flag to track OneSignal initializationx

const AdminFeature = () => {
  const dispatch = useDispatch();
  const themeOpen = useSelector((state) => state?.common?.themeSettings);
  const headerCollapse = useSelector((state) => state?.common.headerCollapse);
  const mobileSidebar = useSelector((state) => state?.common?.mobileSidebar);
  const miniSidebar = useSelector((state) => state?.common?.miniSidebar);
  const expandMenu = useSelector((state) => state?.common?.expandMenu);

  // Use OneSignal auth hook for user login/logout

  return (
    <div
      className={`
      ${miniSidebar ? "mini-sidebar" : ""}
      ${expandMenu ? "expand-menu" : ""}`}
    >
      <div
        className={`main-wrapper 
        ${headerCollapse ? "header-collapse" : ""} 
        ${mobileSidebar ? "slide-nav" : ""}`}
      >
        <AdminHeader />
        <AdminSidebar />
        <Outlet />
        {/* <ThemeSettings/> */}
      </div>
      <div className="sidebar-overlay"></div>
      <div
        className={`sidebar-themeoverlay ${themeOpen ? "open" : ""}`}
        onClick={() => dispatch(setThemeSettings(!themeOpen))}
      ></div>
    </div>
  );
};

export default AdminFeature;
