import React from "react";
import LeadDetailPage from "./Forms/LeadDetailPage";
import LeadRelatedItems from "./RelatedItems";
import FlexiblePageLayout from "../../../components/common/layout/FlexiblePageLayout";

const LeadDetailsWithRelatedItems = () => {
  return (
    <FlexiblePageLayout
      DetailComponent={LeadDetailPage}
      RelatedItemsComponent={LeadRelatedItems}
    />
  )
};
export default LeadDetailsWithRelatedItems;
