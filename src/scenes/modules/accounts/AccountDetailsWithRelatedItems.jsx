import React from "react";
import AccountDetailPage from "./Forms/AccountDetailPage";
import AccountRelatedItems from "./RelatedItems";
import FlexiblePageLayout from "../../../components/common/layout/FlexiblePageLayout";

const AccountDetailsWithRelatedItems = () => {
  return (
    <FlexiblePageLayout
      DetailComponent={AccountDetailPage}
      RelatedItemsComponent={AccountRelatedItems}
    />
  );
};
export default AccountDetailsWithRelatedItems;
