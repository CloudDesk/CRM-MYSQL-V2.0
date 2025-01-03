import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid } from "@mui/material";
import ToastNotification from '../../shared/toast/ToastNotification';
import { RequestServer } from '../../api/HttpReq';
import { opportunityFormFields, generateOpportunityInitialValues } from '../../formik/InitialValues/initialValues';
import { DynamicForm } from "../../../components/Form/DynamicForm";
import { appConfig } from '../../../config/appConfig';

const url = `/UpsertOpportunity`;
const fetchInventoriesbyName = `/InventoryName`;

const CONSTANTS = {
    upsert: appConfig.objects.opportunity.upsert,
    getAllInventory: appConfig.objects.inventory.fetchAllInventories,
    getInventoryByProperty: appConfig.objects.inventory.fetchInventoryByPropertyName

}

const ModalLeadOpportunity = ({ item, handleModal }) => {
    const [leadParentRecord, setLeadParentRecord] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const [inventoriesRecord, setInventoriesRecord] = useState([]);

    useEffect(() => {
        console.log('Lead parent record', location.state.record.item);
        setLeadParentRecord(location.state.record.item);
        FetchInventoriesbyName(false, '');
    }, []);

    const FetchInventoriesbyName = (isNameSearch, newInputValue) => {
        let url = isNameSearch
            ? `${CONSTANTS.getInventoryByProperty}${newInputValue}`
            : CONSTANTS.getAllInventory;

        RequestServer("get", url, {})
            .then((res) => {
                console.log('res fetch Inventoriesby Name', res.data);
                if (res.success) {
                    const inventoryData = typeof res.data === "object"
                        ? res.data.map(inv => ({
                            value: inv._id,
                            label: inv.propertyname
                        }))
                        : [];
                    setInventoriesRecord(inventoryData);
                } else {
                    setInventoriesRecord([]);
                }
            })
            .catch((error) => {
                console.log('error fetchInventoriesbyName', error);
            });
    };

    // Modify fields to include dynamic inventory selection
    const modifiedFields = opportunityFormFields
        .filter(field => !['inventoryname', 'leadname'].includes(field.name))
        .map(field => {
            if (field.name === 'inventoryid') {
                return {
                    ...field,
                    type: 'autocomplete',
                    options: inventoriesRecord,
                    fetchurl: CONSTANTS.getAllInventory,
                    searchfor: 'propertyname',
                    onChange: (value, formik) => {
                        const inventoryDetails = value || null;
                        const inventoryName = value?.label || '';
                        formik.setFieldValue("inventoryname", inventoryName);
                        formik.setFieldValue("inventoryDetails", inventoryDetails);
                    }
                };
            }
            return field;
        });


    const formSubmission = async (values) => {
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let closeDateSec = values.closedate
            ? new Date(values.closedate).getTime()
            : new Date().getTime();

        values.createdby = (sessionStorage.getItem("loggedInUser"));
        values.modifiedby = (sessionStorage.getItem("loggedInUser"));

        values.leadid = leadParentRecord._id;
        values.leadname = leadParentRecord.fullname;
        values.modifieddate = dateSeconds;
        values.createddate = dateSeconds;

        // Add leaddetails
        values.leaddetails = {
            leadname: leadParentRecord.fullname,
            id: leadParentRecord._id
        };

        // Handle closedate
        values.closedate = closeDateSec;

        // Remove empty inventoryid
        if (values.inventoryid === '') {
            delete values.inventoryid;
        }

        console.log('after change form submission value', values);

        await RequestServer("post", CONSTANTS.upsert, values)
            .then((res) => {
                console.log('post response', res);
                setNotify({
                    isOpen: true,
                    message: res.data || `Deal Created For Lead ${leadParentRecord.fullname}`,
                    type: 'success'
                });
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

    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <DynamicForm
                formTitle="New Deal"
                fields={modifiedFields}
                initialValues={generateOpportunityInitialValues()}
                onSubmit={formSubmission}
                permissionValues={permissionValues}
                handleCancel={handleModal}
                onFieldChange={(name, value, setFieldValue) => {
                    // Custom field change logic if needed
                    if (name === 'inventoryid') {
                        console.log('Inventory selected:', value);
                    }
                }}

            />
        </Grid>
    );
};

export default ModalLeadOpportunity;
