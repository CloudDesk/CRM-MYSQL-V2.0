import React from "react";
import ModalTaskFileUpload from "../Files/ModalTaskRelatedFile";
import RelatedItems from "../../components/common/RelatedItems";
import { appConfig } from "../config";

const TaskRelatedItems = ({ props }) => {
  const existingTask = props;
  const URL_getRelatedFiles = "files?eventid=";
  const urlDelete = `/deletefiles`;

  const sections = [
    {
      key: 'file',
      title: 'Notes and Attachments',
      objectApi: appConfig.api.files.apiName || appConfig.objects.task.apiName,
      fetchUrl: appConfig.objects.task.r_file,
      deleteUrl: appConfig.api.files.delete,
      icon: 'attachment',
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
