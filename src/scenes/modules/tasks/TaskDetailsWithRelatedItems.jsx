import React from "react";
import TaskDetailPage from "./Forms/TaskDetailPage";
import TaskRelatedItems from "./RelatedItems";
import FlexiblePageLayout from "../../../components/common/layout/FlexiblePageLayout";

const TaskDetailsWithRelatedItems = () => {
  return (
    <FlexiblePageLayout
      DetailComponent={TaskDetailPage}
      RelatedItemsComponent={TaskRelatedItems}
    />
  )
};
export default TaskDetailsWithRelatedItems;
