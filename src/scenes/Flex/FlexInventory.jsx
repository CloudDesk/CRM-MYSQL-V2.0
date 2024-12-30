import React from "react";
import InventoryDetailPage from "../inventories/Forms/InventoryDetailPage";
import InventoryRelatedItems from "../inventories/RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const FlexInventories = () => {
  return (
    <FlexLayout
      DetailComponent={InventoryDetailPage}
      RelatedItemsComponent={InventoryRelatedItems}
    />
  )
}
export default FlexInventories
