import React from "react";
import TaskDetailPage from "./Forms/TaskDetailPage";
import TaskRelatedItems from "./RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const TaskDetailsWithRelatedItems = () => {
  return (
    <FlexLayout
      DetailComponent={TaskDetailPage}
      RelatedItemsComponent={TaskRelatedItems}
    />
  )
};
export default TaskDetailsWithRelatedItems;
