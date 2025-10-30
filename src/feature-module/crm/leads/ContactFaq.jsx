import React, { useState } from "react";
import { Link } from "react-router-dom";

const ContactFaq = () => {
  const [faqs, setFaqs] = useState([
    { question: "How can I import contacts?", answer: "You can import contacts from CSV, Excel, or Google." },
    { question: "Can I export my contact list?", answer: "Yes, export options are available under 'Import and Export'." },
  ]);

  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFaq((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFaq = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) return;
    setFaqs((prev) => [...prev, newFaq]);
    setNewFaq({ question: "", answer: "" });
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="card ">
              <div className="card-header mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-semibold">Contact FAQs</h4>

                  <div style={{ display: "flex" }}>
                    <div className="icon-form mb-3  me-2 mb-sm-0">
                      <span className="form-icon">
                        <i className="ti ti-search" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search FAQs..."
                        onChange={(text) =>
                          setSearchQuery(text.target.value)
                        }
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#add_faq_modal"
                    >
                      + Add FAQ
                    </button>
                  </div>
                </div>
              </div>
              {/* FAQ List */}
              <div className="accordion px-5 mb-5" id="faqAccordion">
                {faqs
                  .filter(
                    (faq) =>
                      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((faq, index) => (
                    <div className="accordion-item mb-2" key={index}>
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button
                          className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse${index}`}
                          aria-expanded={index === 0 ? "true" : "false"}
                          aria-controls={`collapse${index}`}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div
                        id={`collapse${index}`}
                        className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                        aria-labelledby={`heading${index}`}
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body">{faq.answer}</div>
                      </div>
                    </div>
                  ))}

              </div>
            </div>

            {/* Add FAQ Modal */}
            <div
              className="modal fade"
              id="add_faq_modal"
              role="dialog"
              aria-labelledby="addFaqLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="text-center mb-3">
                      <div className="avatar avatar-xl bg-primary-light rounded-circle mb-2">
                        <i className="ti ti-help fs-36 text-primary" />
                      </div>
                      <h4 className="mb-2">Add New FAQ</h4>
                    </div>

                    <div className="mb-3">
                      <label className="col-form-label">
                        Question <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="question"
                        value={newFaq.question}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter question"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="col-form-label">
                        Answer <span className="text-danger">*</span>
                      </label>
                      <textarea
                        name="answer"
                        value={newFaq.answer}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter answer"
                        rows={3}
                      />
                    </div>

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
                        data-bs-dismiss="modal"
                        className="btn btn-primary"
                        onClick={handleAddFaq}
                      >
                        Save FAQ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ContactFaq;
