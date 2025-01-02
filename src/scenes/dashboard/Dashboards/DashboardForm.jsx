import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { RequestServer } from '../../api/HttpReq';
import { dashboardFormFields, generateDashboardInitialValues } from './initialValues';
import { DynamicForm } from '../../../components/Form/DynamicForm';

const DashboardForm = ({
    open,
    handleClose,
    initialValues,
    onSubmit,
    isEditing
}) => {
    const [objects, setObjects] = useState([]);
    const [preparedInitialValues, setPreparedInitialValues] = useState(null);
    const [permissionValues, setPermissionValues] = useState({
        edit: true,
        create: true
    });

    // Fetch available objects when form opens
    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const response = await RequestServer("get", 'getObject');
                if (response.success) {
                    const objectOptions = response.data.map(obj => ({
                        value: obj.Tables_in_crm,
                        label: obj.Tables_in_crm
                    }));
                    setObjects(objectOptions);
                }
            } catch (error) {
                console.error('Error fetching objects:', error);
            }
        };

        const prepareInitialValues = async () => {
            const values = await generateDashboardInitialValues(initialValues);
            setPreparedInitialValues(values);
        };

        if (open) {
            fetchObjects();
            prepareInitialValues();
        }
    }, [open, initialValues]);

    // Prepare form fields with dynamic options
    const preparedFormFields = dashboardFormFields(isEditing).map(field => {
        if (field.name === 'objectName') {
            return {
                ...field,
                options: objects
            };
        }

        // For selectedFields, use the options from preparedInitialValues if available
        if (field.name === 'selectedFields') {
            // Use the special __fieldOptions if it exists
            const fieldOptions = preparedInitialValues?.__fieldOptions || [];

            return {
                ...field,
                options: fieldOptions
            };
        }

        return field;
    });

    // Handle form submission
    const handleFormSubmit = (values, { resetForm }) => {
        // Prepare values for submission
        const submissionValues = {
            ...values,
            fields: values.selectedFields
        };

        // Call the original onSubmit
        onSubmit(submissionValues, { resetForm });
    };

    // Only render when initial values are ready
    if (!preparedInitialValues) return null;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{isEditing ? 'Edit Dashboard' : 'Create Dashboard'}</DialogTitle>
            <DialogContent>
                <DynamicForm
                    fields={preparedFormFields}
                    initialValues={preparedInitialValues}
                    onSubmit={handleFormSubmit}
                    submitButtonText={isEditing ? 'Update' : 'Create'}
                    permissionValues={permissionValues}
                    handleCancel={handleClose}
                />
            </DialogContent>
        </Dialog>
    );
};

export default DashboardForm; 