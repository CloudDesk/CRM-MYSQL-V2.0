import React, { useState } from 'react';
import * as Yup from 'yup';
import { RequestServer } from '../../../scenes/api/HttpReq';
import { appConfig } from '../../../config/appConfig';
import CommunicationModal from './CommunicationModal';
import CommunicationForm from './CommunicationForm';
import ToastNotification from '../../UI/toast/ToastNotification';

const CONSTANTS = {
    send: appConfig.api.whatsapp.message
};

const WhatsAppModalNew = ({ data, handleModal, bulkMail }) => {
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    const initialValues = {
        message: '',
    };

    const validationSchema = Yup.object({
        message: Yup.string().required('Required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const records = Array.isArray(data) ? data : [data];

            for (const record of records) {
                const obj = {
                    to: `91${record.phone}`,
                    message: `Hai ${record.fullname},\n\n${values.message}`
                };

                const response = await RequestServer('post', CONSTANTS.send, obj);

                if (!response.success) {
                    throw new Error('Failed to send message');
                }
            }

            setNotify({
                isOpen: true,
                message: 'WhatsApp message sent successfully',
                type: 'success'
            });

            setTimeout(() => handleModal(false), 2000);
        } catch (error) {
            setNotify({
                isOpen: true,
                message: error.message || 'Failed to send WhatsApp message',
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
                title="Send WhatsApp Message"
            >
                <CommunicationForm
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    onClose={() => handleModal(false)}
                    type="whatsapp"
                />
            </CommunicationModal>
            <ToastNotification notify={notify} setNotify={setNotify} />
        </>
    );
};

export default WhatsAppModalNew;