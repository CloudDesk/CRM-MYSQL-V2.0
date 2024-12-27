import React from "react";
import ModalAccTask from "../tasks/ModalAccTask";
import ModalConAccount from "../contacts/ModalConAccount";
import RelatedItems from "../../components/common/RelatedItems";

const AccountRelatedItems = ({ props }) => {
  console.log("AccountRelatedItems", props)
  const exisitingAccount = props;
  const sections = [
    {
      key: 'task',
      title: 'Event Logs',
      objectApi: 'Enquiry',
      fetchUrl: '/getTaskbyAccountId?accountid=',
      deleteUrl: '/deleteTask',
      detailUrl: '/taskDetailPage',
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
      key: 'contact',
      title: 'Contacts',
      objectApi: 'Contact',
      fetchUrl: '/getContactsbyAccountId?accountid=',
      detailUrl: '/contactDetailPage',
      deleteUrl: '/deleteContact',
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
      key: 'task',
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

