import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Scrollbars from "react-custom-scrollbars-2";
import { SidebarData } from "../../data/json/sidebarData";
import ImageWithBasePath from "../imageWithBasePath";
import { useDispatch, useSelector } from "react-redux";
import { setExpandMenu } from "../../data/redux/commonSlice";
import Calling from "../../../feature-module/crm/calling";

const Sidebar = () => {
  const Location = useLocation();
  const expandMenu = useSelector((state) => state.expandMenu);
  const dispatch = useDispatch();

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const [showDialer, setShowDialer] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(true);
  const [isHovered, setIsHovered] = useState(null);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const toggleSidebar = (title) => {
    localStorage.setItem("menuOpened", title);
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };
  const toggle = () => {
    dispatch(setExpandMenu(true));
  };
  const toggle2 = () => {
    dispatch(setExpandMenu(false));
  };

  useEffect(() => {
    setSubopen(localStorage.getItem("menuOpened"));
    // Select all 'submenu' elements
    const submenus = document.querySelectorAll(".submenu");
    // Loop through each 'submenu'
    submenus.forEach((submenu) => {
      // Find all 'li' elements within the 'submenu'
      const listItems = submenu.querySelectorAll("li");
      submenu.classList.remove("active");
      // Check if any 'li' has the 'active' class
      listItems.forEach((item) => {
        if (item.classList.contains("active")) {
          // Add 'active' class to the 'submenu'
          submenu.classList.add("active");
          return;
        }
      });
    });
  }, [Location.pathname]);
  const handleMouseEnter = (menuLabel) => {
    setIsHovered(menuLabel);
  };

  const handleMouseLeave = () => {
    setIsHovered(null);
  };

  return (
    <>
      <div
        className="sidebar"
        id="sidebar"
        // onMouseEnter={toggle}
        // onMouseLeave={toggle2}
      >
        {/* <Scrollbars
          style={{ overflow: "visible" }}
          renderView={(props) => (
            <div
              {...props}
              style={{
                ...props.style,
                overflow: "visible",
              }}
            />
          )}
        > */}
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            {/* <ul>
              <li className="clinicdropdown theme">
                <Link to="/profile">
                  <ImageWithBasePath
                    src="assets/img/profiles/avatar-14.jpg"
                    className="img-fluid"
                    alt="Profile"
                  />
                  <div className="user-names">
                    <h5>Adrian Davies</h5>
                    <h6>Tech Lead</h6>
                  </div>
                </Link>
              </li>
            </ul> */}

            <ul>
              {SidebarData?.map((mainLabel, index) => (
                <li className="clinicdropdown" key={index}>
                  <h6 className="submenu-hdr">{mainLabel?.label}</h6>
                  <ul>
                    {mainLabel?.submenuItems?.map((title, i) => {
                      let link_array = [];
                      if ("submenuItems" in title) {
                        title.submenuItems?.forEach((link) => {
                          link_array.push(link?.link);
                          if (link?.submenu && "submenuItems" in link) {
                            link.submenuItems?.forEach((item) => {
                              link_array.push(item?.link);
                            });
                          }
                        });
                      }
                      title.links = link_array;

                      return (
                        <li className="submenu" key={title.label}>
                          <div
                            onMouseEnter={() => handleMouseEnter(title.label)}
                            onMouseLeave={() => handleMouseLeave}
                          >
                            <Link
                              to={title?.submenu ? "#" : title?.link}
                              onClick={() => toggleSidebar(title?.label)}
                              className={`${
                                subOpen === title?.label ? "subdrop" : ""
                              } ${
                                title?.links?.includes(Location.pathname)
                                  ? "active"
                                  : ""
                              } 
                                ${
                                  title?.submenuItems
                                    ?.map((link) => link?.link)
                                    .includes(Location.pathname) ||
                                  title?.link === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink1 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink2 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink3 === Location.pathname
                                    ? "active"
                                    : "" ||
                                      title?.subLink4 === Location.pathname
                                    ? "active"
                                    : ""
                                }
                               `}
                            >
                              <i className={title.icon}></i>
                              <span>{title?.label}</span>
                              <span
                                className={title?.submenu ? "menu-arrow" : ""}
                              />
                            </Link>

                            {isHovered === title.label && (
                              <>
                                <div
                                  style={{
                                    background: "transparent",
                                    position: "absolute",
                                    width: "100px",
                                    height: "100%",
                                    top: 0,
                                    left: 0,
                                    zIndex: 1,
                                  }}
                                  onMouseEnter={() =>
                                    handleMouseEnter(title.label)
                                  }
                                  onMouseLeave={handleMouseLeave}
                                ></div>
                                <div
                                  className="showOnHover"
                                  onMouseEnter={() =>
                                    handleMouseEnter(title.label)
                                  }
                                  onMouseLeave={handleMouseLeave}
                                >
                                  {isHovered === title.label && (
                                    <div
                                      style={{
                                        marginBottom: "10px",
                                        background: "#12344d",
                                        // paddingLeft: 8,
                                        // paddingRight: 8,
                                        borderRadius: 6,
                                        minWidth: 240,
                                        position: "absolute",
                                        textAlign: "center",
                                        top: 0,
                                        left: 0,
                                        zIndex: 1,
                                      }}
                                      onMouseEnter={() =>
                                        handleMouseEnter(title.label)
                                      }
                                      onMouseLeave={handleMouseLeave}
                                    >
                                      {" "}
                                      <div className="sideMenuHeadingContainer">
                                        <p className="sideMenuHeading">
                                          {title.label}
                                        </p>
                                      </div>
                                      <ul
                                        style={{
                                          marginBottom: 0,
                                          paddingLeft: 8,
                                          paddingRight: 8,
                                          paddingBottom: 12,
                                          display: "block",
                                        }}
                                      >
                                        {title?.submenuItems?.map((item) => (
                                          <li
                                            className="submenu submenu-two subMenuLi"
                                            key={item.label}
                                          >
                                            {/* {console.log(title.submenuItems, "title.submenuItems")} */}
                                            <Link
                                              to={item?.link}
                                              className={`${
                                                item?.submenuItems
                                                  ?.map((link) => link?.link)
                                                  .includes(
                                                    Location.pathname
                                                  ) ||
                                                item?.link === Location.pathname
                                                  ? "active subdrop"
                                                  : ""
                                              } `}
                                              onClick={() => {
                                                toggleSubsidebar(item?.label);
                                              }}
                                            >
                                              <div className="me-2">
                                                {item?.icon}
                                              </div>
                                              {item?.label}
                                              <span
                                                className={
                                                  item?.submenu
                                                    ? "menu-arrow"
                                                    : ""
                                                }
                                              />
                                            </Link>
                                            <ul style={{}}>
                                              {item?.submenuItems?.map(
                                                (items) => (
                                                  <li key={items.label}>
                                                    <Link
                                                      to={items?.link}
                                                      className={`${
                                                        subsidebar ===
                                                        items?.label
                                                          ? "submenu-two subdrop"
                                                          : "submenu-two"
                                                      } ${
                                                        items?.submenuItems
                                                          ?.map(
                                                            (link) => link.link
                                                          )
                                                          .includes(
                                                            Location.pathname
                                                          ) ||
                                                        items?.link ===
                                                          Location.pathname
                                                          ? "active"
                                                          : ""
                                                      }`}
                                                    >
                                                      {items?.label}
                                                    </Link>
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* </Scrollbars> */}
      </div>
    </>
  );
};

export default Sidebar;
