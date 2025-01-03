import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Grid } from "@mui/material";
import ToastNotification from '../toast/ToastNotification';
import { RequestServer } from '../api/HttpReq';
import { accountformfields, generateAccountInitialValues } from '../formik/InitialValues/initialValues';
import { DynamicForm } from "../../components/Form/DynamicForm";
import { appConfig } from '../../config/appConfig';

const url = appConfig.objects.account.upsert;

const ModalInventoryAccount = ({ item, handleModal }) => {
    const [inventoryParentRecord, setInventoryParentRecord] = useState();
    const location = useLocation();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setInventoryParentRecord(location.state.record.item);
    }, []);

    const formSubmission = async (values) => {
        console.log('form submission value', values);
        if (values.billingcityOptions) {
            delete values.billingcityOptions
        }
        let dateSeconds = new Date().getTime();
        values.accountnumber = Number(values.accountnumber)
        values.annualrevenue = Number(values.annualrevenue)
        values.phone = Number(values.phone)
        values.modifieddate = dateSeconds;
        values.createddate = dateSeconds;
        values.inventoryid = inventoryParentRecord._id;
        values.inventoryname = inventoryParentRecord.propertyname;
        values.inventorydetails = {
            id: inventoryParentRecord._id,
            propertyname: inventoryParentRecord.propertyname
        };
        values.createdby = (sessionStorage.getItem("loggedInUser"));
        values.modifiedby = (sessionStorage.getItem("loggedInUser"));

        console.log('after change form submission value', values);

        await RequestServer("post", url, values)
            .then((res) => {
                console.log('upsert record response', res);
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data || `Account Created for ${inventoryParentRecord.propertyname}`,
                        type: 'success',
                    });
                } else {
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error',
                    });
                }
            })
            .catch((error) => {
                console.log('upsert record error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                });
            })
            .finally(() => {
                setTimeout(() => {
                    handleModal();
                }, 2000);
            });
    };

    const permissionValues = {
        edit: true
    };

    const filteredFields = accountformfields.filter((i) => {
        return i.name !== "inventoryname"
    })
    console.log(filteredFields, 'filteredFields');
    return (
        <Grid item xs={12} style={{ margin: "20px" }}>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <DynamicForm
                formTitle="New Account"
                fields={filteredFields}
                initialValues={generateAccountInitialValues()}
                onSubmit={formSubmission}
                permissionValues={permissionValues}
                onFieldChange={(name, value, setFieldValue) => {
                    // Custom field change logic if needed
                    if (name === 'billingCountry') {
                        // Reset billing city when country changes
                        setFieldValue('billingCity', '');
                    }
                }}
                handleCancel={handleModal}
            />
        </Grid>
    );
};

export default ModalInventoryAccount;
