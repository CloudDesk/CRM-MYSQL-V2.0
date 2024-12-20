import React from 'react';
import WebListView from './WebListView';
import MobileListView from './MobileListView';
import SharedDataGridSkeleton from '../Skeletons/SharedDataGridSkeleton';
import NoAccessPage from '../NoAccessPage';

const ListViewContainer = ({

    isMobile,
    title,
    subtitle,
    records,
    columnConfig,
    onCreateRecord,
    onEditRecord,
    onDeleteRecord,
    permissions,
    isLoading,
    isDeleteMode,
    selectedRecordIds,
    onToggleDeleteMode,
    onSelectRecords,
    ExcelDownload,
    importConfig,



}) => {
    // Common props for both views
    const commonProps = {
        title,
        subtitle,
        records,
        onCreateRecord,
        onEditRecord,
        permissions,
        onDeleteRecord,
        columnConfig
    };


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
            ExcelDownload={ExcelDownload}
            importConfig={importConfig}

        />
    );
};

export default ListViewContainer;