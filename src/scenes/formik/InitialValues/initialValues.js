import * as Yup from 'yup';
import { format } from 'date-fns';
import { AccRatingPickList, AccTypePickList, IndustryPickList, LeadMonthPicklist, LeadsDemoPicklist, LeadSourcePickList, LeadStatusPicklist, OppStagePicklist, OppTypePicklist } from '../../../data/pickLists';
import { Grid, Typography } from '@mui/material';
import { FetchInventoryData } from '../../../utility/FetchData/FetchInventoryData';

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
    label: 'Lead Source',
    type: 'select',
    xs: 12,
    md: 6,
    options: LeadSourcePickList
  },
  {
    name: 'leadstatus',
    label: 'Lead Status',
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
    console.log(existingLead,"existingLead");
    const defaultValues = leadFormFields.reduce((acc, field) => {
      // Check if value exists in existing lead, otherwise use empty string or default
      acc[field.name] = existingLead[field.name] ?? '';
      return acc;
    }, {});

  
    // Add metadata values only if editing an existing lead
    if (Object.keys(existingLead).length > 0) {

      // Timestamps
      defaultValues.appointmentdate = (existingLead?.appointmentdate !== null && format(existingLead?.appointmentdate,'yyyy-MM-dd')) ?? Date.now();
      defaultValues.createddate = format(existingLead.createddate,'MM/dd/yyyy') ?? Date.now();
      defaultValues.modifieddate = format(existingLead.modifieddate,'MM/dd/yyyy') ?? Date.now();
  
      // Created By
      defaultValues.createdby = existingLead.createdby
        ? existingLead.createdby.userFullName  + " - " + format(existingLead.createddate,"MMMM dd, yyyy hh:mm a")
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
        existingLead.modifiedby.userFullName  + " - " + format(existingLead.modifieddate,"MMMM dd, yyyy hh:mm a")
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
        name:"inventoryname",
        label:"Inventory Name",
        type:"autocomplete",
        xs:12,
        md:6,
        fetchurl: `/InventoryName`,
        searchfor: "propertyname",
        options: [],
        props:{
            placeholder:"Enter Inventory Name"
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
        name:"leadname",
        label:"Enquiry Name",
        type:"autocomplete",
        fetchurl:"/LeadsbyName",
        searchfor:"fullname",
        xs:12,
        md:6,
        props:{
            placeholder:"Enter Enquiry Name"
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
    console.log(existingOpportunity,"existingOpportunity from generateOpportunityInitialValues");
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
      if(existingOpportunity.inventoryname !== null){
        defaultValues.inventoryname = existingOpportunity.inventoryname.startsWith("{") 
        ? JSON.parse(existingOpportunity.inventoryname).label || existingOpportunity.inventoryname 
        : existingOpportunity.inventoryname;
            }
        if(existingOpportunity.leadname !== null){
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
      name:'inventoryname',
      label:'Inventory Name',
      type:'autocomplete',
      xs:12,
      md:6,
      fetchurl:`/InventoryName`,
      searchfor:"propertyname",
      options:[],

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
    console.log(existingAccount,"existingAccount from generateAccountInitialValues");
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
  