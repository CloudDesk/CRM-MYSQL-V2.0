import { formatCurrency } from "../utils/formatCurrency";

export const ACCOUNT_TABLE_CONFIG = {
  mobileFields: [
    {
      key: "accountname",
      label: "Name",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "billingcity",
      label: "City",
    },
    {
      key: "industry",
      label: "Industry",
    },
  ],
  columns: [
    {
      field: "accountname",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "billingcity",
      headerName: "City",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "annualrevenue",
      headerName: "Annual Revenue",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => formatCurrency(params.row.annualrevenue),
    },
    {
      field: "industry",
      headerName: "Industry",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};

export const CONTACT_TABLE_CONFIG = {
  mobileFields: [
    {
      key: "lastname",
      label: "Last Name",
    },
    {
      key: "accountname",
      label: "Account Name",
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "email",
      label: "Email",
    },
  ],
  columns: [
    {
      field: "lastname",
      headerName: "Last Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "accountname",
      headerName: "Account Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row.accountname) {
          return (
            <div className="rowitem">
              {params.row.accountname.startsWith("{")
                ? JSON.parse(params.row.accountname).label
                : params.row.accountname || ""}
            </div>
          );
        }
        return <div className="rowitem">{null}</div>;
      },
    },
    {
      field: "phone",
      headerName: "Phone",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadsource",
      headerName: "Lead Source",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};

export const INVENTORY_TABLE_CONFIG = {
  mobileFields: [
    { label: "Project Name", key: "projectname" },
    { label: "Property Name", key: "propertyname" },
    { label: "Type", key: "type" },
    { label: "Status", key: "status" },
  ],
  columns: [
    {
      field: "projectname",
      headerName: "Project Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "propertyname",
      headerName: "Property Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "type",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "country",
      headerName: "Country",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
      cellClassName: (params) => {
        const statusMap = {
          Available: "inventory-status-avail-green",
          Booked: "inventory-status-booked-pink",
          Sold: "inventory-status-sold-red",
          Processed: "inventory-status-process-yellow",
        };
        return statusMap[params.row.status] || "";
      },
    },
  ],
};

export const LEAD_TABLE_CONFIG = {
  mobileFields: [
    { label: "Enquiry Name", key: "fullname" },
    { label: "Lead Source", key: "leadsource" },
    { label: "Lead Status", key: "leadstatus" },
    { label: "Email", key: "email" },
  ],
  columns: [
    {
      field: "fullname",
      headerName: "Full Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadsource",
      headerName: "Enquiry Source",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "industry",
      headerName: "Industry",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "leadstatus",
      headerName: "Enquiry Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};

export const OPPORTUNITY_TABLE_CONFIG = {
  mobileFields: [
    {
      key: "opportunityname",
      label: "Deal Name",
    },
    {
      key: "propertyname",
      label: "Inventory Name",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "stage",
      label: "Stage",
    },
  ],
  columns: [
    {
      field: "opportunityname",
      headerName: "Deal Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "propertyname",
      headerName: "Inventory Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        if (params.row.inventoryname) {
          return (
            <div className="rowitem">
              {params.row.inventoryname.startsWith("{")
                ? JSON.parse(params.row.inventoryname).label
                : params.row.inventoryname || ""}
            </div>
          );
        } else {
          return <div className="rowitem">{null}</div>;
        }
      },
    },
    {
      field: "type",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Opportunity Amount",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        const formatCurrency = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
        });
        return formatCurrency.format(params.row.amount);
      },
    },
    {
      field: "stage",
      headerName: "Stage",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};

export const PERMISSION_TABLE_CONFIG = {
  mobileFields: [
    { label: "Permission Name", key: "permissionname" },
    { label: "Department Name", key: "department" },
    {
      label: "Role",
      key: "roledetails",
      render: (value) => {
        try {
          return value || "---";
        } catch (error) {
          return "Invalid Format";
        }
      },
    },
  ],
  columns: [
    {
      field: "permissionname",
      headerName: "Permission Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "department",
      headerName: "Department Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "roledetails",
      headerName: "Role",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        try {
          return <div className="rowitem">{params.value || "---"}</div>;
        } catch (error) {
          return <div className="rowitem">Invalid Format</div>;
        }
      },
    },
  ],
};

export const TASK_TABLE_CONFIG = {
  mobileFields: [
    { label: "Subject", key: "subject" },
    {
      label: "Related To",
      key: "realatedto",
      render: (value, row) => {
        if (row?.object === "Account") return row?.accountname;
        if (row?.object === "Enquiry") return row?.leadname;
        if (row?.object === "Deals") return row?.opportunityname;
        return "---";
      },
    },
    { label: "Object", key: "object" },
  ],
  columns: [
    {
      field: "subject",
      headerName: "Subject",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "realatedto",
      headerName: "Related To",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => {
        console.log(params, "params from related to bind");
        if (params.row?.object === "Account") {
          // return <div className="rowitem">{params.row?.accountname}</div>;
          return <div className="rowitem">{params.row?.relatedto}</div>;
        } else if (params.row?.object === "Enquiry") {
          // return <div className="rowitem">{params.row?.leadname}</div>;
          return <div className="rowitem">{params.row?.relatedto}</div>;
        } else if (params.row.object === "Deals") {
          // return <div className="rowitem">{params.row?.opportunityname}</div>;
          return <div className="rowitem">{params.row?.relatedto}</div>;
        }
        return <div className="rowitem">---</div>;
      },
    },
    {
      field: "object",
      headerName: "Object",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};

export const USER_TABLE_CONFIG = {
  mobileFields: [
    { label: "First Name", key: "firstname" },
    { label: "Last Name", key: "lastname" },
    { label: "Email", key: "email" },
    { label: "Role", key: "roledetails" },
  ],
  columns: [
    {
      field: "firstname",
      headerName: "First Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "lastname",
      headerName: "Last Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "roledetails",
      headerName: "Role",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "departmentname",
      headerName: "Department",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ],
};
