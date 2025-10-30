import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";
import CreatableSelect from 'react-select/creatable';
import "./editCell.css"
import { all_tags } from '../selectoption/selectoption';
import { all_routes } from '../../../feature-module/router/all_routes';
import { SelectWithImage2 } from '../selectWithImage2';
import { contactData } from '../../data/json/contactData';


const EditCell = ({ fieldName, fieldValue, recordKey, columnKey, onSave, isActive, onEditClick, onClose, routeLink, textColor,record }) => {
    const [newValue, setNewValue] = useState(fieldValue);
    const route = all_routes;
    const all_companies = [
        ...new Set(
          contactData
            .map((contact) => contact.customer_company)
            .filter((company) => company !== "") // Filter out empty companies
        )
      ].map((company) => ({ label: company, value: company }));
    const handleEditClick = (event) => {
        // event.stopPropagation();
        onEditClick();
    };

    const handleCancel = () => {
        onClose();
        setNewValue(fieldValue);
    };
    const handleSave = () => {
        onSave(recordKey, newValue);
        onClose();
    };

    return (
        <div
            className="editable-cell"
            style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                padding: '5px',
            }}
        >
            {
                routeLink ? <Link to={routeLink} state={{record}} className="d-flex flex-column">
                    {
                        textColor ?
                            // when there is a link passed
                            <span
                                className={`${fieldValue ? '' : 'clickToAdd'}`}
                                style={{ color: fieldValue ? textColor : "#92a2b1", fontWeight: fieldValue ? 400 : 600 }}
                                onClick={fieldValue ? null : handleEditClick}>
                                {fieldValue ? fieldValue : "+  Click to add"}
                            </span>
                            :
                            <span className={`text-default`}>{fieldValue}</span>
                    }
                </Link>
                    :
                    // when there is no link passed means for simple text
                    <span
                        className={`${fieldValue ? '' : 'clickToAdd'}`}
                        style={{ color: fieldValue ? textColor : "#92a2b1", fontWeight: fieldValue ? 400 : 600 }}
                        onClick={fieldValue ? null : handleEditClick}>
                        {fieldValue ? fieldValue : "+  Click to add"}
                    </span>
            }

            {/* <span onClick={()=>{}}>{fieldValue}</span> */}
            {fieldValue && <span
                className={`edit-icon edit-icon-${recordKey}-${columnKey}`}
                onClick={handleEditClick}
                title="Edit"
                style={{
                    cursor: 'pointer',
                }}
            >
                ✎
            </span>}

            {isActive && (
                <>
                    {columnKey == "owner" ? (<div
                        className="popup"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 10,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            padding: '10px',
                        }}
                    >
                        {/* <div className="mb-3">
                            <label className="col-form-label">{fieldName}</label>
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="form-control"
                            />
                        </div> */}

                        <div className="mb-3">
                            <label className="col-form-label">
                                Assign to
                            </label>
                            <SelectWithImage2 />
                        </div>
                        <div className="d-flex align-items-center justify-content-end">
                            <button
                                type="button"
                                className="btn btn-light me-2"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </div>)
                        : columnKey === "customer_tag" ?
                            (
                                <div
                                    className="popup"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        zIndex: 10,
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                    }}
                                >
                                    <div className="mb-3">
                                        <label className="col-form-label">{fieldName}</label>
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
                                    <div className="d-flex align-items-center justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-light me-2"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleSave}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            )
                            : columnKey === "customer_company" ?
                                <div
                                    className="popup"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        zIndex: 10,
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                    }}
                                >
                                    <div className="mb-3">
                                        <label className="col-form-label">{fieldName}</label>
                                        <CreatableSelect
                                            classNamePrefix="react-select"
                                            options={all_companies}
                                            // isLoading={isLoading}
                                            // onChange={(newValue) => setValue(newValue)}
                                            // onCreateOption={handleCreate}
                                            className="js-example-placeholder-multiple select2 js-states"
                                            placeholder="Select"
                                        />
                                    </div>
                                    <div className="d-flex align-items-center justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-light me-2"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleSave}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                                :
                                <div
                                    className="popup"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        zIndex: 10,
                                        backgroundColor: 'white',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                    }}
                                >
                                    <div className="mb-3">
                                        <label className="col-form-label">{fieldName}</label>
                                        <input
                                            type="text"
                                            value={newValue}
                                            onChange={(e) => setNewValue(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="d-flex align-items-center justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-light me-2"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleSave}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                    }
                </>
            )
            }
        </div>
    );
};

export default EditCell;
