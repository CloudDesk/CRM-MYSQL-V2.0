import React from "react";
import ModalInventoryOpportunity from "../opportunities/ModalInventoryOpp";
import ModalInventoryAccount from "../accounts/ModalAccountInventory";
import RelatedItems from "../../../components/common/RelatedItems";
import { appConfig } from "../../../config/appConfig";


const InventoryRelatedItems = ({ props }) => {

  const existingInventory = props;

  const sections = [
    {
      key: appConfig.objects.opportunity.key,
      title: appConfig.objects.opportunity.name.singular,
      objectApi: appConfig.objects.opportunity.apiName || 'Deals',
      fetchUrl: appConfig.objects.inventory.r_opportunity || '/getOpportunitiesbyInvid?inventoryid=',
      deleteUrl: appConfig.objects.opportunity.delete || '/deleteOpportunity',
      detailUrl: appConfig.objects.opportunity.detail,
      icon: 'deal',
      displayFields: [
        { key: 'opportunityname', label: 'Name' },
        { key: 'stage', label: 'Stage' },
        {
          key: 'closedate',
          label: 'Close Date',
          format: (date) => date ? new Date(date).toLocaleDateString() : '---'
        }
      ],
    },
    {
      key: appConfig.objects.account.key,
      title: appConfig.objects.account.name.plural,
      objectApi: appConfig.objects.account.apiName || 'Account',
      fetchUrl: appConfig.objects.inventory.r_account || '/getAccountbyInventory?inventoryid=',
      deleteUrl: appConfig.objects.account.delete || '/deleteAccount',
      detailUrl: appConfig.objects.account.detail || '/accounts',
      icon: 'account',
      displayFields: [
        { key: 'accountname', label: 'Name' },
        { key: 'accountnumber', label: 'Account Number' },
        { key: 'rating', label: 'Rating' }
      ],
    }
  ];

  const modals = [
    {
      key: 'deal',
      component: ModalInventoryOpportunity
    },
    {
      key: 'account',
      component: ModalInventoryAccount
    }
  ];

  return (
    <RelatedItems
      parentId={existingInventory._id}
      sections={sections}
      modals={modals}
    />
  );

}
export default InventoryRelatedItems
