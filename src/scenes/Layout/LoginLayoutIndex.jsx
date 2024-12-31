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
import FileUploadUpdated from "../fileUpload/FileUpdated";
import RoleDetailPage from "../recordDetailPage/RoleDetailPage";
import PermissionDetailPage from "../permissionSets/Forms/PermissionDetailPage";
import PermissionSets from "../permissionSets";
import PageNotFound from "../Errors/PageNotFound";
import { DashboardIndex } from "../dashboard/Dashboards";
import Leads from "../leads";
import Opportunities from "../opportunities";
import Accounts from "../accounts";
import Contacts from "../contacts";
import Inventories from "../inventories";
import Tasks from "../tasks";
import Users from "../users";

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
        <Route path="/new-role" element={<RoleDetailPage />} />
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
        <Route path="/roleDetailPage/:id" element={<RoleDetailPage />} />
        <Route
          path="/permissionDetailPage/:id"
          element={<PermissionDetailPage />}
        />

        <Route path="/file" element={<FileUploadUpdated />} />
        <Route path="*" element={<PageNotFound />} />


        {/* <Route path="/list/file" element={<Files />} /> */}
        {/* <Route path="/list/role" element={<RoleIndex />} /> */}
        {/* <Route path="/leadDetailPage/:Id" element={<LeadDetailPage/>} /> */}
        {/* <Route path="/accountDetailPage/:id" element={<FlexAccounts/>} /> */}
        {/* <Route path="/dataLoader" element={<DataLoadPage />} /> */}
        {/* <Route path='/mobi' element={<AccountsMobile/>} /> */}
        {/* <Route path='/invmobi' element={<InventoriesMobile/>} />  */}
        {/* <Route path ='/test' element={<ResponsiveScreen/>} />   */}
      </Routes>
    </>
  );
}

export default LoginLayoutIndex;
