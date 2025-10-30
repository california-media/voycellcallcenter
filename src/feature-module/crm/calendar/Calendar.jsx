import React, { useState, useEffect, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import Select from "react-select";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EmailAuthContext } from "../../../core/common/context/EmailAuthContext";
import { useDispatch, useSelector } from "react-redux";
import { profileEvents } from "../../../core/data/redux/slices/EventSlice";
// import { setSelectedContact } from "../../../core/data/redux/slices/SelectedContactSlice";
import api from "../../../core/axios/axiosInstance";
import dayjs from "dayjs";
import { DatePicker, TimePicker } from "antd";
import { all_routes } from "../../router/all_routes";
// import { saveContact } from "../../../core/data/redux/slices/ContactSlice";
import customParseFormat from "dayjs/plugin/customParseFormat";
import "./calendar.css";

const Calendar = () => {
  const [startDate, setDate] = useState(new Date()),
    [showCategory, setshowCategory] = useState(false),
    [showmodel, setshowmodel] = useState(false),
    [showEvents, setshowEvents] = useState(false),
    [show, setshow] = useState(false),
    [iseditdelete, setiseditdelete] = useState(false),
    [addneweventobj, setaddneweventobj] = useState(null),
    [isnewevent, setisnewevent] = useState(false),
    [event_title, setevent_title] = useState(""),
    [category_color, setcategory_color] = useState(""),
    [calenderevent, setcalenderevent] = useState(""),
    [allContacts, setAllContacts] = useState([]),
    [weekendsVisible, setweekendsVisible] = useState(true),
    [currentEvents, setscurrentEvents] = useState([]);
  const [defaultEvents, setDefaultEvents] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today.format("YYYY-MM-DD"));

  const userProfile = useSelector((state) => state.profile);
  const events = useSelector((state) => state.event);
  const navigate = useNavigate();
  console.log(events, "evendeeets");
  const dispatch = useDispatch();
  const [meetingFormData, setMeetingFormData] = useState({
    meeting_id: "",
    meetingDescription: "",
    meetingType: "",
    meetingLink: "",
    meetingTitle: "",
    meetingLocation: "",
    meetingStartDate: dayjs(),
    meetingStartTime: dayjs("00:00:00", "HH:mm:ss"),
  });
  const location = useLocation();
  const isCalendar = location.pathname.includes("calendar");
  dayjs.extend(customParseFormat);
  const route = all_routes;
  useEffect(() => {
    setDefaultEvents(events);
  }, [events]);
  useEffect(() => {
    dispatch(profileEvents());
  }, []);

  const meetingType = [
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
  ];
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await api.get("/getAllContact");
        console.log(response.data, "response from all contacts fetched");

        const transformed = response.data.data.map((contact) => {
          const name = `${contact.firstname || ""} ${contact.lastname || ""
            }`.trim();
          const email = contact.emailaddresses?.[0] || "";
          return {
            value: contact.contact_id,
            label: email ? `${name} (${email})` : name,
          };
        });

        setAllContacts(transformed);
      } catch (error) {
        console.log(error.response?.data?.data || "Error fetching contacts");
      }
    };

    fetchContact();
  }, []);

  const handleMeetingSubmit = async () => {
    const formDataObj = new FormData();

    console.log(meetingFormData, "jghjgjhgjg");

    formDataObj.append("contact_id", selectedOption.value);

    formDataObj.append("meeting_id", meetingFormData.meeting_id);
    formDataObj.append(
      "meetingType",
      meetingFormData.meetingType === ""
        ? "offline"
        : meetingFormData.meetingType
    );
    formDataObj.append("meetingLocation", meetingFormData.meetingLocation);
    formDataObj.append(
      "meetingDescription",
      meetingFormData.meetingDescription
    );
    formDataObj.append("meetingTitle", meetingFormData.meetingTitle);

    formDataObj.append(
      "meetingStartDate",
      meetingFormData.meetingStartDate.format("YYYY-MM-DD")
    );
    formDataObj.append(
      "meetingStartTime",
      meetingFormData.meetingStartTime.format("HH:mm")
    );

    console.log(
      "object before going to api:",
      Object.fromEntries(formDataObj.entries())
    );

    try {
      // await dispatch(saveContact(formDataObj)).unwrap();
      dispatch(profileEvents());
      console.log("Contact saved and events updated");
    } catch (error) {
      console.error("Error while saving contact or updating events:", error);
    }

    setMeetingFormData({
      meeting_id: "",
      meetingDescription: "",
      meetingTitle: "",
      meetingType: "",
      meetingStartDate: dayjs(),
      meetingStartTime: dayjs("00:00", "HH:mm"),
      meetingEndDate: dayjs(),
      meetingEndTime: dayjs("00:00", "HH:mm"),
    });
  };

  const handleMeetingInputChange = (name, value) => {
    setMeetingFormData({
      ...meetingFormData,
      [name]: value,
    });
  };
  const handleChange = (option) => {
    console.log("Selected Contact:", option);
    setSelectedOption(option);
  };
  useEffect(() => {
    let elements = Array.from(
      document.getElementsByClassName("react-datepicker-wrapper")
    );
    elements.map((element) => element.classList.add("width-100"));
  }, []);

  const [currentMonth, setCurrentMonth] = useState(dayjs());

  const getCalendarGrid = () => {
    const startOfMonth = currentMonth.startOf("month");
    const endOfMonth = currentMonth.endOf("month");
    const startDay = startOfMonth.startOf("week");
    const endDay = endOfMonth.endOf("week");
    const days = [];
    let day = startDay;
    while (day.isBefore(endDay) || day.isSame(endDay, "day")) {
      days.push(day);
      day = day.add(1, "day");
    }
    return days;
  };

  const eventsByDate = Array.isArray(events) ? events?.reduce((acc, event) => {
    const date = dayjs(event.start).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {}) : {};
  const days = getCalendarGrid();

  return (
    <>
      <div className={isCalendar ? "page-wrapper" : ""}>
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card ">
                <div className="card-header mb-4">
                  {/* <div className="page-header"> */}
                  <div className="row align-items-center w-100">
                    <div className="col-lg-10 col-sm-12">
                      <h3 className="page-title">{isCalendar ? "Calendar" : ""}</h3>
                    </div>
                    <div className="col-lg-2 col-sm-12 d-flex justify-content-end p-0">
                      <Link
                        to="#"
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#add_meeting"
                      >
                        Create Event
                      </Link>
                    </div>
                  </div>
                </div>
                {/* </div> */}
                <div className="row">
                  <div className="col-12 col-md-6 order-2 order-md-1">
                    {selectedDate && (
                      <div className="selected-events mt-6 ps-4">
                        <h5 className="text-lg font-semibold mb-3 text-gray-700 ">
                          Events on {dayjs(selectedDate).format("DD MMM YYYY")}
                        </h5>

                        {eventsByDate[selectedDate]?.length > 0 ? (
                          <div>
                            {eventsByDate[selectedDate].map((event) => (
                              // <div
                              //   key={event.event_id}
                              //   className="dashboardSmallCards px-3 py-2 mb-2"
                              // >
                              //   <div className="d-flex justify-content-between items-center">
                              //     <h6 className="font-bold text-blue-600">{event.title}</h6>
                              //     <p className="text-sm text-gray-600">
                              //       🕒 {dayjs(event.start).format("hh:mm A")}
                              //     </p>
                              //   </div>
                              //   {event.description && (
                              //     <p className="mt-2 text-gray-700">{event.description}</p>
                              //   )}
                              // </div>
                              <div
                                key={event.event_id}
                                className="dashboardSmallCards px-3 py-2 mb-2"
                              >
                                <p className="text-sm text-gray-600 whitespace-nowrap">
                                  🕒{" "}
                                  {dayjs(event.startTime, "HH:mm").format("hh:mm A")}
                                </p>
                                <div className="d-flex justify-content-between items-center">
                                  <h6 className="font-bold text-blue-600 truncate max-w-[200px]">
                                    {event.title}
                                  </h6>
                                </div>

                                {/* {event.description && (
                            <p className="mt-2 text-gray-700 line-clamp-2">
                              {event.description}
                            </p>
                          )} */}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No events</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-6 order-1 order-md-2">
                    <div className="custom-calendar-wrapper mb-4">
                      <div className="calendar-header">
                        <div
                          onClick={() =>
                            setCurrentMonth(currentMonth.subtract(1, "month"))
                          }
                          className="calendar-nav"
                        >
                          {"<"}
                        </div>
                        <span>{currentMonth.format("MMMM YYYY")}</span>
                        <div
                          onClick={() =>
                            setCurrentMonth(currentMonth.add(1, "month"))
                          }
                          className="calendar-nav"
                        >
                          {">"}
                        </div>
                      </div>
                      <div className="calendar-grid">
                        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                          <div className="calendar-cell calendar-cell-header" key={d}>
                            {d}
                          </div>
                        ))}
                        {/* {days.map((day, idx) => {
                    const isCurrentMonth = day.month() === currentMonth.month();
                    const isToday = day.isSame(today, "day");
                    const dayEvents =
                      eventsByDate[day.format("YYYY-MM-DD")] || [];
                    return (
                      <div
                        key={idx}
                        className={`calendar-cell${
                          isCurrentMonth ? "" : " calendar-cell-outside"
                        }${isToday ? " calendar-cell-today" : ""}`}
                      >
                        <div className="calendar-date">{day.date()}</div>
                        {dayEvents.length > 0 && (
                          <div
                            className={`calendar-event-indicator`}
                            style={{
                              backgroundColor: isToday ? "white" : "",
                            }}
                          />
                        )}
                      </div>
                    );
                  })} */}
                        {days.map((day, idx) => {
                          const isCurrentMonth = day.month() === currentMonth.month();
                          const isToday = day.isSame(today, "day");
                          const dayEvents =
                            eventsByDate[day.format("YYYY-MM-DD")] || [];

                          return (
                            <div
                              key={idx}
                              className={`calendar-cell${isCurrentMonth ? "" : " calendar-cell-outside"
                                }${isToday ? " calendar-cell-today" : ""}`}
                              onClick={() =>
                                setSelectedDate(day.format("YYYY-MM-DD"))
                              } // 👈 set clicked date
                            >
                              <div className="calendar-date">{day.date()}</div>
                              {dayEvents.length > 0 && (
                                <div
                                  className={`calendar-event-indicator`}
                                  style={{ backgroundColor: isToday ? "white" : "" }}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal custom-modal fade modal-padding"
        id="add_meeting"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Meeting</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="col-form-label">
                    Title <span className="text-danger"> *</span>
                  </label>
                  <input
                    className="form-control"
                    name="meetingTitle"
                    value={meetingFormData.meetingTitle}
                    onChange={(e) => {
                      handleMeetingInputChange(e.target.name, e.target.value);
                    }}
                    type="text"
                  />
                </div>

                <div className="mb-3">
                  <label className="col-form-label">
                    Description <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    name="meetingDescription"
                    value={meetingFormData.meetingDescription}
                    onChange={(e) =>
                      handleMeetingInputChange(e.target.name, e.target.value)
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="col-form-label">
                    Select Contact <span className="text-danger"> *</span>
                  </label>
                  <Select
                    value={selectedOption}
                    className="select2"
                    options={allContacts}
                    name="allContacts"
                    onChange={handleChange}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">Start Date</label>
                    <div className="icon-form-end">
                      <span className="form-icon">
                        <i className="ti ti-calendar-event" />
                      </span>
                      <DatePicker
                        className="form-control datetimepicker deals-details"
                        value={meetingFormData.meetingStartDate}
                        name="meetingStartDate"
                        onChange={(date) => {
                          handleMeetingInputChange("meetingStartDate", date);
                        }}
                        format="DD-MM-YYYY"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">Start Time </label>
                    <div className="icon-form">
                      <span className="form-icon">
                        <i className="ti ti-clock-hour-10" />
                      </span>
                      <TimePicker
                        placeholder="Select Time"
                        className="form-control datetimepicker-time"
                        name="meetingStartTime"
                        onChange={(time) =>
                          handleMeetingInputChange("meetingStartTime", time)
                        }
                        value={meetingFormData.meetingStartTime}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                        format="hh:mm A"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Meeting Type</label>
                  <Select
                    value={
                      meetingFormData?.meetingType
                        ? meetingType.find(
                          (option) =>
                            option.value === meetingFormData?.meetingType
                        )
                        : null
                    }
                    className="select2"
                    options={meetingType}
                    name="meetingType"
                    onChange={(option) =>
                      handleMeetingInputChange("meetingType", option.value)
                    }
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>

                {meetingFormData?.meetingType === "offline" && (
                  <div className="mb-3">
                    <label className="col-form-label">Location</label>
                    <input
                      className="form-control"
                      name="meetingLocation"
                      onChange={(e) => {
                        handleMeetingInputChange(e.target.name, e.target.value);
                      }}
                      value={meetingFormData.meetingLocation}
                      type="text"
                    />
                  </div>
                )}

                {meetingFormData?.meetingType === "online" &&
                  meetingFormData?.meetingLink !== "" ? (
                  <>
                    <div className="mb-3">
                      <label className="col-form-label">Meeting Link</label>
                      <input
                        className="form-control"
                        disabled
                        name="meetingLink"
                        value={meetingFormData.meetingLink}
                        onChange={(e) => {
                          handleMeetingInputChange(
                            e.target.name,
                            e.target.value
                          );
                        }}
                        type="text"
                      />
                    </div>
                  </>
                ) : (
                  ""
                )}

                {meetingFormData?.meetingType === "online" &&
                  meetingFormData?.meetingLink == "" && (
                    <div>
                      {!userProfile.accounts?.some(
                        (acc) => acc.type === "google" && acc.isConnected
                      ) && (
                          <>
                            <div className="text-danger mt-2">
                              *Generating meeting links Google Account is Required
                            </div>
                            <div className="mt-2">
                              <Link
                                to={route.emailSetup}
                                target="_blank"
                              // onClick={()=>{
                              //   document.getElementById("closeMeetingModal")?.click();
                              //   }}
                              >
                                Click here{" "}
                              </Link>
                              to connect your Google Account
                            </div>
                          </>
                        )}
                    </div>
                  )}

                <div className="col-lg-12 text-end modal-btn mt-4">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                    id="closeMeetingModal"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    type="button"
                    onClick={() => {
                      handleMeetingSubmit();
                    }}
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendar;
