import React from "react";
import {
  OBJECT_API_EVENT
} from "../api/endUrls";
import ModalTaskFileUpload from "../Files/ModalTaskRelatedFile";
import RelatedItems from "../../components/common/RelatedItems";

const TaskRelatedItems = ({ props }) => {
  const existingTask = props;
  const OBJECT_API = OBJECT_API_EVENT;
  const URL_getRelatedFiles = "files?eventid=";
  const urlDelete = `/deletefiles`;

  const sections = [
    {
      key: 'file',
      title: 'Notes and Attachments',
      objectApi: OBJECT_API,
      fetchUrl: URL_getRelatedFiles,
      deleteUrl: urlDelete,
      icon: 'file',
      displayFields: [
        { key: 'filename', label: 'File Name' },
        { key: 'size', label: 'Size', format: (size) => (size / 1024).toFixed(2) + ' KB' },

      ],
      onItemClick: (item) => {
        console.log(item, "onItemClick")
        if (item.fileurl) {
          window.open(item.fileurl, '_blank');
        }
      }
    }
  ];


  const modals = [
    {
      key: 'file',
      component: ModalTaskFileUpload
    }
  ];
  console.log(existingTask, "existingTask")
  return (
    <RelatedItems
      parentId={existingTask._id}
      sections={sections}
      modals={modals}
    />
  )
};
export default TaskRelatedItems;
