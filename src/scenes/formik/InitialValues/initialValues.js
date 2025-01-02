import * as Yup from 'yup';
import { format } from 'date-fns';
import { AccRatingPickList, AccTypePickList, IndustryPickList, InvCitiesPickList, InvCountryPickList, InvStatusPicklist, InvTypePicklist, LeadMonthPicklist, LeadsDemoPicklist, LeadSourcePickList, LeadStatusPicklist, NameSalutionPickList, OppStagePicklist, OppTypePicklist, RolesCategories, RolesDepartment, TaskObjectPicklist, TaskSubjectPicklist, UserRolePicklist } from '../../../data/pickLists';
import { Grid, Typography } from '@mui/material';
import { FetchInventoryData } from '../../../utility/FetchData/FetchInventoryData';
import { RequestServer } from '../../api/HttpReq';

const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

// Metadata
export const metaDataFields = [{
  name: 'createddate',
  label: 'Created Date',
  type: 'text',
  xs: 12,
  md: 6,
  props: {
    disabled: true
  },
  defaultValue: () => format(new Date(), 'yyyy-MM-dd HH:mm:ss')
},
{
  name: 'modifieddate',
  label: 'Modified Date',
  type: 'text',
  xs: 12,
  md: 6,
  props: {
    disabled: true
  },
  defaultValue: () => format(new Date(), 'yyyy-MM-dd HH:mm:ss')
},
{
  name: 'createdby',
  label: 'Created By',
  type: 'text',
  xs: 12,
  md: 6,
  props: {
    disabled: true
  },
},
{
  name: 'modifiedby',
  label: 'Modified By',
  type: 'text',
  xs: 12,
  md: 6,
  props: {
    disabled: true
  },
},

  // Additional Notes

];

// Lead Initial Values
export const leadFormFields = [
  // Personal Information
  {
    name: 'fullname',
    label: 'Full Name',
    type: 'text',
    required: true,
    xs: 12,
    md: 6,
    validator: Yup.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters')
      .required('Full Name is required'),
    props: {
      placeholder: 'Enter full name'
    }
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    xs: 12,
    md: 6,
    validator: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    props: {
      placeholder: 'Enter email address'
    }
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    required: true,
    xs: 12,
    md: 6,
    validator: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Phone number is required'),
    props: {
      placeholder: 'Enter phone number'
    }

  },
  {
    name: 'primaryphone',
    label: 'Primary Phone',
    type: 'tel',
    required: true,
    xs: 12,
    md: 6,
    validator: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Primary phone number is required'),
    props: {
      placeholder: 'Enter primary phone number'
    }
  },
  {
    name: 'secondaryphone',
    label: 'Secondary Phone',
    type: 'tel',
    xs: 12,
    md: 6,
    required: true,
    validator: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .optional(),
    props: {
      placeholder: 'Enter secondary phone number'
    }
  },

  // Company Information
  {
    name: 'companyname',
    label: 'Company Name',
    type: 'text',
    xs: 12,
    md: 6,
    validator: Yup.string()
      .max(100, 'Company name must be less than 100 characters'),
    props: {
      placeholder: 'Enter company name'
    }
  },
  {
    name: 'designation',
    label: 'Designation',
    type: 'text',
    xs: 12,
    md: 6,
    props: {
      placeholder: 'Enter job designation'
    }
  },
  {
    name: 'industry',
    label: 'Industry',
    type: 'select',
    xs: 12,
    md: 6,
    options: IndustryPickList,
    props: {
      displayEmpty: true
    }
  },

  // Lead Information
  {
    name: 'leadsource',
    label: 'Enquiry Source',
    type: 'select',
    xs: 12,
    md: 6,
    options: LeadSourcePickList
  },
  {
    name: 'leadstatus',
    label: 'Enquiry Status',
    type: 'select',
    xs: 12,
    md: 6,
    required: true,
    options: LeadStatusPicklist
  },

  // Additional Information
  {
    name: 'linkedinprofile',
    label: 'LinkedIn Profile',
    type: 'url',
    xs: 12,
    md: 6,
    validator: Yup.string().url('Invalid URL'),
    props: {
      placeholder: 'Enter LinkedIn profile URL'
    }
  },
  {
    name: 'location',
    label: 'Location',
    type: 'text',
    xs: 12,
    md: 6,
    props: {
      placeholder: 'Enter city or region'
    }
  },

  // Scheduling
  {
    name: 'appointmentdate',
    label: 'Appointment Date',
    type: 'date',
    xs: 12,
    md: 6,
    required: true,
    validator: Yup.date().nullable(),
    props: {
      InputLabelProps: { shrink: true }
    }
  },
  {
    name: 'demo',
    label: 'Demo Requested',
    type: 'select',
    xs: 12,
    md: 6,
    options: LeadsDemoPicklist
  },
  {
    name: 'month',
    label: 'Month',
    type: 'select',
    xs: 12,
    md: 6,
    required: true,
    options: LeadMonthPicklist
  },
  {
    name: 'remarks',
    label: 'Remarks',
    type: 'text',
    multiline: true,
    xs: 12,
    props: {
      multiline: true,
      rows: 4,
      placeholder: 'Additional notes or comments'
    }
  }
]


