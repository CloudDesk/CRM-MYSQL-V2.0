import React from "react";
import InventoryDetailPage from "./Forms/InventoryDetailPage";
import InventoryRelatedItems from "./RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const InventoryDetailsWithRelatedItems = () => {
  return (
    <FlexLayout
      DetailComponent={InventoryDetailPage}
      RelatedItemsComponent={InventoryRelatedItems}
    />
  )
}
export default InventoryDetailsWithRelatedItems
