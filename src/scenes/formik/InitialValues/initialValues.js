import * as Yup from 'yup';
import { format } from 'date-fns';
import { IndustryPickList, LeadMonthPicklist, LeadsDemoPicklist, LeadSourcePickList, LeadStatusPicklist } from '../../../data/pickLists';
import { Grid, Typography } from '@mui/material';

const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

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
      defaultValues.appointmentdate = format(existingLead.appointmentdate,'yyyy-MM-dd') ?? Date.now();
      defaultValues.createddate = format(existingLead.createddate,'MM/dd/yyyy') ?? Date.now();
      defaultValues.modifieddate = format(existingLead.modifieddate,'MM/dd/yyyy') ?? Date.now();
  
      // Created By
      defaultValues.createdby = existingLead.createdby
        ? existingLead.createdby.userFullName  + " " + format(existingLead.createddate,"MM/dd/yyyy")
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
        existingLead.modifiedby.userFullName  + " " + format(existingLead.modifieddate,"MM/dd/yyyy")
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