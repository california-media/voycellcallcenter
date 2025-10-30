import SubMenu from "antd/es/menu/SubMenu";
import { all_routes } from "../../../feature-module/router/all_routes";
import { IoMdPeople } from "react-icons/io";
import { FaWhatsapp } from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
const route = all_routes;
export const SidebarData = [
  // {
  //   label: "MAIN MENU",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Main",
  //   submenuItems: [
  //     {
  //       label: "Dashboard",
  //       icon: "ti ti-layout-2",
  //       submenu: true,
  //       showSubRoute: false,

  //       submenuItems: [
  //         { label: "Deals Dashboard", link: route.dealsDashboard },
  //         { label: "Leads Dashboard", link: route.leadsDashboard },
  //         { label: "Project Dashboard", link: route.projectDashboard },
  //       ],
  //     },
  //     {
  //       label: "Application",
  //       icon: "ti ti-brand-airtable",
  //       submenu: true,
  //       showSubRoute: false,
  //       submenuItems: [
  //         {
  //           label: "Chat",
  //           link: route.chat,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Call",
  //           submenu: true,
  //           submenuItems: [
  //             { label: "Video Call", link: route.videoCall },
  //             { label: "Audio Call", link: route.audioCall },
  //             { label: "Call History", link: route.callHistory },
  //           ],
  //         },
  //         {
  //           label: "Calendar",
  //           link: route.calendar,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Email",
  //           link: route.email,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "To Do",
  //           link: route.todo,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Notes",
  //           link: route.notes,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "File Manager",
  //           link: route.fileManager,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    // label: "CRM",
    submenuOpen: true,
    showSubRoute: false,
    submenuHdr: "Inventory",
    submenuItems: [
      // {
      //   label: "Condtacts",
      //   icon: "ti ti-user-up",
      //   submenu: true,
      //   showSubRoute: false,
      //   submenuItems: [
      //     { label: "Leads Dashboard", link: route.contactList, icon:<IoMdPeople /> },
      //     { label: "Leads Details", link: route.contactGrid, icon:<IoMdPeople /> },
      //     { label: "Leads Kanban", link: route.contactDetails, icon:<IoMdPeople /> },
      //   ],
      // },
      {
        label: "Dashboard",
        icon: "ti ti-layout-2",
        submenu: false,
        showSubRoute: false,
         link: route.dashboard,
       
      },
          {
        label: "Speak To Lead",
        icon: "ti ti-medal",
        // subLink1: route.contactGrid,
        // subLink2: route.contactDetails,
        submenu: true,
        showSubRoute: false,
        submenuItems: [
          { label: "Calls", link: route.allCalls, icon: <IoMdPeople /> },
          { label: "Script", link: route.scriptGenerator, icon: <IoMdPeople /> },
          // { label: "Deal Details", link: route.dealsDetails, icon:<IoMdPeople /> },
          // { label: "Deal Grid", link: route.dealsKanban, icon:<IoMdPeople /> },
        ],
      },
    
      {
        label: "Contacts",
        icon: "ti ti-user-up",
        // subLink1: route.contactGrid,
        // subLink2: route.contactDetails,
        submenu: true,
        showSubRoute: false,
        submenuItems: [
          {
            label: "Contacts List",
            link: route.contactList,
            icon: <IoMdPeople />,
          },
          {
            label: "FAQ",
            link: route.contactFaq,
            icon: <IoMdPeople />,
          },
          // { label: "Customer Details", link: route.contactDetails, icon:<IoMdPeople /> },
          // { label: "Customer Grid", link: route.contactGrid, icon:<IoMdPeople /> },
        ],
      },
        {
        label: "Leads",
        icon: "ti ti-medal",
        // subLink1: route.contactGrid,
        // subLink2: route.contactDetails,
        submenu: false,
        showSubRoute: false,
        link: route.leads,
      },
        {
        label: "Calendar",
        icon: "ti ti-medal",
        // subLink1: route.contactGrid,
        // subLink2: route.contactDetails,
        submenu: false,
        showSubRoute: false,
        link: route.calendar,
      },
    
      
      // {
      //   label: "Linkus Client",
      //   icon: "ti ti-timeline-event-exclamation",
      //   // subLink1: route.contactGrid,
      //   // subLink2: route.contactDetails,
      //   submenu: true,
      //   showSubRoute: false,
      //   submenuItems: [
      //     {
      //       label: "Linkus Client",
      //       link: route.linkusClient,
      //       icon: <IoMdPeople />,
      //     },
      //     // { label: "Customer Details", link: route.contactDetails, icon:<IoMdPeople /> },
      //     // { label: "Customer Grid", link: route.contactGrid, icon:<IoMdPeople /> },
      //   ],
      // },
      // {
      //   label: "Script Generator",
      //   icon: "ti ti-code",
      //   submenu: true,
      //   showSubRoute: false,
      //   submenuItems: [
      //     {
      //       label: "Script Generator",
      //       link: route.scriptGenerator,
      //       icon: <IoMdPeople />,
      //     },
      //   ],
      // },
      {
        label: "Settings",
        icon: "ti ti-code",
        submenu: true,
        showSubRoute: false,
        submenuItems: [
          {
            label: "Profile Settings",
            link: route.profile,
            icon: <IoMdPeople />,
          },
          {
            label: "Security",
            link: route.security,
            icon: <IoMdPeople />,
          },
          // {
          //   label: "Sync And Integration",
          //   link: route.syncAndIntegration,
          //   icon: <IoMdPeople />,
          // },
          // {
          //   label: "Import And Export",
          //   link: route.importAndExport,
          //   icon: <IoMdPeople />,
          // },
          // {
          //   label: "API",
          //   link: route.api,
          //   icon: <IoMdPeople />,
          // },
        ],
      },






       {
        label: "Sync And Integration",
        icon: "ti ti-layout-2",
        submenu: false,
        showSubRoute: false,
         link: route.syncAndIntegration,
       
      },
       {
        label: "Import And Export",
        icon: "ti ti-layout-2",
        submenu: false,
        showSubRoute: false,
         link: route.importAndExport,
       
      },
       {
        label: "API",
        icon: "ti ti-layout-2",
        submenu: false,
        showSubRoute: false,
         link: route.api,
       
      },





      {
        label: "Upgrade Plan",
        icon: "ti ti-code",
        submenu: false,
        link: route.upgradePlan,
        showSubRoute: false,
      },
      {
        label: "Help & Support",
        icon: "ti ti-code",
        submenu: false,
        link: route.helpAndSupport,
        showSubRoute: false,
      },
    

      // {
      //   label: "Pipeline",
      //   icon: "ti ti-timeline-event-exclamation",
      //   // subLink1: route.contactGrid,
      //   // subLink2: route.contactDetails,
      //   submenu: true,
      //   showSubRoute: false,
      //   submenuItems: [
      //     { label: "Pipeline", link: route.pipeline, icon:<IoMdPeople /> },
      //   ],
      // },
      // {
      //   label: "Chat",
      //   icon: "typcn typcn-messages",
      //   // subLink1: route.contactGrid,
      //   // subLink2: route.contactDetails,
      //   submenu: true,
      //   showSubRoute: false,
      //   submenuItems: [
      //     { label: "Whatsapp", link: route.Whatsapp, icon:<FaMessage /> },
      //   ],
      // },

      // {
      //   label: "Companies",
      //   link: route.companies,
      //   subLink1: route.companyDetails,
      //   subLink2: route.companiesGrid,
      //   icon: "ti ti-building-community",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Deals",
      //   link: route.deals,
      //   subLink1: route.dealsKanban,
      //   subLink2: route.dealsDetails,
      //   icon: "ti ti-medal",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Leads",
      //   icon: "ti ti-chart-arcs",
      //   submenu: true,
      //   showSubRoute: false,
      //   submenuItems: [
      //     { label: "Deals Dashboard", link: route.leads },
      //     { label: "Leads Dashboard", link: route.leads },
      //     { label: "Project Dashboard", link: route.leads },
      //   ],
      // },

      // {
      //   label: "Pipeline",
      //   link: route.pipeline,
      //   icon: "ti ti-timeline-event-exclamation",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Campaign",
      //   link: route.campaign,
      //   subLink1: route.campaignArchieve,
      //   subLink2: route.campaignComplete,
      //   icon: "ti ti-brand-campaignmonitor",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Projects",
      //   link: route.projects,
      //   subLink1: route.projectsGrid,
      //   icon: "ti ti-atom-2",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Tasks",
      //   link: route.tasks,
      //   subLink1: route.tasksCompleted,
      //   subLink2: route.tasksImportant,
      //   icon: "ti ti-list-check",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Proposals",
      //   link: route.ProposalsList,
      //   subLink1: route.ProposalsView,
      //   subLink2: route.ProposalsGrid,
      //   icon: "ti ti-file-star",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Contracts",
      //   link: route.ContractsList,
      //   subLink1: route.ContractsGrid,
      //   icon: "ti ti-file-check",
      //   showSubRoute: false,
      //   submenu: false,
      // },

      // {
      //   label: "Estimations",
      //   link: route.estimationList,
      //   subLink1: route.estimationKanban,
      //   icon: "ti ti-file-report",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Invoices",
      //   link: route.InvoiceList,
      //   subLink1: route.InvoiceGrid,
      //   icon: "ti ti-file-invoice",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Payments",
      //   link: route.payments,
      //   icon: "ti ti-report-money",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Analytics",
      //   link: route.analytics,
      //   icon: "ti ti-chart-bar",
      //   showSubRoute: false,
      //   submenu: false,
      // },
      // {
      //   label: "Activities",
      //   link: route.activities,
      //   subLink1: route.activityMeeting,
      //   subLink2: route.activityTask,
      //   subLink3: route.activityMail,
      //   subLink4: route.activityCalls,
      //   icon: "ti ti-bounce-right",
      //   showSubRoute: false,
      //   submenu: false,
      // },
    ],
  },
  // {
  //   label: "REPORTS",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Finance & Accounts",
  //   submenuItems: [
  //     {
  //       label: "Reports",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-file-invoice",
  //       submenuItems: [
  //         { label: "Lead Reports", link: route.leadReports, showSubRoute: false },
  //         {
  //           label: "Deal Reports",
  //           link: route.dealReports,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Contact Reports",
  //           link: route.contactReports,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Company Reports",
  //           link: route.companyReports,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Project Reports",
  //           link: route.projectReports,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Task Reports",
  //           link: route.taskReports,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "CRM SETTINGS",
  //   submenuOpen: true,
  //   submenuHdr: "Sales",
  //   submenu: false,
  //   showSubRoute: false,
  //   submenuItems: [
  //     {
  //       label: "Sources",
  //       link: route.sources,
  //       icon: "ti ti-artboard",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Lost Reason",
  //       link: route.lostReason,
  //       icon: "ti ti-message-exclamation",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Contact Stage",
  //       link: route.contactStage,
  //       icon: "ti ti-steam",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Industry",
  //       link: route.industry,
  //       icon: "ti ti-building-factory",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Calls",
  //       link: route.calls,
  //       icon: "ti ti-phone-check",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //   ],
  // },
  // {
  //   label: "USER MANAGEMENT",
  //   submenuOpen: true,
  //   submenuHdr: "Sales",
  //   submenu: false,
  //   showSubRoute: false,
  //   submenuItems: [
  //     {
  //       label: "Manage Users",
  //       link: route.manageusers,
  //       icon: "ti ti-file-invoice",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Roles & Permission",
  //       link: route.rolesPermissions,
  //       icon: "ti ti-navigation-cog",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Delete  Request",
  //       link: route.deleteRequest,
  //       icon: "ti ti-flag-question",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //   ],
  // },
  // {
  //   label: "MEMBERSHIP",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Finance & Accounts",
  //   submenuItems: [
  //     {
  //       label: "Membership",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-file-invoice",
  //       submenuItems: [
  //         {
  //           label: "Membership Plans",
  //           link: route.membershipplan,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Membership Addons",
  //           link: route.membershipAddon,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Transactions",
  //           link: route.membershipTransaction,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "CONTENT",
  //   icon: "ti ti-page-break",
  //   submenu: true,
  //   showSubRoute: false,
  //   submenuItems: [
  //     {
  //       label: "Pages",
  //       link: route.pages,
  //       showSubRoute: false,
  //       icon: "ti ti-page-break",
  //     },
  //     {
  //       label: "Location",
  //       icon: "ti ti-map-pin-pin",
  //       submenu: true,
  //       submenuItems: [
  //         { label: "Countries", link: route.countries },
  //         { label: "States", link: route.states, icon: "ti ti-quote" },
  //         {
  //           label: "Cities",
  //           link: route.cities,
  //           icon: "ti ti-question-mark",
  //         },
  //       ],
  //     },
  //     {
  //       label: "Testimonials",
  //       link: route.testimonials,
  //       showSubRoute: false,
  //       icon: "ti ti-quote",
  //     },
  //     {
  //       label: "FAQ",
  //       link: route.faq,
  //       showSubRoute: false,
  //       icon: "ti ti-question-mark",
  //     },
  //   ],
  // },
  // {
  //   label: "SUPPORT",
  //   submenuOpen: true,
  //   submenuHdr: "Purchases",
  //   showSubRoute: false,
  //   submenuItems: [
  //     {
  //       label: "Content Messages",
  //       link: route.contactMessages,
  //       icon: "ti ti-page-break",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //     {
  //       label: "Tickets",
  //       link: route.tickets,
  //       icon: "ti ti-ticket",
  //       showSubRoute: false,
  //       submenu: false,
  //     },
  //   ],
  // },

  // {
  //   label: "Settings",
  //   submenu: true,
  //   showSubRoute: false,
  //   submenuHdr: "Settings",
  //   submenuItems: [
  //     {
  //       label: "General Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-settings-cog",
  //       submenuItems: [
  //         { label: "Profile", link: route.profile },
  //         { label: "Security", link: route.security },
  //         { label: "Notifications", link: route.notification },
  //         { label: "Connected Apps", link: route.connectedApps },
  //       ],
  //     },
  //     {
  //       label: "Website Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-world-cog",
  //       submenuItems: [
  //         {
  //           label: "Company Settings",
  //           link: route.companySettings,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Localization",
  //           link: route.localization,
  //           showSubRoute: false,
  //         },
  //         { label: "Prefixes", link: route.prefixes, showSubRoute: false },
  //         { label: "Preference", link: route.preference, showSubRoute: false },
  //         { label: "Appearance", link: route.appearance, showSubRoute: false },
  //         {
  //           label: "Language",
  //           link: route.language,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "App Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-apps",
  //       submenuItems: [
  //         {
  //           label: "Invoice",
  //           link: route.invoiceSettings,
  //           showSubRoute: false,
  //         },
  //         { label: "Printer", link: route.printers, showSubRoute: false },
  //         {
  //           label: "Custom Fields",
  //           link: route.customFields,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "System Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-device-laptop",
  //       submenuItems: [
  //         { label: "Email", link: route.emailSettings, showSubRoute: false },
  //         {
  //           label: "SMS Gateways",
  //           link: route.smsGateways,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "GDPR Cookies",
  //           link: route.gdprCookies,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Financial Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-moneybag",
  //       submenuItems: [
  //         {
  //           label: "Payment Gateway",
  //           link: route.paymentGateways,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Bank Accounts",
  //           link: route.bankAccounts,
  //           showSubRoute: false,
  //         },
  //         { label: "Tax Rates", link: route.taxRates, showSubRoute: false },
  //         {
  //           label: "Currencies",
  //           link: route.currencies,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Other Settings",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-flag-cog",
  //       submenuItems: [
  //         { label: "Storage", link: route.storage, showSubRoute: false },
  //         {
  //           label: "Ban IP Address",
  //           link: route.banIpAddrress,
  //           showSubRoute: false,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "Pages",
  //   submenu: true,
  //   showSubRoute: false,
  //   submenuHdr: "Authentication",
  //   submenuItems: [
  //     {
  //       label: "Authentication",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-lock-square-rounded",
  //       submenuItems: [
  //         { label: "Login", link: route.login },
  //         { label: "Register", link: route.register },
  //         { label: "Forgot Password", link: route.forgotPassword },
  //         { label: "Reset Password", link: route.resetPassword },
  //         { label: "Email Verfication", link: route.emailVerification },
  //         { label: "2 Step Verification", link: route.twoStepVerification },
  //         { label: "Lock Screen", link: route.lockScreen },
  //       ],
  //     },
  //     {
  //       label: "Error Pages",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-error-404",
  //       submenuItems: [
  //         {
  //           label: "404 Error",
  //           link: route.error404,
  //           showSubRoute: false,
  //         },
  //         { label: "500 Error", link: route.error500, showSubRoute: false },
  //       ],
  //     },
  //     {
  //       label: "Blank Page",
  //       link: route.blankPage,
  //       icon: "ti ti-apps",
  //       showSubRoute: false,
  //       submenu: false,
  //     },

  //     {
  //       label: "Coming Soon",
  //       link: route.comingSoon,
  //       icon: "ti ti-device-laptop",
  //       showSubRoute: false,
  //     },
  //     {
  //       label: "Under Maintenance",
  //       link: route.underMaintenance,
  //       icon: "ti ti-moneybag",
  //       showSubRoute: false,
  //     },
  //   ],
  // },

  // {
  //   label: "UI Interface",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "UI Interface",
  //   submenuItems: [
  //     {
  //       label: "Base UI",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-adjustments-check",
  //       submenuItems: [
  //         { label: "Alerts", link: route.alert, showSubRoute: false },
  //         { label: "Accordion", link: route.accordion, showSubRoute: false },
  //         { label: "Avatar", link: route.avatar, showSubRoute: false },
  //         { label: "Badges", link: route.uiBadges, showSubRoute: false },
  //         { label: "Border", link: route.border, showSubRoute: false },
  //         { label: "Buttons", link: route.button, showSubRoute: false },
  //         {
  //           label: "Button Group",
  //           link: route.buttonGroup,
  //           showSubRoute: false,
  //         },
  //         { label: "Breadcrumb", link: route.breadcrums, showSubRoute: false },
  //         { label: "Card", link: route.cards, showSubRoute: false },
  //         { label: "Carousel", link: route.carousel, showSubRoute: false },
  //         { label: "Colors", link: route.colors, showSubRoute: false },
  //         { label: "Dropdowns", link: route.dropdowns, showSubRoute: false },
  //         { label: "Grid", link: route.grid, showSubRoute: false },
  //         { label: "Images", link: route.images, showSubRoute: false },
  //         { label: "Lightbox", link: route.lightbox, showSubRoute: false },
  //         { label: "Media", link: route.media, showSubRoute: false },
  //         { label: "Modals", link: route.modals, showSubRoute: false },
  //         { label: "Offcanvas", link: route.offcanvas, showSubRoute: false },
  //         { label: "Pagination", link: route.pagination, showSubRoute: false },
  //         { label: "Popovers", link: route.popover, showSubRoute: false },
  //         { label: "Progress", link: route.progress, showSubRoute: false },
  //         {
  //           label: "Placeholders",
  //           link: route.placeholder,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Range Slider",
  //           link: route.rangeSlider,
  //           showSubRoute: false,
  //         },
  //         { label: "Spinner", link: route.spinner, showSubRoute: false },
  //         {
  //           label: "Sweet Alerts",
  //           link: route.sweetalert,
  //           showSubRoute: false,
  //         },
  //         { label: "Tabs", link: route.navTabs, showSubRoute: false },
  //         { label: "Toasts", link: route.toasts, showSubRoute: false },
  //         { label: "Tooltips", link: route.tooltip, showSubRoute: false },
  //         { label: "Typography", link: route.typography, showSubRoute: false },
  //         { label: "Video", link: route.video, showSubRoute: false },
  //       ],
  //     },
  //     {
  //       label: "Advanced UI",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-box-align-bottom",
  //       submenuItems: [
  //         { label: "Ribbon", link: route.ribbon, showSubRoute: false },
  //         { label: "Clipboard", link: route.clipboard, showSubRoute: false },
  //         { label: "Drag & Drop", link: route.dragandDrop, showSubRoute: false },
  //         {
  //           label: "Range Slider",
  //           link: route.rangeSlider,
  //           showSubRoute: false,
  //         },
  //         { label: "Rating", link: route.rating, showSubRoute: false },
  //         {
  //           label: "Text Editor",
  //           link: route.textEditor,
  //           showSubRoute: false,
  //         },
  //         { label: "Counter", link: route.counter, showSubRoute: false },
  //         { label: "Scrollbar", link: route.scrollBar, showSubRoute: false },
  //         { label: "Sticky Note", link: route.stickyNotes, showSubRoute: false },
  //         { label: "Timeline", link: route.timeLine, showSubRoute: false },
  //       ],
  //     },
  //     {
  //       label: "Charts",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-chart-donut-2",
  //       submenuItems: [
  //         { label: "Apex Charts", link: route.apexChat, showSubRoute: false },
  //         // { label: "Chart Js", link: route.chart, showSubRoute: false },
  //       ],
  //     },
  //     {
  //       label: "Icons",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-icons",
  //       submenuItems: [
  //         {
  //           label: "Fontawesome Icons",
  //           link: route.fantawesome,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Feather Icons",
  //           link: route.featherIcons,
  //           showSubRoute: false,
  //         },
  //         { label: "Ionic Icons", link: route.iconicIcon, showSubRoute: false },
  //         {
  //           label: "Material Icons",
  //           link: route.materialIcon,
  //           showSubRoute: false,
  //         },
  //         { label: "Pe7 Icons", link: route.pe7icon, showSubRoute: false },
  //         {
  //           label: "Simpleline Icons",
  //           link: route.simpleLineIcon,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Themify Icons",
  //           link: route.themifyIcon,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Weather Icons",
  //           link: route.weatherIcon,
  //           showSubRoute: false,
  //         },
  //         {
  //           label: "Typicon Icons",
  //           link: route.typicon,
  //           showSubRoute: false,
  //         },
  //         { label: "Flag Icons", link: route.falgIcons, showSubRoute: false },
  //       ],
  //     },
  //     {
  //       label: "Forms",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-forms",
  //       submenuItems: [
  //         {
  //           label: "Form Elements",
  //           submenu: true,
  //           showSubRoute: false,
  //           submenuItems: [
  //             {
  //               label: "Basic Inputs",
  //               link: route.basicInput,
  //               showSubRoute: false,
  //             },
  //             {
  //               label: "Checkbox & Radios",
  //               link: route.checkboxandRadion,
  //               showSubRoute: false,
  //             },
  //             {
  //               label: "Input Groups",
  //               link: route.inputGroup,
  //               showSubRoute: false,
  //             },
  //             {
  //               label: "Grid & Gutters",
  //               link: route.gridandGutters,
  //               showSubRoute: false,
  //             },
  //             {
  //               label: "Form Select",
  //               link: route.formSelect,
  //               showSubRoute: false,
  //             },
  //             { label: "Input Masks", link: route.formMask, showSubRoute: false },
  //             {
  //               label: "File Uploads",
  //               link: route.fileUpload,
  //               showSubRoute: false,
  //             },
  //           ],
  //         },
  //         {
  //           label: "Layouts",
  //           submenu: true,
  //           showSubRoute: false,
  //           submenuItems: [
  //             { label: "Horizontal Form", link: route.horizontalForm },
  //             { label: "Vertical Form", link: route.verticalForm },
  //             { label: "Floating Labels", link: route.floatingLable },
  //           ],
  //         },
  //         { label: "Form Validation", link: route.formValidation },
  //         { label: "Select", link: route.reactSelect },
  //         // { label: "Form Wizard", link: route.formWizard },
  //       ],
  //     },
  //     {
  //       label: "Tables",
  //       submenu: true,
  //       showSubRoute: false,
  //       icon: "ti ti-table",
  //       submenuItems: [
  //         { label: "Basic Tables", link: "/tables-basic" },
  //         { label: "Data Table", link: "/data-tables" },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "Help",
  //   submenuOpen: true,
  //   showSubRoute: false,
  //   submenuHdr: "Help",
  //   submenuItems: [
  //     {
  //       label: "Documentation",
  //       link: "#",
  //       icon: "ti ti-file-type-doc",
  //       showSubRoute: false,
  //     },
  //     {
  //       label: "Changelog v2.2",
  //       link: "#",
  //       icon: "ti ti-arrow-capsule",
  //       showSubRoute: false,
  //     },
  //     {
  //       label: "Multi Level",
  //       showSubRoute: false,
  //       submenu: true,
  //       icon: "ti ti-brand-databricks",
  //       submenuItems: [
  //         { label: "Level 1.1", link: "#", showSubRoute: false },
  //         {
  //           label: "Level 1.2",
  //           submenu: true,
  //           showSubRoute: false,
  //           submenuItems: [
  //             { label: "Level 2.1", link: "#", showSubRoute: false },
  //             {
  //               label: "Level 2.2",
  //               submenu: true,
  //               showSubRoute: false,
  //               submenuItems: [
  //                 { label: "Level 3.1", link: "#", showSubRoute: false },
  //                 { label: "Level 3.2", link: "#", showSubRoute: false },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // },
];
