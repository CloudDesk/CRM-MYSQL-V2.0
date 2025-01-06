/*import React from "react";


import { Route } from "react-router-dom";
import DashboardIndex from "./scenes/modules/dashboard/index";
import Accounts from "./scenes/modules/accounts/index";
import Contacts from "./scenes/modules/contacts/index";
import Opportunities from "./scenes/modules/opportunities/index";
import Leads from "./scenes/modules/leads/index";
import Inventories from "./scenes/modules/inventories/index";
import Tasks from "./scenes/modules/tasks/index";
import Users from "./scenes/modules/users/index";
import PermissionSets from "./scenes/modules/permissionSets/index";
import ContactDetailPage from "./scenes/modules/contacts/Forms/ContactDetailPage";
import UserDetailPage from "./scenes/modules/users/Forms/UserDetailPage";
import TaskDetailPage from "./scenes/modules/tasks/Forms/TaskDetailPage";
import InventoryDetailPage from "./scenes/modules/inventories/Forms/InventoryDetailPage";
import LeadDetailPage from "./scenes/modules/leads/Forms/LeadDetailPage";
import OpportunityDetailPage from "./scenes/modules/opportunities/Forms/DealDetailPage";
import AccountDetailPage from "./scenes/modules/accounts/Forms/AccountDetailPage";
import PermissionDetailPage from "./scenes/modules/permissionSets/Forms/PermissionDetailPage";
import Error404 from "./components/UI/Error/Error404";

import LoginIndex from "./scenes/modules/login/LoginIndex";
import SignUpIndex from "./scenes/modules/login/SignUpIndex";
import ForgotPasswordIndex from "./scenes/modules/login/ForgotPassword";
import ConfirmPasswordIndex from "./scenes/modules/login/ConfirmPasswordIndex";
import NoUserNameFound from "./scenes/modules/login/NoUserNameFound";
import OTPVerification from "./scenes/modules/login/OTPVerification";

export const authenticatedRoutes = [
  <Route path="/" exact element={<DashboardIndex />} />,
  <Route path="/list/account" element={<Accounts />} />,
  <Route path="/list/contact" element={<Contacts />} />,
  <Route path="/list/deals" element={<Opportunities />} />,
  <Route path="/list/enquiry" element={<Leads />} />,
  <Route path="/list/inventory" element={<Inventories />} />,
  <Route path="/list/event" element={<Tasks />} />,
  <Route path="/list/user" element={<Users />} />,
  <Route path="/list/permissions" element={<PermissionSets />} />,
  <Route path="/new-contacts" element={<ContactDetailPage />} />,
  <Route path="/new-users" element={<UserDetailPage />} />,
  <Route path="/new-task" element={<TaskDetailPage />} />,
  <Route path="/new-inventories" element={<InventoryDetailPage />} />,
  <Route path="/new-leads" element={<LeadDetailPage />} />,
  <Route path="/new-opportunities" element={<OpportunityDetailPage />} />,
  <Route path="/new-accounts" element={<AccountDetailPage />} />,
  <Route path="/new-permission" element={<PermissionDetailPage />} />,
  <Route path="*" element={<Error404 />} />,
];

export const unauthenticatedRoutes = [
  <Route path="/" element={<LoginIndex />} />,
  <Route path="/sign-up" element={<SignUpIndex />} />,
  <Route path="/forgot-password" element={<ForgotPasswordIndex />} />,
  <Route path="/confirm-password" element={<ConfirmPasswordIndex />} />,
  <Route path="/noUserFound" element={<NoUserNameFound />} />,
  <Route path="/otp" element={<OTPVerification />} />,
];
*/

import { lazy } from "react";

// Lazy load components for authenticated routes

const Dashboard = lazy(() => import("./scenes/modules/dashboard"));
const Accounts = lazy(() => import("./scenes/modules/accounts"));
const Contacts = lazy(() => import("./scenes/modules/contacts"));
const Opportunities = lazy(() => import("./scenes/modules/opportunities"));
const Leads = lazy(() => import("./scenes/modules/leads"));
const Inventories = lazy(() => import("./scenes/modules/inventories"));
const Tasks = lazy(() => import("./scenes/modules/tasks"));
const Users = lazy(() => import("./scenes/modules/users"));
const PermissionSets = lazy(() => import("./scenes/modules/permissionSets"));

