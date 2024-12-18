import React from 'react';
import WebListView from './WebListView';
import MobileListView from './MobileListView';

const ListViewContainer = ({
    isMobile,
    title,
    subtitle,
    records,
    columns,
    mobileFields,
    loading,
    permissionValues,
    onAdd,
    onView,
    onDelete,
    onMultipleDelete
}) => {
    // Common props for both views
    const commonProps = {
        title,
        subtitle,
        records,
        onAdd,
        onDelete
    };

    return isMobile ? (
        <MobileListView
            {...commonProps}
            fields={mobileFields}
            onEdit={onView}
        />
    ) : (
        <WebListView
            {...commonProps}
            columns={columns}
            loading={loading}
            permissionValues={permissionValues}
            onView={onView}
            onMultipleDelete={onMultipleDelete}
        />
    );
};

export default ListViewContainer;