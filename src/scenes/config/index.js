export const appConfig = {
  name: process.env.REACT_APP_APP_NAME,
  subTitle: process.env.REACT_APP_SUB_TITLE,
  adminEmail: process.env.REACT_APP_ADMIN_EMAIL_ID,
  resetLink: process.env.REACT_APP_FORGOT_EMAIL_LINK,
  server: process.env.REACT_APP_SERVER_URL,

  // Object API Names
  objectTypes: {
    ACCOUNT: "Account",
    CONTACT: "Contact",
    OPPORTUNITY: "Opportunity",
    LEAD: "Lead",
    TASK: "Task",
    EVENT: "Event",
    FILE: "File",
    USER: "User",
    INVENTORY: "Inventory",
    DEAL: "Deal",
  },

  //API Endpoints
  api: {
    //Auth
    auth: {
      login: "/auth/login",
      logout: "/auth/logout",
      resetPassword: "/auth/reset-password",
      forgotPassword: "/auth/forgot-password",
    },
    // File upload endpoints
    files: {
      upload: "/upsertfiles",
      generatePreview: "/generatePreview",
      delete: "/deleteFile",
      download: "/downloadFile",
    },

    // Data loader endpoints
    dataLoader: {
      generatePreview: "/generatePreview",
      import: "/importData",
    },
  },
  // Object specific endpoints
  objects: {
    account: {
      key: "account",
      name: "Account",
      apiName: "Account",
      base: "/accounts",
      delete: "/deleteAccount",
      new: "/new-accounts",
      detail: "/accountDetailPage",
      upsert: "/UpsertAccount",
      list: "/list/account",
    },
    contact: {
      base: "/contacts",
      delete: "/deleteContact",
      new: "/new-contacts",
      detail: "/contactDetailPage",
    },
    opportunity: {
      base: "/opportunities",
      delete: "/deleteOpportunity",
      new: "/new-opportunities",
      detail: "/opportunityDetailPage",
    },
    task: {
      base: "/tasks",
      delete: "/deleteTask",
      new: "/new-tasks",
      detail: "/taskDetailPage",
    },
    lead: {
      base: "/leads",
      delete: "/deleteLead",
      new: "/new-leads",
      detail: "/leadDetailPage",
    },
    // Common endpoints
    common: {
      search: "/search",
      export: "/export",
      import: "/import",
    },
  },

  // File upload configurations
  upload: {
    supportedFormats: {
      csv: ["text/csv"],
      documents: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ],
      images: ["image/jpeg", "image/png", "image/gif"],
      all: [
        "text/csv",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/gif",
      ],
    },
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
};
