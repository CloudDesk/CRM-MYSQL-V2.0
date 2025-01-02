import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Box, Button, Grid, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const formStyle = {
    '& .form-field': {
        mb: 3
    },
    '& .form-input': {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        '&:focus': {
            outline: 'none',
            borderColor: '#1976d2'
        }
    },
    '& .file-input': {
        display: 'none'
    },
    '& .file-label': {
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
        color: '#1976d2'
    },
    '& .error-message': {
        color: 'red',
        fontSize: '0.75rem',
        marginTop: '4px'
    }
};

const CommunicationForm = ({
    initialValues,
    validationSchema,
    onSubmit,
    onClose,
    allowAttachments = false,
    type = 'whatsapp' // or 'email'
}) => {
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                    <Box sx={formStyle}>
                        {type === 'email' && (
                            <Grid item xs={12} className="form-field">
                                <Typography variant="subtitle2">Subject</Typography>
                                <Field name="subject" className="form-input" />
                                <ErrorMessage name="subject" component="div" className="error-message" />
                            </Grid>
                        )}

                        <Grid item xs={12} className="form-field">
                            <Typography variant="subtitle2">Message</Typography>
                            <Field
                                name="message"
                                as="textarea"
                                className="form-input"
                                rows={6}
                            />
                            <ErrorMessage name="message" component="div" className="error-message" />
                        </Grid>

                        {allowAttachments && (
                            <Grid item xs={12} className="form-field">
                                <input
                                    type="file"
                                    id="file-input"
                                    className="file-input"
                                    onChange={(event) => {
                                        setFieldValue("attachments", event.currentTarget.files[0]);
                                    }}
                                />
                                <label htmlFor="file-input" className="file-label">
                                    <AttachFileIcon />
                                    <Typography variant="body2">
                                        {values.attachments ? values.attachments.name : 'Attach File'}
                                    </Typography>
                                </label>
                            </Grid>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                            <Button
                                variant="outlined"
                                onClick={() => onClose()}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={isSubmitting}
                                endIcon={<SendIcon />}
                            >
                                Send
                            </Button>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default CommunicationForm;