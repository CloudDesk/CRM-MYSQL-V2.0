export const AccountInitialValues = {
  accountName: "",
  accountNumber: "",
  annualRevenue: "",
  rating: "",
  type: "",
  phone: "",
  industry: "",
  billingAddress: "",
  billingCountry: "",
  billingCity: "",
  createdbyId: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
  inventoryid: "",
};

export const AccountSavedValues = (singleAccount) => {
  const inventoryDetails =
    typeof singleAccount?.inventorydetails === "object"
      ? singleAccount.inventorydetails
      : {
          id: singleAccount?.inventoryid ?? "",
          propertyname: singleAccount?.inventoryname ?? "",
        };

  return {
    accountName: singleAccount?.accountname ?? "",
    accountNumber: singleAccount?.accountnumber ?? "",
    annualRevenue: singleAccount?.annualrevenue ?? "",
    rating: singleAccount?.rating ?? "",
    type: singleAccount?.type ?? "",
    phone: singleAccount?.phone ?? "",
    industry: singleAccount?.industry ?? "",
    billingAddress: singleAccount?.billingaddress ?? "",
    billingCountry: singleAccount?.billingcountry ?? "",
    billingCity: singleAccount?.billingcity ?? "",
    createdbyId: singleAccount?.createdbyid ?? "",
    createdDate: new Date(singleAccount?.createddate).toLocaleString(),
    modifiedDate: new Date(singleAccount?.modifieddate).toLocaleString(),
    _id: singleAccount?._id ?? "",
    inventorydetails: inventoryDetails,
    inventoryid: singleAccount?.inventoryid ?? "",
    inventoryname: singleAccount?.inventoryname ?? "",
    createdBy: (() => {
      try {
        return singleAccount?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleAccount?.modifiedby;
      } catch {
        return "";
      }
    })(),
  };
};