export const generateLeadInitialValues = (existingLead = {}) => {
  console.log(existingLead, "existingLead");
  const defaultValues = leadFormFields.reduce((acc, field) => {
    // Check if value exists in existing lead, otherwise use empty string or default
    acc[field.name] = existingLead[field.name] ?? '';
    return acc;
  }, {});


  // Add metadata values only if editing an existing lead
  if (Object.keys(existingLead).length > 0) {

    // Timestamps
    defaultValues.appointmentdate = (existingLead?.appointmentdate !== null && format(existingLead?.appointmentdate, 'yyyy-MM-dd')) ?? Date.now();
    defaultValues.createddate = format(existingLead.createddate, 'MM/dd/yyyy') ?? Date.now();
    defaultValues.modifieddate = format(existingLead.modifieddate, 'MM/dd/yyyy') ?? Date.now();

    // Created By
    defaultValues.createdby = existingLead.createdby
      ? existingLead.createdby.userFullName + " - " + format(existingLead.createddate, "MMMM dd, yyyy hh:mm a")
      // {
      //     userId: existingLead.createdby.userId || 0,
      //     userName: existingLead.createdby.userName || '',
      //     userRole: existingLead.createdby.userRole || '',
      //     userFullName: existingLead.createdby.userFullName || '',
      //     userDepartment: existingLead.createdby.userDepartment || ''
      //   }
      : null;

    // Modified By
    defaultValues.modifiedby = existingLead.modifiedby
      ?
      existingLead.modifiedby.userFullName + " - " + format(existingLead.modifieddate, "MMMM dd, yyyy hh:mm a")
      // {
      //     userId: existingLead.modifiedby.userId || 0,
      //     userName: existingLead.modifiedby.userName || '',
      //     userRole: existingLead.modifiedby.userRole || '',
      //     userFullName: existingLead.modifiedby.userFullName || '',
      //     userDepartment: existingLead.modifiedby.userDepartment || ''
      //   }
      : null;
  }

  return defaultValues;
};


// Opportunity Initial Values

export const opportunityFormFields = [
  // Identification
  // {
  //   name: 'leadid',
  //   label: 'Lead ID',
  //   type: 'text',
  //   xs: 12,
  //   md: 6,
  //   props: {
  //     placeholder: 'Enter Lead ID'
  //   }
  // },
  // {
  //   name: 'inventoryid',
  //   label: 'Inventory ID',
  //   type: 'text',
  //   xs: 12,
  //   md: 6,
  //   props: {
  //     placeholder: 'Enter Inventory ID'
  //   }
  // },
  {
    name: 'opportunityname',
    label: 'Deal Name',
    type: 'text',
    required: true,
    xs: 12,
    md: 6,
    validator: Yup.string()
      .min(2, 'Opportunity name must be at least 2 characters')
      .max(100, 'Opportunity name must be less than 100 characters')
      .required('Opportunity Name is required'),
    props: {
      placeholder: 'Enter Opportunity Name'
    }
  },
  {
    name: "inventoryname",
    label: "Inventory Name",
    type: "autocomplete",
    xs: 12,
    md: 6,
    fetchurl: `/InventoryName`,
    searchfor: "propertyname",
    options: [],
    props: {
      placeholder: "Enter Inventory Name"
    }
  },

  // Opportunity Details
  {
    name: 'type',
    label: 'Deal Type',
    type: 'select',
    xs: 12,
    md: 6,
    options: OppTypePicklist,
    validator: Yup.string().required('Opportunity Type is required'),
    props: {
      displayEmpty: true
    }
  },
  {
    name: "leadname",
    label: "Enquiry Name",
    type: "autocomplete",
    fetchurl: "/LeadsbyName",
    searchfor: "fullname",
    xs: 12,
    md: 6,
    props: {
      placeholder: "Enter Enquiry Name"
    }

  },
  {
    name: 'leadsource',
    label: 'Enquiry Source',
    type: 'select',
    xs: 12,
    md: 6,
    options: LeadSourcePickList, // You would import or define LeadSourcePickList similar to previous example
    props: {
      displayEmpty: true
    }
  },
  {
    name: 'amount',
    label: 'Deal Amount',
    type: 'number',
    xs: 12,
    md: 6,
    validator: Yup.number()
      .positive('Amount must be a positive number')
      .required('Opportunity Amount is required'),
    props: {
      placeholder: 'Enter Opportunity Amount',
      type: 'number'
    }
  },
  {
    name: 'closedate',
    label: 'Close Date',
    type: 'date',
    xs: 12,
    md: 6,
    validator: Yup.date().nullable(),
    props: {
      InputLabelProps: { shrink: true },
      placeholder: 'Select Close Date'
    }
  },
  {
    name: 'stage',
    label: 'Deal Stage',
    type: 'select',
    xs: 12,
    md: 6,
    required: true,
    options: OppStagePicklist,
    validator: Yup.string().required('Opportunity Stage is required'),
    props: {
      displayEmpty: true
    }
  },
  {
    name: 'description',
    label: 'Description',
    type: 'text',
    multiline: true,
    xs: 12,
    props: {
      multiline: true,
      rows: 4,
      placeholder: 'Additional details about the opportunity'
    }
  },

  // Metadata
  // {
  //   name: 'createddate',
  //   label: 'Created Date',
  //   type: 'text',
  //   xs: 12,
  //   md: 6,
  //   props: {
  //     disabled: true
  //   },
  //   defaultValue: () => format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  // },
  // {
  //   name: 'modifieddate',
  //   label: 'Modified Date',
  //   type: 'text',
  //   xs: 12,
  //   md: 6,
  //   props: {
  //     disabled: true
  //   },
  //   defaultValue: () => format(new Date(), 'yyyy-MM-dd HH:mm:ss')
  // },
  // {
  //   name: 'createdby',
  //   label: 'Created By',
  //   type: 'text',
  //   xs: 12,
  //   md: 6,
  //   props: {
  //     disabled: true
  //   }
  // },
  // {
  //   name: 'modifiedby',
  //   label: 'Modified By',
  //   type: 'text',
  //   xs: 12,
  //   md: 6,
  //   props: {
  //     disabled: true
  //   }
  // }
];