// Lazy load form components
const ContactDetailPage = lazy(() =>
  import("./scenes/modules/contacts/Forms/ContactDetailPage")
);
const AccountDetailPage = lazy(() =>
  import("./scenes/modules/accounts/Forms/AccountDetailPage")
);
const LeadDetailPage = lazy(() =>
  import("./scenes/modules/leads/Forms/LeadDetailPage")
);
const OpportunityDetailPage = lazy(() =>
  import("./scenes/modules/opportunities/Forms/DealDetailPage")
);
const InventoryDetailPage = lazy(() =>
  import("./scenes/modules/inventories/Forms/InventoryDetailPage")
);
const TaskDetailPage = lazy(() =>
  import("./scenes/modules/tasks/Forms/TaskDetailPage")
);
const UserDetailPage = lazy(() =>
  import("./scenes/modules/users/Forms/UserDetailPage")
);
const PermissionDetailPage = lazy(() =>
  import("./scenes/modules/permissionSets/Forms/PermissionDetailPage")
);

// Lazy load detail pages with related items
const AccountDetailsWithRelatedItems = lazy(() =>
  import("./scenes/modules/accounts/AccountDetailsWithRelatedItems")
);
const InventoryDetailsWithRelatedItems = lazy(() =>
  import("./scenes/modules/inventories/InventoryDetailsWithRelatedItems")
);
const LeadDetailsWithRelatedItems = lazy(() =>
  import("./scenes/modules/leads/LeadDetailsWithRelatedItems")
);
const OpportunityDetailsWithRelatedItems = lazy(() =>
  import("./scenes/modules/opportunities/OpportunityDetailsWithRelatedItems")
);
const TaskDetailsWithRelatedItems = lazy(() =>
  import("./scenes/modules/tasks/TaskDetailsWithRelatedItems")
);

// Lazy load auth components
const LoginIndex = lazy(() => import("./scenes/modules/login/LoginIndex"));
const SignUpIndex = lazy(() => import("./scenes/modules/login/SignUpIndex"));
const ForgotPasswordIndex = lazy(() =>
  import("./scenes/modules/login/ForgotPassword")
);
const ConfirmPasswordIndex = lazy(() =>
  import("./scenes/modules/login/ConfirmPasswordIndex")
);
const NoUserNameFound = lazy(() =>
  import("./scenes/modules/login/NoUserNameFound")
);
const OTPVerification = lazy(() =>
  import("./scenes/modules/login/OTPVerification")
);

export const authenticatedRoutes = [
  { path: "/", element: Dashboard },
  { path: "/list/account", element: Accounts },
  { path: "/list/contact", element: Contacts },
  { path: "/list/deals", element: Opportunities },
  { path: "/list/enquiry", element: Leads },
  { path: "/list/inventory", element: Inventories },
  { path: "/list/event", element: Tasks },
  { path: "/list/user", element: Users },
  { path: "/list/permissions", element: PermissionSets },
  { path: "/list/dashboard", element: Dashboard },

  // Form routes
  { path: "/new-contacts", element: ContactDetailPage },
  { path: "/new-users", element: UserDetailPage },
  { path: "/new-task", element: TaskDetailPage },
  { path: "/new-inventories", element: InventoryDetailPage },
  { path: "/new-leads", element: LeadDetailPage },
  { path: "/new-opportunities", element: OpportunityDetailPage },
  { path: "/new-accounts", element: AccountDetailPage },
  { path: "/new-permission", element: PermissionDetailPage },

  // Detail routes
  { path: "/accountDetailPage/:id", element: AccountDetailsWithRelatedItems },
  { path: "/taskDetailPage/:id", element: TaskDetailsWithRelatedItems },
  {
    path: "/inventoryDetailPage/:id",
    element: InventoryDetailsWithRelatedItems,
  },
  { path: "/contactDetailPage/:id", element: ContactDetailPage },
  { path: "/userDetailPage/:id", element: UserDetailPage },
  { path: "/leadDetailPage/:id", element: LeadDetailsWithRelatedItems },
  {
    path: "/opportunityDetailPage/:id",
    element: OpportunityDetailsWithRelatedItems,
  },
  { path: "/permissionDetailPage/:id", element: PermissionDetailPage },
];

export const unauthenticatedRoutes = [
  { path: "/", element: LoginIndex },
  { path: "/sign-up", element: SignUpIndex },
  { path: "/forgot-password", element: ForgotPasswordIndex },
  { path: "/confirm-password", element: ConfirmPasswordIndex },
  { path: "/noUserFound", element: NoUserNameFound },
  { path: "/otp", element: OTPVerification },
];
