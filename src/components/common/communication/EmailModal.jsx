import React, { useState } from 'react';
import * as Yup from 'yup';
import { RequestServerFiles } from '../../../scenes/api/HttpReqFiles';
import { appConfig } from '../../../scenes/config';
import CommunicationModal from './CommunicationModal';
import CommunicationForm from './CommunicationForm';
import ToastNotification from '../../../scenes/toast/ToastNotification';

const CONSTANTS = {
    send: appConfig.api.email.bulk
};

const EmailModalPage = ({ data, handleModal, bulkMail }) => {
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    const initialValues = {
        subject: '',
        message: '',
        attachments: null
    };

    const validationSchema = Yup.object({
        subject: Yup.string().required('Required'),
        message: Yup.string().required('Required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const records = Array.isArray(data) ? data : [data];

            for (const record of records) {
                const formData = new FormData();
                formData.append('subject', values.subject);
                formData.append('htmlBody', `Hai ${record.fullname},\n\n${values.message}`);
                formData.append('emailId', record.email);
                if (values.attachments) {
                    formData.append('file', values.attachments);
                }

                const response = await RequestServerFiles('post', CONSTANTS.send, formData);

                if (!response.success) {
                    throw new Error('Failed to send email');
                }
            }

            setNotify({
                isOpen: true,
                message: 'Email sent successfully',
                type: 'success'
            });

            setTimeout(() => handleModal(false), 2000);
        } catch (error) {
            setNotify({
                isOpen: true,
                message: error.message || 'Failed to send email',
                type: 'error'
            });
        }
        setSubmitting(false);
    };

    return (
        <>
            <CommunicationModal
                open={true}
                onClose={() => handleModal(false)}
                title="Send Email"
            >
                <CommunicationForm
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    onClose={() => handleModal(false)}
                    type="email"
                    allowAttachments={true}
                />
            </CommunicationModal>
            <ToastNotification notify={notify} setNotify={setNotify} />
        </>
    );
};

export default EmailModalPage;