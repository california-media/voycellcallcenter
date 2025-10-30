import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select from "react-select";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import { MdDoubleArrow } from "react-icons/md";
import "./leads.css";
import "antd/dist/reset.css";
import {
  countryoptions1,
  languageOptions,
  optiondeals,
  optionindustry,
  options,
  optionschoose,
  optionsource,
  leadStatus,
  optionssymbol,
  owner as companyEmployee,
} from "../../../core/common/selectoption/selectoption";
import { leadsData } from "../../../core/data/json/leads";
import { Modal } from "react-bootstrap";
import { TableData } from "../../../core/data/interface";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CollapseHeader from "../../../core/common/collapse-header";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { all_routes } from "../../router/all_routes";
import { TagsInput } from "react-tag-input-component";
import Offcanvas from "react-bootstrap/Offcanvas";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import { Wizard, useWizard } from "react-use-wizard";
import { HiEllipsisVertical } from "react-icons/hi2";
import * as XLSX from "xlsx";

// import { init } from 'ys-webrtc-sdk-ui';
import "ys-webrtc-sdk-ui/lib/ys-webrtc-sdk-ui.css";
import { useAppDispatch, useAppSelector } from "../../../core/data/redux/hooks";

import { setPhone } from "../../../core/data/redux/slices/appCommonSlice";
import EditCell from "../../../core/common/editCell/EditCell";
import { Pagination } from "antd";
import LeadOffcanvas from "../../../core/common/offCanvas/lead/LeadOffcanvas";
import DeleteModal from "../../../core/common/modals/DeleteModal";
import { saveBulkContacts } from "../../../core/data/redux/slices/ContactSlice";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";
import api from "../../../core/axios/axiosInstance";

