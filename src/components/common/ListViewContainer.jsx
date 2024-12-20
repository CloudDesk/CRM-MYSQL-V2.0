import React from 'react';
import WebListView from './WebListView';
import MobileListView from './MobileListView';

const ListViewContainer = ({

    isMobile,
    title,
    subtitle,
    records,
    columnConfigMobile,
    columnConfigWeb,
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
        permissions
    };

    return isMobile ? (
        <MobileListView
            {...commonProps}
            columnConfig={columnConfigMobile}
            onDeleteRecord={permissions.delete ? handleDelete : null}
        />
    ) : (
        <WebListView
            {...commonProps}
            columnConfig={columnConfigWeb}
            isLoading={isLoading}
            isDeleteMode={isDeleteMode}
            selectedRecordIds={selectedRecordIds}
            onToggleDeleteMode={onToggleDeleteMode}
            onSelectRecords={onSelectRecords}
            onDeleteRecord={onDeleteRecord}
            ExcelDownload={ExcelDownload}
            importConfig={importConfig}

        />
    );
};

export default ListViewContainer;