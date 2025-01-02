import { formatCurrency } from "../../../utility/formatCurrency";

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
