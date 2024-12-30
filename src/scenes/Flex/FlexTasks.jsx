import React from "react";
import TaskDetailPage from "../tasks/Forms/TaskDetailPage";
import TaskRelatedItems from "../tasks/RelatedItems";
import FlexLayout from "../../components/common/FlexLayout";

const FlexTasks = () => {
  return (
    <FlexLayout
      DetailComponent={TaskDetailPage}
      RelatedItemsComponent={TaskRelatedItems}
    />
  )
};
export default FlexTasks;