const Leads = () => {
  const route = all_routes;
  const [adduser, setAdduser] = useState(false);
  const [addcompany, setAddCompany] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Lead");
  const data = leadsData;
  const [owner, setOwner] = useState(["Collab"]);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeadStatus, setSelectedLeadStatus] = useState([]);
  const [importModal, setImportModal] = useState(false);

  const [selectedLeadEmployee, setSelectedLeadEmployee] = useState([]);
  const [stars, setStars] = useState({});
  const [newContents, setNewContents] = useState([0]);
  const [statusLead, setStatusLead] = useState({});
  const [deleteModalText, setDeleteModalText] = useState("");
  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  const [activeRecordKey, setActiveRecordKey] = useState(null);
  const [activeCell, setActiveCell] = useState(null);


  const dispatch = useAppDispatch();

  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date().toDateString(),
    endDate: new Date().toDateString(),
  });
  const currentDateAndTime = new Date();
  const currentDate = currentDateAndTime.toLocaleDateString();
  const currentTime = currentDateAndTime.toLocaleTimeString();

  const handleRadioSelect = (option) => {
    setSelectedOption(option); // Update the selected option
  };
  const handleDownload = () => {
    const data = [
      [
        "firstname",
        "lastname",
        "company",
        "designation",
        "emailaddresses",
        "phonenumbers",
        "instagram",
        "twitter",
        "linkedin",
        "facebook",
        "telegram",
      ],
      [
        "John",
        "Doe",
        "TechCorp",
        "Software Engineer",
        "john.doe@example.com",
        "1234567890",
        "https://instagram.com/johndoe",
        "https://twitter.com/johndoe",
        "https://linkedin.com/in/johndoe",
        "https://facebook.com/johndoe",
        "https://t.me/johndoe",
      ],
      [
        "Jane",
        "Smith",
        "DesignHub",
        "Product Designer",
        "jane.smith@example.com",
        "9876543210",
        "https://instagram.com/janesmith",
        "https://twitter.com/janesmith",
        "https://linkedin.com/in/janesmith",
        "https://facebook.com/janesmith",
        "https://t.me/janesmith",
      ],
      [
        "Alice",
        "Johnson",
        "FinTech Ltd",
        "Data Analyst",
        "alice.johnson@example.com",
        "1122334455",
        "https://instagram.com/alicejohnson",
        "https://twitter.com/alicejohnson",
        "https://linkedin.com/in/alicejohnson",
        "https://facebook.com/alicejohnson",
        "https://t.me/alicejohnson",
      ],
    ];

    // Convert data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      data.map((row) => row.join(",")).join("\n");

    // Create a Blob and download it as an Excel file
    const downloadLink = document.createElement("a");
    downloadLink.href = encodeURI(csvContent);
    downloadLink.download = "sample.csv";

    // Simulate a click to trigger the download
    downloadLink.click();
  };

  const Step1 = () => {
    const { previousStep, nextStep } = useWizard();

    return (
      <>
        <h2 className="uploadHeading mb-3">
          Select a way to import your contacts
        </h2>
        <p className="uploadSubHeading">
          Contacts (or 'leads') are people you engage with
        </p>

        <div className="d-md-flex justify-content-center">
          <div
            className={`importMenu  ${selectedOption === "csvExcel" ? "selected" : ""
              }`}
            onClick={() => handleRadioSelect("csvExcel")}
          >
            <div className="importIcons">
              <ImageWithBasePath
                src="assets/img/customIcons/excelLogo.png"
                alt="Excel Logo"
              />
            </div>
            <p className="importType">CSV or Excel</p>
          </div>
          <div
            className={`importMenu ${selectedOption === "google" ? "selected" : ""
              }`}
            onClick={() => handleRadioSelect("google")}
          >
            <div className="importIcons">
              <ImageWithBasePath
                src="assets/img/icons/googleLogo.png"
                alt="google Logo"
              />
            </div>
            <p className="importType">Google Contacts</p>
          </div>
        </div>
        <div className="d-md-flex justify-content-center mt-md-3">
          <div
            className={`importMenu ${selectedOption === "zoho" ? "selected" : ""
              }`}
            onClick={() => handleRadioSelect("zoho")}
          >
            <div
              style={{
                height: 40,
                marginRight: 15,
                justifyContent: "center",
                display: "flex",
              }}
            >
              <ImageWithBasePath
                src="assets/img/customIcons/zohoLogo.png"
                alt="Zoho Logo"
              />
            </div>
            <p className="importType">Zoho</p>
          </div>
          <div
            className={`importMenu ${selectedOption === "hubspot" ? "selected" : ""
              }`}
            onClick={() => handleRadioSelect("hubspot")}
          >
            <div className="importIcons">
              <ImageWithBasePath
                src="assets/img/icons/hubspotLogo.jpg"
                alt="Hubspot Logo"
              />
            </div>
            <p className="importType">Hubspot</p>
          </div>
        </div>
        <div className="wizardBtnContainer">
          {selectedOption && (
            <button
              className="nextStep btn btn-primary"
              onClick={async () => {
                if (selectedOption === "google") {
                  try {
                    const response = await api.get("/fetch-google-contacts");
                    console.log(
                      response.data,
                      "response from google fetch contacts"
                    );

                    if (
                      response.data.status === "success" &&
                      response.data.url
                    ) {
                      const width = 500;
                      const height = 600;
                      const left =
                        window.screenX + (window.outerWidth - width) / 2;
                      const top =
                        window.screenY + (window.outerHeight - height) / 2;

                      const messageHandler = (event) => {
                        console.log(event, "mhasgjasvfsa");

                        console.log("origin:", event.origin);
                        console.log("data:", event.data);

                        const data = event.data;
                        if (data?.status === "success") {
                          setImportModal(false);
                          setTimeout(() => {
                            window.location.reload();
                          }, 2000);
                          dispatch(
                            showToast({
                              message: "Contacts fetched successfully",
                              variant: "success",
                            })
                          );

                          window.removeEventListener("message", messageHandler);
                          popup?.close();
                        }
                      };
                      window.addEventListener("message", messageHandler);

                      const popup = window.open(
                        response.data.url,
                        "_blank",
                        `width=${width},height=${height},left=${left},top=${top}`
                      );
                      if (!popup) {
                        console.error("Popup blocked");
                      }
                    }
                  } catch (error) {
                    console.error("Google Sign-In initiation failed", error);
                  }
                }
                if (selectedOption === "zoho") {
                  try {
                    const response = await api.get("/fetch-zoho-contacts");
                    console.log(
                      response.data,
                      "response from zoho fetch contacts"
                    );

                    if (
                      response.data.status === "success" &&
                      response.data.url
                    ) {
                      const width = 500;
                      const height = 600;
                      const left =
                        window.screenX + (window.outerWidth - width) / 2;
                      const top =
                        window.screenY + (window.outerHeight - height) / 2;

                      const messageHandler = (event) => {
                        console.log(event, "mhasgjasvfsa");

                        console.log("origin:", event.origin);
                        console.log("data:", event.data);

                        const data = event.data;
                        if (data?.status === "success") {
                          setImportModal(false);
                          setTimeout(() => {
                            window.location.reload();
                          }, 2000);
                          dispatch(
                            showToast({
                              message: "Contacts fetched successfully",
                              variant: "success",
                            })
                          );

                          window.removeEventListener("message", messageHandler);
                          popup?.close();
                        }
                      };
                      window.addEventListener("message", messageHandler);

                      const popup = window.open(
                        response.data.url,
                        "_blank",
                        `width=${width},height=${height},left=${left},top=${top}`
                      );
                      if (!popup) {
                        console.error("Popup blocked");
                      }
                    }
                  } catch (error) {
                    console.error("Zoho Sign-In initiation failed", error);
                  }
                }
                if (selectedOption === "hubspot") {
                  try {
                    const response = await api.get("/fetch-hubspot-contacts");
                    console.log(
                      response.data,
                      "response from hubspot fetch contacts"
                    );

                    if (
                      response.data.status === "success" &&
                      response.data.url
                    ) {
                      const width = 500;
                      const height = 600;
                      const left =
                        window.screenX + (window.outerWidth - width) / 2;
                      const top =
                        window.screenY + (window.outerHeight - height) / 2;

                      const messageHandler = (event) => {
                        console.log(event, "mhasgjasvfsa");

                        console.log("origin:", event.origin);
                        console.log("data:", event.data);

                        const data = event.data;
                        if (data?.status === "success") {
                          setImportModal(false);
                          setTimeout(() => {
                            window.location.reload();
                          }, 2000);
                          dispatch(
                            showToast({
                              message: "Contacts fetched successfully",
                              variant: "success",
                            })
                          );

                          window.removeEventListener("message", messageHandler);
                          popup?.close();
                        }
                      };
                      window.addEventListener("message", messageHandler);

                      const popup = window.open(
                        response.data.url,
                        "_blank",
                        `width=${width},height=${height},left=${left},top=${top}`
                      );
                      if (!popup) {
                        console.error("Popup blocked");
                      }
                    }
                  } catch (error) {
                    console.error("Hubspot Sign-In initiation failed", error);
                  }
                }
                if (selectedOption !== "google") {
                  nextStep();
                }
              }}
            >
              Import
            </button>
          )}
        </div>
      </>
    );
  };
  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const contacts = XLSX.utils.sheet_to_json(sheet);

      const response = await dispatch(saveBulkContacts(contacts)).unwrap();
      console.log(response, "response from thejsdbmsdb");

      if (response.status == "success") {
        setImportModal(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };
  const Step3 = () => {
    const { handleStep, previousStep, nextStep } = useWizard();

    return (
      <>
        {selectedOption === "csvExcel" && (
          <div>
            <h2 className="uploadHeading">Upload Your File</h2>
            <div className="uploadSectionContainer">
              <div className="uploadSectionInnerBox">
                <div className="uploadSectionImageBox">
                  <ImageWithBasePath
                    src="assets/img/customIcons/excelLogo.png"
                    className="uploadSectionImage"
                    alt="Excel Logo"
                  />
                </div>
                <div className="profile-upload d-block">
                  <div className="profile-upload-content">
                    <label className="profile-upload-btn">
                      <i className="ti ti-file-broken" /> Upload File
                      <input
                        type="file"
                        className="input-img"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p>Only Excel file</p>
                  </div>
                </div>
                <p className="supportedFormat">
                  (Supported formats .xlsx; max file size 5 MB)
                </p>
                <p className="text-muted">
                  Download a{" "}
                  <span
                    onClick={handleDownload}
                    style={{ cursor: "pointer", color: "#2c5cc5" }}
                  >
                    sample CSV
                  </span>
                </p>
              </div>
            </div>
            <div className="wizardBtnContainer">
              <button
                className="btn btn-light previousStep"
                onClick={() => previousStep()}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  const handleEditClick = (rowKey, columnKey) => {
    setActiveCell({ rowKey, columnKey });
  };

  const handleClose = () => {
    setActiveCell(null);
  };

  const resetFilters = () => {
    setSelectedLeadStatus([]);
    setSelectedLeadEmployee([]);
    setSearchEmployeeInFilter("");
  };



  // const handleSave = () => {

  //   setPopupVisible(false);
  // };

  // const handleCancel = () => {
  //   setPopupVisible(false);
  // };

  const handleSaveField = (key, field, value) => {
    // Update the record data here. For example:
    // const updatedData = tableData.map((item) =>
    //   item.key === key ? { ...item, [field]: value } : item
    // );
    // setTableData(updatedData);
  };

  const handleDateRangeChange = (startDate, endDate) => {
    setSelectedDateRange({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };

  // Initial column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    "": true,
    Name: true,
    Company: false,
    Phone: true,
    Email: false,
    Status: true,
    "Created Date": true,
    Owner: false,
    Action: true,
  });
  const navigate = useNavigate();
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow(false);
  const handleShow2 = () => setShow(true);
  const handleClose3 = () => setShow(false);
  const handleShow3 = () => setShow(true);
  const togglePopup = (isEditing) => {
    setModalTitle(isEditing ? "Edit Lead" : "Add New Lead");
    setAdduser(!adduser);
  };
  const addcompanyPopup = () => {
    setAddCompany(!addcompany);
  };

  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };
  const handleToggleColumnVisibility = (columnTitle) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));
  };
  // Seach Employee in filter
  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );

  useEffect(() => {
    const shouldHideActionAndBlank = Object.keys(columnVisibility)
      .filter((key) => key !== "" && key !== "Action")
      .every((key) => columnVisibility[key] === false);

    setColumnVisibility((prevState) => {
      // Only update the state if the values are actually different
      if (
        (shouldHideActionAndBlank && (prevState.Action || prevState[""])) ||
        (!shouldHideActionAndBlank && (!prevState.Action || !prevState[""]))
      ) {
        return {
          ...prevState,
          Action: shouldHideActionAndBlank ? false : true,
          "": shouldHideActionAndBlank ? false : true,
        };
      }
      return prevState; // No update needed
    });
  }, [columnVisibility]);

  const handlePhoneClick = (phone) => {
    dispatch(setPhone(phone));
  };

  const handleLeadEditClick = (record) => {
    setSelectedLead(record);
  };
  const columns = [
    {
      title: "",
      dataIndex: "",
      render: (text, record, index) => (
        <div
          className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
          onClick={() => handleStarToggle(index)}
        >
          <i className="fa fa-star"></i>
        </div>
      ),
    },
    {
      title: "Name",
      dataIndex: "lead_name",
      key: "lead_name",
      width: 200,
      onCell: () => ({
        className: "hoverable-cell", // Adding a class for the cell
      }),

      render: (text, record) => {
        return (
          <div className="cell-content justify-content-between">
            {/* Lead name */}

            <Link
              to={route.leadsDetails}
              state={{ record }}
              className="lead-name title-name fw-bold "
              style={{ color: "#2c5cc5" }}
            >
              {text}
            </Link>

            {/* Icons that will be shown on hover */}
            <div className="icons">
              <div className="action-icons d-flex justify-content-center">
                <a
                  //  href={`tel:${text}`}
                  onClick={() => handlePhoneClick(record.phone)}
                  className="action-icon me-3"
                  title="Call"
                >
                  <i className="ti ti-phone" />
                </a>

                <a
                  href={`https://wa.me/${text}`}
                  className="action-icon"
                  title="WhatsApp"
                >
                  <i className="ti ti-message-circle-share me-1" />
                </a>
              </div>
            </div>
            <div>
              <Link
                to="#"
                className="action-icon "
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={() => {
                  handleLeadEditClick(record);
                }}
              >
                <HiEllipsisVertical />
              </Link>
              <div className="dropdown-menu dropdown-menu-right">
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#lead_offcanvas"
                >
                  <i className="ti ti-edit text-blue" /> Edit
                </Link>
                <Link
                  className="dropdown-item"
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target={`#delete_${deleteModalText}`}
                  onClick={() => { setDeleteModalText("lead") }}
                >
                  <i className="ti ti-trash text-danger"></i> Delete
                </Link>
              </div>
            </div>

          </div>
        );
      },

      sorter: (a, b) => a.lead_name.localeCompare(b.lead_name),
    },
    {
      title: "Company",
      dataIndex: "customer_company",
      onCell: (record) => ({
        onMouseEnter: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "visible";
        },
        onMouseLeave: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "hidden";
        },
      }),
      render: (text, record) => {
        return (
          <>
            <EditCell
              fieldName="Company Name"
              fieldValue={text}
              textColor="#2c5cc5"
              routeLink={route.leads}
              recordKey={record.key}
              columnKey="customer_company"
              isActive={record.key === activeRecordKey}
              onEditClick={() => {
                setActiveRecordKey(record.key);
              }}
              onClose={() => setActiveRecordKey(null)}
              onSave={(key, value) =>
                handleSaveField(key, "customer_company", value)
              }
            />
          </>
        );
      },
      sorter: (a, b) => a.customer_company.localeCompare(b.customer_company),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      onCell: (record) => ({
        onMouseEnter: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "visible";
        },
        onMouseLeave: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "hidden";
        },
      }),
      render: (text, record) => (
        <>
          <EditCell
            fieldName="Phone"
            fieldValue={text}
            recordKey={record.key}
            columnKey="phone"
            routeLink="#"
            textColor="#2c5cc5"
            isActive={
              activeCell?.rowKey === record.key &&
              activeCell?.columnKey === "phone"
            }
            onSave={(key, value) => handleSaveField(key, "phone", value)}
            onEditClick={() => handleEditClick(record.key, "phone")}
            onClose={handleClose}
          />
        </>
      ),
      // sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      onCell: (record) => ({
        onMouseEnter: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "visible";
        },
        onMouseLeave: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "hidden";
        },
      }),
      render: (text, record) => (
        <>
          <EditCell
            fieldName="Email"
            fieldValue={text}
            recordKey={record.key}
            columnKey="email"
            routeLink="#"
            textColor="#2c5cc5"
            isActive={
              activeCell?.rowKey === record.key &&
              activeCell?.columnKey === "email"
            }
            onSave={(key, value) => handleSaveField(key, "email", value)}
            onEditClick={() => handleEditClick(record.key, "email")}
            onClose={handleClose}
          />
        </>
      ),
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => (
        <div>
          <div className="dropdown d-inline-block">
            <Link
              to="#"
              className="py-1 border-0"
              style={{
                boxShadow: "none",
                fontSize: "12px",
                padding: "4px 8px 4px 4px",
                color:
                  statusLead[record.key] === "Win"
                    ? "#00795b"
                    : statusLead[record.key] === "Interested"
                      ? "#264966"
                      : statusLead[record.key] === "Contacted"
                        ? "#d58c08"
                        : statusLead[record.key] === "Lost"
                          ? "#ff1616c7"
                          : "#000000c7",
                backgroundColor:
                  statusLead[record.key] === "Win"
                    ? "#e0f5f1"
                    : statusLead[record.key] === "Interested"
                      ? "#dff0ff"
                      : statusLead[record.key] === "Contacted"
                        ? "#ffd9947a"
                        : statusLead[record.key] === "Lost"
                          ? "#c169692b"
                          : "#62626273",
              }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <MdDoubleArrow />
              {statusLead[record.key] || "Select Status"}
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              {leadStatus.map((leadstatus, index) => (
                <Link
                  className="dropdown-item"
                  to="#"
                  key={index}
                  onClick={() => handleLeadStatus(record.key, leadstatus.value)}
                >
                  {leadstatus.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },

    {
      title: "Created Date",
      dataIndex: "created_date",
      key: "created_date",
      sorter: (a, b) =>
        new Date(a.created_date).getTime() - new Date(b.created_date).getTime(),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      onCell: (record) => ({
        onMouseEnter: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "visible";
        },
        onMouseLeave: () => {
          const editIcon = document.querySelector(`.edit-icon-${record.key}`);
          if (editIcon) editIcon.style.visibility = "hidden";
        },
      }),
      render: (text, record) => (
        <>
          <EditCell
            fieldName="Owner"
            fieldValue={text}
            recordKey={record.key}
            columnKey="owner"
            isActive={
              activeCell?.rowKey === record.key &&
              activeCell?.columnKey === "owner"
            }
            onSave={(key, value) => handleSaveField(key, "owner", value)}
            onEditClick={() => handleEditClick(record.key, "owner")}
            onClose={handleClose}
          />
        </>
      ),
      sorter: (a, b) => a.customer_company.length - b.customer_company.length,
    },
  ];

  const handleLeadStatus = (rowKey, value) => {
    setStatusLead((prevState) => ({
      ...prevState,
      [rowKey]: value,
    }));
  };
  useEffect(() => {
    const initialStatuses = leadsData.reduce((acc, lead) => {
      acc[lead.key] = lead.status;
      return acc;
    }, {});
    setStatusLead(initialStatuses);
  }, [leadsData]);

  const getDateRanges = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const startOfLast30Days = new Date(today);
    startOfLast30Days.setDate(today.getDate() - 30);

    const startOfLast7Days = new Date(today);
    startOfLast7Days.setDate(today.getDate() - 7);

    const ranges = {
      "Last 30 Days": [startOfLast30Days, today],
      "Last 7 Days": [startOfLast7Days, today],
      "Last Month": [startOfLastMonth, endOfLastMonth],
      "This Month": [startOfMonth, endOfMonth],
      Today: [today, today],
      Yesterday: [yesterday, yesterday],
    };

    return {
      endDate: today,
      ranges,
      startDate: startOfLast7Days,
      timePicker: false,
    };
  };

  const initialSettings = getDateRanges();

  const addNewContent = () => {
    setNewContents([...newContents, newContents.length]);
  };
  const filteredData = leadsData.filter((lead) => {
    const leadDate = new Date(lead.created_date).toDateString();

    const isAnySearchColumnVisible =
      columnVisibility["Name"] ||
      columnVisibility["Company"] ||
      columnVisibility["Phone"] ||
      columnVisibility["Email"];


    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      (columnVisibility["Name"] &&
        lead.lead_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Company"] &&
        lead.customer_company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Phone"] &&
        lead.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Email"] &&
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()));

    // Check if lead matches selected statuses
    const matchesStatus =
      selectedLeadStatus.length === 0 || // If no status is selected, show all
      selectedLeadStatus.includes(lead.status.toLowerCase());
    // Check if lead matches selected employee
    const matchesEmployee =
      selectedLeadEmployee.length === 0 || // If no status is selected, show all
      selectedLeadEmployee.includes(lead.owner.toLowerCase());

    // Check if lead date is within the selected date range
    // const matchesDateRange =
    //   selectedDateRange.startDate || selectedDateRange.endDate || // If no date range is selected, show all
    //   console.log(selectedDateRange.endDate, "selectedDateRange.endDate");

    // (leadDate >= selectedDateRange.startDate && leadDate <= selectedDateRange.endDate);

    return matchesSearchQuery && matchesStatus && matchesEmployee;
    // && matchesDateRange;
  });

  const filterLeadStatus = (leadStatus) => {
    setSelectedLeadStatus(
      (prevStatus) =>
        prevStatus.includes(leadStatus)
          ? prevStatus.filter((status) => status !== leadStatus) // Remove status if unchecked
          : [...prevStatus, leadStatus] // Add status if checked
    );
  };
  const filterLeadEmployee = (leadEmployee) => {
    setSelectedLeadEmployee((prevStatus) =>
      prevStatus.includes(leadEmployee)
        ? prevStatus.filter((employee) => employee !== leadEmployee)
        : [...prevStatus, leadEmployee]
    );
  };
  const exportPDF = () => {
    const doc = new jsPDF();

    // Filter columns based on column visibility
    const filteredColumns = columns.filter(
      (col) =>
        columnVisibility[col.title] && // Check if the column is visible
        col.title !== "Action" // Exclude the Action column from export
    );

    // Create headers and data based on filtered columns
    const headers = filteredColumns.map((col) => col.title);
    const data = filteredData.map((row) =>
      filteredColumns.map((col) => row[col.dataIndex] || "")
    );

    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = "Leads Report";
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (pageWidth - titleWidth) / 2;

    doc.setFontSize(15);
    doc.text(titleText, titleX, 20);

    doc.setFontSize(10);
    doc.text(`Exported on: ${currentDate} at ${currentTime}`, 15, 35);

    // Generate the table with the headers and data
    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: data,
    });

    // Save the PDF
    doc.save("Calls_report.pdf");
  };

  const exportExcel = () => {
    const wb = utils.book_new();

    // Filter out the columns that are hidden (same as for PDF export)
    const filteredColumns = columns.filter(
      (col) => columnVisibility[col.title] && col.title !== "Action"
    );

    // Prepare worksheet data (only include visible columns)
    const wsData = [
      filteredColumns.map((col) => col.title), // Column headers
      ...filteredData.map((row) =>
        filteredColumns.map((col) => row[col.dataIndex] || "")
      ),
    ];

    // Convert array of arrays to a sheet
    const ws = utils.aoa_to_sheet(wsData);

    // Append the worksheet to the workbook
    utils.book_append_sheet(wb, ws, "Calls");

    // Save the Excel file
    writeFile(wb, "Calls_report.xlsx");
  };

  // Filter columns based on checkbox state
  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.title]
  );

  const numberOfLeads = filteredData.length;

  return (
    <>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    {/* Search */}
                    <div className="row align-items-center">
                      <div className="col-sm-12">

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="page-header mb-0">
                            <div className="row align-items-center">

                              <h4 className="page-title mb-0 ms-5">
                                Leads
                                <span className="count-title">
                                  {filteredData.length}
                                </span>
                              </h4>


                            </div>
                          </div>

                          <div className="d-flex">

                            <div className="icon-form mb-3  me-2 mb-sm-0">
                              <span className="form-icon">
                                <i className="ti ti-search" />
                              </span>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Search Leads"
                                onChange={(text) =>
                                  setSearchQuery(text.target.value)
                                }
                              />
                            </div>
                            <div className="form-sorts dropdown me-2">
                              <Link
                                to="#"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                              >
                                <i className="ti ti-filter-share" />
                                Filter
                              </Link>
                              <div className="filter-dropdown-menu dropdown-menu  dropdown-menu-md-end p-3">
                                <div className="filter-set-view">
                                  <div className="filter-set-head">
                                    <h4>
                                      <i className="ti ti-filter-share" />
                                      Filter
                                    </h4>
                                  </div>
                                  <div
                                    className="accordion"
                                    id="accordionExample"
                                  >
                                    <div className="filter-set-content">
                                      <div className="filter-set-content-head">
                                        <Link
                                          to="#"
                                          className="collapsed"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#Status"
                                          aria-expanded="false"
                                          aria-controls="Status"
                                        >
                                          Lead Status
                                        </Link>
                                      </div>
                                      <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="Status"
                                        data-bs-parent="#accordionExample"
                                      >
                                        <div className="filter-content-list">
                                          <ul>
                                            {leadStatus.map(
                                              (leadStatus, index) => {
                                                return (
                                                  <li key={index}>
                                                    <div className="filter-checks">
                                                      <label className="checkboxs">
                                                        <input
                                                          type="checkbox"
                                                          checked={selectedLeadStatus.includes(
                                                            leadStatus.value.toLowerCase()
                                                          )} // Check if status is selected
                                                          onChange={() =>
                                                            filterLeadStatus(
                                                              leadStatus.value.toLowerCase()
                                                            )
                                                          } // Call filterLeadStatus on change
                                                        />
                                                        <span className="checkmarks" />
                                                        {leadStatus.value}
                                                      </label>
                                                    </div>
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="filter-set-content">
                                      <div className="filter-set-content-head">
                                        <Link
                                          to="#"
                                          className="collapsed"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#owner"
                                          aria-expanded="false"
                                          aria-controls="owner"
                                        >
                                          Lead Owner
                                        </Link>
                                      </div>
                                      <div
                                        className="filter-set-contents accordion-collapse collapse"
                                        id="owner"
                                        data-bs-parent="#accordionExample"
                                      >
                                        <div className="filter-content-list">
                                          <div className="mb-2 icon-form">
                                            <span className="form-icon">
                                              <i className="ti ti-search" />
                                            </span>
                                            <input
                                              type="text"
                                              className="form-control"
                                              placeholder="Search Owner"
                                              value={searchEmployeeInFilter}
                                              onChange={(e) =>
                                                setSearchEmployeeInFilter(
                                                  e.target.value
                                                )
                                              }
                                            />
                                          </div>
                                          <ul>
                                            {filteredEmployees.map(
                                              (companyEmployee, index) => {
                                                return (
                                                  <li key={index}>
                                                    <div className="filter-checks">
                                                      <label className="checkboxs">
                                                        <input
                                                          type="checkbox"
                                                          checked={selectedLeadEmployee.includes(
                                                            companyEmployee.value.toLowerCase()
                                                          )}
                                                          onChange={() =>
                                                            filterLeadEmployee(
                                                              companyEmployee.value.toLowerCase()
                                                            )
                                                          }
                                                        />
                                                        <span className="checkmarks" />
                                                        {companyEmployee.value}
                                                      </label>
                                                    </div>
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="filter-reset-btns">
                                    <div className="row">
                                      <div className="col-6"></div>
                                      <div className="col-6">
                                        <Link
                                          to="#"
                                          className="btn btn-primary"
                                          onClick={resetFilters}
                                        >
                                          Reset
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="dropdown me-2">
                              <Link
                                to="#"
                                className="btn bg-soft-purple text-purple"
                                data-bs-toggle="dropdown"
                                data-bs-auto-close="outside"
                              >
                                <i className="ti ti-columns-3 me-2" />
                                Manage Columns
                              </Link>
                              <div className="dropdown-menu  dropdown-menu-md-end dropdown-md p-3">
                                <h4 className="mb-2 fw-semibold">
                                  Want to manage datatables?
                                </h4>
                                <p className="mb-3">
                                  Please drag and drop your column to reorder
                                  your table and enable see option as you want.
                                </p>
                                <div className="border-top pt-3">
                                  {columns.map((column, index) => {
                                    if (
                                      column.title === "Action" ||
                                      column.title === ""
                                    ) {
                                      return;
                                    }
                                    return (
                                      <div
                                        className="d-flex align-items-center justify-content-between mb-3"
                                        key={index}
                                      >
                                        <p className="mb-0 d-flex align-items-center">
                                          <i className="ti ti-grip-vertical me-2" />
                                          {column.title}
                                        </p>
                                        <div className="status-toggle">
                                          <input
                                            type="checkbox"
                                            id={column.title}
                                            className="check"
                                            checked={!!columnVisibility[column.title]}
                                            onClick={() =>
                                              handleToggleColumnVisibility(
                                                column.title
                                              )
                                            }
                                          />
                                          <label
                                            htmlFor={column.title}
                                            className="checktoggle"
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>

                            <div className="d-flex">
                              <div className="dropdown me-2">
                                <Link
                                  to="#"
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="ti ti-package-export me-2" />
                                  Import / Export
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-end">
                                  <ul className="mb-0">
                                    <li>
                                      <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => setImportModal(true)}
                                      >
                                        <i className="ti ti-file-type-pdf text-danger me-1" />
                                        Import
                                      </button>
                                    </li>
                                    <li>
                                      <Link
                                        to="#"
                                        className="dropdown-item"
                                        onClick={exportPDF}
                                      >
                                        <i className="ti ti-file-type-pdf text-danger me-1" />
                                        Export as PDF
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to="#"
                                        className="dropdown-item"
                                        onClick={exportExcel}
                                      >
                                        <i className="ti ti-file-type-xls text-green me-1" />
                                        Export as Excel{" "}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <Link
                                to="#"
                                className="btn btn-primary me-2"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#lead_offcanvas"
                                onClick={() => {
                                  setSelectedLead(null);
                                }}
                              >
                                <i className="ti ti-square-rounded-plus me-2" />
                                Add Leads
                              </Link>
                              <div className="view-icons">
                                <Link to={route.leads} className="active">
                                  <i className="ti ti-list-tree" />
                                </Link>
                                <Link to={route.leadsKanban}>
                                  <i className="ti ti-grid-dots" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-8">
                        <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end"></div>
                      </div>
                    </div>
                    {/* /Search */}
                  </div>
                  <div className="card-body">
                    {/* Filter */}
                    <div className="d-flex align-items-center justify-content-end flex-wrap row-gap-2 mb-4">
                      {/* <div className="d-flex align-items-center flex-wrap row-gap-2">

                        <div className="icon-form">
                          <span className="form-icon">
                            <i className="ti ti-calendar" />
                          </span>
                          <DateRangePicker initialSettings={initialSettings}>
                            <input
                              className="form-control bookingrange"
                              type="text"
                            />
                          </DateRangePicker>
                        </div>
                      </div> */}
                      <div className="d-flex align-items-center flex-wrap row-gap-2"></div>
                    </div>
                    {/* /Filter */}
                    {/* Contact List */}
                    <div className="table-responsive custom-table">
                      <Table
                        dataSource={filteredData}
                        columns={visibleColumns}
                        rowKey={(record) => record.key}
                      />
                    </div>
                    <div className="row align-items-center">
                      <div className="col-md-6">
                        <div className="datatable-length" />
                      </div>
                      <div className="col-md-6">
                        <div className="datatable-paginate" />
                      </div>
                    </div>
                    {/* /Contact List */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /Page Wrapper */}
        {/* Add Edit Lead */}
        <LeadOffcanvas selectedLead={selectedLead} />
        {/* /Add Edit Lead */}

        {/* Delete Lead */}
        {<DeleteModal text={deleteModalText} />}
        {/* /Delete Lead */}
        {/* Create Lead */}
        <Modal show={openModal2} onHide={() => setOpenModal2(false)}>
          <div className="modal-header border-0 m-0 justify-content-end">
            <button
              className="btn-close"
              onClick={() => setOpenModal2(false)}
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="modal-body">
            <div className="success-message text-center">
              <div className="success-popup-icon bg-light-blue">
                <i className="ti ti-building" />
              </div>
              <h3>Lead Created Successfully!!!</h3>
              <p>View the details of lead, created</p>
              <div className="col-lg-12 text-center modal-btn">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <Link
                  to={route.leadsDetails}
                  onClick={() => setOpenModal2(false)}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </Modal>
        {/* /Create Lead */}
        {/* Create Company */}
        <Modal show={openModal} onHide={() => setOpenModal(false)}>
          <div className="modal-header border-0 m-0 justify-content-end">
            <button
              className="btn-close"
              onClick={() => setOpenModal(false)}
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="modal-body">
            <div className="success-message text-center">
              <div className="success-popup-icon bg-light-blue">
                <i className="ti ti-building" />
              </div>
              <h3>Company Created Successfully!!!</h3>
              <p>View the details of company, created</p>
              <div className="col-lg-12 text-center modal-btn">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <Link
                  to={route.companyDetails}
                  onClick={() => setOpenModal(false)}
                  className="btn btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </Modal>
        {/* /Create Company */}
        {/* Add New View */}
        <div className="modal custom-modal fade" id="save_view" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New View</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="col-form-label">View Name</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="modal-btn text-end">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-danger"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Add New View */}
        {/* Access */}
        <div className="modal custom-modal fade" id="access_view" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Access For</h5>
                <button
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="ti ti-x" />
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-2 icon-form">
                    <span className="form-icon">
                      <i className="ti ti-search" />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                  </div>
                  <div className="access-wrap">
                    <ul>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-19.jpg"
                              alt=""
                            />
                            <Link to="#">Darlee Robertson</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-20.jpg"
                              alt=""
                            />
                            <Link to="#">Sharon Roy</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-21.jpg"
                              alt=""
                            />
                            <Link to="#">Vaughan</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-01.jpg"
                              alt=""
                            />
                            <Link to="#">Jessica</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-16.jpg"
                              alt=""
                            />
                            <Link to="#">Carol Thomas</Link>
                          </span>
                        </label>
                      </li>
                      <li className="select-people-checkbox">
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                          <span className="people-profile">
                            <ImageWithBasePath
                              src="assets/img/profiles/avatar-22.jpg"
                              alt=""
                            />
                            <Link to="#">Dawn Mercha</Link>
                          </span>
                        </label>
                      </li>
                    </ul>
                  </div>
                  <div className="modal-btn text-end">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <button
                      type="button"
                      data-bs-dismiss="modal"
                      className="btn btn-primary"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* /Access */}

        {/* import leads */}
        <Modal
          show={importModal}
          onHide={() => setImportModal(false)}
          fullscreen
        >
          <div className="modal-header border-0 m-0 justify-content-end">
            <button
              className="btn-close"
              onClick={() => setImportModal(false)}
              aria-label="Close"
            >
              <i className="ti ti-x" />
            </button>
          </div>
          <div className="modal-body">
            <div>
              <Wizard
                startIndex={0}
              // wrapper={<Wrapper />}
              >
                <Step1 />
                {/* <Step2 /> */}
                <Step3 />
              </Wizard>
            </div>
          </div>
          <div className="modal-footer"></div>
        </Modal>
        {/* import leads */}
      </>
    </>
  );
};

export default Leads;
