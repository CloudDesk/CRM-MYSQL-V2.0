import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import * as Yup from "yup";
import { Grid } from "@mui/material";
import { TaskSubjectPicklist } from "../../assets/pickLists";
import ToastNotification from '../toast/ToastNotification';
import { RequestServer } from '../api/HttpReq';
import { TaskInitialValues } from "../formik/InitialValues/formValues";
import { DynamicForm } from "../../components/Form/DynamicForm";
import { appConfig } from "../../config/appConfig";

const UpsertUrl = `/UpsertTask`;
const fetchUsersbyName = `/usersByName`;

const CONSTANTS = {
    upsert: appConfig.objects.task.upsert,
    getUsersByName: appConfig.objects.user.fetchUsersByFirstName,
    getAllUsers: appConfig.objects.user.fetchAllUsers
}


const ModalAccTask = ({ handleModal, parentId, onSuccess }) => {
    const [taskParentRecord, setTaskParentRecord] = useState();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const [usersRecord, setUsersRecord] = useState([]);
    const location = useLocation();

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setTaskParentRecord(location.state.record.item);
        FetchUsersbyName(false, '');
    }, []);

    const FetchUsersbyName = (isNameSearch, newInputValue) => {
        let url = isNameSearch ? `${CONSTANTS.getUsersByName}${newInputValue}` : CONSTANTS.getAllUsers;
        RequestServer("get", url, {})
            .then((res) => {
                console.log('res fetchUsersbyName', res.data);
                if (res.success) {
                    setUsersRecord(res.data.map(user => ({
                        value: user._id,
                        label: user.fullname
                    })));
                } else {
                    console.log("fetchUsersbyName status error", res.error.message);
                }
            })
            .catch((error) => {
                console.log('error fetchInventoriesbyName', error);
            });
    };

    const formFields = [
        {
            name: "subject",
            label: "Subject",
            type: "select",
            required: true,
            xs: 12,
            md: 6,
            options: TaskSubjectPicklist.map(item => ({
                value: item.value,
                label: item.text
            }))
        },
        {
            name: "assignedto",
            label: "Assigned To",
            type: "autocomplete",
            xs: 12,
            md: 6,
            options: usersRecord,
            fetchurl: CONSTANTS.getAllUsers,
            searchfor: 'firstname'
        },
        {
            name: "StartDate",
            label: "Start Date",
            type: "date",
            required: true,
            xs: 12,
            md: 6,
            validator: Yup.date().nullable(),
            props: {
                InputLabelProps: { shrink: true }
            }
        },
        {
            name: "EndDate",
            label: "End Date",
            type: "date",
            required: true,
            xs: 12,
            md: 6,
            validator: Yup.date().nullable(),
            props: {
                InputLabelProps: { shrink: true }
            }
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
                placeholder: 'Additional details about the task'
            }
        }
    ];

    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);
        let dateSeconds = new Date().getTime();
        let StartDateSec = new Date(values.StartDate).getTime();
        let EndDateSec = new Date(values.EndDate).getTime();

        values.createdBy = (sessionStorage.getItem("loggedInUser"));
        values.modifiedBy = (sessionStorage.getItem("loggedInUser"));

        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.accountId = taskParentRecord._id;
        values.accountName = taskParentRecord.accountname;
        values.object = 'Account';
        values.relatedto = taskParentRecord.accountname;
        values.assignedto = JSON.stringify(values.assignedto);

        if (values.StartDate && values.EndDate) {
            values.StartDate = StartDateSec;
            values.EndDate = EndDateSec;
        } else if (values.StartDate) {
            values.StartDate = StartDateSec;
        } else if (values.EndDate) {
            values.EndDate = EndDateSec;
        }

        await RequestServer("post", CONSTANTS.upsert, values)
            .then((res) => {
                console.log('task form Submission response', res);
                setNotify({
                    isOpen: true,
                    message: res.data || `Task Created for ${taskParentRecord.accountname}`,
                    type: 'success'
                });
                onSuccess && onSuccess();
            })
            .catch((error) => {
                console.log('task form Submission error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                });
            })
            .finally(() => {
                setTimeout(() => {
                    handleModal(false);
                }, 2000);
            });
    };

    const validationSchema = Yup.object({
        subject: Yup.string().required('Subject is required'),
        StartDate: Yup.date().required('Start Date is required'),
        EndDate: Yup.date().required('End Date is required')
    });

    const permissionValues = {
        edit: true
    };

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <DynamicForm
                formTitle="New Task"
                fields={formFields}
                initialValues={TaskInitialValues}
                validationSchema={validationSchema}
                onSubmit={formSubmission}
                permissionValues={permissionValues}
                handleCancel={handleModal}
            />
        </Grid>
    );
};

export default ModalAccTask;