export const generateOpportunityInitialValues = (existingOpportunity = {}) => {
  console.log(existingOpportunity, "existingOpportunity from generateOpportunityInitialValues");
  const defaultValues = opportunityFormFields.reduce((acc, field) => {
    // Check if value exists in existing opportunity, otherwise use empty string or default
    acc[field.name] = existingOpportunity[field.name] ?? '';
    return acc;
  }, {});

  // Add metadata values only if editing an existing opportunity
  if (Object.keys(existingOpportunity).length > 0) {
    // Timestamps
    defaultValues.closedate = (existingOpportunity?.closedate !== null && format(existingOpportunity?.closedate, 'yyyy-MM-dd')) ?? null;
    defaultValues.createddate = format(existingOpportunity.createddate, 'MM/dd/yyyy') ?? Date.now();
    defaultValues.modifieddate = format(existingOpportunity.modifieddate, 'MM/dd/yyyy') ?? Date.now();
    if (existingOpportunity.inventoryname !== null) {
      defaultValues.inventoryname = existingOpportunity.inventoryname.startsWith("{")
        ? JSON.parse(existingOpportunity.inventoryname).label || existingOpportunity.inventoryname
        : existingOpportunity.inventoryname;
    }
    if (existingOpportunity.leadname !== null) {
      defaultValues.leadname = existingOpportunity.leadname.startsWith("{")
        ? JSON.parse(existingOpportunity.leadname).label || existingOpportunity.leadname
        : existingOpportunity.leadname;
    }
    // Created By
    defaultValues.createdby = existingOpportunity.createdby
      ? existingOpportunity.createdby.userFullName + " - " + format(existingOpportunity.createddate, "MMMM dd, yyyy hh:mm a")
      : null;

    // Modified By
    defaultValues.modifiedby = existingOpportunity.modifiedby
      ? existingOpportunity.modifiedby.userFullName + " - " + format(existingOpportunity.modifieddate, "MMMM dd, yyyy hh:mm a")
      : null;
  }

  return defaultValues;
};

// Account Initial Values

export const accountformfields = [
  {
    name: "accountname",
    label: "Account Name",
    type: "text",
    required: true,
    xs: 12,
    md: 6,
    validator: Yup.string()
      .min(2, "Account name must be at least 2 characters")
      .max(100, "Account name must be less than 100 characters")
      .required("Account Name is required"),
    props: {
      placeholder: "Enter Account Name",
    },
  },
  {
    name: "accountnumber",
    label: "Account Number",
    type: "text",
    xs: 12,
    md: 6,
    validator: Yup.string().max(20, "Account Number must be less than 20 characters"),
    props: {
      placeholder: "Enter Account Number",
    },
  },
  {
    name: 'inventoryname',
    label: 'Inventory Name',
    type: 'autocomplete',
    xs: 12,
    md: 6,
    fetchurl: `/InventoryName`,
    searchfor: "propertyname",
    options: [],
    props: {
      placeholder: "Enter Inventory Name"
    }

  },
  {
    name: "annualrevenue",
    label: "Annual Revenue",
    type: "number",
    xs: 12,
    md: 6,
    validator: Yup.number()
      .positive("Annual Revenue must be a positive number")
      .nullable(),
    props: {
      placeholder: "Enter Annual Revenue",
    },
  },
  {
    name: "phone",
    label: "Phone",
    type: "text",
    xs: 12,
    md: 6,
    validator: Yup.string().matches(
      /^[+]?[0-9]*$/,
      "Phone must contain only numbers and optional '+'"
    ),
    props: {
      placeholder: "Enter Phone Number",
    },
  },
  {
    name: "rating",
    label: "Rating",
    type: "select",
    xs: 12,
    md: 6,
    options: AccRatingPickList, // Define or import ratingpicklist
    props: {
      displayEmpty: true,
    },
  },
  {
    name: "type",
    label: "Account Type",
    type: "select",
    xs: 12,
    md: 6,
    options: AccTypePickList, // Define or import accounttypepicklist
    props: {
      displayEmpty: true,
    },
  },

  {
    name: "industry",
    label: "Industry",
    type: "select",
    xs: 12,
    md: 6,
    options: IndustryPickList, // Define or import industrypicklist
    props: {
      displayEmpty: true,
    },
  },
  {
    name: "billingcountry",
    label: "Billing Country",
    type: "text",
    xs: 12,
    md: 6,
    props: {
      placeholder: "Enter Billing Country",
    },
  },
  {
    name: "billingcity",
    label: "Billing City",
    type: "text",
    xs: 12,
    md: 6,
    props: {
      placeholder: "Enter Billing City",
    },
  },
  {
    name: "billingaddress",
    label: "Billing Address",
    type: "text",
    multiline: true,
    xs: 12,
    props: {
      multiline: true,
      rows: 3,
      placeholder: "Enter Billing Address",
    },
  },

  // {
  //   name: "inventoryid",
  //   label: "Inventory ID",
  //   type: "text",
  //   xs: 12,
  //   md: 6,
  //   props: {
  //     placeholder: "Enter Inventory ID",
  //   },
  // },
];

