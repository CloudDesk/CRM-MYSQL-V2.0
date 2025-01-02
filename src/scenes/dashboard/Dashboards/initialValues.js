import * as Yup from 'yup';
import { format } from 'date-fns';
import { RequestServer } from '../../api/HttpReq';

export const fetchObjectFields = async (objectName) => {
    try {
        const response = await RequestServer('get', `getFields?object=${objectName}`);
        if (response.success) {
            return response.data.map(field => ({
                value: field.Field || field,
                label: field.Field || field
            }));
        }
        return [];
    } catch (error) {
        console.error('Error fetching fields:', error);
        return [];
    }
};

export const dashboardFormFields = (isExistingDashboard = false, existingDashboard = {}) => {
    const fields = [
        {
            name: 'dashboardName',
            label: 'Dashboard Name',
            type: 'text',
            required: true,
            xs: 12,
            md: 6,
            validator: Yup.string()
                .min(3, 'Dashboard name must be at least 3 characters')
                .max(50, 'Dashboard name must be less than 50 characters')
                .required('Dashboard name is required'),
            props: {
                placeholder: 'Enter Dashboard Name'
            }
        },
        {
            name: 'objectName',
            label: 'Select Object',
            type: 'select',
            required: true,
            xs: 12,
            md: 6,
            options: [], // Will be populated dynamically
            validator: Yup.string().required('Object is required'),
            props: {
                placeholder: 'Select Object'
            },
            onChange: async (name, value, setFieldValue) => {
                console.log('Object changed:', value);

                // Reset selected fields
                setFieldValue('selectedFields', []);

                // Fetch fields for the selected object
                const fieldOptions = await fetchObjectFields(value);

                console.log('Fetched field options:', fieldOptions);

                // Update field options and reset selected fields
                setFieldValue('selectedFieldsOptions', fieldOptions);
                setFieldValue('selectedFields', []);
            }
        },
        {
            name: 'fields',
            label: 'Select Fields',
            type: 'multiselect',
            required: true,
            xs: 12,
            validator: Yup.array()
                .min(1, 'At least one field must be selected')
                .max(2, 'Maximum 2 fields can be selected')
                .required('Fields are required'),
            options: [], // Will be populated dynamically based on selected object
            props: {
                placeholder: 'Select Fields (Max 2)',
                limitTags: 2 // Limit displayed tags
            },
            onChange: (name, value, setFieldValue) => {
                // Ensure only 2 fields are selected
                if (value.length > 2) {
                    // Keep only the first two selections
                    setFieldValue(name, value.slice(0, 2));
                }
            }
        },
        {
            name: 'chartType',
            label: 'Chart Type',
            type: 'select',
            required: true,
            xs: 12,
            md: 6,
            options: [
                { value: 'bar', label: 'Bar Chart' },
                { value: 'line', label: 'Line Chart' },
                { value: 'pie', label: 'Pie Chart' }
            ],
            validator: Yup.string().required('Chart type is required'),
            props: {
                placeholder: 'Select Chart Type'
            }
        }
    ];

    // Add metadata fields for existing dashboards
    if (isExistingDashboard) {
        fields.push(
            {
                name: 'createddate',
                label: 'Created Date',
                type: 'text',
                xs: 12,
                md: 6,
                props: {
                    disabled: true
                }
            },
            {
                name: 'modifieddate',
                label: 'Modified Date',
                type: 'text',
                xs: 12,
                md: 6,
                props: {
                    disabled: true
                }
            },
            {
                name: 'createdby',
                label: 'Created By',
                type: 'text',
                xs: 12,
                md: 6,
                props: {
                    disabled: true
                }
            },
            {
                name: 'modifiedby',
                label: 'Modified By',
                type: 'text',
                xs: 12,
                md: 6,
                props: {
                    disabled: true
                }
            }
        );
    }

    return fields;
};

export const generateDashboardInitialValues = async (existingDashboard = {}) => {
    console.log(existingDashboard, "existing dashboard data");

    const defaultValues = dashboardFormFields(
        Object.keys(existingDashboard).length > 0,
        existingDashboard
    ).reduce((acc, field) => {
        acc[field.name] = existingDashboard[field.name] ?? '';
        return acc;
    }, {});

    // If editing and object is already selected, fetch its fields
    if (existingDashboard.objectname) {
        try {
            const fieldOptions = await fetchObjectFields(existingDashboard.objectname);

            // Add a special key to store field options
            defaultValues.__fieldOptions = fieldOptions;

            // Populate selected fields if they exist
            if (existingDashboard.fields) {
                defaultValues.selectedFields = Array.isArray(existingDashboard.fields)
                    ? existingDashboard.fields
                    : existingDashboard.fields.split(',');
            }
        } catch (error) {
            console.error('Error fetching fields for existing dashboard:', error);
        }
    }

    if (Object.keys(existingDashboard).length > 0) {
        // Format dates and metadata
        defaultValues.createddate = existingDashboard.createddate
            ? format(existingDashboard.createddate, 'MM/dd/yyyy')
            : Date.now();

        defaultValues.modifieddate = existingDashboard.modifieddate
            ? format(existingDashboard.modifieddate, 'MM/dd/yyyy')
            : Date.now();

        // Created By
        defaultValues.createdby = existingDashboard.createdby
            ? `${existingDashboard.createdby.userFullName} - ${format(existingDashboard.createddate, 'MMMM dd, yyyy hh:mm a')}`
            : null;

        // Modified By
        defaultValues.modifiedby = existingDashboard.modifiedby
            ? `${existingDashboard.modifiedby.userFullName} - ${format(existingDashboard.modifieddate, 'MMMM dd, yyyy hh:mm a')}`
            : null;
    }

    return defaultValues;
}; 