import React from "react";
import AccountDetailPage from "./Forms/AccountDetailPage";
import AccountRelatedItems from "./RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const AccountDetailsWithRelatedItems = () => {
  return (
    <FlexLayout
      DetailComponent={AccountDetailPage}
      RelatedItemsComponent={AccountRelatedItems}
    />
  );
};
export default AccountDetailsWithRelatedItems;