export const generateAccountInitialValues = (existingAccount = {}) => {
  console.log(existingAccount, "existingAccount from generateAccountInitialValues");
  const defaultValues = accountformfields.reduce((acc, field) => {
    acc[field.name] = existingAccount[field.name] ?? "";
    return acc;
  }, {});

  if (Object.keys(existingAccount).length > 0) {
    defaultValues.inventoryname = existingAccount.inventoryname.startsWith("{") ? JSON.parse(existingAccount.inventoryname).label || existingAccount.inventoryname : existingAccount.inventoryname;
    defaultValues.createddate = format(existingAccount.createddate, "MM/dd/yyyy") ?? Date.now();
    defaultValues.modifieddate = format(existingAccount.modifieddate, "MM/dd/yyyy") ?? Date.now();
    // Created By
    defaultValues.createdby = existingAccount.createdby
      ? existingAccount.createdby.userFullName + " - " + format(existingAccount.createddate, "MMMM dd, yyyy hh:mm a")
      : null;

    // Modified By
    defaultValues.modifiedby = existingAccount.modifiedby
      ? existingAccount.modifiedby.userFullName + " - " + format(existingAccount.modifieddate, "MMMM dd, yyyy hh:mm a")

      : null;
  }

  return defaultValues;
};


// Contact Initial Values

// export const contactformfields = [
//   {
//     name: "accountid",
//     label: "Account ID",
//     type: "text",
//     xs: 12,
//     md: 6,
//     props: {
//       placeholder: "Enter Account ID",
//     },
//   },
//   {
//     name: "salutation",
//     label: "Salutation",
//     type: "select",
//     xs: 12,
//     md: 6,
//     options: NameSalutionPickList, // Define or import salutationpicklist
//     props: {
//       displayEmpty: true,
//     },
//   },
//   {
//     name: "firstname",
//     label: "First Name",
//     type: "text",
//     xs: 12,
//     md: 6,
//     validator: Yup.string()
//       .max(50, "First name must be less than 50 characters")
//       .nullable(),
//     props: {
//       placeholder: "Enter First Name",
//     },
//   },
//   {
//     name: "lastname",
//     label: "Last Name",
//     type: "text",
//     required: true,
//     xs: 12,
//     md: 6,
//     validator: Yup.string()
//       .min(2, "Last name must be at least 2 characters")
//       .max(50, "Last name must be less than 50 characters")
//       .required("Last Name is required"),
//     props: {
//       placeholder: "Enter Last Name",
//     },
//   },
//   {
//     name: "fullname",
//     label: "Full Name",
//     type: "text",
//     xs: 12,
//     md: 6,
//     props: {
//       disabled: true,
//     },
//   },
//   // Uncomment if dob is required
//   // {
//   //   name: "dob",
//   //   label: "Date of Birth",
//   //   type: "date",
//   //   xs: 12,
//   //   md: 6,
//   //   validator: Yup.date().nullable(),
//   //   props: {
//   //     InputLabelProps: { shrink: true },
//   //     placeholder: "Select Date of Birth",
//   //   },
//   // },
//   {
//     name: "phone",
//     label: "Phone",
//     type: "text",
//     xs: 12,
//     md: 6,
//     validator: Yup.string().matches(
//       /^[+]?[0-9]*$/,
//       "Phone must contain only numbers and optional '+'"
//     ),
//     props: {
//       placeholder: "Enter Phone Number",
//     },
//   },
//   {
//     name: "department",
//     label: "Department",
//     type: "text",
//     xs: 12,
//     md: 6,
//     props: {
//       placeholder: "Enter Department",
//     },
//   },
//   {
//     name: "leadsource",
//     label: "Lead Source",
//     type: "select",
//     xs: 12,
//     md: 6,
//     options: LeadSourcePickList, // Define or import leadsourcespicklist
//     props: {
//       displayEmpty: true,
//     },
//   },
//   {
//     name: "email",
//     label: "Email",
//     type: "text",
//     xs: 12,
//     md: 6,
//     validator: Yup.string()
//       .email("Enter a valid email")
//       .nullable(),
//     props: {
//       placeholder: "Enter Email Address",
//     },
//   },
//   {
//     name: "fulladdress",
//     label: "Full Address",
//     type: "text",
//     multiline: true,
//     xs: 12,
//     props: {
//       multiline: true,
//       rows: 4,
//       placeholder: "Enter Full Address",
//     },
//   },
//   {
//     name: "description",
//     label: "Description",
//     type: "text",
//     multiline: true,
//     xs: 12,
//     props: {
//       multiline: true,
//       rows: 4,
//       placeholder: "Enter Description",
//     },
//   },
// ];

