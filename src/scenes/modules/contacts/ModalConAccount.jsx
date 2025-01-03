import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import * as Yup from "yup";
import { Grid } from "@mui/material";
import ToastNotification from "../../shared/toast/ToastNotification";
import { LeadSourcePickList, NameSalutionPickList } from '../../../assets/pickLists';
import { RequestServer } from "../../api/HttpReq";
import { ContactInitialValues } from "../../formik/formValues";
import { DynamicForm } from "../../../components/Form/DynamicForm";
import { appConfig } from "../../../config/appConfig";

const UpsertUrl = appConfig.objects.contact.upsert;

const ModalConAccount = ({ handleModal, parentId, onSuccess }) => {
    const [accountParentRecord, setAccountParentRecord] = useState();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    const location = useLocation();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setAccountParentRecord(location.state.record.item);
    }, []);

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const formFields = [
        {
            name: "salutation",
            label: "Salutation",
            type: "select",
            xs: 12,
            md: 2,
            options: NameSalutionPickList.map(i => ({
                value: i.value,
                label: i.text
            }))
        },
        {
            name: "firstName",
            label: "First Name",
            type: "text",
            xs: 12,
            md: 4,
            validator: Yup.string()
                .max(30, 'First name must be less than 30 characters')
        },
        {
            name: "lastName",
            label: "Last Name",
            type: "text",
            xs: 12,
            md: 6,
            required: true,
            validator: Yup.string()
                .required('Required')
                .min(3, 'Last name must be more than 3 characters')
                .max(30, 'Last name must be less than 30 characters')
        },
        {
            name: "phone",
            label: "Phone",
            type: "text",
            xs: 12,
            md: 6,
            required: true,
            validator: Yup.string()
                .required('Required')
                .matches(phoneRegExp, 'Phone number is not valid')
                .min(10, "Phone number must be 10 characters")
                .max(10, "Phone number must be 10 characters")
        },
        {
            name: "dob",
            label: "Date of Birth",
            type: "date",
            xs: 12,
            md: 6,
            validator: Yup.date().nullable(),
            props: {
                InputLabelProps: { shrink: true }
            }
        },
        {
            name: "email",
            label: "Email",
            type: "text",
            xs: 12,
            md: 6,
            required: true,
            validator: Yup.string()
                .email('Invalid email address')
                .required('Required')
        },
        {
            name: "leadSource",
            label: "Enquiry Source",
            type: "select",
            xs: 12,
            md: 6,
            options: LeadSourcePickList.map(i => ({
                value: i.value,
                label: i.text
            }))
        },
        {
            name: "description",
            label: "Description",
            type: "text",
            xs: 12,
            md: 12,
            props: {
                multiline: true,
                rows: 4,
                placeholder: 'Additional details about the contact'
            }
        }
    ];

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
        let dateSeconds = new Date().getTime();
        let dobSec = values.dob ? new Date(values.dob).getTime() : null;

        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.AccountId = accountParentRecord._id;
        values.AccountName = accountParentRecord.accountname;
        values.createdBy = (sessionStorage.getItem("loggedInUser"));
        values.modifiedBy = (sessionStorage.getItem("loggedInUser"));

        values.fullName = `${values.firstName || ''} ${values.lastName || ''}`.trim();

        if (dobSec) {
            values.dob = dobSec;
        }

        await RequestServer("post", UpsertUrl, values)
            .then((res) => {
                console.log('contact form Submission response', res);
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data || `Contact Created for ${accountParentRecord.accountname}`,
                        type: 'success'
                    });
                    onSuccess && onSuccess();
                } else {
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    });
                }
            })
            .catch((error) => {
                console.log('contact form Submission error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                });
            })
            .finally(() => {
                setTimeout(() => {
                    handleModal(false);
                }, 1000);
            });
    };

    const permissionValues = {
        edit: true
    };

    return (
        <Grid item xs={12} >
            <ToastNotification notify={notify} setNotify={setNotify} />
            <DynamicForm
                formTitle="New Contact"
                fields={formFields}
                initialValues={ContactInitialValues}
                onSubmit={formSubmission}
                permissionValues={permissionValues}
                handleCancel={handleModal}
            />
        </Grid>
    );
};

export default ModalConAccount;

