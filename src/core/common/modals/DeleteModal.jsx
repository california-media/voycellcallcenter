import React from 'react'
import { Link } from 'react-router-dom'

const DeleteModal = ({text, onCancel,onDelete }) => {    
  return (
    <div className="modal fade" id={`delete_${text}`} role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <div className="text-center">
                <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
                  <i className="ti ti-trash-x fs-36 text-danger" />
                </div>
                <h4 className="mb-2 text-capitalize">Remove {text}?</h4>
                <p className="mb-0">
                  Are you sure you want to remove <br /> the {text} you selected.
                </p>
                <div className="d-flex align-items-center justify-content-center mt-4">
                  <Link
                    to="#"
                    className="btn btn-light me-2"
                    data-bs-dismiss="modal"
                    onClick={onCancel}
                  >
                    Cancel
                  </Link>
                  <Link to={"#"}
                  data-bs-dismiss="modal"
                  className="btn btn-danger"
                  onClick={onDelete}>
                    Yes, Delete it
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default DeleteModal