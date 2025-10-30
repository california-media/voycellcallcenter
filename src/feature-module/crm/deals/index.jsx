import React, { useEffect, useState } from "react";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
// import FilterModal from "../../../core/modals/filter_modal";
import { dealsData } from "../../../core/data/json/dealsData";
import Table from "../../../core/common/dataTable/index";
import { DealsInterface } from "../../../core/data/interface";
// import DealsModal from "../../../core/modals/deals_modal";
import { useDispatch, useSelector } from "react-redux";
import CreatableSelect from 'react-select/creatable';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  setActivityTogglePopup,
  setActivityTogglePopupTwo,
  setAddTogglePopupTwo,
} from "../../../core/data/redux/commonSlice";
import DefaultEditor from "react-simple-wysiwyg";
import Select from "react-select";
import DatePicker from "react-datepicker";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import { TagsInput } from "react-tag-input-component";

import {
  optionssymbol,
  priorityList,
  project,
  salestypelist,
  socialMedia,
  tagInputValues,
  companyName,
  dealType,
  dealStage,
  statusDeal,
  dealStatus,
  all_tags,
  optionsource,
  owner as companyEmployee
} from "../../../core/common/selectoption/selectoption";
import CollapseHeader from "../../../core/common/collapse-header";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { Modal } from "react-bootstrap";
import { leadsData } from "../../../core/data/json/leads";
import DealOffcanvas from "../../../core/common/offCanvas/deal/DealOffcanvas";
import DeleteModal from "../../../core/common/modals/DeleteModal";
import { HiEllipsisVertical } from "react-icons/hi2";
import EditCell from "../../../core/common/editCell/EditCell";
import { MdDoubleArrow } from "react-icons/md";
import { contactData } from "../../../core/data/json/contactData";