export const ContactInitialValues = {
  AccountId: "",
  salutation: "",
  firstName: "",
  lastName: "",
  fullName: "",
  // dob: "",
  phone: "",
  department: "",
  leadSource: "",
  email: "",
  fullAddress: "",
  description: "",
  createdbyId: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const ContactSavedValues = (singleContact) => {
  const accountDetails =
    typeof singleContact?.accountDetails === "object"
      ? singleContact.accountDetails
      : {
          id: singleContact?.accountid ?? "",
          accountname: singleContact?.accountname ?? "",
        };

  return {
    accountid: singleContact?.accountid ?? "",
    salutation: singleContact?.salutation ?? "",
    firstName: singleContact?.firstname ?? "",
    lastName: singleContact?.lastname ?? "",
    fullName: singleContact?.fullname ?? "",
    phone: singleContact?.phone ?? "",
    // dob:
    //   new Date(singleContact?.dob).getUTCFullYear() +
    //     "-" +
    //     ("0" + (new Date(singleContact?.dob).getUTCMonth() + 1)).slice(-2) +
    //     "-" +
    //     ("0" + (new Date(singleContact?.dob).getUTCDate() + 1)).slice(-2) || "",

    department: singleContact?.department ?? "",
    leadSource: singleContact?.leadsource ?? "",
    email: singleContact?.email ?? "",
    fullAddress: singleContact?.fulladdress ?? "",
    description: singleContact?.description ?? "",
    createdbyId: singleContact?.createdbyid ?? "",
    createdDate: new Date(singleContact?.createddate).toLocaleString(),
    modifiedDate: new Date(singleContact?.modifieddate).toLocaleString(),
    _id: singleContact?._id ?? "",
    accountdetails: accountDetails,
    createdBy: (() => {
      try {
        return singleContact?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleContact?.modifiedby;
      } catch {
        return "";
      }
    })(),
  };
};

export const EmailInitialValues = {
  subject: "",
  htmlBody: "",
  recordsData: "",
  attachments: "",
};

export const InventoryInitialValues = {
  projectName: "",
  propertyName: "",
  propertyUnitNumber: "",
  type: "",
  tower: "",
  country: "",
  city: "",
  floor: "",
  status: "",
  totalArea: "",
  createdbyId: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const InventorySavedValues = (singleInventory) => {
  return {
    projectName: singleInventory?.projectname ?? "",
    propertyName: singleInventory?.propertyname ?? "",
    propertyUnitNumber: singleInventory?.propertyunitnumber ?? "",
    type: singleInventory?.type ?? "",
    tower: singleInventory?.tower ?? "",
    country: singleInventory?.country ?? "",
    city: singleInventory?.city ?? "",
    floor: singleInventory?.floor ?? "",
    status: singleInventory?.status ?? "",
    totalArea: singleInventory?.totalarea ?? "",
    createdbyId: singleInventory?.createdbyid ?? "",
    createdDate: new Date(singleInventory?.createddate).toLocaleString(),
    modifiedDate: new Date(singleInventory?.modifieddate).toLocaleString(),
    _id: singleInventory?._id ?? "",
    createdBy: (() => {
      try {
        return singleInventory?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleInventory?.modifiedby;
      } catch {
        return "";
      }
    })(),
  };
};

export const LeadInitialValues = {
  fullName: "",
  companyName: "",
  designation: "",
  phone: "",
  leadSource: "",
  industry: "",
  leadStatus: "",
  email: "",
  linkedinProfile: "",
  location: "",
  appointmentDate: "",
  demo: "",
  month: "",
  remarks: "",
  primaryPhone: "",
  secondaryPhone: "",
  createdDate: "",
  modifiedDate: "",
  createdBy: "",
  modifiedBy: "",
};

export const LeadSavedValues = (singleLead) => {
  return {
    fullName: singleLead?.fullname ?? "",
    companyName: singleLead?.companyname ?? "",
    designation: singleLead?.designation ?? "",
    phone: singleLead?.phone ?? "",
    leadSource: singleLead?.leadsource ?? "",
    industry: singleLead?.industry ?? "",
    leadStatus: singleLead?.leadstatus ?? "",
    email: singleLead?.email ?? "",
    linkedinProfile: singleLead?.linkedinprofile ?? "",
    location: singleLead?.location ?? "",
    primaryPhone: singleLead?.primaryphone ?? "",
    secondaryPhone: singleLead?.secondaryphone ?? "",
    appointmentDate:
      new Date(singleLead?.appointmentdate).getUTCFullYear() +
        "-" +
        ("0" + (new Date(singleLead?.appointmentdate).getUTCMonth() + 1)).slice(
          -2
        ) +
        "-" +
        ("0" + new Date(singleLead?.appointmentdate).getUTCDate()).slice(-2) ||
      "",
    demo: singleLead?.demo ?? "",
    month: singleLead?.month ?? "",
    remarks: singleLead?.remarks ?? "",
    createdDate: new Date(singleLead?.createddate).toLocaleString(),
    modifiedDate: new Date(singleLead?.modifieddate).toLocaleString(),
    _id: singleLead?._id ?? "",
    createdBy: (() => {
      try {
        return singleLead?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleLead?.modifiedby;
      } catch {
        return "";
      }
    })(),
  };
};

export const OpportunityInitialValues = {
  leadid: "",
  inventoryid: "",
  opportunityName: "",
  type: "",
  leadSource: "",
  amount: "",
  closeDate: undefined,
  stage: "",
  description: "",
  createdbyId: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const OpportunitySavedValues = (singleOpportunity) => {
  return {
    leadid:
      singleOpportunity?.leadid ?? singleOpportunity?.leaddetails?._id ?? "",
    inventoryid:
      singleOpportunity?.inventoryid ??
      singleOpportunity?.inventorydetails?._id ??
      "",
    opportunityName: singleOpportunity?.opportunityname ?? "",
    type: singleOpportunity?.type ?? "",
    leadSource: singleOpportunity?.leadsource ?? "",
    amount: singleOpportunity?.amount ?? "",
    closeDate:
      new Date(singleOpportunity?.closedate).getUTCFullYear() +
        "-" +
        (
          "0" +
          (new Date(singleOpportunity?.closedate).getUTCMonth() + 1)
        ).slice(-2) +
        "-" +
        ("0" + (new Date(singleOpportunity?.closedate).getUTCDate() + 1)).slice(
          -2
        ) || "",
    stage: singleOpportunity?.stage ?? "",
    description: singleOpportunity?.description ?? "",
    createdbyId: singleOpportunity?.createdbyid ?? "",
    createdDate: new Date(singleOpportunity?.createddate).toLocaleString(),
    modifiedDate: new Date(singleOpportunity?.modifieddate).toLocaleString(),
    _id: singleOpportunity?._id ?? "",
    inventorydetails: singleOpportunity?.inventorydetails ?? "",
    leaddetails: singleOpportunity?.leaddetails ?? "",
    createdBy: (() => {
      try {
        return singleOpportunity?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleOpportunity?.modifiedby;
      } catch {
        return "";
      }
    })(),
  };
};

export const TaskInitialValues = {
  subject: "",
  relatedto: "",
  assignedto: "",
  StartDate: "",
  EndDate: "",
  description: "",
  // attachments: null,
  object: "",
  // AccountId: '',
  // LeadId: '',
  // OpportunityId: '',
  createdBy: "",
  modifiedBy: "",
  createdbyId: "",
  createdDate: "",
  modifiedDate: "",
};

export const TaskSavedValues = (singleTask) => {
  let leadDetails = {
    id: singleTask?.leadid,
    leadname: singleTask?.leadname,
  };
  let accountDetails = {
    id: singleTask?.accountid,
    accountname: singleTask?.accountname,
  };
  let opportunityDetails = {
    id: singleTask?.opportunityid,
    opportunityname: singleTask?.opportunityname,
  };

  return {
    subject: singleTask?.subject ?? "",
    relatedto: singleTask?.relatedto ?? "",
    // assignedTo: singleTask?.assignedTo ?? "",
    description: singleTask?.description ?? "",
    // attachments: singleTask?.attachments ?? "",
    object: singleTask?.object ?? "",
    accountid: singleTask?.accountid ?? "",
    leadid: singleTask?.leadid ?? "",
    opportunityid: singleTask?.opportunityid ?? "",
    createdbyId: singleTask?.createdbyId ?? "",
    createdDate: new Date(singleTask?.createddate).toLocaleString(),
    modifiedDate: new Date(singleTask?.modifieddate).toLocaleString(),
    _id: singleTask?._id ?? "",
    StartDate: new Date(singleTask?.startdate),
    EndDate: new Date(singleTask?.enddate),
    // StartDate:new Date(singleTask?.StartDate).getUTCFullYear()
    // + '-' +  ('0'+ (new Date(singleTask?.StartDate).getUTCMonth() + 1)).slice(-2)
    // + '-' + ('0'+ ( new Date(singleTask?.StartDate).getUTCDate())).slice(-2) ||'',
    // EndDate:  new Date(singleTask?.EndDate).getUTCFullYear()
    // + '-' +  ('0'+ (new Date(singleTask?.EndDate).getUTCMonth() + 1)).slice(-2)
    // + '-' + ('0'+ ( new Date(singleTask?.EndDate).getUTCDate())).slice(-2) ||'',

    accountdetails: accountDetails,
    leaddetails: leadDetails,
    opportunitydetails: opportunityDetails,
    assignedto: (() => {
      try {
        return singleTask?.assignedto;
      } catch {
        return null;
      }
    })(),
    createdBy: (() => {
      try {
        return singleTask?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleTask?.modifiedby;
      } catch {
        return "";
      }
    })(),
  };
};

export const UserInitialValues = {
  firstName: "",
  lastName: "",
  fullName: "",
  userName: "",
  email: "",
  phone: "",
  departmentName: "",
  roleDetails: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const UserSavedValues = (singleUser) => {
  return {
    firstName: singleUser?.firstname ?? "",
    lastName: singleUser?.lastname ?? "",
    fullName: singleUser?.fullname ?? "",
    userName: singleUser?.username ?? "",
    email: singleUser?.email ?? "",
    phone: singleUser?.phone ?? "",
    departmentName: singleUser?.departmentname ?? "",
    // access: singleUser?.access ?? "",
    createdDate: new Date(singleUser?.createddate).toLocaleString(),
    modifiedDate: new Date(singleUser?.modifieddate).toLocaleString(),
    _id: singleUser?._id ?? "",
    roleDetails: (() => {
      try {
        return singleUser?.roledetails;
      } catch {
        return "";
      }
    })(),
    createdBy: (() => {
      try {
        return singleUser?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleUser?.modifiedby;
      } catch {
        return "";
      }
    })(),
  };
};

export const RoleInitialValues = {
  roleName: "",
  departmentName: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const RoleSavedValues = (singleRole) => {
  return {
    roleName: singleRole?.rolename ?? "",
    departmentName: singleRole?.departmentname ?? "",
    createdDate: new Date(singleRole?.createddate).toLocaleString(),
    modifiedDate: new Date(singleRole?.modifieddate).toLocaleString(),
    _id: singleRole?._id ?? "",
    createdBy: (() => {
      try {
        return singleRole?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleRole?.modifiedby;
      } catch {
        return "";
      }
    })(),
  };
};

export const PermissionSetInitialValues = {
  permissionName: "",
  userDetails: "",
  department: "",
  permissionsets: [
    {
      object: "Account",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Contact",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Deals",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Enquiry",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Inventory",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Event",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
  ],
  roledetails: "",
  createdDate: "",
  modifiedDate: "",
  createdBy: "",
  modifiedBy: "",
};
console.log(
  PermissionSetInitialValues,
  "PermissionSetInitialValues from formValues.js"
);
console.log(
  JSON.stringify(PermissionSetInitialValues.permissionsets, null, 2),
  "PermissionSetInitialValues.permissionsets from formValues.js"
);

export const PermissionSavedValues = (singlePermission) => {
  console.log(singlePermission, "singlePermission in PermissionSavedValues");
  return {
    permissionName: singlePermission?.permissionname ?? "",
    department: singlePermission?.department || "",
    createdDate: new Date(singlePermission?.createddate).toLocaleString(),
    modifiedDate: new Date(singlePermission?.modifieddate).toLocaleString(),
    _id: singlePermission?._id ?? "",
    roledetails: singlePermission?.roledetails ?? "",
    userDetails: (() => {
      try {
        return singlePermission?.userdetails;
      } catch {
        return "";
      }
    })(),
    createdBy: (() => {
      try {
        return singlePermission?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singlePermission?.modifiedby;
      } catch {
        return "";
      }
    })(),
    permissionsets: (() => {
      try {
        return singlePermission?.permissionsets;
      } catch {
        return "";
      }
    })(),
  };
};

export const DashboardInitialValues = (singleDashboard) => {
  return {
    dashboardName: singleDashboard?.dashboardName ?? "",
    chartType: singleDashboard?.chartType ?? "",
    objectName: singleDashboard?.objectName ?? "",
    fields: singleDashboard?.fields ?? [],
    createdDate: singleDashboard?.createdDate ?? "",
    modifiedDate: singleDashboard?.modifiedDate ?? "",
    createdBy: singleDashboard?.createdBy ?? "",
    modifiedBy: singleDashboard?.modifiedBy ?? "",
  };
};

export const DashboardSavedValues = (singleDashboard) => {
  return {
    dashboardName: singleDashboard?.dashboardname ?? "",
    chartType: singleDashboard?.charttype ?? "",
    objectName: singleDashboard?.objectname ?? "",
    // fields: singleDashboard?.fields ?? [],
    createdDate: singleDashboard?.createddate ?? "",
    modifiedDate: singleDashboard?.modifieddate ?? "",
    _id: singleDashboard?._id ?? "",
    createdBy: (() => {
      try {
        return singleDashboard?.createdby;
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return singleDashboard?.modifiedby;
      } catch {
        return "";
      }
    })(),
    fields: (() => {
      try {
        return singleDashboard?.fields || [];
      } catch {
        return [];
      }
    })(),
  };
};
