import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, Forminput, DialogActions,
    MenuItem, TextField, Autocomplete
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
// import axios from 'axios'
// import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import { LeadSourcePickList, OppStagePicklist, OppTypePicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import "../recordDetailPage/Form.css"
import { RequestServer } from "../api/HttpReq";
import { OpportunityInitialValues } from "../formik/InitialValues/formValues";

const url = `/UpsertOpportunity`;
const fetchInventoriesbyName = `/InventoryName`;


const ModalLeadOpportunity = ({ item, handleModal }) => {

    const [leadParentRecord, setLeadParentRecord] = useState();

    const location = useLocation();
    const navigate = useNavigate();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [inventoriesRecord, setInventoriesRecord] = useState([]);

    useEffect(() => {
        console.log('Lead parent  record', location.state.record.item);
        setLeadParentRecord(location.state.record.item)
        FetchInventoriesbyName(false, '')
    }, [])

    const initialValues = OpportunityInitialValues;


    const validationSchema = Yup.object({
        opportunityName: Yup
            .string()
            .required('Required'),
        amount: Yup
            .string()
            .required('Required')
            .matches(/^[0-9]+$/, "Must be only digits")

    })

    const formSubmission = (values) => {
        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();
        let closeDateSec = new Date(values.closedate).getTime()

        values.createdBy = (sessionStorage.getItem("loggedInUser"));
        values.modifiedBy = (sessionStorage.getItem("loggedInUser"));

        values.leadid = leadParentRecord._id;
        values.leadname = leadParentRecord.fullname
        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        delete values.InventoryId;
        values.leaddetails = {
            leadname: leadParentRecord.fullname,
            id: leadParentRecord._id
        }

        if (values.closeDate) {
            values.closedate = closeDateSec ? closeDateSec : new Date().getTime();
        } else {
            values.closedate = new Date().getTime();
        }
        if (values.inventoryid === '') {
            console.log('inventoryid empty')
            delete values.inventoryid;
        }


        console.log('after change form submission value', values);

        RequestServer("post", url, values)
            .then((res) => {
                console.log('post response', res);
                setNotify({
                    isOpen: true,
                    message: res.data,
                    type: 'success'
                })
            })
            .catch((error) => {
                console.log('error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            })
            .finally(() => {
                setTimeout(() => {
                    handleModal()
                }, 1000)
            })

    }

    const FetchInventoriesbyName = (isNameSearch, newInputValue) => {
        let url = isNameSearch ? `${fetchInventoriesbyName}` + `opportunityname=${newInputValue}` : fetchInventoriesbyName;

        RequestServer("get", url, {})
            .then((res) => {
                console.log('res fetch Inventoriesby Name', res.data)
                if (res.success) {
                    if (typeof (res.data) === "object") {
                        setInventoriesRecord(res.data)
                    } else {
                        setInventoriesRecord([])
                    }
                } else {
                    setInventoriesRecord([])
                }
            })
            .catch((error) => {
                console.log('error fetchInventoriesbyName', error);
            })
    }
    return (

        <Grid item xs={12} style={{ margin: "20px" }}>
            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                <h3>New Deals</h3>
            </div>
            <div>
                <Formik
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => { formSubmission(values) }}
                >
                    {(props) => {
                        const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue, errors, touched, } = props;

                        return (
                            <>
                                <ToastNotification notify={notify} setNotify={setNotify} />
                                <Form className="my-form">
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="opportunityName" >Opportunity Name<span className="text-danger">*</span> </label>
                                            <Field name='opportunityName' type="text" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="opportunityName" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="inventoryid">Inventory Name </label>
                                            <Autocomplete
                                                name="inventoryid"
                                                options={inventoriesRecord}
                                                value={values.inventoryDetails}
                                                getOptionLabel={option => option.propertyname || ''}
                                                //  isOptionEqualToValue = {(option,value)=>
                                                //           option.propertyName === value
                                                //   }
                                                onChange={(e, value) => {
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("inventoryid", '')
                                                        setFieldValue("inventoryname", '')
                                                        setFieldValue("inventoryDetails", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("inventoryid", value._id)
                                                        setFieldValue("inventoryDetails", value)
                                                        setFieldValue("inventoryname", value.propertyname)
                                                    }
                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchInventoriesbyName(true, newInputValue);
                                                    }
                                                    else if (newInputValue.length == 0) {
                                                        FetchInventoriesbyName(false, newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="inventoryid" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="stage">Opportunity Stage</label>
                                            <Field name="stage" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    OppStagePicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="type">Type</label>
                                            <Field name="type" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    OppTypePicklist.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="leadSource"> Lead Source</label>
                                            <Field name="leadSource" component={CustomizedSelectForFormik} className="form-customSelect">
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {
                                                    LeadSourcePickList.map((i) => {
                                                        return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                    })
                                                }
                                            </Field>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="closeDate">Close Date</label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    name="closeDate"
                                                    value={values.closeDate}
                                                    onChange={(newValue) => {
                                                        console.log(newValue, "newValue");
                                                        // console.log(new Date(newValue.toDate()).getTime(), "newValue");
                                                        setFieldValue('closeDate', newValue)
                                                    }}
                                                    renderInput={(params) => <TextField  {...params} style={{ width: "100%" }} error={false} />}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="amount">Amount<span className="text-danger">*</span></label>
                                            <Field class="form-input" type='text' name="amount" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="amount" />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="description">Description</label>
                                            <Field as="textarea" name="description" class="form-input-textarea" style={{ width: "100%" }} />
                                        </Grid>
                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                            <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>

                                            <Button type="reset" variant="contained" onClick={handleModal}  >Cancel</Button>
                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </div>
        </Grid>
    )
}
export default ModalLeadOpportunity;
