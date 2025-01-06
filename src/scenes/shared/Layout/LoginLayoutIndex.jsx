import React from "react";
import { Routes, Route } from "react-router-dom";
import ContactDetailPage from "../../modules/contacts/Forms/ContactDetailPage";
import AccountDetailPage from "../../modules/accounts/Forms/AccountDetailPage";
import LeadDetailPage from "../../modules/leads/Forms/LeadDetailPage";
import OpportunityDetailPage from "../../modules/opportunities/Forms/DealDetailPage";
import InventoryDetailPage from "../../modules/inventories/Forms/InventoryDetailPage";
import TaskDetailPage from "../../modules/tasks/Forms/TaskDetailPage";
import UserDetailPage from "../../modules/users/Forms/UserDetailPage";
import AccountDetailsWithRelatedItems from "../../modules/accounts/AccountDetailsWithRelatedItems";
import InventoryDetailsWithRelatedItems from "../../modules/inventories/InventoryDetailsWithRelatedItems";
import LeadDetailsWithRelatedItems from "../../modules/leads/LeadDetailsWithRelatedItems";
import OpportunityDetailsWithRelatedItems from "../../modules/opportunities/OpportunityDetailsWithRelatedItems";
import TaskDetailsWithRelatedItems from "../../modules/tasks/TaskDetailsWithRelatedItems";
import PermissionDetailPage from "../../modules/permissionSets/Forms/PermissionDetailPage";
import PermissionSets from "../../modules/permissionSets/index"
import DashboardIndex from "../../modules/dashboard";
import Leads from "../../modules/leads/index";
import Opportunities from "../../modules/opportunities/index";
import Accounts from "../../modules/accounts/index";
import Contacts from "../../modules/contacts/index";
import Inventories from '../../modules/inventories/index'
import Tasks from "../../modules/tasks/index";
import Users from "../../modules/users/index";
import Error404 from "../../../components/UI/Error/Error404";
function LoginLayoutIndex(props) {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<DashboardIndex />} />
        <Route path="/list/account" element={<Accounts />} />
        <Route path="/list/contact" element={<Contacts />} />
        <Route path="/list/deals" element={<Opportunities />} />
        <Route path="/list/enquiry" element={<Leads />} />
        <Route path="/list/inventory" element={<Inventories />} />
        <Route path="/list/event" element={<Tasks />} />
        <Route path="/list/user" element={<Users />} />
        <Route path="/list/permissions" element={<PermissionSets />} />
        <Route path="/list/dashboard" element={<DashboardIndex />} />

        <Route path="/new-contacts" element={<ContactDetailPage />} />
        <Route path="/new-users" element={<UserDetailPage />} />
        <Route path="/new-task" element={<TaskDetailPage />} />
        <Route path="/new-inventories" element={<InventoryDetailPage />} />
        <Route path="/new-leads" element={<LeadDetailPage />} />
        <Route path="/new-opportunities" element={<OpportunityDetailPage />} />
        <Route path="/new-accounts" element={<AccountDetailPage />} />
        <Route path="/new-permission" element={<PermissionDetailPage />} />

        <Route path="/accountDetailPage/:id" element={<AccountDetailsWithRelatedItems />} />
        <Route path="/taskDetailPage/:id" element={<TaskDetailsWithRelatedItems />} />
        <Route path="/inventoryDetailPage/:id" element={<InventoryDetailsWithRelatedItems />} />
        <Route path="/contactDetailPage/:id" element={<ContactDetailPage />} />
        <Route path="/userDetailPage/:id" element={<UserDetailPage />} />
        <Route path="/leadDetailPage/:id" element={<LeadDetailsWithRelatedItems />} />
        <Route
          path="/opportunityDetailPage/:id"
          element={<OpportunityDetailsWithRelatedItems />}
        />
        <Route
          path="/permissionDetailPage/:id"
          element={<PermissionDetailPage />}
        />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
}

export default LoginLayoutIndex;
