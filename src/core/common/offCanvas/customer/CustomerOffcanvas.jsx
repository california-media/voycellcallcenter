import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';
import { contactData } from '../../../data/json/contactData';
import DatePicker from "react-datepicker";
import { SelectWithImage } from '../../selectWithImage';
import Select from "react-select";
import { all_tags } from '../../selectoption/selectoption';




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
const countries = [
  { value: "Choose", label: "Choose" },
  { value: "India", label: "India" },
  { value: "USA", label: "USA" },
  { value: "France", label: "France" },
  { value: "UAE", label: "UAE" },
];


const CustomerOffcanvas = ({ selectedCustomer }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openModal2, setOpenModal2] = useState(false);



  const all_companies = [
    ...new Set(
      contactData
        .map((contact) => contact.customer_company)
        .filter((company) => company !== "") // Filter out empty companies
    )
  ].map((company) => ({ label: company, value: company }));
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <>
      <div
        className={`offcanvas offcanvas-end offcanvas-large`}
        tabIndex={-1}
        id="customer_offcanvas"
        aria-modal="true"
        role="dialog"
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="fw-semibold">{selectedCustomer ? "Edit Customer" : "Add new Customer"}</h5>
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
            <div className="accordion" id="main_accordion">
              {/* Basic Info */}
              <div className="accordion-item rounded mb-3">
                <div className="accordion-header">
                  <Link
                    to=""
                    className="accordion-button accordion-custom-button bg-white rounded fw-medium text-dark"
                    data-bs-toggle="collapse"
                    data-bs-target="#basic"
                  >
                    <span className="avatar avatar-md rounded text-dark border me-2">
                      <i className="ti ti-user-plus fs-20" />
                    </span>
                    Basic Info
                  </Link>
                </div>
                <div
                  className="accordion-collapse collapse show"
                  id="basic"
                  data-bs-parent="#main_accordion"
                >
                  <div className="accordion-body border-top">
                    <div className="row">

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Customer Name <span className="text-danger">*</span>
                          </label>
                          <input type="text"
                            value={selectedCustomer ? selectedCustomer.customer_name : ""}
                            onChange={() => { }}
                            className="form-control" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Job Title <span className="text-danger">*</span>
                          </label>
                          <input type="text"
                            onChange={() => { }}
                            value={selectedCustomer ? selectedCustomer.customer_occupation : ""} className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">Company Name</label>

                          <CreatableSelect isClearable options={all_companies} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <label className="col-form-label">
                              Email <span className="text-danger">*</span>
                            </label>
                          </div>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Phone 1 <span className="text-danger">*</span>
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">Phone 2</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Date of Birth
                          </label>
                          <div className="icon-form-end">
                            <span className="form-icon">
                              <i className="ti ti-calendar-event" />
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
                        <div className="fmb-3">
                          <label className="col-form-label">Owner</label>
                          <SelectWithImage />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">Tags </label>
                          <CreatableSelect
                            classNamePrefix="react-select"
                            options={all_tags}
                            // isLoading={isLoading}
                            // onChange={(newValue) => setValue(newValue)}
                            // onCreateOption={handleCreate}
                            className="js-example-placeholder-multiple select2 js-states"
                            isMulti={true}
                            placeholder="Select"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Source <span className="text-danger">*</span>
                          </label>
                          <Select
                            className="select2"
                            classNamePrefix="react-select"
                            options={activities}
                            placeholder="Select an option"
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
                            classNamePrefix="react-select"
                            options={industries}
                            defaultValue={industries[2]}
                            placeholder="Banking"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="mb-0">
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
                    </div>
                  </div>
                </div>
              </div>
              {/* /Basic Info */}
              {/* Address Info */}
              <div className="accordion-item border-top rounded mb-3">
                <div className="accordion-header">
                  <Link
                    to=""
                    className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                    data-bs-toggle="collapse"
                    data-bs-target="#address"
                  >
                    <span className="avatar avatar-md rounded text-dark border me-2">
                      <i className="ti ti-map-pin-cog fs-20" />
                    </span>
                    Address Info
                  </Link>
                </div>
                <div
                  className="accordion-collapse collapse"
                  id="address"
                  data-bs-parent="#main_accordion"
                >
                  <div className="accordion-body border-top">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="col-form-label">
                            Street Address{" "}
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">City </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">
                            State / Province{" "}
                          </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3 mb-md-0">
                          <label className="col-form-label">Country</label>
                          <Select
                            className="select"
                            classNamePrefix="react-select"
                            options={countries}
                            placeholder="Choose"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-0">
                          <label className="col-form-label">Zipcode </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Address Info */}
              {/* Social Profile */}
              <div className="accordion-item border-top rounded mb-3">
                <div className="accordion-header">
                  <Link
                    to=""
                    className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                    data-bs-toggle="collapse"
                    data-bs-target="#social"
                  >
                    <span className="avatar avatar-md rounded text-dark border me-2">
                      <i className="ti ti-social fs-20" />
                    </span>
                    Social Profile
                  </Link>
                </div>
                <div
                  className="accordion-collapse collapse"
                  id="social"
                  data-bs-parent="#main_accordion"
                >
                  <div className="accordion-body border-top">
                    <div className="row">

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">Skype </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="col-form-label">Linkedin </label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3 mb-md-0">
                          <label className="col-form-label">Whatsapp</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              {/* /Social Profile */}
              {/* Access */}
              <div className="accordion-item border-top rounded mb-3">
                <div className="accordion-header">
                  <Link
                    to=""
                    className="accordion-button accordion-custom-button rounded bg-white fw-medium text-dark"
                    data-bs-toggle="collapse"
                    data-bs-target="#access-info"
                  >
                    <span className="avatar avatar-md rounded text-dark border me-2">
                      <i className="ti ti-accessible fs-20" />
                    </span>
                    Access
                  </Link>
                </div>
                <div
                  className="accordion-collapse collapse"
                  id="access-info"
                  data-bs-parent="#main_accordion"
                >
                  <div className="accordion-body border-top">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-3">
                          <label className="col-form-label">Visibility</label>
                          <div className="d-flex flex-wrap">
                            <div className="me-2">
                              <input
                                type="radio"
                                className="status-radio"
                                id="public"
                                name="visible"
                              />
                              <label htmlFor="public">Public</label>
                            </div>
                            <div className="me-2">
                              <input
                                type="radio"
                                className="status-radio"
                                id="private"
                                name="visible"
                              />
                              <label htmlFor="private">Private</label>
                            </div>
                            <div
                              data-bs-toggle="modal"
                              data-bs-target="#access_view"
                            >
                              <input
                                type="radio"
                                className="status-radio"
                                id="people"
                                name="visible"
                              />
                              <label htmlFor="people">Select People</label>
                            </div>
                          </div>
                        </div>
                        <div className="mb-0">
                          <label className="col-form-label">Status</label>
                          <div className="d-flex flex-wrap">
                            <div className="me-2">
                              <input
                                type="radio"
                                className="status-radio"
                                id="active"
                                name="status"
                                defaultChecked
                              />
                              <label htmlFor="active">Active</label>
                            </div>
                            <div>
                              <input
                                type="radio"
                                className="status-radio"
                                id="inactive"
                                name="status"
                              />
                              <label htmlFor="inactive">Inactive</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Access */}
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
                onClick={() => setOpenModal2(true)}
              >
                {selectedCustomer ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>

  );
};

export default CustomerOffcanvas;
