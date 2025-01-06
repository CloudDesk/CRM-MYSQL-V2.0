export const appConfig = {
  name: process.env.REACT_APP_APP_NAME,
  subTitle: process.env.REACT_APP_SUB_TITLE,
  adminEmail: process.env.REACT_APP_ADMIN_EMAIL_ID,
  resetLink: process.env.REACT_APP_FORGOT_EMAIL_LINK,
  server: process.env.REACT_APP_SERVER_URL,

  // Object API Names
  objectTypes: {
    ACCOUNT: { singular: "Account", plural: "Accounts" },
    CONTACT: { singular: "Contact", plural: "Contacts" },
    OPPORTUNITY: { singular: "Opportunity", plural: "Opportunities" },
    LEAD: { singular: "Lead", plural: "Leads" },
    TASK: { singular: "Task", plural: "Tasks" },
    EVENT: { singular: "Event", plural: "Events" },
    FILE: { singular: "File", plural: "Files" },
    USER: { singular: "User", plural: "Users" },
    INVENTORY: { singular: "Inventory", plural: "Inventories" },
    DEAL: { singular: "Deal", plural: "Deals" },
  },

  //API Endpoints
  api: {
    //Auth
    auth: {
      login: "/auth/login",
      logout: "/auth/logout",
      resetPassword: "/auth/reset-password",
      forgotPassword: "/auth/forgot-password",
      verifyOTP: "/auth/verify-otp",
      changePassword: "/auth/change-password",
      confirmPassword: "/auth/confirm-password",
      generateOTP: "/generateOTP",
      signin: "/signin",
      rolePermission: "/sendRolePermission?roledetails=",
    },
    // File upload endpoints
    files: {
      apiName: "File",
      base: "/files",
      upsert: "/upsertfiles",
      generatePreview: "/generatePreview",
      delete: "/deletefiles",
      download: "/downloadFile",
    },

    // Data loader endpoints
    dataLoader: {
      preview: `${process.env.REACT_APP_SERVER_URL}/generatePreview`,
      upsertLead: `${process.env.REACT_APP_SERVER_URL}/dataloaderlead`,
      upsertAccount: `${process.env.REACT_APP_SERVER_URL}/dataloaderAccount`,
      upsertOpportunity: `${process.env.REACT_APP_SERVER_URL}/dataloaderOpportunity`,
      upsert: `${process.env.REACT_APP_SERVER_URL}/dataloader`,
    },
    whatsapp: {
      template: "/whatsapp/template",
      message: "/whatsapp/personal",
    },
    email: {
      single: "/singlemail",
      bulk: `/bulkemail`,
    },

    // Role-based access
    access: {
      /**
       * Generates URL for checking access for a specific object
       * @param {string} role - User role
       * @param {string} object - Object API name
       * @param {string} departmentName - Department name
       * @returns {string} URL
       */
      forObject: (role, departmentName, object) =>
        `/checkAccess?roledetails=${role}&department=${departmentName}&object=${object}`,

      /**
       * Generates URL for checking access for all objects
       * @param {string} role - User role
       * @param {string} departmentName - Department name
       * @returns {string} URL
       */
      forAllObjects: (role, departmentName) =>
        `/checkAccess?roledetails=${role}&department=${departmentName}`,
    },
  },
  // Object specific endpoints
  objects: {
    account: {
      key: "account",
      name: { singular: "Account", plural: "Accounts" },
      apiName: "Account",
      base: "/accounts",
      delete: "/deleteAccount",
      new: "/accounts/new",
      detail: "/accounts",
      upsert: "/UpsertAccount",
      list: "/accounts",
      r_task: "getTaskbyAccountId?accountid=",
      r_contact: "/getContactsbyAccountId?accountid=",
      fetchAccountByName: "/accountsname?accountname=",
      fetchAllAccounts: "/accountsname",
    },
    contact: {
      key: "contact",
      name: { singular: "Contact", plural: "Contacts" },
      apiName: "Contact",
      base: "/contacts",
      delete: "/deleteContact",
      new: "/contacts/new",
      detail: "/contacts",
      upsert: "/UpsertContact",
      list: "/contacts",
    },
    inventory: {
      key: "inventory",
      name: { singular: "Inventory", plural: "Inventories" },
      apiName: "Inventory",
      base: "/inventories",
      delete: "/deleteInventory",
      new: "/inventories/new",
      detail: "/inventories",
      upsert: "/UpsertInventory",
      list: "/inventories",
      r_opportunity: "/getOpportunitiesbyInvid?inventoryid=",
      r_account: "/getAccountbyInventory?inventoryid=",
      fetchInventoryByPropertyName: "/InventoryName?propertyname=",
      fetchAllInventories: "/InventoryName",
    },
    opportunity: {
      key: "deal",
      name: { singular: "Deal", plural: "Deals" },
      apiName: "Deals",
      base: "/opportunities",
      delete: "/deleteOpportunity",
      new: "/deals/new",
      detail: "/deals",
      upsert: "/UpsertOpportunity",
      list: "/deals",
      r_task: "/getTaskbyOpportunityId?opportunityid=",
      fetchOpportunityByPropertyName: "/opportunitiesbyName?opportunityname=",
      fetchAllOpportunity: "/opportunitiesbyName",
    },
    task: {
      key: "event",
      name: { singular: "Event", plural: "Events" },
      apiName: "Event",
      base: "/Task",
      delete: "/deleteTask",
      new: "/events/new",
      detail: "/events",
      upsert: "/UpsertTask",
      list: "/events",
      r_file: "files?eventid=",
    },
    lead: {
      key: "enquiry",
      name: { singular: "Enquiry", plural: "Enquiries" },
      apiName: "Enquiry",
      base: "/leads",
      delete: "/deleteLead",
      new: "/enquiries/new",
      detail: "/enquiries",
      upsert: "/UpsertLead",
      list: "/enquiries",
      r_task: "/getTaskbyLeadId?leadid=",
      r_opportunity: "/getLeadsbyOppid?leadid=",
      fetchLeadsByFirstName: "/LeadsbyName?firstname=",
      fetchAllLeads: "/LeadsbyName",
    },
    permission: {
      key: "permissions",
      name: { singular: "Permission Set", plural: "Permission Sets" },
      apiName: "Permissions",
      base: "/getPermissions",
      delete: "/deletePermission",
      new: "/permissions/new",
      detail: "/permissions",
      upsert: "/upsertPermission",
      list: "/permissions",
    },
    role: {
      key: "role",
      name: { singular: "Role", plural: "Roles" },
      apiName: "Role",
      base: "/roles",
      delete: "/deleteRole",
      new: "/new-role",
      detail: "/roleDetailPage",
      upsert: "/upsertRole",
      list: "/list/role",
    },
    user: {
      key: "user",
      name: { singular: "User", plural: "Users" },
      apiName: "Users",
      base: "/Users",
      delete: "/delete",
      new: "/users/new",
      detail: "/users",
      upsert: "/UpsertUser",
      list: "/users",
      generateOTP: "/generateOTP",
      signup: "/signup",
      checkExist: `/Users?username=`,
      fetchAllUsers: "/usersByName",
      fetchUsersByFirstName: "/usersByName?firstname=",
    },
    dashboard: {
      key: "dashboard",
      name: { singular: "Dashboard", plural: "Dashboards" },
      apiName: "Dashboard",
      base: "/dashboard",
      delete: "/deleteDashboard",
      // new: "/users/new",
      // detail: "/users",
      dashboardGroup: "/dashboardGroup",
      upsert: "/upsertDashboard",
      list: "/users",
      // fetchAllUsers: "/usersByName",
      // fetchUsersByFirstName: "/usersByName?firstname=",
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