export const contactformfields = (isExistingContact = false) => {
  const fields = [
    // {
    //   name: "accountid",
    //   label: "Account ID",
    //   type: "text",
    //   xs: 12,
    //   md: 6,
    //   props: {
    //     placeholder: "Enter Account ID",
    //   },
    // },
    {
      name: "accountname",
      label: "Account Name",
      type: "autocomplete",
      xs: 12,
      md: 6,
      fetchurl: `/accountsname`,
      searchfor: "accountname",
      options: [],
      props: {
        placeholder: "Enter Account Name",
      },
    },
    {
      name: "salutation",
      label: "Salutation",
      type: "select",
      xs: 12,
      md: 2.5,
      options: NameSalutionPickList, // Define or import salutationpicklist
      props: {
        displayEmpty: true,
      },
    },
    {
      name: "firstname",
      label: "First Name",
      type: "text",
      xs: 12,
      md: 3.5,
      validator: Yup.string()
        .max(50, "First name must be less than 50 characters")
        .nullable(),
      props: {
        placeholder: "Enter First Name",
      },
    },
    {
      name: "lastname",
      label: "Last Name",
      type: "text",
      required: true,
      xs: 12,
      md: 6,
      validator: Yup.string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name must be less than 50 characters")
        .required("Last Name is required"),
      props: {
        placeholder: "Enter Last Name",
      },
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      xs: 12,
      md: 6,
      validator: Yup.string().matches(
        /^[+]?[0-9]*$/,
        "Phone must contain only numbers and optional '+'"
      ),
      props: {
        placeholder: "Enter Phone Number",
      },
    },
    {
      name: "department",
      label: "Department",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Department",
      },
    },
    {
      name: "leadsource",
      label: "Lead Source",
      type: "select",
      xs: 12,
      md: 6,
      options: LeadSourcePickList, // Define or import leadsourcespicklist
      props: {
        displayEmpty: true,
      },
    },
    {
      name: "email",
      label: "Email",
      type: "text",
      xs: 12,
      md: 6,
      validator: Yup.string()
        .email("Enter a valid email")
        .nullable(),
      props: {
        placeholder: "Enter Email Address",
      },
    },
    {
      name: "fulladdress",
      label: "Full Address",
      type: "text",
      multiline: true,
      xs: 12,
      props: {
        multiline: true,
        rows: 4,
        placeholder: "Enter Full Address",
      },
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      multiline: true,
      xs: 12,
      props: {
        multiline: true,
        rows: 4,
        placeholder: "Enter Description",
      },
    },
  ];

  // Add "fullname" field only for existing contacts
  if (isExistingContact) {
    fields.unshift({
      name: "fullname",
      label: "Full Name",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        disabled: true,
      },
    });
  }

  return fields;
};

export const generateContactInitialValues = (existingContact = {}) => {
  const defaultValues = contactformfields(Object.keys(existingContact).length > 0).reduce((acc, field) => {
    acc[field.name] = existingContact[field.name] ?? "";
    return acc;
  }, {});

  if (Object.keys(existingContact).length > 0) {
    defaultValues.accountname = existingContact.accountname.startsWith("{") ? JSON.parse(existingContact.accountname).label || existingContact.accountname : existingContact.accountname;
    defaultValues.createddate = format(existingContact.createddate, "MM/dd/yyyy") ?? Date.now();
    defaultValues.modifieddate = format(existingContact.modifieddate, "MM/dd/yyyy") ?? Date.now();
    // Created By
    defaultValues.createdby = existingContact.createdby
      ? existingContact.createdby.userFullName + " - " + format(existingContact.createddate, "MMMM dd, yyyy hh:mm a")
      : null;

    // Modified By
    defaultValues.modifiedby = existingContact.modifiedby
      ? existingContact.modifiedby.userFullName + " - " + format(existingContact.modifieddate, "MMMM dd, yyyy hh:mm a")
      : null;
  }

  return defaultValues;
};

// Inventory Initial Values

export const inventoryformfields = (isExistingInventory = false) => {
  const fields = [
    {
      name: "projectname", // Lowercase key
      label: "Project Name",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Project Name",
      },
    },
    {
      name: "propertyname", // Lowercase key
      label: "Property Name",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Property Name",
      },
    },
    {
      name: "propertyunitnumber", // Lowercase key
      label: "Property Unit Number",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Property Unit Number",
      },
    },
    {
      name: "type", // Lowercase key
      label: "Type",
      type: "select",
      xs: 12,
      md: 6,
      options: InvTypePicklist, // Define or import PropertyTypePickList
      props: {
        displayEmpty: true,
      },
    },
    {
      name: "tower", // Lowercase key
      label: "Tower",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Tower",
      },
    },
    {
      name: "country", // Lowercase key
      label: "Country",
      type: "select",
      xs: 12,
      md: 6,
      options: InvCountryPickList,
      props: {
        displayEmpty: true,
      },
      onChange: "city" // Specify which field depends on this
    },
    {
      name: "city", // Lowercase key
      label: "City",
      type: "select",
      xs: 12,
      md: 6,
      options: [], // Will be dynamically set in initial values
      props: {
        displayEmpty: true,
      },
      dependsOn: {
        field: "country",
        options: InvCitiesPickList // Pass the options mapping
      }
    },
    {
      name: "floor", // Lowercase key
      label: "Floor",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Floor",
      },
    },
    {
      name: "status", // Lowercase key
      label: "Status",
      type: "select",
      xs: 12,
      md: 6,
      options: InvStatusPicklist, // Define or import InventoryStatusPickList
      props: {
        displayEmpty: true,
      },
    },
    {
      name: "totalarea", // Lowercase key
      label: "Total Area",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Total Area",
      },
    },
  ];

  if (isExistingInventory) {
    fields.push(
      {
        name: "createddate", // Lowercase key
        label: "Created Date",
        type: "text",
        xs: 12,
        md: 6,
        props: {
          disabled: true,
        },
      },
      {
        name: "modifieddate", // Lowercase key
        label: "Modified Date",
        type: "text",
        xs: 12,
        md: 6,
        props: {
          disabled: true,
        },
      },
      {
        name: "createdby", // Lowercase key
        label: "Created By",
        type: "text",
        xs: 12,
        md: 6,
        props: {
          disabled: true,
        },
      },
      {
        name: "modifiedby", // Lowercase key
        label: "Modified By",
        type: "text",
        xs: 12,
        md: 6,
        props: {
          disabled: true,
        },
      },

    );
  }

  return fields;
};

