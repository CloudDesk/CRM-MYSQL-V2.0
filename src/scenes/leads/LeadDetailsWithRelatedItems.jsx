import React from "react";
import LeadDetailPage from "./Forms/LeadDetailPage";
import LeadRelatedItems from "./RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const LeadDetailsWithRelatedItems = () => {
  return (
    <FlexLayout
      DetailComponent={LeadDetailPage}
      RelatedItemsComponent={LeadRelatedItems}
    />
  )
};
export default LeadDetailsWithRelatedItems;
