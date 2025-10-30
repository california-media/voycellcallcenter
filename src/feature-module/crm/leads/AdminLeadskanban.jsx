import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import "bootstrap-daterangepicker/daterangepicker.css";
import {
  countryoptions1,
  languageOptions,
  optiondeals,
  optionindustry,
  options,
  options1,
  optionschoose,
  optionsource,
  optionssymbol,
  owner as companyEmployee,
  leadStatus
} from "../../../core/common/selectoption/selectoption";
import ImageWithBasePath from "../../../core/common/imageWithBasePath";
import CollapseHeader from "../../../core/common/collapse-header";
import { SelectWithImage } from "../../../core/common/selectWithImage";
import { SelectWithImage2 } from "../../../core/common/selectWithImage2";
import { all_routes } from "../../router/all_routes";
import { leadsData } from "../../../core/data/json/leads";
import { FaSortAlphaDown, FaSortAlphaDownAlt, FaSortAmountDown } from "react-icons/fa";
import dragula, { Drake } from "dragula";
import "dragula/dist/dragula.css";
import LeadOffcanvas from "../../../core/common/offCanvas/lead/LeadOffcanvas";

const AdminLeadskanban = () => {
  const [adduser, setAdduser] = useState(false);
  const [addcompany, setAddCompany] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Lead");
  const [searchQuery, setSearchQuery] = useState("");
  const [cardColors, setCardColors] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedLeadEmployee, setSelectedLeadEmployee] = useState([]);
  const [selectedLeadStatus, setSelectedLeadStatus] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");

  const route = all_routes;

  const togglePopup = (isEditing) => {
    setModalTitle(isEditing ? "Edit Lead" : "Add New Lead");
    setAdduser(!adduser);
  };

  const addcompanyPopup = () => {
    setAddCompany(!addcompany);
  };

  const filteredData = leadsData
  .filter((lead) => {
    // Use nullish coalescing to ensure the value is a string before calling toLowerCase()
    const leadName = lead.lead_name?.toLowerCase() || "";
    const companyName = lead.company_name?.toLowerCase() || "";
    const phone = lead.phone?.toLowerCase() || "";
    const email = lead.email?.toLowerCase() || "";

    // Check if lead matches search query
    const matchesSearchQuery =
      leadName.includes(searchQuery.toLowerCase()) ||
      companyName.includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase());

    // Check if lead matches selected employee
    const matchesEmployee =
      selectedLeadEmployee.length === 0 || // If no employee is selected, show all
      selectedLeadEmployee.includes(lead.owner?.toLowerCase() || "");

    return matchesSearchQuery && matchesEmployee;
  })
  .sort((a, b) => {
    const leadNameA = a.lead_name || ""; // Handle undefined names
    const leadNameB = b.lead_name || "";
    
    if (sortOrder === "asc") {
      return leadNameA.localeCompare(leadNameB);
    } else {
      return leadNameB.localeCompare(leadNameA);
    }
  });




  const filterLeadEmployee = (leadEmployee) => {
    setSelectedLeadEmployee((prevStatus) =>
      prevStatus.includes(leadEmployee)
        ? prevStatus.filter((employee) => employee !== leadEmployee)
        : [...prevStatus, leadEmployee]
    );
  };
  const container1Ref = useRef(null);
  const container2Ref = useRef(null);
  const container3Ref = useRef(null);
  const container4Ref = useRef(null);

  const groupedLeads = filteredData.reduce((acc, lead) => {
    const status = lead.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(lead);
    return acc;
  }, {});

  const handleEditClick = (customer) => {
    setSelectedLead(customer)
  }
  useEffect(() => {
    const containers = [
      container1Ref.current,
      container2Ref.current,
      container3Ref.current,
      container4Ref.current,
    ].filter(Boolean);

    const drake = dragula(containers);


    drake.on('drop', (el, target, source, sibling) => {
      const leadId = el.getAttribute('data-lead-id');
      const newStatus = target.getAttribute('data-status');
      const oldStatus = source.getAttribute('data-status');

      if (newStatus !== oldStatus) {
        console.log(`Lead ${leadId} moved from ${oldStatus} to ${newStatus}`);
        setCardColors(prevColors => ({
          ...prevColors,
          [leadId]: bgColors[newStatus],
        }));

      }

    });
    return () => {
      drake.destroy();
    };
  }, [groupedLeads]);


  const getInitials = (lead) => {
    // Split the name into parts
    const parts = lead.trim().split(" ");
    const firstName = parts[0] || '';
    const lastName = parts[1] || '';

    // Generate initials based on the presence of a last name
    if (lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return `${firstName.charAt(0)}${firstName.charAt(1) || ''}`.toUpperCase(); // Handle single-letter first names
  };


  const resetFilters = () => {
    setSelectedLeadStatus([]);
    setSelectedLeadEmployee([]);
    setSearchEmployeeInFilter('');
  };
  const allLeadStatus = leadStatus.map((e) => { return (e.value) })

  // Seach Employee in filter
  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );
  const statusColors = {
    Open: 'text-info',
    Closed: 'text-danger',
    Pending: 'text-warning',
    Resolved: 'text-success',
  };
  const bgColors = {
    Open: 'rgb(223, 240, 255)',
    Closed: 'rgba(193, 105, 105, 0.1)',
    Pending: 'rgba(255, 217, 148, 0.4)',
    Resolved: 'rgba(224, 245, 241,1)',
  };
  return (
    <>
      <>
        {/* Page Wrapper */}
        <div className="page-wrapper">
          <div className="content">
            <div className="row">
              <div className="col-md-12">

                {/* Filter */}
                <div className="d-flex justify-content-between align-items-center flex-wrap row-gap-2 mb-4">
                  <div className="page-header mb-0 ms-5">
                    <div className="row align-items-center">
                      <h4 className="page-title mb-0">
                        Admin Leads<span className="count-title">{filteredData.length}</span>
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
                                                    checked={selectedLeadEmployee.includes(companyEmployee.value.toLowerCase())}
                                                    onChange={() => filterLeadEmployee(companyEmployee.value.toLowerCase())}
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
                            data-bs-target="#lead_offcanvas"
                            onClick={() => {
                              setSelectedLead(null);
                            }}
                          >
                            <i className="ti ti-square-rounded-plus me-2" />
                            Add Leads
                          </Link>
                        </li>
                        <li>
                          <div className="view-icons">
                            <Link to={route.leads}>
                              <i className="ti ti-list-tree" />
                            </Link>
                            <Link to={route.leadsKanban} className="active">
                              <i className="ti ti-grid-dots" />
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* /Filter */}
                {/* Leads Kanban */}
                <div className="d-flex overflow-x-auto align-items-start mb-4">
                  {leadStatus.map((statusObj, index) => {
                    const status = statusObj.value;
                    const leadsForStatus = groupedLeads[status] || [];
                    return (
                      <div className="kanban-list-items" key={index} data-status={status}>
                        <div className="card mb-0">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h4 className="fw-semibold d-flex align-items-center mb-1">
                                  <i className={`ti ti-circle-filled fs-8 ${statusColors[status]} me-2`} />
                                  {status}
                                </h4>
                                <span className="fw-medium text-default">
                                  {leadsForStatus.length} Leads
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="kanban-drag-wrap mt-4"
                          style={{
                            maxHeight: 600, overflow: 'scroll',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none',
                          }}
                          ref={index === 0 ? container1Ref : index === 1 ? container2Ref : index === 2 ? container3Ref : container4Ref}
                          data-status={status}
                        >
                          {leadsForStatus.length > 0 ? (
                            leadsForStatus.map((lead, leadIndex) => (
                              <div
                                className="card kanban-card border"
                                style={{ backgroundColor: cardColors[lead.id] || bgColors[status] }}
                                key={leadIndex}
                                data-lead-id={lead.id}
                              >
                                <div className="card-body">
                                  <div className="d-block">
                                    <div className="d-flex align-items-center mb-3">
                                      <Link to={route.leadsDetails} state={{lead}} className="avatar avatar-lg bg-gray flex-shrink-0 me-2">
                                        <span className="avatar-title text-dark">{getInitials(lead.lead_name)}</span>
                                      </Link>
                                      <h6 className="fw-medium mb-0">
                                        <Link to={route.leadsDetails} state={{lead}}>{lead.lead_name}</Link>
                                      </h6>
                                    </div>
                                    <div className="mb-3 d-flex flex-column">
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <i className="ti ti-mail text-dark me-1" />
                                        {lead.email}
                                      </p>
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <i className="ti ti-phone text-dark me-1" />
                                        {lead.phone}
                                      </p>
                                      <p className="text-default d-inline-flex align-items-center mb-2">
                                        <i className="ti ti-report-money text-dark me-1" />
                                        {lead.value ? lead.value : 'Nill'}
                                      </p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-3">
                                      <p className="text-default d-inline-flex align-items-center mb-0">
                                        <i className="ti ti-calendar-due text-dark me-1" />
                                        {lead.created_date}
                                      </p>
                                      <div className="icons-social d-flex align-items-center">
                                        <Link to="#" className="d-flex align-items-center justify-content-center me-1">
                                          <i className="ti ti-phone-check" />
                                        </Link>
                                        <Link to="#" className="d-flex align-items-center justify-content-center me-1">
                                          <i className="ti ti-message-circle-share" />
                                        </Link>
                                        <Link to="#" className="d-flex align-items-center justify-content-center">
                                          <i className="ti ti-mail-check" />
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-muted">No Leads</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* /Leads Kanban */}
              </div>
            </div>
          </div>
        </div>

        {/* /Page Wrapper */}
        {/* Add User */}
        {/* <div
          className="offcanvas offcanvas-end offcanvas-large"
          tabIndex={-1}
          id="offcanvas_add">
          <div className="offcanvas-header border-bottom">
            <h5 className="fw-semibold">Add New Lead</h5>
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
                      Lead Name <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="radio-wrap">
                      <label className="col-form-label">Lead Type</label>
                      <div className="d-flex flex-wrap">
                        <div className="radio-btn">
                          <input
                            type="radio"
                            className="status-radio"
                            id="person"
                            name="leave"
                            defaultChecked
                          />
                          <label htmlFor="person">Person</label>
                        </div>
                        <div className="radio-btn">
                          <input
                            type="radio"
                            className="status-radio"
                            id="org"
                            name="leave"
                          />
                          <label htmlFor="org">Organization</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="col-form-label">
                        Company <span className="text-danger">*</span>
                      </label>
                      <Link
                        to="#"
                        className="add-new add-new-company add-popups"
                        onClick={addcompanyPopup}
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add New
                      </Link>
                    </div>
                    <Select
                      className="select"
                      options={options}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Value <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Currency <span className="text-danger">*</span>
                    </label>
                    <Select
                      className="select"
                      options={optionssymbol}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="mb-3">
                        <label className="col-form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                    <div className="col-md-4 d-flex align-items-center">
                      <div className="mb-3 w-100">
                        <Select
                          className="select"
                          options={optionschoose}
                          classNamePrefix="react-select"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Source <span className="text-danger">*</span>
                    </label>
                    <Select
                      className="select"
                      options={optionsource}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Industry <span className="text-danger">*</span>
                    </label>
                    <Select
                      className="select"
                      options={optionindustry}
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">Owner</label>
                    <SelectWithImage />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="col-form-label">Tags </label>
                    <input
                      className="input-tags form-control"
                      type="text"
                      data-role="tagsinput"
                      name="Label"
                      defaultValue="Rated"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-3">
                    <label className="col-form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={5}
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="radio-wrap mb-3">
                    <label className="col-form-label">Visibility</label>
                    <div className="d-flex flex-wrap">
                      <div className="radio-btn">
                        <input
                          type="radio"
                          className="status-radio"
                          id="public1"
                          name="visible"
                        />
                        <label htmlFor="public1">Public</label>
                      </div>
                      <div className="radio-btn">
                        <input
                          type="radio"
                          className="status-radio"
                          id="private1"
                          name="visible"
                        />
                        <label htmlFor="private1">Private</label>
                      </div>
                      <div
                        className="radio-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#access_view"
                      >
                        <input
                          type="radio"
                          className="status-radio"
                          id="people1"
                          name="visible"
                        />
                        <label htmlFor="people1">Select People</label>
                      </div>
                    </div>
                  </div>
                  <div className="radio-wrap mb-3">
                    <label className="col-form-label">Status</label>
                    <div className="d-flex flex-wrap">
                      <div className="radio-btn">
                        <input
                          type="radio"
                          className="status-radio"
                          id="active1"
                          name="status"
                          defaultChecked
                        />
                        <label htmlFor="active1">Active</label>
                      </div>
                      <div className="radio-btn">
                        <input
                          type="radio"
                          className="status-radio"
                          id="inactive1"
                          name="status"
                        />
                        <label htmlFor="inactive1">Inactive</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="submit-button text-end">
                <Link to="#" className="btn btn-light sidebar-close">
                  Cancel
                </Link>
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#create_contact"
                  className="btn btn-primary"
                >
                  Create
                </Link>
              </div>
            </form>
          </div>
        </div> */}
        <LeadOffcanvas selectedLead={selectedLead} />

        {/* /Add User */}
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
                    <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal custom-modal fade"
          id="delete_contact"
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
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
                  <div className="success-popup-icon">
                    <i className="ti ti-trash-x" />
                  </div>
                  <h3>Remove Leads?</h3>
                  <p className="del-info">
                    Are you sure you want to remove lead you selected.
                  </p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link to="leads" className="btn btn-danger">
                      Yes, Delete it
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal custom-modal fade" id="delete_deal" role="dialog">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
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
                  <div className="success-popup-icon">
                    <i className="ti ti-trash-x" />
                  </div>
                  <h3>Remove Leads?</h3>
                  <p className="del-info">
                    Are you sure you want to remove lead you selected.
                  </p>
                  <div className="col-lg-12 text-center modal-btn">
                    <Link
                      to="#"
                      className="btn btn-light"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </Link>
                    <Link to="/leads" className="btn btn-danger">
                      Yes, Delete it
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default AdminLeadskanban;