export const generateInventoryInitialValues = (existingInventory = {}) => {
  const selectedCountry = existingInventory.country || "";
  const cityOptions = selectedCountry
    ? InvCitiesPickList[selectedCountry] || []
    : [];

  const defaultValues = inventoryformfields(
    Object.keys(existingInventory).length > 0
  ).reduce((acc, field) => {
    acc[field.name] = existingInventory[field.name] ?? "";
    return acc;
  }, {});

  // Dynamically set initial options for the `city` field based on `country`
  defaultValues.cityOptions = cityOptions;

  if (Object.keys(existingInventory).length > 0) {
    defaultValues.createddate = format(existingInventory.createddate, "MM/dd/yyyy") ?? Date.now();
    defaultValues.modifieddate = format(existingInventory.modifieddate, "MM/dd/yyyy") ?? Date.now();



    // Created By
    defaultValues.createdby = existingInventory.createdby
      ? existingInventory.createdby.userFullName +
      " - " +
      format(existingInventory.createddate, "MMMM dd, yyyy hh:mm a")
      : null;

    // Modified By
    defaultValues.modifiedby = existingInventory.modifiedby
      ? existingInventory.modifiedby.userFullName +
      " - " +
      format(existingInventory.modifieddate, "MMMM dd, yyyy hh:mm a")
      : null;
  }

  return defaultValues;
};

// Tasks Initial Values

// const fetchAccountUrl = `/accountsname?accountname=`;
const fetchAccountUrl = `/accountsname`;
// const fetchLeadUrl = `/LeadsbyName?fullname=`;
const fetchLeadUrl = `/LeadsbyName`;
// const fetchOpportunityUrl = `/opportunitiesbyName?opportunityname=`;
const fetchOpportunityUrl = `/opportunitiesbyName`;

const fetchUsersbyName = `/usersByName`;

export const TaskFormFields = (isExistingTask = false) => {
  console.log(isExistingTask, "isExistingTask from TaskFormFields");
  const fields = [
    {
      name: "subject", // Lowercase key
      label: "Subject",
      type: "select",
      xs: 12,
      md: 6,
      options: TaskSubjectPicklist,
      required: true,
      props: {
        placeholder: "Select Subject",
      },
    },
    {
      name: "object",
      label: "Object",
      type: "select",
      xs: 12,
      md: 6,
      required: true,
      options: TaskObjectPicklist,
      onChange: async (value, formik) => {
        console.log(value, "value from object onchange");
        // Reset the relatedto field when object changes
        formik.setFieldValue('relatedto', '');

        if (!value) return;

        // Determine the URL based on selected object
        const urlMap = {
          Account: fetchAccountUrl,
          Enquiry: fetchLeadUrl,
          Deals: fetchOpportunityUrl
        };

        const fetchUrl = urlMap[value];
        console.log(fetchUrl, "fetchUrl");
        if (!fetchUrl) return;

        try {
          const response = await RequestServer('get', fetchUrl);
          console.log(response.data, "response.data");
          // Transform the response data into options format
          const options = response.data.map(item => ({
            value: item.fullname || item.opportunityname || item.accountname,
            label: item.fullname || item.opportunityname || item.accountname // adjust this based on your data structure
          }));
          console.log(options, "options");
          // Set the options for the relatedto field
          formik.setFieldValue('relatedtoOptions', options);
        } catch (error) {
          console.error('Error fetching related options:', error);
          formik.setFieldValue('relatedtoOptions', []);
        }
      },
      props: {
        placeholder: "Select Object"
      }
    },

    {
      name: "relatedto",
      label: "Related To",
      type: "select",
      xs: 12,
      md: 6,
      required: true,
      dependsOn: {
        field: "object"
      },
      // The options will be populated from the relatedtoOptions field
      options: [], // This will be overridden by the dynamic options
      props: {
        placeholder: "Select Related To"
      }
    },
    {
      name: "assignedto", // Lowercase key
      label: "Assigned To",
      type: "autocomplete",
      xs: 12,
      md: 6,
      required: true,
      fetchurl: fetchUsersbyName,
      searchfor: "fullname",
      options: [],
      props: {
        placeholder: "Enter Assignee",
      },
    },
    {
      name: "startdate", // Lowercase key
      label: "Start Date",
      type: "date",
      xs: 12,
      md: 6,
      required: true,
      validator: Yup.date().nullable(),
      props: {
        InputLabelProps: { shrink: true }
      }
    },
    {
      name: "enddate", // Lowercase key
      label: "End Date",
      type: "date",
      xs: 12,
      md: 6,
      required: true,
      validator: Yup.date().nullable(),
      props: {
        InputLabelProps: { shrink: true }
      }
    },
    {
      name: "description", // Lowercase key
      label: "Description",
      type: "text",
      xs: 12,
      md: 12,
      props: {
        multiline: true,
        rows: 4,
        placeholder: "Enter Description",
      },
    },
  ];

  if (isExistingTask) {
    fields.map(field => {
      if (field.name === "relatedto") {
        field.options = [];
      }

      return field;
    }
    )
  }


  return fields;
};

