import React, { useState, useRef } from "react";
import "./importAndExport.css";
import { useDispatch } from "react-redux";
import ImportConfirmModal from "../../../core/common/modals/ImportConfirmModal";
import * as XLSX from "xlsx";
import { saveBulkContacts } from "../../../core/data/redux/slices/ContactSlice";
import api from "../../../core/axios/axiosInstance";
import { showToast } from "../../../core/data/redux/slices/ToastSlice";

const ImportAndExport = () => {
  const dispatch = useDispatch();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const options = [
    { id: "csv", label: "Import contacts from CSV / Excel File", icon: "/assets/img/customIcons/excelLogo.png" },
    { id: "fetch-google-contacts", label: "Import contacts from Google", icon: "/assets/img/icons/googleLogo.png" },
    { id: "fetch-hubspot-contacts", label: "Import contacts from Hubspot", icon: "/assets/img/icons/hubspotLogo.jpg" },
    { id: "fetch-zoho-contacts", label: "Import contacts from Zoho", icon: "/assets/img/customIcons/zohoLogo.png" },
  ];

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const contacts = XLSX.utils.sheet_to_json(sheet);

        const response = await dispatch(saveBulkContacts(contacts)).unwrap();
        console.log(response, "response from saveBulkContacts");

        if (response.status === "success") {
          dispatch(showToast({ message: "Contacts imported successfully", variant: "success" }));
        } else {
          dispatch(showToast({ message: "Failed to import contacts", variant: "danger" }));
        }
      } catch (error) {
        console.error("Error importing contacts:", error);
        dispatch(showToast({ message: "Error processing file", variant: "danger" }));
      } finally {
        setIsImporting(false);
        setSelectedOption(null);
        resetFileInput();
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleThirdPartyImport = async () => {
    if (!selectedOption) return;
    try {
      const response = await api.get(`/${selectedOption.id}`);
      console.log(response.data, "API response for", selectedOption.id);

      if (response.data.status === "success" && response.data.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          response.data.url,
          "_blank",
          `width=${width},height=${height},left=${left},top=${top}`
        );

        if (!popup) {
          console.error("Popup blocked");
          dispatch(showToast({ message: "Popup blocked", variant: "error" }));
          return;
        }

        const messageHandler = (event) => {
          console.log("Popup event:", event.data);
          const data = event.data;
          if (data?.status === "success") {
            dispatch(showToast({ message: "Contacts added successfully", variant: "success" }));
            popup.close();
            window.removeEventListener("message", messageHandler);
            setSelectedOption(null);
          }
        };

        window.addEventListener("message", messageHandler);
      } else {
        dispatch(showToast({ message: response.data.message || "No URL found for popup", variant: "error" }));
      }
    } catch (error) {
      console.error("Error importing:", error);
      dispatch(showToast({ message: "Import failed", variant: "error" }));
    }
  };


  const handleModalConfirm = () => {
    if (!selectedOption) return;

    if (selectedOption.id === "csv") {

      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.click();
        }
      }, 150);
    } else {
      handleThirdPartyImport();
    }
  };


  const handleOptionClick = (opt) => {
    setSelectedOption(opt);

    const modalTrigger = document.getElementById("import_confirm_modal_trigger");
    if (modalTrigger) {
      modalTrigger.click();
    }
  };

  return (
    <div className="page-wrapper" style={{background:"white", height:"100vh"}}>
      <div className="content d-flex justify-content-center align-items-center">
        <div className="row">
          <div className="col-lg-12 col-md-10 col-sm-12 mx-auto">
            <h1 className="my-3">Import and Export</h1>
            <p className="text-muted mb-4">
              Manage your contacts and data efficiently. Add the people you care
              about from social media, email, and more.
            </p>

            <div className="import-options-list">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  className="import-option"
                  onClick={() => handleOptionClick(opt)}
                >
                  <img src={opt.icon} alt="icon" className="import-option__icon" />
                  <span className="import-option__label">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>


      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileChange}
      />

      <button
        id="import_confirm_modal_trigger"
        style={{ display: "none" }}
        data-bs-toggle="modal"
        data-bs-target="#import_confirm_modal"
      />

      <ImportConfirmModal
        optionLabel={selectedOption?.label || ""}
        onCancel={() => setSelectedOption(null)}
        onConfirm={handleModalConfirm}
        isProcessing={isImporting}
      />
    </div>
  );
};

export default ImportAndExport;