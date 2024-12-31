import React from "react";
import OpportunityDetailPage from "./Forms/DealDetailPage";
import OpportunityRelatedItems from "./RelatedItems";
import FlexiblePageLayout from "../../components/common/layout/FlexiblePageLayout";

const OpportunityDetailsWithRelatedItems = (item) => {
  return (
    <FlexiblePageLayout
      DetailComponent={OpportunityDetailPage}
      RelatedItemsComponent={OpportunityRelatedItems}
    />
  )
};
export default OpportunityDetailsWithRelatedItems;
