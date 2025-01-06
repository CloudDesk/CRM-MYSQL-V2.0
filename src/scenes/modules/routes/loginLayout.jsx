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