const Deals = () => {
  const [owner, setOwner] = useState(["Collab"]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCell, setActiveCell] = useState(null);
  const [statusDeal, setStatusDeal] = useState({});
  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
  const [selectedDealEmployee, setSelectedDealEmployee] = useState([]);
  const [selectedDealStatus, setSelectedDealStatus] = useState([]);
  const [sliderValues, setSliderValues] = useState([0, 0]);
  const [maxDealValue, setMaxDealValue] = useState();
  const [minDealValue, setMinDealValue] = useState();
  const [columnVisibility, setColumnVisibility] = useState({
    "": true,
    "Company": true,
    "Deal Name": true,
    "Contact Person": true,
    Project: true,
    Tags: true,
    "Deal Value": true,
    "Deal Status": true,
    "Created Date": true,
    Owner: true,
  });
  const sourcelist = [
    { value: "select", label: "Select" },
    { value: "google", label: "Google" },
    { value: "social-media", label: "Social Media" },
  ];
  const priority = [
    { value: "select", label: "Select" },
    { value: "Highy", label: "Highy" },
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
  ];

  const dispatch = useDispatch();
  const activityToggle = useSelector(
    (state) => state?.activityTogglePopup
  );
  const addTogglePopupTwo = useSelector(
    (state) => state?.addTogglePopupTwo
  );
  const activityToggleTwo = useSelector(
    (state) => state?.activityTogglePopupTwo
  );

  const currentDateAndTime = new Date();
  const currentDate = currentDateAndTime.toLocaleDateString();
  const currentTime = currentDateAndTime.toLocaleTimeString();
  // const data = dealsData;
  const route = all_routes;
  const initialSettings = {
    endDate: new Date("2020-08-11T12:30:00.000Z"),
    ranges: {
      "Last 30 Days": [
        new Date("2020-07-12T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last 7 Days": [
        new Date("2020-08-04T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      "Last Month": [
        new Date("2020-06-30T18:30:00.000Z"),
        new Date("2020-07-31T18:29:59.999Z"),
      ],
      "This Month": [
        new Date("2020-07-31T18:30:00.000Z"),
        new Date("2020-08-31T18:29:59.999Z"),
      ],
      Today: [
        new Date("2020-08-10T04:57:17.076Z"),
        new Date("2020-08-10T04:57:17.076Z"),
      ],
      Yesterday: [
        new Date("2020-08-09T04:57:17.076Z"),
        new Date("2020-08-09T04:57:17.076Z"),
      ],
    },
    startDate: new Date("2020-08-04T04:57:17.076Z"), // Set "Last 7 Days" as default
    timePicker: false,
  };
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const [selectedDate1, setSelectedDate1] = useState(new Date());
  const handleDateChange1 = (date) => {
    setSelectedDate1(date);
  };
  const [selectedDate2, setSelectedDate2] = useState(new Date());
  const handleDateChange2 = (date) => {
    setSelectedDate2(date);
  };
  const handleSliderChange = (values) => {
    setSliderValues(values);
  };
  const handleDealEditClick = (record) => {
    setSelectedDeal(record);
  };
  const handleDealValueChange = (index, event) => {
    const newValue = parseInt(event.target.value) || 0;
    const newValues = [...sliderValues];
    newValues[index] = newValue;

    // Ensure the new values are within range and valid
    if (newValues[0] <= newValues[1] && newValues[1] <= maxDealValue) {
      setSliderValues(newValues);
    }
  };
  const handleSaveField = (key, field, value) => {
    // Update the record data here. For example:
    // const updatedData = tableData.map((item) =>
    //   item.key === key ? { ...item, [field]: value } : item
    // );
    // setTableData(updatedData);
  };
  const handleEditClick = (rowKey, columnKey) => {
    setActiveCell({ rowKey, columnKey });
  };
  const handleClose = () => {
    setActiveCell(null);
  };
  const handleToggleColumnVisibility = (columnTitle) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));
  };
  const handleDealSliderChange = (value) => {
    setSliderValues(value);
  };
  const resetFilters = () => {
    setSelectedDealStatus([]);
    setSelectedDealEmployee([]);
    setSearchEmployeeInFilter("");
    setSliderValues([minDealValue, maxDealValue]);
    
  };
  const [stars, setStars] = useState({});

  const initializeStarsState = () => {
    const starsState = {};
    dealsData.forEach((item, index) => {
      starsState[index] = false;
    });
    setStars(starsState);
  };
  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );
  const filterDealEmployee = (dealEmployee) => {
    setSelectedDealEmployee((prevStatus) =>
      prevStatus.includes(dealEmployee)
        ? prevStatus.filter((employee) => employee !== dealEmployee)
        : [...prevStatus, dealEmployee]
    );
  };

  const filteredData = dealsData.filter((deal) => {
    const isAnySearchColumnVisible =
      columnVisibility["Company"] ||
      columnVisibility["Contact Person"] ||
      columnVisibility["Deal Value"] ||
      columnVisibility["Deal Name"] ||
      columnVisibility["Project"] ||
      columnVisibility["Tags"]



    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      (columnVisibility["Deal Name"] &&
        deal.dealName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (
        columnVisibility["Company"] &&
        deal.customer_company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Contact Person"] &&
        deal.relatedContact.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Project"] &&
        deal.relatedProject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Tags"] &&
        deal.customer_tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (columnVisibility["Owner"] &&
        deal.owner.toLowerCase().includes(searchQuery.toLowerCase()));


    const matchesStatus =
      selectedDealStatus.length === 0 ||
      selectedDealStatus.includes(deal.dealStatus.toLowerCase());

    const matchesEmployee =
      selectedDealEmployee.length === 0 ||
      selectedDealEmployee.includes(deal.owner.toLowerCase());

    // Check if the deal value is within the slider range
    const matchesDealValueRange =
      parseInt(deal.dealValue) >= sliderValues[0] &&
      parseInt(deal.dealValue) <= sliderValues[1];


    return matchesSearchQuery
      && matchesStatus
      && matchesEmployee
      && matchesDealValueRange
  });


  const handleDealStatus = (rowKey, value) => {
    setStatusDeal((prevState) => ({
      ...prevState,
      [rowKey]: value,
    }));
  };
  const filterDealStatus = (dealStatus) => {
    setSelectedDealStatus(
      (prevStatus) =>
        prevStatus.includes(dealStatus)
          ? prevStatus.filter((status) => status !== dealStatus) // Remove status if unchecked
          : [...prevStatus, dealStatus] // Add status if checked
    );
  };
  useEffect(() => {
    const initialStatuses = dealsData.reduce((acc, deal) => {
      acc[deal.key] = deal.dealStatus;
      return acc;
    }, {});
    console.log(statusDeal, "status Deal");

    setStatusDeal(initialStatuses);
  }, [dealsData]);
  // Call initializeStarsState once when the component mounts
  React.useEffect(() => {
    initializeStarsState();
  }, []);
  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };
  // Calculate the maximum deal value
  useEffect(() => {
    const maxValue = Math.max(...dealsData.map((deal) => parseInt(deal.dealValue)));
    const minValue = Math.min(...dealsData.map((deal) => parseInt(deal.dealValue)));
    setMaxDealValue(maxValue);
    setMinDealValue(minValue);
    setSliderValues([minValue, maxValue])
  }, []);
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
      title: "Deal Name",
      dataIndex: "dealName",
      render: (text, record) => (
        <div className="cell-content justify-content-between">
          <div>
            <Link to={route.dealsDetails} state={{ record }} className="title-name" style={{ color: '#2c5cc5', textDecoration: 'none', fontWeight: 700 }}>{text}</Link>
          </div>
          <div>
            <Link
              to="#"
              className="action-icon "
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={() => {
                handleDealEditClick(record);
              }}
            >
              <HiEllipsisVertical />
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              <Link
                className="dropdown-item"
                to="#"
                data-bs-toggle="offcanvas"
                data-bs-target="#deal_offcanvas"
              >
                <i className="ti ti-edit text-blue" /> Edit
              </Link>
              <Link
                className="dropdown-item"
                to="#"
                data-bs-toggle="modal"
                data-bs-target={`#delete_${deleteModalText}`}
                onClick={() => { setDeleteModalText("deal") }}
              >
                <i className="ti ti-trash text-danger"></i> Delete
              </Link>
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.dealName.localeCompare(b.dealName),
    },
    {
      title: "Company",
      dataIndex: "customer_company",
      render: (text, record) => {
        const companyDetails = contactData.find(
          (contact) => contact.customer_company === text
        );

        return (
          <>
            <EditCell
              fieldName="Company"
              fieldValue={text}
              recordKey={record.key}
              columnKey="customer_company"
              routeLink={route.contactDetails}
              record={companyDetails || record} // Pass matched company details or original record
              textColor="#2c5cc5"
              isActive={
                activeCell?.rowKey === record.key &&
                activeCell?.columnKey === "customer_company"
              }
              onSave={(key, value) => handleSaveField(key, "customer_company", value)}
              onEditClick={() => {
                // This is where you can handle your click without the need for a separate function
                console.log("Clicked on company:", companyDetails);
                // Here you could directly use companyDetails for whatever you need
              }}
              onClose={handleClose}
            />
          </>
        );
      },
      sorter: (a, b) => a.customer_company.localeCompare(b.customer_company),
    }
    ,
    {
      title: "Contact Person",
      dataIndex: "relatedContact",
      render: (text, record) => (
        <>
          <EditCell
            fieldName="Contact Person"
            fieldValue={text}
            recordKey={record.key}
            columnKey="relatedContact"
            routeLink="#"
            textColor="#2c5cc5"
            isActive={
              activeCell?.rowKey === record.key &&
              activeCell?.columnKey === "relatedContact"
            }
            onSave={(key, value) => handleSaveField(key, "relatedContact", value)}
            onEditClick={() => handleEditClick(record.key, "relatedContact")}
            onClose={handleClose}
          />
        </>
      ),
      sorter: (a, b) => a.relatedContact.localeCompare(b.relatedContact),
    },
    {
      title: "Project",
      dataIndex: "relatedProject",
      render: (text, record) => (
        <>
          <EditCell
            fieldName="Project"
            fieldValue={text}
            recordKey={record.key}
            columnKey="relatedProject"
            routeLink="#"
            textColor="#2c5cc5"
            isActive={
              activeCell?.rowKey === record.key &&
              activeCell?.columnKey === "relatedProject"
            }
            onSave={(key, value) => handleSaveField(key, "relatedProject", value)}
            onEditClick={() => handleEditClick(record.key, "relatedProject")}
            onClose={handleClose}
          />
        </>
      ),
      sorter: (a, b) => a.relatedProject.localeCompare(b.relatedProject),
    },
    {
      title: "Deal Value",
      dataIndex: "dealValue",
      render: (text, record) => (
        <>
          <EditCell
            fieldName="Deal Value"
            fieldValue={text}
            recordKey={record.key}
            columnKey="dealValue"
            routeLink="#"
            textColor="#2c5cc5"
            isActive={
              activeCell?.rowKey === record.key &&
              activeCell?.columnKey === "dealValue"
            }
            onSave={(key, value) => handleSaveField(key, "dealValue", value)}
            onEditClick={() => handleEditClick(record.key, "dealValue")}
            onClose={handleClose}
          />
        </>
      ),
      sorter: (a, b) => Number(b.dealValue) - Number(a.dealValue)
    },
    {
      title: "Tags",
      dataIndex: "customer_tag",
      render: (text, record) => {
        return (
          <>
            <EditCell
              fieldName="Tags"
              fieldValue={text}
              recordKey={record.key}
              columnKey="customer_tag"
              routeLink=""
              textColor="#2c5cc5"
              isActive={
                activeCell?.rowKey === record.key &&
                activeCell?.columnKey === "customer_tag"
              }
              onSave={(key, value) => handleSaveField(key, "customer_tag", value)}
              onEditClick={() => handleEditClick(record.key, "customer_tag")}
              onClose={handleClose}
            />
          </>
        );
      },
      sorter: (a, b) => a.customer_tag.localeCompare(b.customer_tag),
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      sorter: (a, b) => a.createdDate.localeCompare(b.createdDate),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      render: (text, record) => (
        <>
          <EditCell
            fieldName="Owner"
            fieldValue={text}
            recordKey={record.key}
            columnKey="owner"
            routeLink="#"
            textColor="#2c5cc5"
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
      sorter: (a, b) => a.owner.localeCompare(b.owner),
    },
    {
      title: "Deal Status",
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
                  statusDeal[record.key] === "Qualify To Buy"
                    ? "#00795b"
                    : statusDeal[record.key] === "Negotiation"
                      ? "#264966"
                      : statusDeal[record.key] === "Proposal Sent"
                        ? "#d58c08"
                        : statusDeal[record.key] === "Closed"
                          ? "#ff1616c7"
                          : "#000000c7",
                backgroundColor:
                  statusDeal[record.key] === "Qualify To Buy"
                    ? "#e0f5f1"
                    : statusDeal[record.key] === "Negotiation"
                      ? "#dff0ff"
                      : statusDeal[record.key] === "Proposal Sent"
                        ? "#ffd9947a"
                        : statusDeal[record.key] === "Closed"
                          ? "#c169692b"
                          : "#62626273",
              }}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <MdDoubleArrow />
              {statusDeal[record.key] || "Select Status"}
            </Link>
            <div className="dropdown-menu dropdown-menu-right">
              {dealStatus.map((dealstatus, index) => (
                <Link
                  className="dropdown-item"
                  to="#"
                  key={index}
                  onClick={() => handleDealStatus(record.key, dealstatus.value)}
                >
                  {dealstatus.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
  ];
  const pipelineOption = [
    { value: "choose", label: "Choose" },
    { value: "sales", label: "Sales" },
    { value: "marketing", label: "Marketing" },
    { value: "calls", label: "Calls" },
  ];
  const status = [
    { value: "choose", label: "Choose" },
    { value: "Open", label: "Open" },
    { value: "Lost", label: "Lost" },
    { value: "Won", label: "Won" },
  ];
  const currency = [
    { value: "Select", label: "Select" },
    { value: "$", label: "$" },
    { value: "€", label: "€" },
  ];

  const duration = [
    { value: "Choose", label: "Choose" },
    { value: "Days", label: "Days" },
    { value: "Month", label: "Month" },
  ];

  const filteredColumns = columns.filter(
    (col) =>
      columnVisibility[col.title]
  );
  const headers = filteredColumns.map((col) => col.title);
  const data = filteredData.map((row) =>
    filteredColumns.map((col) => row[col.dataIndex] || "")
  );
  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.title]
  );
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
    const titleText = "Deals Report";
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
    doc.save("Deals_report.pdf");
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
    utils.book_append_sheet(wb, ws, "Deals");

    // Save the Excel file
    writeFile(wb, "Deals_report.xlsx");
  };
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  {/* Filter */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                    <div className="page-header mb-0">
                      <div className="row align-items-center">

                        <h4 className="page-title mb-0 ms-5">
                          Deals
                          <span className="count-title">
                            {filteredData.length}
                          </span>
                        </h4>
                      </div>
                    </div>
                    <div className="d-flex align-items-center flex-wrap row-gap-2">
                      <div className="icon-form mb-3 mb-sm-0 me-2">
                        <span className="form-icon">
                          <i className="ti ti-search" />
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search Deals"
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
                            <div className="accordion" id="accordionExample">
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
                                    Deal Owner
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
                                                    checked={selectedDealEmployee.includes(
                                                      companyEmployee.value.toLowerCase()
                                                    )}
                                                    onChange={() =>
                                                      filterDealEmployee(
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
                                    Deal Status
                                  </Link>
                                </div>
                                <div
                                  className="filter-set-contents accordion-collapse collapse"
                                  id="Status"
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="filter-content-list">
                                    <ul>
                                      {dealStatus.map(
                                        (dealStatus, index) => {
                                          return (
                                            <li key={index}>
                                              <div className="filter-checks">
                                                <label className="checkboxs">
                                                  <input
                                                    type="checkbox"
                                                    checked={selectedDealStatus.includes(
                                                      dealStatus.value.toLowerCase()
                                                    )} // Check if status is selected
                                                    onChange={() =>
                                                      filterDealStatus(
                                                        dealStatus.value.toLowerCase()
                                                      )
                                                    } // Call filterLeadStatus on change
                                                  />
                                                  <span className="checkmarks" />
                                                  {dealStatus.value}
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
                                    data-bs-target="#Value"
                                    aria-expanded="false"
                                    aria-controls="Value"
                                  >
                                    Deal Value
                                  </Link>
                                </div>
                                <div
                                  className="filter-set-contents accordion-collapse collapse"
                                  id="Value"
                                  data-bs-parent="#accordionExample"
                                >
                                  <div className="filter-content-list">
                                    {/* <ul>
                                      {dealStatus.map(
                                        (dealStatus, index) => {
                                          return (
                                            <li key={index}>
                                              <div className="filter-checks">
                                                <label className="checkboxs">
                                                  <input
                                                    type="checkbox"
                                                    checked={selectedDealStatus.includes(
                                                      dealStatus.value.toLowerCase()
                                                    )} // Check if status is selected
                                                    onChange={() =>
                                                      filterDealStatus(
                                                        dealStatus.value.toLowerCase()
                                                      )
                                                    } // Call filterLeadStatus on change
                                                  />
                                                  <span className="checkmarks" />
                                                  {dealStatus.value}
                                                </label>
                                              </div>
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul> */}
                                    <div className="col-md-12">
                                      <div className="card mb-0">
                                        <div className="card-body">
                                          <Slider
                                            min={minDealValue}
                                            max={maxDealValue}
                                            step={2}
                                            value={sliderValues}
                                            onChange={handleDealSliderChange}
                                            range
                                          />
                                          <div className="d-flex justify-content-between">
                                            {/* <span>{sliderValues[0]} AED</span> <span>{sliderValues[1]} AED</span> */}
                                            {/* <div>
                                              <label>Min Value: </label>
                                              <input
                                                type="number"
                                                value={sliderValues[0]}
                                                onChange={(e) => handleDealValueChange(0, e)}
                                              /> AED
                                            </div> */}
                                            <div className="row mb-0">
                                              {/* <div className="col-lg-10"> */}
                                              <div className="input-group input-group-sm pt-2 px-0 mb-3" style={{ width: 150 }}>
                                                <span className="input-group-text">AED</span>
                                                {/* <span className="input-group-text">0.00</span> */}
                                                <input className="form-control" type="number"
                                                  value={sliderValues[0]}
                                                  onChange={(e) => handleDealValueChange(0, e)} />
                                              </div>
                                              {/* </div> */}
                                            </div>
                                            <div className="row mb-0">
                                              {/* <div className="col-lg-10"> */}
                                              <div className="input-group input-group-sm pt-2 px-0 mb-3" style={{ width: 150 }}>
                                                <span className="input-group-text">AED</span>
                                                {/* <span className="input-group-text">0.00</span> */}
                                                <input className="form-control" type="number"
                                                  value={sliderValues[1]}
                                                  onChange={(e) => handleDealValueChange(1, e)} />
                                              </div>
                                              {/* </div> */}
                                            </div>
                                            {/* <div>
                                              <label>Max Value: </label>
                                              <input
                                                type="number"
                                                value={sliderValues[1]}
                                                onChange={(e) => handleDealValueChange(1, e)}
                                              /> AED
                                            </div> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="filter-reset-btns">
                              <div className="row">
                                <div className="col-6">
                                  <Link to="#" className="btn btn-light" onClick={resetFilters}>
                                    Reset
                                  </Link>
                                </div>
                                <div className="col-6">
                                  <Link to={route.deals} className="btn btn-primary">
                                    Filter
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

                          <div className="pt-3">
                            {columns.map((column, index) => {
                              if (
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
                                      defaultChecked={true}
                                      onClick={() => {
                                        handleToggleColumnVisibility(column.title)


                                      }
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

                      <div className="dropdown me-2">
                        <Link
                          to="#"
                          className="dropdown-toggle"
                          data-bs-toggle="dropdown"
                        >
                          <i className="ti ti-package-export me-2" />
                          Export
                        </Link>
                        <div className="dropdown-menu  dropdown-menu-end">
                          <ul className="mb-0">
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
                        className="btn btn-primary"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#deal_offcanvas"
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add Deals
                      </Link>
                      <div className="view-icons">
                        <Link to={route.deals} className="active">
                          <i className="ti ti-list-tree" />
                        </Link>
                        <Link to={route.dealsKanban}>
                          <i className="ti ti-grid-dots" />
                        </Link>
                      </div>
                    </div>
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
      <DealOffcanvas />
      {/* Delete Deal */}
      {<DeleteModal text={deleteModalText} />}
      {/* /Delete Deal */}
      {/* Create Deal */}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <div className="modal-header border-0 m-0 justify-content-end">
          <button
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            onClick={() => setOpenModal(false)}
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="success-message text-center">
            <div className="success-popup-icon bg-light-blue">
              <i className="ti ti-medal" />
            </div>
            <h3>Deal Created Successfully!!!</h3>
            <p>View the details of deal, created</p>
            <div className="col-lg-12 text-center modal-btn">
              <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                Cancel
              </Link>
              <Link to={route.dealsDetails} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Create Deal */}
      {/* Add New Pipeline */}
      {/* <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_pipeline"
      >
        <div className="offcanvas-header border-bottom">
          <h4>Add New Pipeline</h4>
          <button
            type="button"
            className="btn-close custom-btn-close border p-1 me-0 d-flex align-items-center justify-content-center rounded-circle"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="offcanvas-body">
          <form >
            <div>
              <div className="mb-3">
                <label className="col-form-label">
                  Pipeline Name <span className="text-danger">*</span>
                </label>
                <input className="form-control" type="text" />
              </div>
              <div className="mb-3">
                <div className="pipe-title d-flex align-items-center justify-content-between">
                  <h5 className="form-title">Pipeline Stages</h5>
                  <Link
                    to="#"
                    className="add-stage"
                    data-bs-toggle="modal"
                    data-bs-target="#add_stage"
                  >
                    <i className="ti ti-square-rounded-plus" />
                    Add New
                  </Link>
                </div>
                <div className="pipeline-listing">
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Inpipeline
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_stage"
                      >
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Follow Up
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_stage"
                      >
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                  <div className="pipeline-item">
                    <p>
                      <i className="ti ti-grip-vertical" /> Schedule Service
                    </p>
                    <div className="action-pipeline">
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#edit_stage"
                      >
                        <i className="ti ti-edit text-blue" />
                        Edit
                      </Link>
                      <Link
                        to="#"
                        data-bs-toggle="modal"
                        data-bs-target="#delete_stage"
                      >
                        <i className="ti ti-trash text-danger" />
                        Delete
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <h5 className="form-title">Access</h5>
                <div className="d-flex flex-wrap access-item nav">
                  <div
                    className="radio-btn"
                    data-bs-toggle="tab"
                    data-bs-target="#all"
                  >
                    <input
                      type="radio"
                      className="status-radio"
                      id="all"
                      name="status"
                      defaultChecked
                    />
                    <label htmlFor="all">All</label>
                  </div>
                  <div
                    className="radio-btn"
                    data-bs-toggle="tab"
                    data-bs-target="#select-person"
                  >
                    <input
                      type="radio"
                      className="status-radio"
                      id="select"
                      name="status"
                    />
                    <label htmlFor="select">Select Person</label>
                  </div>
                </div>
                <div className="tab-content mb-3">
                  <div className="tab-pane fade" id="select-person">
                    <div className="access-wrapper">
                      <div className="access-view">
                        <div className="access-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-21.jpg"
                            alt="Image"
                          />
                          Vaughan
                        </div>
                        <Link to="#">Remove</Link>
                      </div>
                      <div className="access-view">
                        <div className="access-img">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt="Image"
                          />
                          Jessica
                        </div>
                        <Link to="#">Remove</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end">
              <button
                type="button"
                data-bs-dismiss="offcanvas"
                className="btn btn-light me-2"
              >
                Cancel
              </button>
              <button type="button" className="btn btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div> */}
      {/* /Add New Pipeline */}
      {/* Delete Stage */}
      <div className="modal fade" id="delete_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                  <i className="ti ti-trash-x fs-36 text-danger" />
                </div>
                <h4 className="mb-2">Remove Stage?</h4>
                <p className="mb-0">
                  Are you sure you want to remove <br /> stage you selected.
                </p>
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <Link to={route.deals} data-bs-dismiss="modal" className="btn btn-danger">
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Stage */}
      {/* Add New Stage */}
      <div className="modal custom-modal fade" id="add_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Stage</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New Stage */}
      {/* Edit Stage */}
      <div className="modal custom-modal fade" id="edit_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Stage</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Inpipeline"
                  />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Stage */}
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
              <form >
                <div className="mb-3">
                  <label className="col-form-label">View Name</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New View */}
    </>

  );
};

export default Deals;
