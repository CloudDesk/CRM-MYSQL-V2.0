import React from "react";
import LeadDetailPage from "../leads/Forms/LeadDetailPage";
import LeadRelatedItems from "../leads/RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const FlexLeads = () => {
  return (
    <FlexLayout
      DetailComponent={LeadDetailPage}
      RelatedItemsComponent={LeadRelatedItems}
    />
  )
};
export default FlexLeads;
