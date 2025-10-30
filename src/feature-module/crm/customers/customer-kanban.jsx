import React, { useState } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  companyName,
  duration,
  initialSettings,
  optionssymbol,
  priorityList,
  project,
  salestypelist,
  socialMedia,
  status,
  tagInputValues,
  owner as companyEmployee,
  all_tags,
} from "../../../core/common/selectoption/selectoption";
import DefaultEditor from "react-simple-wysiwyg";
import { useDispatch, useSelector } from "react-redux";
import { contactData } from "../../../core/data/json/contactData";
import { Modal } from "react-bootstrap";
import {
  setActivityTogglePopup,
  setActivityTogglePopupTwo,
} from "../../../core/data/redux/commonSlice";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { TagsInput } from "react-tag-input-component";
import CollapseHeader from "../../../core/common/collapse-header";
import CreatableSelect from 'react-select/creatable';
import { SelectWithImage } from "../../../core/common/selectWithImage";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { FaRegBuilding, FaSortAlphaDown, FaSortAlphaDownAlt, FaSortAmountDown } from "react-icons/fa";
import CustomerOffcanvas from "../../../core/common/offCanvas/customer/CustomerOffcanvas";

const ContactGrid = () => {
  const route = all_routes;
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
  const [selectedContactEmployee, setSelectedContactEmployee] = useState([]);
  const [selectedContactStatus, setSelectedContactStatus] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const activityToggle = useSelector(
    (state) => state?.activityTogglePopup
  );
  const activityToggleTwo = useSelector(
    (state) => state?.activityTogglePopupTwo
  );
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
  const [selectedDate4, setSelectedDate4] = useState(new Date());
  const handleDateChange4 = (date) => {
    setSelectedDate4(date);
  };
  const [owner, setOwner] = useState(["Collab"]);
  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );
  const all_companies = [...new Set(contactData.map((contact) => contact.customer_company))]
    .map(company => ({ label: company, value: company }));
  const filterContactEmployee = (contactEmployee) => {
    setSelectedContactEmployee((prevStatus) =>
      prevStatus.includes(contactEmployee)
        ? prevStatus.filter((employee) => employee !== contactEmployee)
        : [...prevStatus, contactEmployee]
    );
  };
  const getInitials = (customer) => {

    const parts = customer.trim().split(" ");
    const firstName = parts[0] || '';
    const lastName = parts[1] || '';

    if (lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return `${firstName.charAt(0)}${firstName.charAt(1) || ''}`.toUpperCase(); // Handle single-letter first names
  };

  const filteredContactData = contactData.filter((contact) => {
    const matchesSearchQuery =
      (contact.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (contact.email.toLowerCase().includes(searchQuery.toLowerCase()));


    const matchesStatus =
      selectedContactStatus.length === 0 ||
      selectedContactStatus.includes(contact.status.toLowerCase());

    const matchesEmployee =
      selectedContactEmployee.length === 0 ||
      selectedContactEmployee.includes(contact.owner.toLowerCase());

    return matchesSearchQuery && matchesStatus && matchesEmployee;
  }).sort((a, b) => {
    if (sortOrder === "asc") {
      return a.customer_name.localeCompare(b.customer_name);
    } else {
      return b.customer_name.localeCompare(a.customer_name);
    }
  });

  const resetFilters = () => {
    setSelectedContactStatus([]);
    setSelectedContactEmployee([]);
    setSearchEmployeeInFilter("");
  };
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer)
  }
  const dealsopen = [
    { value: "choose", label: "Choose" },
    { value: "collins", label: "Collins" },
    { value: "konopelski", label: "Konopelski" },
    { value: "adams", label: "Adams" },
    { value: "schumm", label: "Schumm" },
    { value: "wisozk", label: "Wisozk" },
  ];
  const activities = [
    { value: "choose", label: "Choose" },
    { value: "phoneCalls", label: "Phone Calls" },
    { value: "socialMedia", label: "Social Media" },
    { value: "referralSites", label: "Referral Sites" },
    { value: "webAnalytics", label: "Web Analytics" },
    { value: "previousPurchases", label: "Previous Purchases" },
  ];
  const industries = [
    { value: "choose", label: "Choose" },
    { value: "Retail Industry", label: "Retail Industry" },
    { value: "Banking", label: "Banking" },
    { value: "Hotels", label: "Hotels" },
    { value: "Financial Services", label: "Financial Services" },
    { value: "Insurance", label: "Insurance" },
  ];
  const languages = [
    { value: "Choose", label: "Choose" },
    { value: "English", label: "English" },
    { value: "Arabic", label: "Arabic" },
    { value: "Chinese", label: "Chinese" },
    { value: "Hindi", label: "Hindi" },
  ];
  const countries = [
    { value: "Choose", label: "Choose" },
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "France", label: "France" },
    { value: "UAE", label: "UAE" },
  ];
  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}

              {/* /Page Header */}
              <div className="card ">
                <div className="card-body">

                  {/* Filter */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-2 mb-4">
                    <div className="page-header mb-0 ms-5">
                      <div className="row align-items-center">
                        <h4 className="page-title mb-0">
                          Customers<span className="count-title">{filteredContactData.length}</span>
                        </h4>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="d-flex align-items-center flex-wrap row-gap-2">
                        <div className="icon-form me-2 mb-sm-0">
                          <span className="form-icon">
                            <i className="ti ti-search" />
                          </span>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Customers"
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
                                          onChange={(e) => setSearchEmployeeInFilter(e.target.value)}
                                        />
                                      </div>
                                      <ul>
                                        {
                                          filteredEmployees.map((companyEmployee, index) => {
                                            return (
                                              <li key={index}>
                                                <div className="filter-checks">
                                                  <label className="checkboxs">
                                                    <input
                                                      type="checkbox"
                                                      checked={selectedContactEmployee.includes(companyEmployee.value.toLowerCase())}
                                                      onChange={() => filterContactEmployee(companyEmployee.value.toLowerCase())}
                                                    />
                                                    <span className="checkmarks" />
                                                    {companyEmployee.value}
                                                  </label>
                                                </div>
                                              </li>
                                            )
                                          })
                                        }
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="filter-reset-btns">
                                <div className="row">
                                  <div className="col-6">
                                  </div>
                                  <div className="col-6">
                                    <Link to="#" className="btn btn-primary" onClick={resetFilters}>
                                      Reset
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="dropdown me-2 bg-white">
                          <Link
                            to="#"
                            className="dropdown-toggle"
                            data-bs-toggle="dropdown"
                          >
                            <FaSortAmountDown className="me-1" />
                            Order By
                          </Link>
                          <div className="dropdown-menu dropdown-menu-end sortBtn">
                            <ul className="mb-0">
                              <li>
                                <button
                                  type="button"
                                  className="dropdown-item"
                                  onClick={() => setSortOrder("asc")}
                                >
                                  <FaSortAlphaDown className="me-1" />
                                  Name (Ascending)
                                </button>
                              </li>
                              <li>
                                <Link
                                  to="#"
                                  className="dropdown-item"
                                  onClick={() => setSortOrder("desc")}
                                >
                                  <FaSortAlphaDownAlt className="me-1" />
                                  Name (Descending)
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div>
                        <ul className="d-flex align-items-center mb-0">
                          <li className="me-2">
                            <Link
                              to="#"
                              className="btn btn-primary"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#customer_offcanvas"
                              onClick={() => {
                                setSelectedCustomer(null);
                              }}
                            >
                              <i className="ti ti-square-rounded-plus me-2" />
                              Add Customer
                            </Link>
                          </li>
                          <li>
                            <div className="view-icons">
                              <Link to={route.contactList}>
                                <i className="ti ti-list-tree" />
                              </Link>
                              <Link to={route.contactGrid} className="active">
                                <i className="ti ti-grid-dots" />
                              </Link>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* /Filter */}
                  <>
                    <div className="row">

                      {
                        filteredContactData.map((customer, index) => {
                          return (
                            <div className="col-xxl-3 col-xl-4 col-md-6" key={index}>
                              <div className="card border">
                                <div className="card-body">
                                  <div className="d-flex align-items-center justify-content-between mb-3">
                                    <div className="d-flex align-items-center">
                                      <Link
                                        to={route.contactDetails}
                                        state={{customer}}
                                        className="avatar avatar-lg bg-gray flex-shrink-0 me-2"
                                      >
                                        <span className="avatar-title text-dark">{getInitials(customer.customer_name)}</span>
                                      </Link>

                                      <div>
                                        <h6>
                                          <Link
                                            to={route.contactDetails}
                                            className="fw-medium"
                                          >
                                            {customer.customer_name}
                                          </Link>
                                        </h6>
                                        <p className="text-default">{customer.customer_occupation}</p>
                                      </div>
                                    </div>
                                    <div className="dropdown table-action">
                                      <Link
                                        to="#"
                                        className="action-icon "
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="fa fa-ellipsis-v" />
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          data-bs-toggle="offcanvas"
                                          data-bs-target="#customer_offcanvas"
                                          onClick={() => handleEditClick(customer)}
                                        >
                                          <i className="ti ti-edit text-blue" /> Edit
                                        </Link>
                                        <Link
                                          className="dropdown-item"
                                          to="#"
                                          data-bs-toggle="modal"
                                          data-bs-target="#delete_contact"
                                        >
                                          <i className="ti ti-trash text-danger" />{" "}
                                          Delete
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-block">
                                    <div className="d-flex flex-column mb-3">
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <FaRegBuilding className="text-dark me-1" />
                                        {customer.customer_company}
                                      </p>
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <i className="ti ti-mail text-dark me-1" />
                                        {customer.email ? customer.email : "Null"}
                                      </p>
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <i className="ti ti-phone text-dark me-1" />
                                        {customer.phone}
                                      </p>
                                      <p className="text-default d-inline-flex align-items-center">
                                        <i className="ti ti-map-pin-pin text-dark me-1" />
                                        {customer.location}
                                      </p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <span className="badge badge-tag badge-success-light me-2">
                                        Collab
                                      </span>
                                      <span className="badge badge-tag badge-warning-light">
                                        Rated
                                      </span>
                                    </div>
                                  </div>
                                  <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <div className="d-flex align-items-center grid-social-links">
                                      <Link
                                        to="#"
                                        className="avatar avatar-xs text-dark rounded-circle me-1"
                                      >
                                        <i className="ti ti-mail fs-14" />
                                      </Link>
                                      <Link
                                        to="#"
                                        className="avatar avatar-xs text-dark rounded-circle me-1"
                                      >
                                        <i className="ti ti-phone-check fs-14" />
                                      </Link>
                                      <Link
                                        to="#"
                                        className="avatar avatar-xs text-dark rounded-circle me-1"
                                      >
                                        <i className="ti ti-message-circle-share fs-14" />
                                      </Link>
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }

                    </div>

                    <div className="load-btn text-center pb-4">
                      <Link to="#" className="btn btn-primary">
                        Load More Contacts
                        <i className="ti ti-loader" />
                      </Link>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Contact */}
      <CustomerOffcanvas selectedCustomer={selectedCustomer}/>
      {/* /Add Contact */}
      {/* Add New Deals */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_add_2"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="fw-semibold">Add New Deals</h5>
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
          <form>
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="col-form-label">
                    Deal Name <span className="text-danger">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <label className="col-form-label">
                      Pipeine <span className="text-danger">*</span>
                    </label>
                  </div>
                  <Select
                    className="select2"
                    options={salestypelist}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select2"
                    options={status}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Deal Value<span className="text-danger"> *</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Currency <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select2"
                    options={optionssymbol}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Period <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select2"
                    options={duration}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Period Value <span className="text-danger">*</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="col-form-label">
                    Contact <span className="text-danger">*</span>
                  </label>
                  <SelectWithImage2 />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Project <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select2"
                    options={project}
                    defaultValue={tagInputValues}
                    isMulti
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Due Date <span className="text-danger">*</span>
                  </label>
                  <div className="icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <DatePicker
                      className="form-control datetimepicker deals-details"
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Expected Closing Date <span className="text-danger">*</span>
                  </label>
                  <div className="icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>

                    <DatePicker
                      className="form-control datetimepicker deals-details"
                      selected={selectedDate1}
                      onChange={handleDateChange1}
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="mb-3">
                  <label className="col-form-label">
                    Assignee <span className="text-danger">*</span>
                  </label>
                  <SelectWithImage2 />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Follow Up Date <span className="text-danger">*</span>
                  </label>
                  <div className="icon-form">
                    <span className="form-icon">
                      <i className="ti ti-calendar-check" />
                    </span>
                    <DatePicker
                      className="form-control datetimepicker deals-details"
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="dd-MM-yyyy"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Source <span className="text-danger">*</span>
                  </label>

                  <Select
                    className="select2"
                    options={socialMedia}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Tags <span className="text-danger">*</span>
                  </label>
                  <TagsInput
                    // className="input-tags form-control"
                    value={owner}
                    onChange={setOwner}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="col-form-label">
                    Priority <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select2"
                    options={priorityList}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-lg-12">
                <div className="mb-3">
                  <label className="col-form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <DefaultEditor className="summernote" />
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
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setOpenModal(true)}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add New Deals */}
      {/* Delete Contact */}
      <div className="modal fade" id="delete_contact" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                  <i className="ti ti-trash-x fs-36 text-danger" />
                </div>
                <h4 className="mb-2">Remove Contacts?</h4>
                <p className="mb-0">
                  Are you sure you want to remove <br /> contact you selected.
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
                    to="#"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                  >
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Delete Contact */}
      {/* Create Deal */}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <div className="modal-header border-0 m-0 justify-content-end">
          <button
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
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
              <Link to={route.contactDetails} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Create Deal */}
      {/* Create Contact */}
      <Modal show={openModal2} onHide={() => setOpenModal2(false)}>
        <div className="modal-header border-0 m-0 justify-content-end">
          <button
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="modal-body">
          <div className="success-message text-center">
            <div className="success-popup-icon bg-light-blue">
              <i className="ti ti-user-plus" />
            </div>
            <h3>Contact Created Successfully!!!</h3>
            <p>View the details of contact, created</p>
            <div className="col-lg-12 text-center modal-btn">
              <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                Cancel
              </Link>
              <Link to={route.contactDetails} className="btn btn-primary">
                View Details
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {/* /Create Contact */}
      {/* Access */}
      <div className="modal fade" id="access_view" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Access For</h5>
              <button
                className="btn-close custom-btn-close border p-1 me-0 text-dark"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <form>
              <div className="modal-body">
                <div className="icon-form mb-3">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="access-wrap mb-0">
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
              </div>
              <div className="modal-footer">
                <div className="d-flex align-items-center justify-content-end m-0">
                  <button
                    type="button"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    data-bs-dismiss="modal"
                    type="button"
                    className="btn btn-primary"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* /Access */}
    </>
  );
};

export default ContactGrid;
