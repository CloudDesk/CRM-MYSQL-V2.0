import React from "react";
import OpportunityDetailPage from "./Forms/DealDetailPage";
import OpportunityRelatedItems from "./RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const OpportunityDetailsWithRelatedItems = (item) => {
  return (
    <FlexLayout
      DetailComponent={OpportunityDetailPage}
      RelatedItemsComponent={OpportunityRelatedItems}
    />
  )
};
export default OpportunityDetailsWithRelatedItems;
