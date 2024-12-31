import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid } from "@mui/material";
import ToastNotification from '../toast/ToastNotification';
import { RequestServer } from '../api/HttpReq';
import { opportunityFormFields, generateOpportunityInitialValues } from '../formik/InitialValues/initialValues';
import { DynamicForm } from "../../components/Form/DynamicForm";
import { appConfig } from '../config';

const url = `/UpsertOpportunity`;
const fetchLeadsbyName = `/LeadsbyName`;

const CONSTANTS = {
    upsert: appConfig.objects.opportunity.upsert,
    getLeadsByName: appConfig.objects.lead.fetchLeadsByFirstName,
    getAllLeads: appConfig.objects.lead.fetchAllLeads
}

const ModalInventoryOpportunity = ({ item, handleModal }) => {
    const [inventoryParentRecord, setInventoryParentRecord] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [leadsRecords, setLeadsRecords] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    useEffect(() => {
        console.log('Inventory parent record', location.state.record.item);
        setInventoryParentRecord(location.state.record.item);
        FetchLeadsbyName(false, '');
    }, []);

    const FetchLeadsbyName = (isNameSearch, newInputValue) => {
        console.log('inside FetchLeadsbyName fn');
        console.log('newInputValue', newInputValue);
        let url = isNameSearch ? `${CONSTANTS.getLeadsByName}${newInputValue}` : CONSTANTS.getAllLeads;

        RequestServer("get", url, {})
            .then((res) => {
                console.log('res fetchLeadsbyName', res.data);
                if (res.success) {
                    if (typeof res.data === "object") {
                        const formattedLeads = res.data.map((item) => ({
                            id: item._id,
                            leadname: item.fullname
                        }));
                        console.log('fetchLeadsbyName1', formattedLeads);
                        setLeadsRecords(formattedLeads);
                    } else {
                        setLeadsRecords([]);
                    }
                } else {
                    setLeadsRecords([]);
                }
            })
            .catch((error) => {
                console.log('error fetchLeadsbyName', error);
            });
    };

    const formSubmission = async (values) => {
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let closeDateSec = values.closedate
            ? new Date(values.closedate).getTime()
            : new Date().getTime();

        values.amount = Number(values.amount);
        values.modifieddate = dateSeconds;
        values.createddate = dateSeconds;
        values.createdby = sessionStorage.getItem("loggedInUser");
        values.modifiedby = sessionStorage.getItem("loggedInUser");

        values.inventoryid = inventoryParentRecord._id;
        values.inventoryname = inventoryParentRecord.propertyname;
        values.inventorydetails = {
            id: inventoryParentRecord._id,
            propertyname: inventoryParentRecord.propertyname
        };

        values.closedate = closeDateSec;

        // Remove empty leadid
        if (values.leadid === '') {
            delete values.leadid;
        }

        console.log('after change form submission value', values);

        await RequestServer("post", CONSTANTS.upsert, values)
            .then((res) => {
                console.log('post response', res);
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data || `Deal Created for ${inventoryParentRecord.propertyname}`,
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
                console.log('error', error);
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

    const permissionValues = {
        edit: true
    };

    // Filter out inventoryname and modify fields to include dynamic lead selection
    const modifiedFields = opportunityFormFields
        .filter(field => field.name !== 'inventoryname')
        .map(field => {
            if (field.name === 'leadid') {
                return {
                    ...field,
                    type: 'autocomplete',
                    options: leadsRecords,
                    fetchurl: CONSTANTS.getAllLeads,
                    searchfor: 'firstname',
                    onChange: (value, formik) => {
                        if (!value) {
                            formik.setFieldValue("leaddetails", '');
                            formik.setFieldValue("leadid", '');
                            formik.setFieldValue("leadname", '');
                        } else {
                            formik.setFieldValue("leaddetails", value);
                            formik.setFieldValue("leadid", value.id);
                            formik.setFieldValue("leadname", value.leadname);
                        }
                    }
                };
            }
            return field;
        });

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <DynamicForm
                formTitle="New Deal"
                fields={modifiedFields}
                initialValues={generateOpportunityInitialValues()}
                onSubmit={formSubmission}
                permissionValues={permissionValues}
                onFieldChange={(name, value, setFieldValue) => {
                    if (name === 'leadid') {
                        console.log('Lead selected:', value);
                    }
                }}
                handleCancel={handleModal}
            />
        </Grid>
    );
};

export default ModalInventoryOpportunity;
