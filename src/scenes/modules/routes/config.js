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

// Private routes grouped by modules
export const privateRoutes = [
  // Accounts
  { path: "/accounts", element: Accounts },
  { path: "/accounts/new", element: AccountDetailPage },
  { path: "/accounts/:id", element: AccountDetailsWithRelatedItems },

  // Contacts
  { path: "/contacts", element: Contacts },
  { path: "/contacts/new", element: ContactDetailPage },
  { path: "/contacts/:id", element: ContactDetailPage },

  // Enquiries (Leads)
  { path: "/enquiries", element: Leads },
  { path: "/enquiries/new", element: LeadDetailPage },
  { path: "/enquiries/:id", element: LeadDetailsWithRelatedItems },

  // Deals (Opportunities)
  { path: "/deals", element: Opportunities },
  { path: "/deals/new", element: OpportunityDetailPage },
  { path: "/deals/:id", element: OpportunityDetailsWithRelatedItems },

  // Inventories
  { path: "/inventories", element: Inventories },
  { path: "/inventories/new", element: InventoryDetailPage },
  { path: "/inventories/:id", element: InventoryDetailsWithRelatedItems },

  // Events (Tasks)
  { path: "/events", element: Tasks },
  { path: "/events/new", element: TaskDetailPage },
  { path: "/events/:id", element: TaskDetailsWithRelatedItems },

  // Users
  { path: "/users", element: Users },
  { path: "/users/new", element: UserDetailPage },
  { path: "/users/:id", element: UserDetailPage },

  // Permissions
  { path: "/permissions", element: PermissionSets },
  { path: "/permissions/new", element: PermissionDetailPage },
  { path: "/permissions/:id", element: PermissionDetailPage },

  // Dashboard
  { path: "/", element: DashboardIndex },
  { path: "/dashboard", element: DashboardIndex },
];

// Auth routes
export const authRoutes = [
  { path: "/auth/login", element: LoginIndex },
  { path: "/auth/forgot-password", element: ForgotPasswordIndex },
  { path: "/auth/confirm-password", element: ConfirmPasswordIndex },
  { path: "/auth/verify-otp", element: OTPVerification },
];

// { path: "/auth/login", element: LoginIndex }, // Login page
// { path: "/auth/forgot-password", element: ForgotPasswordIndex }, // Forgot password page
// { path: "/auth/reset-password", element: ConfirmPasswordIndex }, // Reset password confirmation
// { path: "/auth/verify-otp", element: OTPVerification }, // OTP verification page
// { path: "/auth/user-not-found", element: NoUserNameFound },
