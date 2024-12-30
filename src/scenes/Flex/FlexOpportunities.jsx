import React from "react";
import OpportunityDetailPage from "../opportunities/Forms/DealDetailPage";
import OpportunityRelatedItems from "../opportunities/RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const FlexOpportunities = (item) => {
  return (
    <FlexLayout
      DetailComponent={OpportunityDetailPage}
      RelatedItemsComponent={OpportunityRelatedItems}
    />
  )
};
export default FlexOpportunities;
