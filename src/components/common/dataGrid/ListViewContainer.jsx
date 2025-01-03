import React from 'react';
import WebListView from './WebListView';
import MobileListView from './MobileListView';
import SharedDataGridSkeleton from '../../UI/Skeletons/SharedDataGridSkeleton';
import NoAccessPage from '../../UI/NoAccessPage';

const ListViewContainer = ({
    isMobile,
    title,
    subtitle,
    records,
    onCreateRecord,
    onEditRecord,
    onDeleteRecord,
    permissions,
    columnConfig,
    isLoading,
    isDeleteMode,
    selectedRecordIds,
    onToggleDeleteMode,
    onSelectRecords,
    importConfig,
}) => {
    // Common props for both views
    const commonProps = {
        isMobile,
        title,
        subtitle,
        records,
        onCreateRecord,
        onEditRecord,
        permissions,
        onDeleteRecord,
        columnConfig
    };


    console.log(columnConfig, "columnConfig")
    console.log(isLoading, !permissions.read, "isLoading,!permissions.read")

    if (isLoading) {
        return <SharedDataGridSkeleton />;
    }

    if (!permissions.read) {
        return <NoAccessPage />;
    }

    return isMobile ? (
        <MobileListView
            {...commonProps}
        />
    ) : (
        <WebListView
            {...commonProps}
            isLoading={isLoading}
            isDeleteMode={isDeleteMode}
            selectedRecordIds={selectedRecordIds}
            onToggleDeleteMode={onToggleDeleteMode}
            onSelectRecords={onSelectRecords}
            importConfig={importConfig}

        />
    );
};

export default ListViewContainer;