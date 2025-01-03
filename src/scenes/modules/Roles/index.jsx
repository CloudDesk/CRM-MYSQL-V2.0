import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RequestServer } from '../../api/HttpReq';
import { getUserRoleAndDepartment } from '../../../utils/sessionUtils';
import { useCheckPermission } from '../../hooks/useCheckPermission';
import { appConfig } from '../../../config/appConfig';
import ListViewContainer from '../../../components/common/dataGrid/ListViewContainer';

const CONSTANTS = {
  OBJECT_NAME: appConfig.objects.role.apiName,
  ROUTES: {
    get: appConfig.objects.role.base || '/roles',
    delete: appConfig.objects.role.delete || '/roles',
    new: appConfig.objects.role.new || '/new-role',
    detail: appConfig.objects.role.detail || '/roleDetailPage',
  },
}

const RoleIndex = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const userRoleDept = getUserRoleAndDepartment(CONSTANTS.OBJECT_NAME);

  // State management
  const [records, setRecords] = useState([]);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Use the custom permission hook
  const { permissions } = useCheckPermission({
    role: userRoleDept?.role,
    object: userRoleDept?.object,
    departmentname: userRoleDept?.departmentname
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await RequestServer("get", CONSTANTS.ROUTES.get);
      if (response.success) {
        setRecords(response.data);
        setFetchError(null);
      } else {
        setRecords([]);
        setFetchError(response.error.message);
      }
    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of your handlers

  return (
    <Box>
      <ListViewContainer
        isMobile={isMobile}
        title="Role"
        subtitle="List of Roles"
        records={records}
        // onCreateRecord={handleCreateRecord}
        // onEditRecord={handleEditRecord}
        // onDeleteRecord={isMobile ? (permissions.delete ? handleDelete : null) : handleDelete}
        permissions={permissions}
        // columnConfig={isMobile ? ROLE_TABLE_CONFIG.mobileFields : getTableColumns()}
        isLoading={isLoading}
        isDeleteMode={isDeleteMode}
        selectedRecordIds={selectedIds}
        onToggleDeleteMode={setIsDeleteMode}
        onSelectRecords={setSelectedIds}
      />
    </Box>
  );
};

export default RoleIndex;



