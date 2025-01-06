// src/modules/routes/index.js
import { lazy } from "react";
import { Navigate } from "react-router-dom";

// Lazy load components
const DashboardLayout = lazy(() => import("../shared/Layout/LoginLayoutIndex"));
const DashboardIndex = lazy(() => import("../dashboard/DashboardIndex"));
const LoginIndex = lazy(() => import("../login/LoginIndex"));
const SignUpIndex = lazy(() => import("../login/SignUpIndex"));
const ForgotPasswordIndex = lazy(() => import("../login/ForgotPasswordIndex"));
const ConfirmPasswordIndex = lazy(() =>
  import("../login/ConfirmPasswordIndex")
);
const OTPVerification = lazy(() => import("../login/OTPVerification"));
const NoUserNameFound = lazy(() => import("../login/NoUserFound"));
const Error404 = lazy(() => import("../shared/Error404"));

// Module components
const Accounts = lazy(() => import("../accounts/Accounts"));
const AccountDetailPage = lazy(() => import("../accounts/AccountDetailPage"));
const AccountDetailsWithRelatedItems = lazy(() =>
  import("../accounts/AccountDetailsWithRelatedItems")
);

const Contacts = lazy(() => import("../contacts/Contacts"));
const ContactDetailPage = lazy(() => import("../contacts/ContactDetailPage"));

const Opportunities = lazy(() => import("../opportunities/Opportunities"));
const OpportunityDetailPage = lazy(() =>
  import("../opportunities/OpportunityDetailPage")
);
const OpportunityDetailsWithRelatedItems = lazy(() =>
  import("../opportunities/OpportunityDetailsWithRelatedItems")
);

const Leads = lazy(() => import("../leads/Leads"));
const LeadDetailPage = lazy(() => import("../leads/LeadDetailPage"));
const LeadDetailsWithRelatedItems = lazy(() =>
  import("../leads/LeadDetailsWithRelatedItems")
);

const Inventories = lazy(() => import("../inventories/Inventories"));
const InventoryDetailPage = lazy(() =>
  import("../inventories/InventoryDetailPage")
);
const InventoryDetailsWithRelatedItems = lazy(() =>
  import("../inventories/InventoryDetailsWithRelatedItems")
);

const Tasks = lazy(() => import("../tasks/Tasks"));
const TaskDetailPage = lazy(() => import("../tasks/TaskDetailPage"));
const TaskDetailsWithRelatedItems = lazy(() =>
  import("../tasks/TaskDetailsWithRelatedItems")
);

const Users = lazy(() => import("../users/Users"));
const UserDetailPage = lazy(() => import("../users/UserDetailPage"));

const PermissionSets = lazy(() => import("../permissionSets/PermissionSets"));
const PermissionDetailPage = lazy(() =>
  import("../permissionSets/PermissionDetailPage")
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Module-specific routes
const accountRoutes = {
  path: "accounts",
  children: [
    { path: "", element: <Accounts /> },
    { path: "new", element: <AccountDetailPage /> },
    { path: ":id", element: <AccountDetailsWithRelatedItems /> },
  ],
};

const contactRoutes = {
  path: "contacts",
  children: [
    { path: "", element: <Contacts /> },
    { path: "new", element: <ContactDetailPage /> },
    { path: ":id", element: <ContactDetailPage /> },
  ],
};

const opportunityRoutes = {
  path: "opportunities",
  children: [
    { path: "", element: <Opportunities /> },
    { path: "new", element: <OpportunityDetailPage /> },
    { path: ":id", element: <OpportunityDetailsWithRelatedItems /> },
  ],
};

const leadRoutes = {
  path: "leads",
  children: [
    { path: "", element: <Leads /> },
    { path: "new", element: <LeadDetailPage /> },
    { path: ":id", element: <LeadDetailsWithRelatedItems /> },
  ],
};

const inventoryRoutes = {
  path: "inventories",
  children: [
    { path: "", element: <Inventories /> },
    { path: "new", element: <InventoryDetailPage /> },
    { path: ":id", element: <InventoryDetailsWithRelatedItems /> },
  ],
};

const taskRoutes = {
  path: "tasks",
  children: [
    { path: "", element: <Tasks /> },
    { path: "new", element: <TaskDetailPage /> },
    { path: ":id", element: <TaskDetailsWithRelatedItems /> },
  ],
};

const userRoutes = {
  path: "users",
  children: [
    { path: "", element: <Users /> },
    { path: "new", element: <UserDetailPage /> },
    { path: ":id", element: <UserDetailPage /> },
  ],
};

const permissionRoutes = {
  path: "permissions",
  children: [
    { path: "", element: <PermissionSets /> },
    { path: "new", element: <PermissionDetailPage /> },
    { path: ":id", element: <PermissionDetailPage /> },
  ],
};

// Main route configuration
export const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "", element: <DashboardIndex /> },
      { path: "dashboard", element: <DashboardIndex /> },
      accountRoutes,
      contactRoutes,
      opportunityRoutes,
      leadRoutes,
      inventoryRoutes,
      taskRoutes,
      userRoutes,
      permissionRoutes,
    ],
  },
  {
    path: "/",
    children: [
      { path: "login", element: <LoginIndex /> },
      { path: "sign-up", element: <SignUpIndex /> },
      { path: "forgot-password", element: <ForgotPasswordIndex /> },
      { path: "confirm-password", element: <ConfirmPasswordIndex /> },
      { path: "otp", element: <OTPVerification /> },
      { path: "noUserFound", element: <NoUserNameFound /> },
      { path: "*", element: <Error404 /> },
    ],
  },
];

export default routes;
