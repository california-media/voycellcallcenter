import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import Select from "react-select";
import { options, optionssymbol, optionschoose, optionsource, optionindustry } from '../../selectoption/selectoption';
import { SelectWithImage2 } from '../../selectWithImage2';
import { TagsInput } from 'react-tag-input-component';


const LeadOffcanvas = ({ selectedLead }) => {
    const [show, setShow] = useState(false);
    const [newContents, setNewContents] = useState([0]);
    const [owner, setOwner] = useState(["Collab"]);
    const [openModal2, setOpenModal2] = useState(false);


    const handleShow = () => setShow(true);
    const addNewContent = () => {
        setNewContents([...newContents, newContents.length]);
      };

    return (
        <div
            className="offcanvas offcanvas-end offcanvas-large"
            tabIndex={-1}
            id="lead_offcanvas"
        >
            <div className="offcanvas-header border-bottom">
                <h5 className="fw-semibold">
                    {selectedLead ? "Edit Lead" : "Add New Lead"}
                </h5>
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
                                <input
                                    type="text"
                                    value={selectedLead ? selectedLead.lead_name : ""}
                                    onChange={() => { }}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="mb-3">
                                <div className="radio-wrap">
                                    <label className="col-form-label">Lead Type</label>
                                    <div className="d-flex flex-wrap">
                                        <div className="me-2">
                                            <input
                                                type="radio"
                                                className="status-radio"
                                                id="person"
                                                name="leave"
                                                defaultChecked
                                            />
                                            <label htmlFor="person">Person</label>
                                        </div>
                                        <div>
                                            <input
                                                type="radio"
                                                className="status-radio"
                                                id="Organization"
                                                name="leave"
                                            />
                                            <label htmlFor="Organization">Organization</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="mb-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="col-form-label">Company Name</label>
                                    <Link to="" className="label-add " onClick={handleShow}>
                                        <i className="ti ti-square-rounded-plus" />
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
                                    Value<span className="text-danger">*</span>
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
                        {newContents.map((index) => (
                            <div className="col-md-12" key={index}>
                                <div className="add-product-new">
                                    <div className="row align-items-end">
                                        <div className="col-md-8">
                                            <div className=" mb-3">
                                                <label className="col-form-label">
                                                    Phone <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    defaultValue={
                                                        selectedLead ? selectedLead.phone : ""
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4 d-flex align-items-center">
                                            <div className=" w-100 mb-3">
                                                <Select
                                                    className="select"
                                                    options={optionschoose}
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="col-md-12">
                            <Link
                                onClick={addNewContent}
                                to="#"
                                className="add-new add-new-phone mb-3 d-block"
                            >
                                <i className="ti ti-square-rounded-plus me-2" />
                                Add New
                            </Link>
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
                                <SelectWithImage2 />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label className="col-form-label">Tags </label>
                                <TagsInput
                                    // className="input-tags form-control"
                                    value={owner}
                                    onChange={setOwner}
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
                                    <div data-bs-toggle="modal" data-bs-target="#access_view">
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
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LeadOffcanvas