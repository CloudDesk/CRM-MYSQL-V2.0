import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
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


const ModalOppTask = ({ item, handleModal }) => {
    const [taskParentRecord, setTaskParentRecord] = useState();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const [usersRecord, setUsersRecord] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log('Task parent record', location.state.record.item);
        setTaskParentRecord(location.state.record.item);
        FetchUsersbyName(false, '');
    }, []);

    const FetchUsersbyName = (isNameSearch, newInputValue) => {
        let url = isNameSearch ? `${CONSTANTS.getUsersByName}${newInputValue}` : CONSTANTS.getAllUsers;
        RequestServer('get', url, {})
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
            options: TaskSubjectPicklist.map(item => ({
                value: item.value,
                label: item.text
            }))
        },
        {
            name: "assignedto",
            label: "Assigned To",
            type: "autocomplete",
            options: usersRecord,
            fetchurl: CONSTANTS.getAllUsers,
            searchfor: 'firstname'
        },
        {
            name: "StartDate",
            label: "Start Date",
            type: "date",
            required: true,
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
            validator: Yup.date().nullable(),
            props: {
                InputLabelProps: { shrink: true }
            }
        },
        {
            name: "description",
            label: "Description",
            type: "text",
            props: {
                multiline: true,
                rows: 4,
                placeholder: 'Additional details about the event'
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
        values.opportunityid = taskParentRecord._id;
        values.opportunityName = taskParentRecord.opportunityname;
        values.object = 'Deals';
        values.relatedto = taskParentRecord.opportunityname;
        values.assignedto = (values.assignedto);

        if (values.StartDate && values.EndDate) {
            values.StartDate = StartDateSec;
            values.EndDate = EndDateSec;
        } else if (values.StartDate) {
            values.StartDate = StartDateSec;
        } else if (values.EndDate) {
            values.EndDate = EndDateSec;
        }

        console.log(values, "values after modification");

        await RequestServer("post", CONSTANTS.upsert, values)
            .then((res) => {
                console.log('task form Submission response', res);
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    });
                } else {
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    });
                }
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
                    handleModal();
                }, 1000);
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
                formTitle="New Event"
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

export default ModalOppTask;

