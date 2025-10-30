import React, { useCallback, useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Modal } from 'react-bootstrap';
import { all_routes } from '../../router/all_routes';
// import DealsDeailsModal from '../../../core/modals/deals_modal';
import DefaultEditor from "react-simple-wysiwyg";
import { useDispatch, useSelector } from 'react-redux';
import { setActivityTogglePopup } from '../../../core/data/redux/commonSlice';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import CollapseHeader from '../../../core/common/collapse-header';
import CreatableSelect from 'react-select/creatable';
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { accountType, taskType, meetingType,  callStatus, all_tags,  owner as companyEmployee, ascendingandDecending, documentType, LocaleData, status, statusList } from '../../../core/common/selectoption/selectoption';
import { SelectWithImage2 } from '../../../core/common/selectWithImage2';
import { MdDownloadDone, MdOutlineRemoveDone, MdPhoneInTalk } from 'react-icons/md';
import { FaCalendarAlt, FaCloudDownloadAlt, FaPhoneSlash, FaRegBell, FaTasks } from 'react-icons/fa';
import { IoMdDoneAll } from 'react-icons/io';
import { SlPeople } from 'react-icons/sl';
import { RiVideoOnLine } from 'react-icons/ri';
import { IoLocationSharp } from 'react-icons/io5';
import DeleteModal from '../../../core/common/modals/DeleteModal';
import Table from "../../../core/common/dataTable/index";
import { utils, writeFile } from "xlsx";
import { callsData } from "../../../core/data/json/calls";
import { CiPlay1 } from 'react-icons/ci';
import { FcUpload } from 'react-icons/fc';
import { useDropzone } from 'react-dropzone';

const allNotes = [
  {
    photo: 'assets/img/profiles/avatar-19.jpg',
    name: 'California media',
    dateCreated: '15 Sep 2023, 12:10 pm',
    lastModified: "15 Sep 2023, 12:10 pm",
    isContacted: true,
    noteHeading: 'Important announcement',
    noteText: "A project review evaluates the success of an initiative and identifies areas for improvement. It can also evaluate a current project to determine whether it's on the right track. Or, it can determine the success of a completed project.",
    uploadedFiles: [
      {
        fileName: 'Project Specs.xls',
        fileSize: '365 kb',
        fileLogo: 'assets/img/media/media-35.jpg'
      },
      {
        fileName: 'Project.pdf',
        fileSize: '4 MB',
        fileLogo: 'assets/img/media/media-35.jpg'
      },
    ]
  },
  {
    photo: 'assets/img/profiles/avatar-19.jpg',
    name: 'California media',
    dateCreated: '15 Sep 2023, 12:12 pm',
    lastModified: "15 Sep 2023, 12:10 pm",
    isContacted: false,
    noteHeading: 'Not Important announcement',
    noteText: "A project review evaluates the success of an initiative and identifies areas for improvement. It can also evaluate a current project to determine whether it's on the right track. Or, it can determine the success of a completed project.",
    noteComments: [
      {
        commentText: 'The best way to get a project done faster is to start sooner. A goal without a timeline is just a dream.The goal you set must be challenging. At the same time, it should be realistic and attainable, not impossible to reach.',
        commentedBy: 'Aeron',
        commentTime: '17 Sep 2023, 12:10 pm',
      },
      {
        commentText: 'The best way to get a project done faster is to start sooner. A goal without a timeline is just a dream.The goal you set must be challenging. At the same time, it should be realistic and attainable, not impossible to reach.',
        commentedBy: 'Aeron',
        commentTime: '17 Sep 2023, 12:10 pm',
      },
    ],
    uploadedFiles: [
      {
        fileName: 'Project Specs.xls',
        fileSize: '365 kb',
        fileLogo: 'assets/img/media/media-35.jpg'
      },
      {
        fileName: 'Project.pdf',
        fileSize: '4 MB',
        fileLogo: 'assets/img/media/media-35.jpg'
      },
    ]
  },
]
const allTasks = [
  {
    name: 'California Media',
    photo: 'assets/img/profiles/avatar-19.jpg',
    title: 'Important Meeting',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat sed culpa rem odio natus inventore eaque beatae voluptas, delectus alias omnis, totam eveniet dolore quia!',
    taskType: 'Follow Up',
    isCompleted: 'false',
    dateCreated: '16 Sep 2023, 12:10 pm',
    dueDate: '15 Sep 2024',
    dueTime: '11.40 pm',
  },
  {
    name: 'California Media',
    photo: 'assets/img/profiles/avatar-19.jpg',
    title: 'Important Meeting',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat sed culpa rem odio natus inventore eaque beatae voluptas, delectus alias omnis, totam eveniet dolore quia!',
    taskType: 'Reminder',
    isCompleted: 'false',
    dateCreated: '17 Sep 2023, 12:10 pm',
    dueDate: '15 Oct 2024',
    dueTime: '11.40 pm',
  },
  {
    name: 'California Media',
    photo: 'assets/img/profiles/avatar-19.jpg',
    title: 'Important Meeting',
    description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fugiat sed culpa rem odio natus inventore eaque beatae voluptas, delectus alias omnis, totam eveniet dolore quia!',
    taskType: 'Reminder',
    isCompleted: 'true',
    dateCreated: '18 Sep 2023, 12:10 pm',
    dueDate: '15 Oct 2024',
    dueTime: '11.40 pm',
  },
]

const allMeetings = [
  {
    title: "Important Meeting",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe explicabo cum quas quasi quo ut culpa exercitationem in! Similique, maxime!",
    startDate: '9 sep 2024',
    startTime: '12.45 pm',
    endDate: '9 sep 2024',
    endTime: '01.45 pm',
    meetingType: 'Online',
    createdOnDate: "9 sep 2024",
    createdOnTime: "01.45 pm",
    physicalLocation: "Burjuman",
  },
  {
    title: "Not Important Meeting",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe explicabo cum quas quasi quo ut culpa exercitationem in! Similique, maxime!",
    startDate: '9 sep 2024',
    startTime: '12.45 pm',
    endDate: '9 sep 2024',
    endTime: '01.45 pm',
    meetingType: 'Offline',
    createdOnDate: "9 sep 2024",
    createdOnTime: "01.45 pm",
    physicalLocation: "Burjuman",
  },
]