export const generateTaskInitialValues = (existingTask = {}) => {
  console.log(existingTask, "existingTask from generateTaskInitialValues");
  const defaultValues = TaskFormFields(
    Object.keys(existingTask).length > 0
  ).reduce((acc, field) => {
    acc[field.name] = existingTask[field.name] ?? "";
    return acc;
  }, {});

  if (existingTask.object) {
    fetchRelatedToOptions(existingTask.object).then((options) => {
      defaultValues.relatedtoOptions = options;
    });
  }

  if (Object.keys(existingTask).length > 0) {
    // defaultValues.relatedToOptions = relatedToOptions;
    defaultValues.relatedto = existingTask.relatedto;
    if ((existingTask.startdate && existingTask.enddate) !== null) {
      defaultValues.startdate = format(existingTask?.startdate, "yyyy-MM-dd") ?? Date.now();
      defaultValues.enddate = format(existingTask?.enddate, "yyyy-MM-dd") ?? Date.now();
    }

    defaultValues.createddate = format(existingTask.createddate, "MM/dd/yyyy") || Date.now();
    defaultValues.modifieddate = format(existingTask.modifieddate, "MM/dd/yyyy") || Date.now();

    // Created By
    defaultValues.createdby = existingTask.createdby
      ? existingTask.createdby.userFullName +
      " - " +
      format(existingTask.createddate, "MMMM dd, yyyy hh:mm a")
      : null;

    // Modified By
    defaultValues.modifiedby = existingTask.modifiedby
      ? existingTask.modifiedby.userFullName +
      " - " +
      format(existingTask.modifieddate, "MMMM dd, yyyy hh:mm a")
      : null;
  }

  return defaultValues;
};


const fetchRelatedToOptions = async (object) => {
  const fetchUrl = {
    Account: fetchAccountUrl,
    Enquiry: fetchLeadUrl,
    Deals: fetchOpportunityUrl
  }[object];

  if (!fetchUrl) return [];

  try {
    const response = await RequestServer('get', fetchUrl);
    console.log(response, 'response');
    return response.data.map(item => ({
      value: item._id,
      label: item.fullname || item.opportunityname || item.accountname
    }));
  } catch (error) {
    console.error('Error fetching related options:', error);
    return [];
  }
}

// Users Initial Values

export const UserFormFields = (isExistingUser = false) => {
  const fields = [
    {
      name: "firstname", // Lowercase key
      label: "First Name",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter First Name",
      },
    },
    {
      name: "lastname", // Lowercase key
      label: "Last Name",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Last Name",
      },
    },
    {
      name: "email", // Lowercase key
      label: "Email",
      type: "email",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Email Address",
      },
    },
    {
      name: "username", // Lowercase key
      label: "User Name",
      type: "text",
      xs: 12,
      md: 6,
      disabled: true,
      props: {
        placeholder: "Enter User Name",
        disabled: true
      },
    },

    {
      name: "phone", // Lowercase key
      label: "Phone",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Phone Number",
      },
    },
    {
      name: "departmentname", // Lowercase key
      label: "Department Name",
      type: "select",
      xs: 12,
      md: 6,
      options: RolesDepartment, // Define or import rolesdepartmentpicklist
      props: {
        placeholder: "Enter Department Name",
      },
    },
    {
      name: "roledetails", // Lowercase key
      label: "Role Details",
      type: "select",
      xs: 12,
      md: 6,
      options: UserRolePicklist, // Define or import userrolepicklist
      props: {
        placeholder: "Enter Role Details",
      },
    },

  ];

  if (isExistingUser) {
    fields.unshift({
      name: "fullname", // Lowercase key
      label: "Full Name",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        disabled: true,
      },
    });
  }

  return fields;
};

export const generateUserInitialValues = (existingUser = {}) => {
  console.log(existingUser, "existingUser from generateUserInitialValues");
  const defaultValues = UserFormFields(
    Object.keys(existingUser).length > 0
  ).reduce((acc, field) => {
    acc[field.name] = existingUser[field.name] ?? "";
    return acc;
  }, {});

  if (Object.keys(existingUser).length > 0) {
    defaultValues.createddate = format(Number(existingUser.createddate), "MM/dd/yyyy") || Date.now();
    defaultValues.modifieddate = format(Number(existingUser.modifieddate), "MM/dd/yyyy") || Date.now();

    // Automatically generate full name if first and last names exist
    defaultValues.fullname =
      existingUser.firstname && existingUser.lastname
        ? `${existingUser.firstname} ${existingUser.lastname}`
        : "";

    // Created By
    defaultValues.createdby = existingUser.createdby
      ? existingUser.createdby.userFullName +
      " - " +
      format(Number(existingUser.createddate), "MMMM dd, yyyy hh:mm a")
      : null;

    // Modified By
    defaultValues.modifiedby = existingUser.modifiedby
      ? existingUser.modifiedby.userFullName +
      " - " +
      format(Number(existingUser.modifieddate), "MMMM dd, yyyy hh:mm a")
      : null;
  }

  return defaultValues;
};


// Permission Set Initial Values

