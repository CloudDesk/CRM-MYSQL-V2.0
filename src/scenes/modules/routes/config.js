// import ContactDetailPage from "../contacts/Forms/ContactDetailPage";
// import AccountDetailPage from "../accounts/Forms/AccountDetailPage";
// import LeadDetailPage from "../leads/Forms/LeadDetailPage";
// import OpportunityDetailPage from "../opportunities/Forms/DealDetailPage";
// import InventoryDetailPage from "../inventories/Forms/InventoryDetailPage";
// import TaskDetailPage from "../tasks/Forms/TaskDetailPage";
// import UserDetailPage from "../users/Forms/UserDetailPage";
// import AccountDetailsWithRelatedItems from "../accounts/AccountDetailsWithRelatedItems";
// import InventoryDetailsWithRelatedItems from "../inventories/InventoryDetailsWithRelatedItems";
// import LeadDetailsWithRelatedItems from "../leads/LeadDetailsWithRelatedItems";
// import OpportunityDetailsWithRelatedItems from "../opportunities/OpportunityDetailsWithRelatedItems";
// import TaskDetailsWithRelatedItems from "../tasks/TaskDetailsWithRelatedItems";
// import PermissionDetailPage from "../permissionSets/Forms/PermissionDetailPage";
// import PermissionSets from "../permissionSets/index";
// import DashboardIndex from "../dashboard";
// import Leads from "../leads/index";
// import Opportunities from "../opportunities/index";
// import Accounts from "../accounts/index";
// import Contacts from "../contacts/index";
// import Inventories from "../inventories/index";
// import Tasks from "../tasks/index";
// import Users from "../users/index";
// import LoginIndex from "../login/LoginIndex";
// import ForgotPasswordIndex from "../login/ForgotPassword";
// import ConfirmPasswordIndex from "../login/ConfirmPasswordIndex";
// import NoUserNameFound from "../login/NoUserNameFound";
// import OTPVerification from "../login/OTPVerification";

// export const privateRoutes = [
//   { path: "/", element: DashboardIndex },
//   { path: "/list/account", element: Accounts },
//   { path: "/list/contact", element: Contacts },
//   { path: "/list/deals", element: Opportunities },
//   { path: "/list/enquiry", element: Leads },
//   { path: "/list/inventory", element: Inventories },
//   { path: "/list/event", element: Tasks },
//   { path: "/list/user", element: Users },
//   { path: "list/permissions", element: PermissionSets },
//   { path: "/list/dashboard", element: DashboardIndex },
//   { path: "/new-contacts", element: ContactDetailPage },
//   { path: "/new-users", element: UserDetailPage },
//   { path: "/new-task", element: TaskDetailPage },
//   { path: "/new-inventories", element: InventoryDetailPage },
//   { path: "/new-leads", element: LeadDetailPage },
//   { path: "/new-opportunities", element: OpportunityDetailPage },
//   { path: "/new-accounts", element: AccountDetailPage },
//   { path: "/new-permission", element: PermissionDetailPage },

//   { path: "/accountDetailPage/:id", element: AccountDetailsWithRelatedItems },
//   { path: "/taskDetailPage/:id", element: TaskDetailsWithRelatedItems },
//   {
//     path: "//inventoryDetailPage/:id",
//     element: InventoryDetailsWithRelatedItems,
//   },
//   { path: "/contactDetailPage/:id", element: ContactDetailPage },
//   { path: "/userDetailPage/:id", element: UserDetailPage },
//   { path: "/leadDetailPage/:id", element: LeadDetailsWithRelatedItems },
//   {
//     path: "/opportunityDetailPage/:id",
//     element: OpportunityDetailsWithRelatedItems,
//   },
//   { path: "/permissionDetailPage/:id", element: PermissionDetailPage },
// ];

// export const authRoutes = [
//   { path: "/auth/login", element: LoginIndex },
//   { path: "/auth/forgot-password", element: ForgotPasswordIndex },
//   { path: "/auth/confirm-password", element: ConfirmPasswordIndex },
//   { path: "/auth/otp", element: OTPVerification },
//   { path: "/auth/noUserFound", element: NoUserNameFound },
// ];

import { lazy } from "react";

// Module-specific lazy imports
const Accounts = lazy(() => import("../accounts/index"));
const AccountDetailPage = lazy(() =>
  import("../accounts/Forms/AccountDetailPage")
);
const AccountDetailsWithRelatedItems = lazy(() =>
  import("../accounts/AccountDetailsWithRelatedItems")
);

