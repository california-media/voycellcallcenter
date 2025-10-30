import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageWithBasePath from '../../imageWithBasePath'
import DeleteModal from '../../modals/DeleteModal';
import dragula from "dragula";
import "dragula/dist/dragula.css";
const PipelineOffcanvas = () => {
    const [deleteModalText, setDeleteModalText] = useState("");
    const [pipelineOrder, setPipelineOrder] = useState([]);
    const pipelineRef = useRef(null); // Reference to the container

    // useEffect(() => {
    //     // Initialize Dragula on the pipeline container
    //     dragula([pipelineRef.current]);
    // }, []);
    useEffect(() => {
        const drake = dragula([pipelineRef.current]);

        // Track the order after dragging ends
        drake.on("dragend", () => {
            const newOrder = Array.from(pipelineRef.current.children).map(
                (item) => item.textContent.trim() // Extract text content of each stage
            );
            setPipelineOrder(newOrder);
            console.log("New order:", newOrder); // Log the new order of pipeline stages
        });

        // Add 'is-dragging' class on drag
        drake.on("drag", (el) => {
            el.classList.add("is-dragging");
        });

        // Remove 'is-dragging' class on dragend
        drake.on("dragend", (el) => {
            el.classList.remove("is-dragging");
        });
    }, []);
    return (
        <>
            <div
                className="offcanvas offcanvas-end offcanvas-large"
                tabIndex={-1}
                id="pipeline_offcanvas"
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
                    <form>
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
                                <div className="pipeline-listing" ref={pipelineRef}>
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
                                                data-bs-target={`#delete_${deleteModalText}`}
                                                onClick={() => { setDeleteModalText("stage") }}
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
                                <div className="tab-content">
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
                            <button
                                type="button"
                                className="btn btn-primary"

                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <DeleteModal text={deleteModalText} />
        </>
    )
}

export default PipelineOffcanvas