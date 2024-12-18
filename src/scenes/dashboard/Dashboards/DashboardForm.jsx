import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Chip,
    Box,
    OutlinedInput
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { RequestServer } from '../../api/HttpReq';

const DashboardForm = ({ open, handleClose, initialValues, onSubmit, isEditing, onObjectChange }) => {
    const [objects, setObjects] = useState([]);
    const [fields, setFields] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);

    // Fetch available objects when form opens
    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const response = await RequestServer("get", 'getObject');
                if (response.success) {
                    setObjects(response.data);
                }
            } catch (error) {
                console.error('Error fetching objects:', error);
            }
        };

        if (open) {
            fetchObjects();
        }
    }, [open]);

    // Fetch fields when object is selected
    const fetchFields = async (objectName) => {
        try {
            const response = await RequestServer("get", `getFields?object=${objectName}`);
            console.log(response.data, "response data from fields");
            if (response.success) {
                setFields(response.data);
            }
        } catch (error) {
            console.error('Error fetching fields:', error);
        }
    };

    const handleObjectChange = async (e, setFieldValue) => {
        const objectName = e.target.value;
        setFieldValue('objectName', objectName);
        setFieldValue('selectedFields', []); // Reset selected fields
        setSelectedFields([]); // Reset local state
        if (objectName) {
            await fetchFields(objectName);
        }
        if (onObjectChange) {
            onObjectChange(objectName);
        }
    };

    const validationSchema = Yup.object().shape({
        dashboardName: Yup.string().required('Dashboard name is required'),
        objectName: Yup.string().required('Object is required'),
        chartType: Yup.string().required('Chart type is required'),
        selectedFields: Yup.array().min(1, 'At least one field must be selected'),
    });

    const defaultValues = {
        dashboardName: '',
        objectName: '',
        chartType: '',
        selectedFields: [],
    };
    console.log(initialValues, "savedvalues from dashboard form");

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEditing ? 'Edit Dashboard' : 'Create Dashboard'}</DialogTitle>
            <Formik
                initialValues={initialValues || defaultValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
                    <Form>
                        <DialogContent>
                            <TextField
                                fullWidth
                                margin="normal"
                                name="dashboardName"
                                label="Dashboard Name"
                                value={values.dashboardName || values.dashboardname}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.dashboardName && Boolean(errors.dashboardName)}
                                helperText={touched.dashboardName && errors.dashboardName}
                            />

                            <TextField
                                select
                                fullWidth
                                margin="normal"
                                name="objectName"
                                label="Select Object"
                                value={values.objectName || values.objectname}
                                onChange={(e) => handleObjectChange(e, setFieldValue)}
                                onBlur={handleBlur}
                                error={touched.objectName && Boolean(errors.objectName)}
                                helperText={touched.objectName && errors.objectName}
                            >
                                {objects.map((object) => (
                                    <MenuItem key={object.Tables_in_crm} value={object.Tables_in_crm}>
                                        {object.Tables_in_crm}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <FormControl
                                fullWidth
                                margin="normal"
                                error={touched.selectedFields && Boolean(errors.selectedFields)}
                            >
                                <InputLabel id="fields-select-label">Select Fields</InputLabel>
                                <Select
                                    labelId="fields-select-label"
                                    multiple
                                    name="selectedFields"
                                    value={values.selectedFields || values.fields || []}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFieldValue('selectedFields', typeof value === 'string' ? value.split(',') : value);
                                    }}
                                    input={<OutlinedInput label="Select Fields" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                    disabled={!values.objectName}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 48 * 4.5,
                                                width: 250,
                                            },
                                        },
                                    }}
                                >
                                    {fields.map((field) => {
                                        const fieldName = field.Field || field;
                                        return (
                                            <MenuItem
                                                key={fieldName}
                                                value={fieldName}
                                                style={{
                                                    fontWeight: values.selectedFields?.indexOf(fieldName) === -1
                                                        ? 'normal'
                                                        : 'bold',
                                                }}
                                            >
                                                {fieldName}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                                {touched.selectedFields && errors.selectedFields && (
                                    <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                                        {errors.selectedFields}
                                    </Box>
                                )}
                            </FormControl>

                            <TextField
                                select
                                fullWidth
                                margin="normal"
                                name="chartType"
                                label="Chart Type"
                                value={values.chartType || values.charttype}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={touched.chartType && Boolean(errors.chartType)}
                                helperText={touched.chartType && errors.chartType}
                            >
                                <MenuItem value="bar">Bar Chart</MenuItem>
                                <MenuItem value="line">Line Chart</MenuItem>
                                <MenuItem value="pie">Pie Chart</MenuItem>
                            </TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit" variant="contained" color="primary">
                                {isEditing ? 'Update' : 'Create'}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};

export default DashboardForm; 