export const PermissionSetFormFields = () => {
  const fields = [
    {
      name: "permissionname", // Lowercase key
      label: "Permission Name",
      type: "text",
      xs: 12,
      md: 6,
      props: {
        placeholder: "Enter Permission Name",
      },
    },
    // {
    //   name: "userdetails", // Lowercase key
    //   label: "User Details",
    //   type: "autocomplete",
    //   xs: 12,
    //   md: 6,
    //   fetchurl: `/usersByName`,
    //   searchfor: "fullname",
    //   props: {
    //     placeholder: "Enter User Details",
    //   },
    // },
    {
      name: "department", // Lowercase key
      label: "Department",
      type: "select",
      xs: 12,
      md: 6,
      options: RolesDepartment, // Define or import rolesdepartment
      props: {
        placeholder: "Enter Department Name",
      },
    },

    {
      name: "roledetails", // Lowercase key
      label: "Role Details",
      type: "select",
      xs: 12,
      md: 6,
      options: RolesCategories, // Define or import userrolepicklist
      props: {
        placeholder: "Enter Role Details",
      },
    },
    {
      name: "permissionsets", // Lowercase key
      label: "Permission Sets",
      type: "section", // Indicates this is a separate section
      xs: 12,
      md: 12,
      sections: [
        {
          object: "Account",
          fields: [
            { name: "read", label: "Read", type: "checkbox" },
            { name: "create", label: "Create", type: "checkbox" },
            { name: "edit", label: "Edit", type: "checkbox" },
            { name: "delete", label: "Delete", type: "checkbox" },
          ],
        },
        {
          object: "Contact",
          fields: [
            { name: "read", label: "Read", type: "checkbox" },
            { name: "create", label: "Create", type: "checkbox" },
            { name: "edit", label: "Edit", type: "checkbox" },
            { name: "delete", label: "Delete", type: "checkbox" },
          ],
        },
        {
          object: "Deals",
          fields: [
            { name: "read", label: "Read", type: "checkbox" },
            { name: "create", label: "Create", type: "checkbox" },
            { name: "edit", label: "Edit", type: "checkbox" },
            { name: "delete", label: "Delete", type: "checkbox" },
          ],
        },
        {
          object: "Enquiry",
          fields: [
            { name: "read", label: "Read", type: "checkbox" },
            { name: "create", label: "Create", type: "checkbox" },
            { name: "edit", label: "Edit", type: "checkbox" },
            { name: "delete", label: "Delete", type: "checkbox" },
          ],
        },
        {
          object: "Inventory",
          fields: [
            { name: "read", label: "Read", type: "checkbox" },
            { name: "create", label: "Create", type: "checkbox" },
            { name: "edit", label: "Edit", type: "checkbox" },
            { name: "delete", label: "Delete", type: "checkbox" },
          ],
        },
        {
          object: "Event",
          fields: [
            { name: "read", label: "Read", type: "checkbox" },
            { name: "create", label: "Create", type: "checkbox" },
            { name: "edit", label: "Edit", type: "checkbox" },
            { name: "delete", label: "Delete", type: "checkbox" },
          ],
        },
      ],
    },
  ];

  return fields;
};

export const generatePermissionSetInitialValues = (existingPermissionSet = {}) => {
  console.log(existingPermissionSet, "existingPermissionSet from generatePermissionSetInitialValues");
  const defaultPermissionsets = [
    "Account",
    "Contact",
    "Deals",
    "Enquiry",
    "Inventory",
    "Event",
  ].map((object) => ({
    object,
    permissions: {
      read: false,
      create: false,
      edit: false,
      delete: false,
    },
    permissionLevel: 0,
  }));

  const defaultValues = PermissionSetFormFields().reduce((acc, field) => {
    if (field.name === "permissionsets") {
      acc.permissionsets = existingPermissionSet.permissionsets || defaultPermissionsets;
    } else {
      acc[field.name] = existingPermissionSet[field.name] ?? "";
    }
    return acc;
  }, {});

  if (Object.keys(existingPermissionSet).length > 0) {
    defaultValues.createddate = format(existingPermissionSet.createddate, "MM/dd/yyyy") || Date.now();
    defaultValues.modifieddate = format(existingPermissionSet.modifieddate, "MM/dd/yyyy") || Date.now();

    // Created By
    defaultValues.createdby = existingPermissionSet.createdby
      ? existingPermissionSet.createdby.userFullName +
      " - " +
      format(existingPermissionSet.createddate, "MMMM dd, yyyy hh:mm a")
      : null;

    // Modified By
    defaultValues.modifiedby = existingPermissionSet.modifiedby
      ? existingPermissionSet.modifiedby.userFullName +
      " - " +
      format(existingPermissionSet.modifieddate, "MMMM dd, yyyy hh:mm a")
      : null;
  }

  return defaultValues;
};

export const dashboardFormFields = (isEditing = false) => [
  {
    name: "_id",
    type: "hidden", // This field won't be visible in the form
  },
  {
    name: "dashboardName",
    label: "Dashboard Name",
    type: "text",
    required: true,
    xs: 12,
    validator: Yup.string()
      .required("Dashboard Name is Required")
      .max(50, "Dashboard Name must be less than 50 characters"),
  },
  {
    name: "objectName",
    label: "Select Object",
    type: "select",
    required: true,
    xs: 12,
    validator: Yup.string().required("Object Name is Required"),
    options: [] // Will be populated dynamically
  },
  {
    name: "selectedFields",
    label: "Select Fields",
    type: "multiselect",
    required: true,
    xs: 12,
    validator: Yup.array()
      .min(1, "At least one field must be selected")
      .max(2, "Maximum 2 fields can be selected"),
    options: [], // Will be populated dynamically
    dependsOn: {
      field: "objectName",
      optionsKey: "selectedFieldsOptions"
    },
    props: {
      limitTags: 2,
      SelectProps: {
        MenuProps: {
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5,
              width: 250,
            },
          },
        },
      },
    }
  },
  {
    name: "chartType",
    label: "Chart Type",
    type: "select",
    required: true,
    xs: 12,
    validator: Yup.string().required("Chart Type is Required"),
    options: [
      { value: "bar", label: "Bar Chart" },
      { value: "line", label: "Line Chart" },
      { value: "pie", label: "Pie Chart" }
    ]
  }
];
