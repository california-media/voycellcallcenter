import React from "react";
import { Link } from "react-router-dom";

const ImportConfirmModal = ({ optionLabel, onCancel, onConfirm }) => {
  return (
    <div className="modal fade" id="import_confirm_modal" role="dialog">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-body">
            <div className="text-center">
              <div className="avatar avatar-xl bg-primary-light rounded-circle mb-3">
                <i className="ti ti-upload fs-36 text-primary" />
              </div>
              <h4 className="mb-2">Import Contacts?</h4>
              <p className="mb-0">
                You are about to import contacts using <b>{optionLabel}</b>.
                <br />
                Do you want to continue?
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
                <Link
                  to="#"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                  onClick={onConfirm}
                >
                  Yes, Continue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportConfirmModal;
    