const Contacts = lazy(() => import("../contacts/index"));
const ContactDetailPage = lazy(() =>
  import("../contacts/Forms/ContactDetailPage")
);

const Leads = lazy(() => import("../leads/index"));
const LeadDetailPage = lazy(() => import("../leads/Forms/LeadDetailPage"));
const LeadDetailsWithRelatedItems = lazy(() =>
  import("../leads/LeadDetailsWithRelatedItems")
);

const Opportunities = lazy(() => import("../opportunities/index"));
const OpportunityDetailPage = lazy(() =>
  import("../opportunities/Forms/DealDetailPage")
);
const OpportunityDetailsWithRelatedItems = lazy(() =>
  import("../opportunities/OpportunityDetailsWithRelatedItems")
);

const Inventories = lazy(() => import("../inventories/index"));
const InventoryDetailPage = lazy(() =>
  import("../inventories/Forms/InventoryDetailPage")
);
const InventoryDetailsWithRelatedItems = lazy(() =>
  import("../inventories/InventoryDetailsWithRelatedItems")
);

const Tasks = lazy(() => import("../tasks/index"));
const TaskDetailPage = lazy(() => import("../tasks/Forms/TaskDetailPage"));
const TaskDetailsWithRelatedItems = lazy(() =>
  import("../tasks/TaskDetailsWithRelatedItems")
);

const Users = lazy(() => import("../users/index"));
const UserDetailPage = lazy(() => import("../users/Forms/UserDetailPage"));

const PermissionSets = lazy(() => import("../permissionSets/index"));
const PermissionDetailPage = lazy(() =>
  import("../permissionSets/Forms/PermissionDetailPage")
);

const DashboardIndex = lazy(() => import("../dashboard"));
const LoginIndex = lazy(() => import("../login/LoginIndex"));
const ForgotPasswordIndex = lazy(() => import("../login/ForgotPassword"));
const ConfirmPasswordIndex = lazy(() =>
  import("../login/ConfirmPasswordIndex")
);
const OTPVerification = lazy(() => import("../login/OTPVerification"));
const NoUserNameFound = lazy(() => import("../login/NoUserNameFound"));

// Private routes grouped by modules
export const privateRoutes = [
  // Accounts
  { path: "/list/account", element: Accounts },
  { path: "/new-accounts", element: AccountDetailPage },
  { path: "/accountDetailPage/:id", element: AccountDetailsWithRelatedItems },

  // Contacts
  { path: "/list/contact", element: Contacts },
  { path: "/new-contacts", element: ContactDetailPage },

  // Leads
  { path: "/list/enquiry", element: Leads },
  { path: "/new-leads", element: LeadDetailPage },
  { path: "/leadDetailPage/:id", element: LeadDetailsWithRelatedItems },

  // Opportunities
  { path: "/list/deals", element: Opportunities },
  { path: "/new-opportunities", element: OpportunityDetailPage },
  {
    path: "/opportunityDetailPage/:id",
    element: OpportunityDetailsWithRelatedItems,
  },

  // Inventories
  { path: "/list/inventory", element: Inventories },
  { path: "/new-inventories", element: InventoryDetailPage },
  {
    path: "/inventoryDetailPage/:id",
    element: InventoryDetailsWithRelatedItems,
  },

  // Tasks
  { path: "/list/event", element: Tasks },
  { path: "/new-task", element: TaskDetailPage },
  { path: "/taskDetailPage/:id", element: TaskDetailsWithRelatedItems },

  // Users
  { path: "/list/user", element: Users },
  { path: "/new-users", element: UserDetailPage },

  // Permissions
  { path: "/list/permissions", element: PermissionSets },
  { path: "/new-permission", element: PermissionDetailPage },
  { path: "/permissionDetailPage/:id", element: PermissionDetailPage },

  // Dashboard
  { path: "/", element: DashboardIndex },
  { path: "/list/dashboard", element: DashboardIndex },
];

// Auth routes
export const authRoutes = [
  { path: "/auth/login", element: LoginIndex },
  { path: "/auth/forgot-password", element: ForgotPasswordIndex },
  { path: "/auth/confirm-password", element: ConfirmPasswordIndex },
  { path: "/auth/otp", element: OTPVerification },
  { path: "/auth/noUserFound", element: NoUserNameFound },
];