const DealsDetails = () => {

  const [value, setValue] = useState('Write a new comment, send your team notification by typing @ followed by their name');
  const onChange = (e) => {
    setValue(e.target.value);
  }
  const route = all_routes
  const [openModal, setOpenModal] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  const [isEditor2, setIsEditor2] = useState(false);
  const [isEditor3, setIsEditor3] = useState(false);
  const [sortOrder, setSortOrder] = useState("Descending");
  const [contactedToday, setContactedToday] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortOrderIncompleteTask, setSortOrderIncompleteTask] = useState("Descending");
  const [sortOrderCompletedTask, setSortOrderCompletedTask] = useState("Descending");
  const [activeEditorIndex, setActiveEditorIndex] = useState(null);
  const [hoveredNoteIndex, setHoveredNoteIndex] = useState(null);
  const [deleteModalText, setDeleteModalText] = useState("");
  const [indexToDelete, setIndexToDelete] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [hoveredTaskIndex, setHoveredTaskIndex] = useState(null);
  const [hoveredTaskCompletedIndex, setHoveredTaskCompletedIndex] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState(null);
  const [hoveredMeetingIndex, setHoveredMeetingIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCallStatus, setSelectedCallStatus] = useState([]);
  const [searchEmployeeInFilter, setSearchEmployeeInFilter] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [stars, setStars] = useState({});
  const [showFirstField, setShowFirstField] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    "": true,
    "Call Id": true,
    "Agent Name": true,
    "Call Type": true,
    "Call Date": true,
    "Call Duration": true,
    "Call Status": true,
    "Next FollowUp": true,
    "Recording": true,

  });




  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const handleNoteEditClick = (note) => {
    setSelectedNote(note)
  }
  const handleTaskEditClick = (task) => {
    setSelectedTask(task)
  }
  const handleMeetingTypeChange = (selectedOption) => {
    setSelectedMeetingType(selectedOption ? selectedOption.value : null);
  };
  const handleMeetingEditClick = (meeting) => {
    setSelectedMeeting(meeting)
  }
  const handleModalDeleteBtn = (text) => {

    console.log(`Deleting ${indexToDelete} ${text}...`);
  };
  const filterCallStatus = (callStatus) => {
    setSelectedCallStatus((prevStatus) =>
      prevStatus.includes(callStatus)
        ? prevStatus.filter((status) => status !== callStatus)
        : [...prevStatus, callStatus]
    );
  };
  const onDrop = useCallback((acceptedFiles) => {
    // Handle the uploaded files here
    setUploadedFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    console.log(acceptedFiles);
    console.log(uploadedFiles, "UploadedFiles");

  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // accept: {
    //   "text/csv": ['.csv'],
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ['.xlsx']
    // },
    maxSize: 5242880, // 5MB max file size
    multiple: true
  });
  const resetFilters = () => {
    setSelectedCallStatus([]);
    setSelectedEmployee([]);
    setSearchEmployeeInFilter('');
  };
  const filteredEmployees = companyEmployee.filter((employee) =>
    employee.value.toLowerCase().includes(searchEmployeeInFilter.toLowerCase())
  );
  const exportPDF = () => {
    const doc = new jsPDF();

    const filteredColumns = columns.filter(
      (col) =>
        columnVisibility[col.title] &&
        col.title !== "Recording"
    );
    const currentDateAndTime = new Date();
    const currentDate = currentDateAndTime.toLocaleDateString();
    const currentTime = currentDateAndTime.toLocaleTimeString();

    const headers = filteredColumns.map((col) => col.title);
    const data = filteredCallData.map((row) =>
      filteredColumns.map((col) => row[col.dataIndex] || "")
    );


    const pageWidth = doc.internal.pageSize.getWidth();
    const titleText = "Calls Report";
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (pageWidth - titleWidth) / 2;

    doc.setFontSize(15);
    doc.text(titleText, titleX, 20);

    doc.setFontSize(10);
    doc.text(`Exported on: ${currentDate} at ${currentTime}`, 15, 35);


    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: data,
    });


    doc.save("Call-details.pdf");
  };

  const exportExcel = () => {
    const wb = utils.book_new();


    const filteredColumns = columns.filter((col) =>
      columnVisibility[col.title] && col.title !== "Recording"
    );


    const wsData = [
      filteredColumns.map((col) => col.title),
      ...filteredCallData.map((row) =>
        filteredColumns.map((col) => row[col.dataIndex] || "")
      ),
    ];


    const ws = utils.aoa_to_sheet(wsData);


    utils.book_append_sheet(wb, ws, "Calls");


    writeFile(wb, "calls_report.xlsx");
  };
  const handleToggleColumnVisibility = (columnTitle) => {
    setColumnVisibility((prevVisibility) => ({
      ...prevVisibility,
      [columnTitle]: !prevVisibility[columnTitle],
    }));

  };
  const options = [
    { value: 'marketing', label: 'Marketing Pipeline' },
    { value: 'sales', label: 'Sales Pipeline' }
  ];
  const dealsopen = [
    { value: "choose", label: "Choose" },
    { value: "collins", label: "Collins" },
    { value: "konopelski", label: "Konopelski" },
    { value: "adams", label: "Adams" },
    { value: "schumm", label: "Schumm" },
    { value: "wisozk", label: "Wisozk" },
  ];
  const sortbydata = [
    { value: 'Sort By Date', label: 'Sort By Date' },
    { value: 'Ascending', label: 'Ascending' },
    { value: 'Descending', label: 'Descending' }
  ];
  const handleStarToggle = (index) => {
    setStars((prevStars) => ({
      ...prevStars,
      [index]: !prevStars[index],
    }));
  };
  const handleRadioChange = (event) => {
    setContactedToday(event.target.value === 'contactedToday');
  };

  const sortNotes = (notes) => {
    const sortedNotes = [...notes];
    const parseDate = (dateString) => {
      const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
      const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
      return new Date(formattedDate).getTime();
    };
    if (sortOrder === "Ascending") {
      sortedNotes.sort((a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated));
    } else if (sortOrder === "Descending") {
      sortedNotes.sort((a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated));
    }
    return sortedNotes;
  };
  const sortIncompleteTask = (incompleteTask) => {
    const sortedIncompleteTask = [...incompleteTask];
    const parseDate = (dateString) => {
      const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
      const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
      return new Date(formattedDate).getTime();
    };
    if (sortOrderIncompleteTask === "Ascending") {
      sortedIncompleteTask.sort((a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated));
    } else if (sortOrderIncompleteTask === "Descending") {
      sortedIncompleteTask.sort((a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated));
    }
    return sortedIncompleteTask;
  };
  const sortCompletedTask = (completedTask) => {
    const sortedCompletedTask = [...completedTask];
    const parseDate = (dateString) => {
      const [day, month, year, time, meridiem] = dateString.split(/[\s,]+/);
      const formattedDate = `${day} ${month} ${year} ${time} ${meridiem}`;
      return new Date(formattedDate).getTime();
    };
    if (sortOrderCompletedTask === "Ascending") {
      sortedCompletedTask.sort((a, b) => parseDate(a.dateCreated) - parseDate(b.dateCreated));
    } else if (sortOrderCompletedTask === "Descending") {
      sortedCompletedTask.sort((a, b) => parseDate(b.dateCreated) - parseDate(a.dateCreated));
    }
    return sortedCompletedTask;
  };

  const sortedNotes = sortNotes(allNotes);
  const sortedIncompleteTask = sortIncompleteTask(allTasks);
  const sortedCompletedTask = sortCompletedTask(allTasks);
  const filteredCallData = callsData.filter((calls) => {

    const isAnySearchColumnVisible =
      columnVisibility["Call Id"] ||
      columnVisibility["Agent Name"];

    const matchesSearchQuery =
      !isAnySearchColumnVisible ||
      (calls.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (calls.agentName.toLowerCase().includes(searchQuery.toLowerCase()))
    // (columnVisibility["Call Id"] && calls.callId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    // (columnVisibility["Agent Name"] && calls.agentName.toLowerCase().includes(searchQuery.toLowerCase()))


    const matchesStatus =
      selectedCallStatus.length === 0 ||
      selectedCallStatus.includes(calls.callStatus.toLowerCase());


    const matchesEmployee =
      selectedEmployee.length === 0 ||
      selectedEmployee.includes(calls.agentName.toLowerCase());


    return matchesSearchQuery && matchesStatus && matchesEmployee

  });

  const getInitials = (deal_name) => {
    if (deal_name) {
      const parts = deal_name.trim().split(" ");
      const firstName = parts[0] || '';
      const lastName = parts[1] || '';
      if (lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
      }
      return `${firstName.charAt(0)}${firstName.charAt(1) || ''}`.toUpperCase();
    }
  };
  const handleInput = (event) => {
    const input = event.target.value;
    console.log(input, "input");
    if (selectedTask) {

      setSelectedTask({
        ...selectedTask,
        title: input,
      });
    }
    console.log(selectedTask, "selected task");
  }
  const filterLeadEmployee = (leadEmployee) => {
    setSelectedEmployee((prevStatus) =>
      prevStatus.includes(leadEmployee)
        ? prevStatus.filter((employee) => employee !== leadEmployee)
        : [...prevStatus, leadEmployee]
    );
  };


  const columns = [
    {
      title: "",
      dataIndex: "",
      render: (text, record, index) => (
        <div
          className={`set-star rating-select ${stars[index] ? "filled" : ""}`}
          onClick={() => handleStarToggle(index)}
        >
          <i className="fa fa-star"></i>
        </div>
      ),
    },
    {
      title: "Call Id",
      dataIndex: "callId",
      key: "callId",
      sorter: (a, b) => a.callId.localeCompare(b.callId),
    },
    {
      title: "Agent Name",
      dataIndex: "agentName",
      key: "agentName",
      sorter: (a, b) => a.agentName.localeCompare(b.agentName),
    },
    {
      title: "Call Date",
      dataIndex: "callDate",
      key: "callDate",
      sorter: (a, b) => a.callDate.localeCompare(b.callDate),
    },
    {
      title: "Call Duration",
      dataIndex: "callDuration",
      key: "callDuration",
      sorter: (a, b) => a.callDuration.localeCompare(b.callDuration),
    },
    {
      title: "Call Status",
      dataIndex: "callStatus",
      key: "callStatus",
      sorter: (a, b) => a.callStatus.localeCompare(b.callStatus),
    },
    {
      title: "Next FollowUp",
      dataIndex: "nextFollowUp",
      key: "nextFollowUp",
      sorter: (a, b) => a.nextFollowUp.localeCompare(b.nextFollowUp),
    },
    {
      title: "Recording",
      dataIndex: "recordingLink",
      key: "recordingLink",
      render: (text) => (
        <div className="d-flex justify-content-center align-items-center">
          <span style={{ color: '#00918E' }} className="me-3">
            <FaCloudDownloadAlt />
          </span>
          <span style={{ color: "blue" }}>
            <CiPlay1 />
          </span>
        </div>
      ),
    },
  ];
  const visibleColumns = columns.filter(
    (column) => columnVisibility[column.title]
  );

  const handleSaveAndNext = () => {
    setShowFirstField(true);
  };
  const handleCancel = () => {
    setShowFirstField(false);
  };
  const [showFirstField2, setShowFirstField2] = useState(false);

  const handleSaveAndNext2 = () => {
    setShowFirstField2(true);
  };
  const handleCancel2 = () => {
    setShowFirstField2(false);
  };
  const [showFirstField3, setShowFirstField3] = useState(false);

  const handleSaveAndNext3 = () => {
    setShowFirstField3(true);
  };
  const handleCancel3 = () => {
    setShowFirstField3(false);
  };
  const tooltipContent = (
    <Tooltip id="tooltip">
      There are no email accounts configured. Please configure your email account in order to Send/Create Emails.
    </Tooltip>
  );


  const dispatch = useDispatch();
  const activityToggle = useSelector((state) => state?.activityTogglePopup);


  const location = useLocation();

  const dealInfo = location.state?.record || {};

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Deals User */}
              <div className="contact-head">
                <div className="row align-items-center">
                  <div className="col-sm-8">
                    <ul className="contact-breadcrumb">
                      <li>
                        <Link to={route.deals}>
                          <i className="ti ti-arrow-narrow-left" />
                          Deals
                        </Link>
                      </li>
                      <li>{dealInfo.dealName}</li>
                      {/* <li className="before-none">
                        <div className="select-pipeline">
                          <span className="pipe-icon">
                            <i className="ti ti-timeline-event-text" />
                          </span>
                          <Select
                            className='select'
                            options={options}
                            classNamePrefix="react-select"
                            placeholder="Marketing Pipeline"
                          />
                        </div>
                      </li>
                      <li className="before-none">
                        <Link
                          to="#"
                          className="btn btn-primary"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#offcanvas_pipeline"
                        >
                          <i className="ti ti-square-rounded-plus" />
                          Add
                        </Link>
                      </li> */}
                    </ul>
                  </div>
                  {/* <div className="col-sm-4 text-sm-end">
                    <div className="contact-pagination">
                      <p>1 of 40</p>
                      <ul>
                        <li>
                          <Link to={route.dealsDetails}>
                            <i className="ti ti-chevron-left" />
                          </Link>
                        </li>
                        <li>
                          <Link to={route.dealsDetails}>
                            <i className="ti ti-chevron-right" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
              </div>
              <div className="card">
                <div className="card-body pb-2">
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <div className="d-flex align-items-center mb-2">
                      <span
                        className="avatar avatar-lg bg-gray flex-shrink-0 me-2"
                      >
                        <span className="avatar-title text-dark">{getInitials(dealInfo.dealName)}</span>
                      </span>
                      <div>
                        <h5 className="mb-1">
                          {dealInfo.dealName}{" "}
                          <span className="star-icon">
                            <i className="fa-solid fa-star" />
                          </span>
                        </h5>
                        <p className="mb-1">
                          <i className="ti ti-building" /> {dealInfo.customer_company}
                        </p>
                        {/* <p className="mb-0">
                          <i className="ti ti-map-pin-pin" /> 22, Ave Street,
                          Newyork, USA
                        </p> */}
                      </div>
                    </div>
                    <div className="contacts-action">
                      <span className="badge badge-light">
                        <i className="ti ti-lock" />
                        Private
                      </span>
                      <div className="dropdown mb-2">
                        <Link
                          to="#"
                          className="text-white bg-success py-1 px-2 d-inline-flex align-items-center"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="ti ti-thumb-up me-2" />
                          Won
                          <i className="ti ti-chevron-down ms-2" />
                        </Link>
                        <div className="dropdown-menu dropdown-menu-right">
                          <Link className="dropdown-item" to="#">
                            <span>Won</span>
                          </Link>
                          <Link className="dropdown-item" to="#">
                            <span>Lost</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Deals User */}
            </div>
            {/* Deals Sidebar */}
            <div className="col-xl-3 theiaStickySidebar">
              <div className="card">
                <div className="card-body p-3">
                  <h6 className="mb-3 fw-semibold">Deal Information</h6>
                  <ul>
                    <li className="row mb-3">
                      <span className="col-6">Date Created</span>
                      <span className="col-6">{dealInfo.createdDate}</span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Value</span>
                      <span className="col-6">{dealInfo.dealValue} AED</span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Due Date</span>
                      <span className="col-6">20 Jan 2024, 10:00 am</span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Follow Up</span>
                      <span className="col-6">20 Jan 2024</span>
                    </li>
                    <li className="row mb-3">
                      <span className="col-6">Source</span>
                      <span className="col-6">{dealInfo.source}</span>
                    </li>
                  </ul>
                  <hr />
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Owner</h6>
                    <Link
                      to="#"
                      className="link-purple fw-medium mb-3"
                      data-bs-toggle="modal"
                      data-bs-target="#owner"
                    >
                      <i className="ti ti-circle-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md me-2">
                      <ImageWithBasePath src="assets/img/profiles/avatar-21.jpg" alt="Image" />
                    </div>
                    <p>Vaughan</p>
                  </div>
                  <div className="d-flex align-items-center mb-0">
                    <div className="avatar avatar-md me-2">
                      <ImageWithBasePath src="assets/img/profiles/avatar-01.jpg" alt="Image" />
                    </div>
                    <p>Jessica</p>
                  </div>
                  <hr />
                  <div>
                    <label className="col-form-label">Tags </label>
                    <CreatableSelect
                      classNamePrefix="react-select"
                      options={all_tags}
                      // isLoading={isLoading}
                      // onChange={(newValue) => setValue(newValue)}
                      // onCreateOption={handleCreate}
                      className="js-example-placeholder-multiple select2 js-states"
                      isMulti={true}
                      placeholder="Add Tags"
                    />
                  </div>
                  <hr />
                  {/* <h6 className="mb-3 fw-semibold">Projects</h6>
                  <Link
                    to="#"
                    className="badge bg-light-300 text-default me-2 mb-2"
                  >
                    Devops Design
                  </Link>
                  <Link
                    to="#"
                    className="badge bg-light-300 text-default mb-2"
                  >
                    Margrate Design
                  </Link> */}
                  <hr />
                  {/* <h6 className="mb-3 fw-semibold">Priority</h6>
                  <div className="priority-info">
                    <div className="dropdown">
                      <Link
                        to="#"
                        className="dropdown-toggle"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span>
                          <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                          High
                        </span>
                        <i className="ti ti-chevron-down me-1" />
                      </Link>
                      <div className="dropdown-menu dropdown-menu-right">
                        <Link className="dropdown-item" to="#">
                          <span>
                            <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                            High
                          </span>
                        </Link>
                        <Link className="dropdown-item" to="#">
                          <span>
                            <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                            Low
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <hr /> */}
                  <div className="d-flex align-items-center justify-content-between flex-wrap">
                    <h6 className="mb-3 fw-semibold">Contacts</h6>
                    <Link
                      to="#"
                      className="link-purple mb-3 fw-medium"
                      data-bs-toggle="modal"
                      data-bs-target="#add_contact"
                    >
                      <i className="ti ti-circle-plus me-1" />
                      Add New
                    </Link>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar avatar-md me-2">
                      <ImageWithBasePath src="assets/img/profiles/avatar-21.jpg" alt="Image" />
                    </div>
                    <p>Vaughan</p>
                  </div>
                  <div className="d-flex align-items-center mb-0">
                    <div className="avatar avatar-md me-2">
                      <ImageWithBasePath src="assets/img/profiles/avatar-01.jpg" alt="Image" />
                    </div>
                    <p>Jessica</p>
                  </div>
                  <hr />
                  <ul>
                    <li className="row mb-3">
                      <span className="col-6">Last Modified</span>
                      <span className="col-6">10 Jan 2024, 10:00 am</span>
                    </li>
                    <li className="row mb-0">
                      <span className="col-6">Modified By</span>
                      <span className="col-6">
                        <span className="avatar avatar-xs me-1">
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-19.jpg"
                            className="avatar-xs"
                            alt="img"
                          />
                        </span>
                        Darlee Robertson
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* /Deals Sidebar */}
            {/* Deals Details */}
            <div className="col-xl-9">
              <div className="card mb-3">
                <div className="card-body pb-0">
                  <h4 className="fw-semibold mb-3">Deal Pipeline Status</h4>
                  <div className="pipeline-list">
                    <ul>
                      <li>
                        <Link to="#" className="bg-info-cus-light" style={{ backgroundColor: '#d7ffd9' }}>
                          Quality To Buy
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="bg-blue-cus-light" style={{ backgroundColor: '#bdf7ff' }}>
                          Contact Made
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="bg-success-cus-light" style={{ backgroundColor: '#ffe4b4' }}>
                          Presentation
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="bg-danger-cus-light" style={{ backgroundColor: '#ffdbdb' }}>
                          Proposal Made
                        </Link>
                      </li>
                      <li>
                        <Link to="#">Appointment</Link>
                      </li>
                    </ul>
                  </div>
                  <ul className="nav nav-tabs nav-tabs-bottom" role="tablist">
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#notes"
                        className="nav-link active"
                      >
                        <i className="ti ti-notes me-1" />
                        Notes
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        data-bs-toggle="tab"
                        data-bs-target="#tasks"
                        className="nav-link"
                      >
                        <FaTasks className="me-2" />
                        Tasks
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to=""
                        data-bs-toggle="tab"
                        data-bs-target="#meeting"
                        className="nav-link"
                      >
                        <SlPeople className="me-2" />
                        Meetings
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#calls"
                        className="nav-link"
                      >
                        <i className="ti ti-phone me-1" />
                        Calls
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#attachment"
                        className="nav-link"
                      >
                        <i className="ti ti-file me-1" />
                        Attachments
                      </Link>
                    </li>
                    <li className="nav-item" role="presentation">
                      <Link
                        to="#"
                        data-bs-toggle="tab"
                        data-bs-target="#activities"
                        className="nav-link"
                      >
                        <i className="ti ti-alarm-minus me-1" />
                        Activities
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Tab Content */}
              <div className="tab-content pt-0">
                {/* Activities */}
                <div className="tab-pane" id="activities">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h4 className="fw-semibold">Activities</h4>
                      <div>
                        <div className="form-sort mt-0">
                          <i className="ti ti-sort-ascending-2" />
                          <Select
                            className="select"
                            options={ascendingandDecending}
                            placeholder="Ascending"
                            classNamePrefix="react-select"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                        <i className="ti ti-calendar-check me-1" />
                        29 Aug 2023
                      </div>
                      <div className="card border shadow-none mb-3">
                        <div className="card-body p-3">
                          <div className="d-flex">
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-pending">
                              <i className="ti ti-mail-code" />
                            </span>
                            <div>
                              <h6 className="fw-medium mb-1">
                                You sent 1 Message to the contact.
                              </h6>
                              <p>10:25 pm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border shadow-none mb-3">
                        <div className="card-body p-3">
                          <div className="d-flex">
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                              <i className="ti ti-phone" />
                            </span>
                            <div>
                              <h6 className="fw-medium mb-1">
                                Denwar responded to your appointment schedule
                                question by call at 09:30pm.
                              </h6>
                              <p>09:25 pm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border shadow-none mb-3">
                        <div className="card-body p-3">
                          <div className="d-flex">
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-orange">
                              <i className="ti ti-notes" />
                            </span>
                            <div>
                              <h6 className="fw-medium mb-1">
                                Notes added by Antony
                              </h6>
                              <p className="mb-1">
                                Please accept my apologies for the inconvenience
                                caused. It would be much appreciated if it's
                                possible to reschedule to 6:00 PM, or any other
                                day that week.
                              </p>
                              <p>10.00 pm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                        <i className="ti ti-calendar-check me-1" />
                        28 Feb 2024
                      </div>
                      <div className="card border shadow-none mb-3">
                        <div className="card-body p-3">
                          <div className="d-flex">
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-info">
                              <i className="ti ti-user-pin" />
                            </span>
                            <div>
                              <h6 className="fw-medium mb-1 d-inline-flex align-items-center flex-wrap">
                                Meeting With{" "}
                                <span className="avatar avatar-xs mx-2">
                                  <ImageWithBasePath
                                    src="assets/img/profiles/avatar-19.jpg"
                                    alt="img"
                                  />
                                </span>{" "}
                                Abraham
                              </h6>
                              <p>Schedueled on 05:00 pm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card border shadow-none mb-3">
                        <div className="card-body p-3">
                          <div className="d-flex">
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-secondary-success">
                              <i className="ti ti-notes" />
                            </span>
                            <div>
                              <h6 className="fw-medium mb-1">
                                Drain responded to your appointment schedule
                                question.
                              </h6>
                              <p>09:25 pm</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="badge badge-soft-purple fs-14 fw-normal shadow-none mb-3">
                        <i className="ti ti-calendar-check me-1" />
                        Upcoming Activity
                      </div>
                      <div className="card border shadow-none mb-0">
                        <div className="card-body p-3">
                          <div className="d-flex">
                            <span className="avatar avatar-md flex-shrink-0 rounded me-2 bg-info">
                              <i className="ti ti-user-pin" />
                            </span>
                            <div>
                              <h6 className="fw-medium mb-1">
                                Product Meeting
                              </h6>
                              <p className="mb-1">
                                A product team meeting is a gathering of the
                                cross-functional product team — ideally
                                including team members from product,
                                engineering, marketing, and customer support.
                              </p>
                              <p>25 Jul 2023, 05:00 pm</p>
                              <div className="upcoming-info">
                                <div className="row">
                                  <div className="col-sm-4">
                                    <p>Reminder</p>
                                    <div className="dropdown">
                                      <Link
                                        to="#"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="ti ti-clock-edit me-1" />
                                        Reminder
                                        <i className="ti ti-chevron-down ms-1" />
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          Remainder
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          1 hr
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          10 hr
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <p>Task Priority</p>
                                    <div className="dropdown">
                                      <Link
                                        to="#"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                        High
                                        <i className="ti ti-chevron-down ms-1" />
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          <i className="ti ti-square-rounded-filled me-1 text-danger circle" />
                                          High
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          <i className="ti ti-square-rounded-filled me-1 text-success circle" />
                                          Low
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-sm-4">
                                    <p>Assigned to</p>
                                    <div className="dropdown">
                                      <Link
                                        to="#"
                                        className="dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                      >
                                        <ImageWithBasePath
                                          src="assets/img/profiles/avatar-19.jpg"
                                          alt="img"
                                          className="avatar-xs"
                                        />
                                        John
                                        <i className="ti ti-chevron-down ms-1" />
                                      </Link>
                                      <div className="dropdown-menu dropdown-menu-right">
                                        <Link className="dropdown-item" to="#">
                                          <ImageWithBasePath
                                            src="assets/img/profiles/avatar-19.jpg"
                                            alt="img"
                                            className="avatar-xs"
                                          />
                                          John
                                        </Link>
                                        <Link className="dropdown-item" to="#">
                                          <ImageWithBasePath
                                            src="assets/img/profiles/avatar-15.jpg"
                                            alt="img"
                                            className="avatar-xs"
                                          />
                                          Peter
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
                    </div>
                  </div>
                </div>
                {/* /Activities */}
                {/* Notes */}
                <div className="tab-pane active show" id="notes">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h4 className="fw-semibold">Notes</h4>
                      <div className="d-inline-flex align-items-center">
                        <div className="form-sort me-3 mt-0">
                          <i className="ti ti-sort-ascending-2" />
                          <Select
                            className="select dropdownCusWidth"
                            options={ascendingandDecending}
                            placeholder="Sort By Date"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                setSortOrder(selectedOption.value)
                              }
                              else {
                                setSortOrder(null)
                              }
                            }}
                          />
                        </div>

                      </div>
                    </div>
                    <div className="card-body">
                      <div className="notes-activity">
                        <form>
                          <div className="row">
                            <div className="mb-3 col-md-8">
                              <label className="col-form-label">
                                Note <span className="text-danger"> *</span>
                              </label>
                              <textarea
                                className="form-control"
                                rows={3}
                                defaultValue={''}
                              />
                            </div>
                            <div className="mb-3 my-auto col-md-4">
                              {contactedToday && <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <label className="col-form-label">Due Date</label>
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
                                  <div className="mb-3">
                                    <label className="col-form-label">
                                      Due Time
                                    </label>
                                    <div className="icon-form">
                                      <span className="form-icon">
                                        <i className="ti ti-clock-hour-10" />
                                      </span>
                                      <TimePicker
                                        placeholder="Select Time"
                                        className="form-control datetimepicker-time"
                                        onChange={onChange}
                                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>}
                              <div className="d-flex">
                                <div className="form-check me-5">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="contactedOrNot"
                                    value="contactedToday"
                                    id="flexRadioDefault1"
                                    onChange={handleRadioChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexRadioDefault1"
                                  >
                                    Contacted Today
                                  </label>
                                </div>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="contactedOrNot"
                                    value="notContacted"
                                    id="flexRadioDefault2"
                                    onChange={handleRadioChange}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="flexRadioDefault2"
                                  >
                                    Not Contacted
                                  </label>
                                </div>
                              </div>

                            </div>
                          </div>

                          <div className="col-lg-12 modal-btn mb-4">
                            <button
                              className="btn btn-primary"
                              data-bs-dismiss="modal"
                              type="button"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                        {sortedNotes.map((note, index) => {
                          const isActiveEditor = activeEditorIndex === index;
                          return (
                            <div className="card mb-3" key={index}>
                              <div className="card-body notesBorderLeft"
                                onMouseEnter={() => setHoveredNoteIndex(index)}
                                onMouseLeave={() => setHoveredNoteIndex(null)}
                              >
                                <div style={{ position: 'absolute', top: 20, right: 20 }}>
                                  {
                                    hoveredNoteIndex === index &&
                                    <>
                                      <Link to=""
                                        className="me-3 styleForEditBtn"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add_notes"
                                        onClick={() => { handleNoteEditClick(note) }}
                                      >
                                        <i className="ti ti-edit text-blue" />
                                      </Link>
                                      <Link to="" className="styleForDeleteBtn"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#delete_${deleteModalText}`}
                                        onClick={() => {
                                          setDeleteModalText("note")
                                          setIndexToDelete(index)
                                        }}
                                      >
                                        <i className="ti ti-trash text-danger" />
                                      </Link>
                                    </>
                                  }
                                </div>

                                {
                                  note.isContacted === true ? <div className="mb-3">
                                    <span className={`badge badge-soft-success fw-medium`}>
                                      <MdPhoneInTalk className="me-2" />
                                      Contacted
                                    </span>
                                  </div> :
                                    <div className="mb-3">
                                      <span className={`badge badge-soft-danger fw-medium`}>
                                        <FaPhoneSlash className="me-2" />
                                        Not Contacted
                                      </span>
                                    </div>
                                }
                                <p className="mb-3">
                                  {note.noteText}{" "}
                                </p>

                                <div>
                                  <p>✎  <span className="fw-medium text-black ms-2">Modified by Jessica on </span> <span>{note.lastModified}{' '}</span></p>
                                </div>

                              </div>
                            </div>
                          )
                        })}

                      </div>
                    </div>
                  </div>
                </div>
                {/* /Notes */}
                {/* Tasks */}
                <div className="tab-pane fade" id="tasks">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h4 className="fw-semibold mb-0">Tasks</h4>
                      <div className="d-inline-flex align-items-center">
                        <div className="form-sort me-3 mt-0">
                          <i className="ti ti-sort-ascending-2" />
                          <Select
                            className="select dropdownCusWidth"
                            options={ascendingandDecending}
                            placeholder="Sort By Date"
                            classNamePrefix="react-select"
                            onChange={(selectedOption) => {
                              if (selectedOption) {
                                setSortOrderIncompleteTask(selectedOption.value);
                              } else {
                                setSortOrderIncompleteTask(null);
                              }
                            }}
                          />
                        </div>
                        <Link
                          to=""
                          data-bs-toggle="modal"
                          data-bs-target="#add_tasks"
                          className="link-purple fw-medium"
                          onClick={() => {
                            setSelectedTask(null)
                          }}
                        >
                          <i className="ti ti-circle-plus me-1" />
                          Add New
                        </Link>
                      </div>
                    </div>
                    <div className="card-body">

                      <div className="notes-activity">
                        {sortedIncompleteTask.filter(task => task.isCompleted === 'false').map((task, taskIndex) => {
                          return (
                            <div className="card mb-3" key={taskIndex}>
                              <div className="card-body"
                                onMouseEnter={() => setHoveredTaskIndex(taskIndex)}
                                onMouseLeave={() => setHoveredTaskIndex(null)}
                              >
                                <div className="d-flex align-items-center justify-content-between pb-2">

                                  {hoveredTaskIndex === taskIndex && <div style={{ position: 'absolute', top: 20, right: 20 }}>
                                    <Link to="" className="styleForDoneBtn me-3">
                                      <IoMdDoneAll />
                                    </Link>
                                    <Link to=""
                                      className="styleForEditBtn me-3"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add_tasks"
                                      onClick={() => { handleTaskEditClick(task) }}
                                    >
                                      <i className="ti ti-edit text-blue" />
                                    </Link>
                                    <Link to="" className="styleForDeleteBtn"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#delete_${deleteModalText}`}
                                      onClick={() => {
                                        setDeleteModalText("task")
                                        setIndexToDelete(taskIndex)
                                      }}
                                    >
                                      <i className="ti ti-trash text-danger" />
                                    </Link>
                                  </div>
                                  }
                                </div>
                                <div className="col-md-11 mb-3">
                                  {task.taskType == "Follow Up" ? <p className={`badge badge-soft-warning fw-medium me-2`}>
                                    <FaCalendarAlt className="me-2" />
                                    {task.taskType}
                                  </p> :
                                    <p className={`badge badge-soft-info fw-medium me-2`}>
                                      <FaRegBell className="me-2" />
                                      {task.taskType}
                                    </p>
                                  }
                                  <p>
                                    {task.description}
                                  </p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <p className="mb-0">✎  <span className="fw-medium text-black ms-2">Modified by Jessica on </span> <span>{task.dateCreated}{' '}</span></p>
                                  <p><span className="fw-medium text-black">Due date :</span> <span>{task.dateCreated}{' '}</span></p>
                                </div>

                              </div>
                            </div>
                          )
                        })}

                      </div>
                    </div>
                  </div>
                  {/* for completed task */}
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h4 className="fw-semibold mb-0">Completed Tasks</h4>
                      <div className="d-inline-flex align-items-center">
                        <div className="form-sort me-3 mt-0">
                          <i className="ti ti-sort-ascending-2" />
                          <Select
                            className="select dropdownCusWidth"
                            options={ascendingandDecending}
                            placeholder="Sort By Date"
                            classNamePrefix="react-select"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="notes-activity">
                        {sortedCompletedTask.filter(task => task.isCompleted === 'true').map((task, taskCompletedIndex) => {
                          return (
                            <div className="card mb-3" key={taskCompletedIndex}>
                              <div className="card-body"
                                onMouseEnter={() => setHoveredTaskCompletedIndex(taskCompletedIndex)}
                                onMouseLeave={() => setHoveredTaskCompletedIndex(null)}
                              >
                                <div className="d-flex align-items-center justify-content-between pb-2">
                                  {hoveredTaskCompletedIndex === taskCompletedIndex && <div style={{ position: 'absolute', top: 20, right: 20 }}>
                                    <Link to="" className="styleForNotDoneBtn me-3">
                                      <MdOutlineRemoveDone />
                                    </Link>
                                    <Link to=""
                                      className="styleForEditBtn me-3"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add_tasks"
                                      onClick={() => { handleTaskEditClick(task) }}
                                    >
                                      <i className="ti ti-edit text-blue" />
                                    </Link>
                                    <Link to="" className="styleForDeleteBtn"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#delete_${deleteModalText}`}
                                      onClick={() => {
                                        setDeleteModalText("task")
                                        setIndexToDelete(taskCompletedIndex)
                                      }}
                                    >
                                      <i className="ti ti-trash text-danger" />
                                    </Link>
                                  </div>
                                  }
                                </div>
                                <div className="col-md-11 mb-3">
                                  {task.taskType == "Follow Up" ?
                                    <div className="mb-3">
                                      <span className={`badge badge-soft-warning fw-medium me-2`}>
                                        <FaCalendarAlt className="me-2" />
                                        {task.taskType}
                                      </span>
                                      <span className={`badge badge-soft-success fw-medium`}>
                                        <FaCalendarAlt className="me-2" />
                                        Completed
                                      </span>
                                    </div>
                                    :
                                    <div className="mb-3">
                                      <span className={`badge badge-soft-info fw-medium me-2`}>
                                        <FaRegBell className="me-2" />
                                        {task.taskType}
                                      </span>
                                      <span className={`badge badge-soft-success fw-medium`}>
                                        <MdDownloadDone className="me-2" />
                                        Completed
                                      </span>
                                    </div>
                                  }
                                  <p>
                                    {task.description}
                                  </p>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <p className="mb-0">✎  <span className="fw-medium text-black ms-2">Modified by Jessica on </span> <span>{task.dueDate}{' '}{task.dueTime && <span>{task.dueTime}</span>}</span></p>
                                  <p><span className="fw-medium text-black">Due date :</span> <span>{task.dueDate}{' '}{task.dueTime && <span>{task.dueTime}</span>}</span></p>
                                </div>

                              </div>
                            </div>
                          )
                        })}

                      </div>
                    </div>
                  </div>
                </div>
                {/* /Tasks */}

                {/* Meeting */}
                <div className="tab-pane fade" id="meeting">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h4 className="fw-semibold mb-0">Meeting</h4>
                      <div className="d-inline-flex align-items-center">
                        <div className="form-sort me-3 mt-0">
                          <i className="ti ti-sort-ascending-2" />
                          <Select
                            className="select dropdownCusWidth"
                            options={ascendingandDecending}
                            placeholder="Sort By Date"
                            classNamePrefix="react-select"
                          />
                        </div>
                        <Link
                          to=""
                          data-bs-toggle="modal"
                          data-bs-target="#add_meeting"
                          className="link-purple fw-medium"
                          onClick={() => {
                            setSelectedMeeting(null)
                            setSelectedMeetingType(null)
                          }}
                        >
                          <i className="ti ti-circle-plus me-1" />
                          Add New
                        </Link>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="notes-activity">
                        {allMeetings.map((meeting, meetingIndex) => {
                          return (
                            <div className="card mb-3" key={meetingIndex}>
                              <div className="card-body"
                                onMouseEnter={() => setHoveredMeetingIndex(meetingIndex)}
                                onMouseLeave={() => setHoveredMeetingIndex(null)}
                              >
                                <div className="d-flex align-items-center justify-content-between pb-2">

                                  {hoveredMeetingIndex === meetingIndex && <div style={{ position: 'absolute', top: 20, right: 20 }}>
                                    <Link to=""
                                      className="me-3 styleForEditBtn"
                                      data-bs-toggle="modal"
                                      data-bs-target="#add_meeting"
                                      onClick={() => { handleMeetingEditClick(meeting) }}
                                    >
                                      <i className="ti ti-edit text-blue" />
                                    </Link>
                                    <Link to="" className="styleForDeleteBtn"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#delete_${deleteModalText}`}
                                      onClick={() => {
                                        setDeleteModalText("meeting")
                                        setIndexToDelete(meetingIndex)
                                      }}
                                    >
                                      <i className="ti ti-trash text-danger" />
                                    </Link>
                                  </div>}
                                </div>
                                <div className="col-md-11 mb-3">
                                  {meeting.meetingType == "Online" ? <p className={`badge badge-soft-black fw-medium me-2`}>
                                    <RiVideoOnLine className="me-2" />
                                    {meeting.meetingType}
                                  </p> :
                                    <p className={`badge badge-soft-warning fw-medium me-2`}>
                                      <IoLocationSharp className="me-2" />
                                      {meeting.meetingType}
                                    </p>
                                  }
                                  <p className="fw-medium text-black">
                                    {meeting.title}
                                  </p>
                                  <p>
                                    {meeting.description}
                                  </p>
                                </div>


                                <div className="d-flex justify-content-between align-items-center">
                                  <p className="mb-0">✎  <span className="fw-medium text-black ms-2">Created by Jessica on </span> <span>{meeting.createdOnDate}{' '}{meeting.createdOnTime && <span>{meeting.createdOnTime}</span>}</span></p>
                                  <p>
                                    <span className="fw-medium text-black">Meeting time :</span> {meeting.startDate} {meeting.startTime}
                                  </p>

                                </div>

                              </div>
                            </div>
                          )
                        })}

                      </div>
                    </div>
                  </div>
                </div>
                {/* /Meeting */}
                {/* Calls */}
                <div className="tab-pane fade" id="calls">
                  <div className="card">
                    <div className="card-header">
                      <div className="row align-items-center">
                        <div className="col-sm-12">
                          <div className="d-flex justify-content-between">
                            <div className="d-flex">
                              <div className="icon-form mb-3  me-2 mb-sm-0">
                                <span className="form-icon">
                                  <i className="ti ti-search" />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search Calls"
                                  onChange={(text) =>
                                    setSearchQuery(text.target.value)
                                  }
                                />
                              </div>
                              <div className="form-sorts dropdown me-2">
                                <Link
                                  to=""
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
                                            to=""
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#Status"
                                            aria-expanded="false"
                                            aria-controls="Status"
                                          >
                                            Call Status
                                          </Link>
                                        </div>
                                        <div
                                          className="filter-set-contents accordion-collapse collapse"
                                          id="Status"
                                          data-bs-parent="#accordionExample"
                                        >
                                          <div className="filter-content-list">
                                            <ul>
                                              {callStatus.map((callStatus, index) => {
                                                return (
                                                  <li
                                                    key={index}

                                                  >
                                                    <div className="filter-checks" >
                                                      <label className="checkboxs" >
                                                        <input
                                                          type="checkbox"
                                                          checked={selectedCallStatus.includes(callStatus.value.toLowerCase())}
                                                          onChange={() => filterCallStatus(callStatus.value.toLowerCase())}
                                                        />
                                                        <span className="checkmarks" />
                                                        {callStatus.value}
                                                      </label>
                                                    </div>
                                                  </li>
                                                );
                                              })}

                                            </ul>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="filter-set-content">
                                        <div className="filter-set-content-head">
                                          <Link
                                            to=""
                                            className="collapsed"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#owner"
                                            aria-expanded="false"
                                            aria-controls="owner"
                                          >
                                            Employee
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
                                                            checked={selectedEmployee.includes(companyEmployee.value.toLowerCase())}
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
                                          <Link to="" className="btn btn-primary" onClick={resetFilters}>
                                            Reset
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="dropdown">
                                <Link
                                  to=""
                                  className="btn bg-soft-purple text-purple"
                                  data-bs-toggle="dropdown"
                                  data-bs-auto-close="outside"
                                >
                                  <i className="ti ti-columns-3 me-2" />
                                  Manage Columns
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-md-end dropdown-md p-3">
                                  <h4 className="mb-2 fw-semibold">
                                    Want to manage datatables?
                                  </h4>
                                  <p className="mb-3">
                                    Please drag and drop your column to reorder your
                                    table and enable see option as you want.
                                  </p>
                                  <div className="border-top pt-3">
                                    {columns.map((column, index) => {
                                      if (
                                        column.title === "Action" ||
                                        column.title === ""
                                      ) {
                                        return;
                                      }
                                      return (
                                        <div
                                          className="d-flex align-items-center justify-content-between mb-3"
                                          key={index}
                                        >
                                          <p className="mb-0 d-flex align-items-center">
                                            <i className="ti ti-grip-vertical me-2" />
                                            {column.title}
                                          </p>
                                          <div
                                            className="status-toggle"

                                          >
                                            <input
                                              type="checkbox"
                                              id={column.title}
                                              className="check"
                                              defaultChecked={true}
                                              onClick={() =>
                                                handleToggleColumnVisibility(
                                                  column.title
                                                )
                                              }
                                            />
                                            <label
                                              htmlFor={column.title}
                                              className="checktoggle"
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}

                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex">
                              <div className="dropdown me-2">
                                <Link
                                  to=""
                                  className="dropdown-toggle"
                                  data-bs-toggle="dropdown"
                                >
                                  <i className="ti ti-package-export me-2" />
                                  Export
                                </Link>
                                <div className="dropdown-menu  dropdown-menu-end">
                                  <ul className="mb-0">
                                    <li>
                                      <Link
                                        to=""
                                        className="dropdown-item"
                                        onClick={exportPDF}
                                      >
                                        <i className="ti ti-file-type-pdf text-danger me-1" />
                                        Export as PDF
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to=""
                                        className="dropdown-item"
                                        onClick={exportExcel}
                                      >
                                        <i className="ti ti-file-type-xls text-green me-1" />
                                        Export as Excel{" "}
                                      </Link>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              {/* <Link
                                  to=""
                                  className="btn btn-primary me-2"
                                  data-bs-toggle="offcanvas"
                                  data-bs-target="#offcanvas_add"
                                  onClick={() => {
                                    setSelectedLead(null)
                                  }}
                                >
                                  <i className="ti ti-square-rounded-plus me-2" />
                                  Add Leads
                                </Link> */}
                              {/* <div className="view-icons">
                                  <Link to={route.leads} className="active">
                                    <i className="ti ti-list-tree" />
                                  </Link>
                                  <Link to={route.leadsKanban}>
                                    <i className="ti ti-grid-dots" />
                                  </Link>
                                </div> */}
                            </div>

                          </div>
                        </div>
                        <div className="col-sm-8">
                          <div className="d-flex align-items-center flex-wrap row-gap-2 justify-content-sm-end">

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive custom-table">
                        <Table
                          dataSource={filteredCallData}
                          columns={visibleColumns}
                          rowKey={(record) => record.key}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /Calls */}
                 {/* Attachment */}
                 <div className="tab-pane fade" id="attachment">
                  <div className="card">
                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                      <h4 className="fw-semibold mb-0">Attachment</h4>
                    </div>
                    <div className="card-body">
                      <div className="uploadSectionContainer">
                        <div
                          {...getRootProps()}
                          className={`uploadSectionInnerBox ${isDragActive ? "drag-active" : ""}`}
                        >
                          <input {...getInputProps()} />
                          <div className="uploadSectionImageBox">
                            <FcUpload style={{ fontSize: 30 }} />
                          </div>
                          <div className="profile-upload d-block">
                            <div className="profile-upload-content">
                              <label className="profile-upload-btn">
                                <i className="ti ti-file-broken" /> Upload File
                              </label>
                              {isDragActive ? (
                                <p>Drop the files here ...</p>
                              ) : (
                                <p>Drag 'n' drop Excel or CSV files here, or click to select them</p>
                              )}
                            </div>
                          </div>
                          <p className="supportedFormat">
                            (Supported formats .csv, .xlsx; max file size 5 MB)
                          </p>

                        </div>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="uploaded-files">
                          <h4>Uploaded Files:</h4>
                          <ul>
                            {uploadedFiles.map((file, index) => (
                              <li key={index}>{file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* /Attachment */}

              </div>
              {/* /Tab Content */}
            </div>
            {/* /Deals Details */}
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}
      {/* Create Contact */}
      <div className="modal custom-modal fade" id="create_contact" role="dialog">
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
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-user-plus" />
                </div>
                <h3>Contact Created Successfully!!!</h3>
                <p>View the details of contact, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <Link to={route.dealsDetails} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Contact */}
      {/* Add Note */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_notes"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Notes</h5>
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
              <form >
                <div className="mb-3">
                  <label className="col-form-label">
                    Title <span className="text-danger"> *</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Note <span className="text-danger"> *</span>
                  </label>
                  <textarea className="form-control" rows={4} defaultValue={""} />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Attachment <span className="text-danger"> *</span>
                  </label>
                  <div className="drag-attach">
                    <input type="file" />
                    <div className="img-upload">
                      <i className="ti ti-file-broken" />
                      Upload File
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">Uploaded Files</label>
                  <div className="upload-file">
                    <h6>Projectneonals teyys.xls</h6>
                    <p>4.25 MB</p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "25%" }}
                        aria-valuenow={25}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <p className="black-text">45%</p>
                  </div>
                  <div className="upload-file upload-list">
                    <div>
                      <h6>tes.txt</h6>
                      <p>4.25 MB</p>
                    </div>
                    <Link to="#" className="text-danger">
                      <i className="ti ti-trash-x" />
                    </Link>
                  </div>
                </div>
                <div className="col-lg-12 text-end modal-btn">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button className="btn btn-primary" data-bs-dismiss="modal" type="button">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Note */}

      {/* Add Edit Task */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_tasks"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedTask ? "Edit Task" : "Add new Task"}</h5>
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
                    Description <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    name="taskDescription"
                    defaultValue={selectedTask ? selectedTask.description : ''}
                    onChange={handleInput}
                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Task Type
                  </label>
                  <Select
                    className="select2"
                    options={taskType}
                    value={selectedTask ? selectedTask.taskType : ''}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>

                <div className="mb-3">
                  <label className="col-form-label">Due Date</label>
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

                <label className="col-form-label">
                  Due Time {selectedTask ? selectedTask.dueDate : ""}
                </label>
                <div className="mb-3 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-clock-hour-10" />
                  </span>
                  <TimePicker
                    placeholder="Select Time"
                    className="form-control datetimepicker-time"
                    onChange={onChange}
                    defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                  />
                </div>

                <div className="col-lg-12 text-end modal-btn">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    type="button"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Edit Task */}
      {/* Add Edit Meeting */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_meeting"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{selectedMeeting ? "Edit Meeting" : "Add new Meeting"}</h5>
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
                  <input className="form-control" type="text" />
                </div>

                <div className="mb-3">
                  <label className="col-form-label">
                    Description <span className="text-danger"> *</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    name="taskDescription"
                    defaultValue={selectedTask ? selectedTask.description : ''}
                    onChange={handleInput}
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
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd-MM-yyyy"
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">
                      Start Time {selectedMeeting ? selectedMeeting.startDate : ""}
                    </label>
                    <div className="icon-form">
                      <span className="form-icon">
                        <i className="ti ti-clock-hour-10" />
                      </span>
                      <TimePicker
                        placeholder="Select Time"
                        className="form-control datetimepicker-time"
                        onChange={onChange}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">End Date</label>
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
                  <div className="col-md-6 mb-3">
                    <label className="col-form-label">
                      End Time {selectedMeeting ? selectedMeeting.endDate : ""}
                    </label>
                    <div className="icon-form">
                      <span className="form-icon">
                        <i className="ti ti-clock-hour-10" />
                      </span>
                      <TimePicker
                        placeholder="Select Time"
                        className="form-control datetimepicker-time"
                        onChange={onChange}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Meeting Type
                  </label>
                  <Select
                    className="select2"
                    options={meetingType}
                    value={selectedMeetingType ? meetingType.find(option => option.value === selectedMeetingType) : null}
                    onChange={handleMeetingTypeChange}
                    placeholder="Choose"
                    classNamePrefix="react-select"
                  />
                </div>
                {selectedMeetingType === 'Offline' && <div className="mb-3">
                  <label className="col-form-label">
                    Location
                  </label>
                  <input className="form-control" type="text" />
                </div>
                }

                {selectedMeetingType === 'Online' && <div className="d-flex align-items-center">
                  <span style={{ background: '#dce8ff', color: '#4a8bff', padding: 8, borderRadius: 5 }} className="me-3">
                    <ImageWithBasePath src="assets/img/customIcons/zoomIcon.png" className="iconWidth me-2">
                    </ImageWithBasePath>
                    <span>
                      Add Zoom Meeting
                    </span>
                  </span>


                  <span style={{ background: '#dfffec', color: '#00ac48', padding: 8, borderRadius: 5 }}>
                    <ImageWithBasePath src="assets/img/customIcons/googleMeetIcon.png" className="iconWidth me-2">
                    </ImageWithBasePath>
                    <span>
                      Add Google Meeting
                    </span>
                  </span>

                </div>}



                <div className="col-lg-12 text-end modal-btn mt-4">
                  <Link
                    to="#"
                    className="btn btn-light"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    type="button"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Edit Meeting */}
      {/* Create Call Log */}
      <div
        className="modal custom-modal fade modal-padding"
        id="create_call"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Call Log</h5>
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
              <form >
                <div className="row">
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="col-form-label">
                        Status <span className="text-danger"> *</span>
                      </label>
                      <Select
                        className="select2"
                        options={statusList}
                        placeholder="Choose"
                        classNamePrefix="react-select"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Follow Up Date <span className="text-danger"> *</span>
                      </label>
                      <div className="icon-form">
                        <span className="form-icon">
                          <i className="ti ti-calendar-check" />
                        </span>
                        <input
                          type="text"
                          className="form-control datetimepicker"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="col-form-label">
                        Note <span className="text-danger"> *</span>
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Add text"
                        defaultValue={""}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" /> Create a followup task
                      </label>
                    </div>
                    <div className="text-end modal-btn">
                      <Link
                        to="#"
                        className="btn btn-light"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </Link>
                      <button className="btn btn-primary" data-bs-dismiss="modal" type="button">
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Call Log */}
      {/* Add File */}
      <div
        className="modal custom-modal fade custom-modal-two modal-padding"
        id="new_file"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New File</h5>
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
              <div className="add-info-fieldset">
                <div className="add-details-wizard">
                  <ul className="progress-bar-wizard">
                    <li className="active">
                      <span>
                        <i className="ti ti-file" />
                      </span>
                      <div className="multi-step-info">
                        <h6>Basic Info</h6>
                      </div>
                    </li>
                    <li>
                      <span>
                        <i className="ti ti-circle-plus" />
                      </span>
                      <div className="multi-step-info">
                        <h6>Add Recipient</h6>
                      </div>
                    </li>
                  </ul>
                </div>
                <fieldset id="first-field-file">
                  <form >
                    <div className="contact-input-set">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Choose Deal <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={dealsopen}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Document Type{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={documentType}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Owner <span className="text-danger">*</span>
                            </label>
                            <SelectWithImage2 />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Title <span className="text-danger"> *</span>
                            </label>
                            <input className="form-control" type="text" />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Locale <span className="text-danger">*</span>
                            </label>
                            <Select
                              className="select2"
                              options={LocaleData}
                              placeholder="Choose"
                              classNamePrefix="react-select"
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="signature-wrap">
                            <h4>Signature</h4>
                            <ul className="nav sign-item">
                              <li className="nav-item">
                                <span
                                  className=" mb-0"
                                  data-bs-toggle="tab"
                                  data-bs-target="#nosign"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="sign1"
                                    name="email"
                                  />
                                  <label htmlFor="sign1">
                                    <span className="sign-title">
                                      No Signature
                                    </span>
                                    This document does not require a signature
                                    before acceptance.
                                  </label>
                                </span>
                              </li>
                              <li className="nav-item">
                                <span
                                  className="active mb-0"
                                  data-bs-toggle="tab"
                                  data-bs-target="#use-esign"
                                >
                                  <input
                                    type="radio"
                                    className="status-radio"
                                    id="sign2"
                                    name="email"
                                    defaultChecked
                                  />
                                  <label htmlFor="sign2">
                                    <span className="sign-title">
                                      Use e-signature
                                    </span>
                                    This document require e-signature before
                                    acceptance.
                                  </label>
                                </span>
                              </li>
                            </ul>
                            <div className="tab-content">
                              <div
                                className="tab-pane show active"
                                id="use-esign"
                              >
                                <div className="input-block mb-0">
                                  <label className="col-form-label">
                                    Document Signers{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                </div>
                                <div className="sign-content">
                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="mb-3">
                                        <input
                                          className="form-control"
                                          type="text"
                                          placeholder="Enter Name"
                                        />
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="d-flex align-items-center">
                                        <div className="float-none mb-3 me-3 w-100">
                                          <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Email Address"
                                          />
                                        </div>
                                        <div className="input-btn mb-3">
                                          <Link to="#" className="add-sign">
                                            <i className="ti ti-circle-plus" />
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
                        <div className="col-md-12">
                          <div className="input-block mb-3">
                            <label className="col-form-label">
                              Content <span className="text-danger"> *</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder="Add Content"
                              defaultValue={""}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 text-end form-wizard-button modal-btn">
                          <button className="btn btn-light" type="reset">
                            Reset
                          </button>
                          <button
                            className="btn btn-primary wizard-next-btn"
                            type="button"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </fieldset>
                <fieldset>
                  <form >
                    <div className="contact-input-set">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="signature-wrap">
                            <h4 className="mb-2">
                              Send the document to following signers
                            </h4>
                            <p>In order to send the document to the signers</p>
                            <div className="input-block mb-0">
                              <label className="col-form-label">
                                Recipients (Additional recipients)
                              </label>
                            </div>
                            <div className="sign-content">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="mb-3">
                                    <input
                                      className="form-control"
                                      type="text"
                                      placeholder="Enter Name"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="d-flex align-items-center">
                                    <div className="float-none mb-3 me-3 w-100">
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Email Address"
                                      />
                                    </div>
                                    <div className="input-btn mb-3">
                                      <Link to="#" className="add-sign">
                                        <i className="ti ti-circle-plus" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label className="col-form-label">
                              Message Subject{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Enter Subject"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="col-form-label">
                              Message Text{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <textarea
                              className="form-control"
                              rows={3}
                              placeholder="Your document is ready"
                              defaultValue={""}
                            />
                          </div>
                          <button className="btn btn-light mb-3">
                            Send Now
                          </button>
                          <div className="send-success">
                            <p>
                              <i className="ti ti-circle-check" /> Document sent
                              successfully to the selected recipients
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-12 text-end form-wizard-button modal-btn">
                          <button className="btn btn-light" type="reset">
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            type="button"
                            data-bs-dismiss="modal"
                          >
                            Save &amp; Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Add File */}
      {/* Connect Account */}
      <div className="modal custom-modal fade" id="create_email" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Connect Account</h5>
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
              <div className="mb-3">
                <label className="col-form-label">
                  Account type <span className="text-danger"> *</span>
                </label>
                <Select
                  className="select2"
                  options={accountType}
                  placeholder="Choose"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="mb-3">
                <h5 className="form-title">Sync emails from</h5>
                <div className="sync-radio">
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test1"
                      name="radio-group"
                      defaultChecked
                    />
                    <label htmlFor="test1">Now</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test2"
                      name="radio-group"
                    />
                    <label htmlFor="test2">1 Month Ago</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test3"
                      name="radio-group"
                    />
                    <label htmlFor="test3">3 Month Ago</label>
                  </div>
                  <div className="radio-item">
                    <input
                      type="radio"
                      className="status-radio"
                      id="test4"
                      name="radio-group"
                    />
                    <label htmlFor="test4">6 Month Ago</label>
                  </div>
                </div>
              </div>
              <div className="col-lg-12 text-end modal-btn">
                <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                  Cancel
                </Link>
                <button
                  className="btn btn-primary"
                  data-bs-target="#success_mail"
                  data-bs-toggle="modal"
                  data-bs-dismiss="modal"
                >
                  Connect Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Connect Account */}
      {/* Success Contact */}
      <div className="modal custom-modal fade" id="success_mail" role="dialog">
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
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-mail-opened" />
                </div>
                <h3>Email Connected Successfully!!!</h3>
                <p>
                  Email Account is configured with “example@example.com”. Now
                  you can access email.
                </p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link to={route.leads} className="btn btn-primary">
                    Go to email
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Success Contact */}
      {/* Add Contact */}
      <div className="modal custom-modal fade" id="add_contact" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Contact</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-2 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="access-wrap">
                  <ul>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-19.jpg" alt="" />
                          <Link to="#">Darlee Robertson</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-20.jpg" alt="" />
                          <Link to="#">Sharon Roy</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-21.jpg" alt="" />
                          <Link to="#">Vaughan</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-01.jpg" alt="" />
                          <Link to="#">Jessica</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-16.jpg" alt="" />
                          <Link to="#">Carol Thomas</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-22.jpg" alt="" />
                          <Link to="#">Dawn Mercha</Link>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Contact */}
      {/* Add Owner */}
      <div className="modal custom-modal fade" id="owner" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Deal Owner</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-2 icon-form">
                  <span className="form-icon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                  />
                </div>
                <div className="access-wrap">
                  <ul>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" defaultChecked />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-19.jpg" alt="" />
                          <Link to="#">Darlee Robertson</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-20.jpg" alt="" />
                          <Link to="#">Sharon Roy</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-21.jpg" alt="" />
                          <Link to="#">Vaughan</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-01.jpg" alt="" />
                          <Link to="#">Jessica</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-16.jpg" alt="" />
                          <Link to="#">Carol Thomas</Link>
                        </span>
                      </label>
                    </li>
                    <li className="select-people-checkbox">
                      <label className="checkboxs">
                        <input type="checkbox" />
                        <span className="checkmarks" />
                        <span className="people-profile">
                          <ImageWithBasePath src="assets/img/profiles/avatar-22.jpg" alt="" />
                          <Link to="#">Dawn Mercha</Link>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Owner */}
      {/* Deal Status */}
      <div className="modal custom-modal fade" id="deal_status" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Deal Status</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label className="col-form-label">
                    Status <span className="text-danger">*</span>
                  </label>
                  <Select
                    className="select2"
                    classNamePrefix="react-select"
                    options={status}
                    placeholder="Choose"
                  />
                </div>
                <div className="mb-3">
                  <label className="col-form-label">
                    Reason <span className="text-danger">*</span>
                  </label>
                  <textarea className="form-control" rows={5} defaultValue={""} />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-primary">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Deal Status */}
      {/* Add New Pipeline */}
      <div
        className="offcanvas offcanvas-end offcanvas-large"
        tabIndex={-1}
        id="offcanvas_pipeline"
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
          <form >
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
                <div className="pipeline-listing">
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
                        onClick={() => setOpenModal(true)}
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
                        onClick={() => setOpenModal(true)}
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
                        onClick={() => setOpenModal(true)}
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
                <div className="tab-content mb-3">
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
                data-bs-toggle="modal"
                data-bs-target="#create_pipeline"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* /Add New Pipeline */}
      {/* Add New Stage */}
      <div className="modal custom-modal fade" id="add_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Stage</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input type="text" className="form-control" />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add New Stage */}
      {/* Create Pipeline */}
      <div className="modal custom-modal fade" id="create_pipeline" role="dialog">
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
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-building" />
                </div>
                <h3>Pipeline Created Successfully!!!</h3>
                <p>View the details of pipeline, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <Link to={route.dealsDetails} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Pipeline*/}
      {/* Edit Stage */}
      <div className="modal custom-modal fade" id="edit_stage" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Stage</h5>
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <form >
                <div className="mb-3">
                  <label className="col-form-label">Stage Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="Inpipeline"
                  />
                </div>
                <div className="modal-btn text-end">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button type="button" data-bs-dismiss="modal" className="btn btn-danger">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Stage */}
      {/* Delete Stage */}
      <Modal show={openModal} onHide={() => setOpenModal(false)}>
        <div className="modal-body">
          <div className="text-center">
            <div className="avatar avatar-xl bg-danger-light rounded-circle mb-3">
              <i className="ti ti-trash-x fs-36 text-danger" />
            </div>
            <h4 className="mb-2">Remove Stage?</h4>
            <p className="mb-0">
              Are you sure you want to remove <br /> stage you selected.
            </p>
            <div className="d-flex align-items-center justify-content-center mt-4">
              <Link
                to="#"
                className="btn btn-light me-2"
                data-bs-dismiss="modal"
              >
                Cancel
              </Link>
              <Link to={route.contactList} className="btn btn-danger">
                Yes, Delete it
              </Link>
            </div>
          </div>
        </div>
      </Modal>
      {<DeleteModal text={deleteModalText} onDelete={() => { handleModalDeleteBtn(deleteModalText) }} onCancel={() => { setDeleteModalText("") }} />}
      {/* /Delete Stage */}
    </>


  )
}

export default DealsDetails
