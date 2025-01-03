import React from "react";
import InventoryDetailPage from "./Forms/InventoryDetailPage";
import InventoryRelatedItems from "./RelatedItems";
import FlexiblePageLayout from "../../../components/common/layout/FlexiblePageLayout";

const InventoryDetailsWithRelatedItems = () => {
  return (
    <FlexiblePageLayout
      DetailComponent={InventoryDetailPage}
      RelatedItemsComponent={InventoryRelatedItems}
    />
  )
}
export default InventoryDetailsWithRelatedItems
