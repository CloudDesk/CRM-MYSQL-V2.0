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

/*Old code -LoginLayoutIndex
import React from "react";
import { Routes, Route } from "react-router-dom";
import ContactDetailPage from "../contacts/Forms/ContactDetailPage";
import AccountDetailPage from "../accounts/Forms/AccountDetailPage";
import LeadDetailPage from "../leads/Forms/LeadDetailPage";
import OpportunityDetailPage from "../opportunities/Forms/DealDetailPage";
import InventoryDetailPage from "../inventories/Forms/InventoryDetailPage";
import TaskDetailPage from "../tasks/Forms/TaskDetailPage";
import UserDetailPage from "../users/Forms/UserDetailPage";
import AccountDetailsWithRelatedItems from "../accounts/AccountDetailsWithRelatedItems";
import InventoryDetailsWithRelatedItems from "../inventories/InventoryDetailsWithRelatedItems";
import LeadDetailsWithRelatedItems from "../leads/LeadDetailsWithRelatedItems";
import OpportunityDetailsWithRelatedItems from "../opportunities/OpportunityDetailsWithRelatedItems";
import TaskDetailsWithRelatedItems from "../tasks/TaskDetailsWithRelatedItems";
import PermissionDetailPage from "../permissionSets/Forms/PermissionDetailPage";
import PermissionSets from "../permissionSets/index"
import DashboardIndex from "../dashboard";
import Leads from "../leads/index";
import Opportunities from "../opportunities/index";
import Accounts from "../accounts/index";
import Contacts from "../contacts/index";
import Inventories from '../inventories/index'
import Tasks from "../tasks/index";
import Users from "../users/index";
import Error404 from "../../../components/UI/Error/Error404";
function LoginLayoutIndex(props) {
    return (
        <>
            <Routes>
                <Route path="/" exact element={<DashboardIndex />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/deals" element={<Opportunities />} />
                <Route path="/enquiries" element={<Leads />} />
                <Route path="/inventories" element={<Inventories />} />
                <Route path="/events" element={<Tasks />} />
                <Route path="/users" element={<Users />} />
                <Route path="/permissions" element={<PermissionSets />} />
                <Route path="/dashboard" element={<DashboardIndex />} />

                <Route path="/contacts/new" element={<ContactDetailPage />} />
                <Route path="/users/new" element={<UserDetailPage />} />
                <Route path="/events/new" element={<TaskDetailPage />} />
                <Route path="/inventories/new" element={<InventoryDetailPage />} />
                <Route path="/enquiries/new" element={<LeadDetailPage />} />
                <Route path="/deals/new" element={<OpportunityDetailPage />} />
                <Route path="/accounts/new" element={<AccountDetailPage />} />
                <Route path="/permissions/new" element={<PermissionDetailPage />} />

                <Route path="/accounts/:id" element={<AccountDetailsWithRelatedItems />} />
                <Route path="/events/:id" element={<TaskDetailsWithRelatedItems />} />
                <Route path="/inventories/:id" element={<InventoryDetailsWithRelatedItems />} />
                <Route path="/contacts/:id" element={<ContactDetailPage />} />
                <Route path="/users/:id" element={<UserDetailPage />} />
                <Route path="/enquiries/:id" element={<LeadDetailsWithRelatedItems />} />
                <Route
                    path="/deals/:id"
                    element={<OpportunityDetailsWithRelatedItems />}
                />
                <Route
                    path="/permissions/:id"
                    element={<PermissionDetailPage />}
                />
                <Route path="*" element={<Error404 />} />
            </Routes>
        </>
    );
}

export default LoginLayoutIndex;

*/

/* Old Code -LogoutLayoutIndex
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginIndex from "../login/LoginIndex";
import ForgotPasswordIndex from "../login/ForgotPassword";
import ConfirmPasswordIndex from "../login/ConfirmPasswordIndex";
import OTPVerification from "../login/OTPVerification";

function LogoutLayoutIndex() {
    const navigate = useNavigate();
    const handleAuthentication = () => {
        navigate("/");
    };

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={<LoginIndex onAuthentication={handleAuthentication} />}
                />
                <Route path="/forgot-password" element={<ForgotPasswordIndex />} />
                <Route path="/confirm-password" element={<ConfirmPasswordIndex />} />
                <Route path="/otp" element={<OTPVerification />} />
            </Routes>
        </>
    );
}

export default LogoutLayoutIndex;


*/
