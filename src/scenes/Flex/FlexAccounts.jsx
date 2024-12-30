import React from "react";
import AccountDetailPage from "../accounts/Forms/AccountDetailPage";
import AccountRelatedItems from "../accounts/RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const FlexAccounts = () => {
  return (
    <FlexLayout
      DetailComponent={AccountDetailPage}
      RelatedItemsComponent={AccountRelatedItems}
    />
  );
};
export default FlexAccounts;
