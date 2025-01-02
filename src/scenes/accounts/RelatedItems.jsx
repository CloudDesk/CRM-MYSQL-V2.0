import React from "react";
import ModalAccTask from "../tasks/ModalAccTask";
import ModalConAccount from "../contacts/ModalConAccount";
import RelatedItems from "../../components/common/RelatedItems";
import { appConfig } from "../config";


const AccountRelatedItems = ({ props }) => {
  console.log("AccountRelatedItems", props)
  const exisitingAccount = props;
  const sections = [
    {
      key: appConfig.objects.task.key || 'event',
      title: appConfig.objects.task.name.plural,
      objectApi: appConfig.objects.task.apiName,
      fetchUrl: appConfig.objects.account.r_task,
      deleteUrl: appConfig.objects.task.delete,
      detailUrl: appConfig.objects.task.detail,
      icon: 'task',
      displayFields: [
        { key: 'subject', label: 'Subject' },
        {
          key: 'startdate',
          label: 'Date&Time',
          format: (date) => date ? new Date(date).toLocaleDateString() : '---'
        },
        { key: 'description', label: 'Description' }
      ],
    },
    {
      key: appConfig.objects.contact.key || 'contact',
      title: appConfig.objects.contact.name.plural,
      objectApi: appConfig.objects.contact.apiName,
      fetchUrl: appConfig.objects.account.r_contact || '/getContactsbyAccountId?accountid=',
      detailUrl: appConfig.objects.contact.detail,
      deleteUrl: appConfig.objects.contact.delete,
      icon: 'contact',
      displayFields: [
        { key: 'fullname', label: 'Name' },
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' }
      ],

    }
  ];

  const modals = [
    {
      key: 'event',
      component: ModalAccTask
    },
    {
      key: 'contact',
      component: ModalConAccount
    }
  ];
  return <RelatedItems parentId={exisitingAccount._id} sections={sections} modals={modals} />;

}
export default AccountRelatedItems

