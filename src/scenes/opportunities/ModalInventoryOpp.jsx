import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, Forminput, DialogActions,
    MenuItem, TextField, Autocomplete
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import ToastNotification from '../toast/ToastNotification';
import { LeadSourcePickList, OppStagePicklist, OppTypePicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../recordDetailPage/Form.css'
import { RequestServer } from '../api/HttpReq';
import { OpportunityInitialValues } from '../formik/InitialValues/formValues';

const url = `/UpsertOpportunity`;
const fetchLeadsbyName = `/LeadsbyName`;

const ModalInventoryOpportunity = ({ item, handleModal }) => {

    const [inventoryParentRecord, setinventoryParentRecord] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [leadsRecords, setLeadsRecords] = useState([]);
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })


    useEffect(() => {
        console.log('Inventory parent  record', location.state.record.item);
        setinventoryParentRecord(location.state.record.item)
        FetchLeadsbyName(false, '')
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
        let createDateSec = new Date(values.createdDate).getTime()
        let closeDateSec = new Date(values.closeDate).getTime()

        values.modifiedDate = dateSeconds;
        values.createdDate = dateSeconds;
        values.createdBy = (sessionStorage.getItem("loggedInUser"));
        values.modifiedBy = (sessionStorage.getItem("loggedInUser"));

        values.inventoryid = inventoryParentRecord._id;
        values.inventoryname = inventoryParentRecord.propertyname;
        values.inventorydetails = { id: inventoryParentRecord._id, propertyname: inventoryParentRecord.propertyname }

        if (values.closeDate) {
            values.closeDate = closeDateSec ? closeDateSec : new Date().getTime();
        }
        else {
            values.closedate = new Date().getTime();
        }
        if (values.LeadId === '') {
            console.log('LeadId empty')
            delete values.LeadId;
        }


        console.log('after change form submission value', values);

        RequestServer("post", url, values)
            .then((res) => {
                console.log('post response', res);
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    })
                } else {
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    })
                }
            })
            .catch((error) => {
                console.log('error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
                setTimeout(() => {
                    handleModal();
                }, 1000)
            })
            .finally(() => {
                setTimeout(() => {
                    handleModal();
                }, 1000);
            })
    }

    const FetchLeadsbyName = (isNameSearch, newInputValue) => {
        console.log('inside FetchLeadsbyName fn');
        console.log('newInputValue', newInputValue)
        let url = isNameSearch ? `${fetchLeadsbyName}` + `?firstname=${newInputValue}` : fetchLeadsbyName;


        RequestServer("get", url, {})
            .then((res) => {
                console.log('res fetchLeadsbyName', res.data)
                if (res.success) {
                    if (typeof (res.data) === "object") {
                        res.data = res.data.map((item) => {
                            return {
                                id: item._id,
                                leadname: item.fullname
                            }
                        })
                        console.log('fetchLeadsbyName1', res.data)
                        setLeadsRecords(res.data)
                    } else {
                        setLeadsRecords([])
                    }
                } else {
                    setLeadsRecords([])
                }
            })
            .catch((error) => {
                console.log('error fetchLeadsbyName', error);
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
                                            <label htmlFor="leadid">Enquiry Name </label>
                                            <Autocomplete
                                                name="leadid"
                                                options={leadsRecords}
                                                value={(() => {
                                                    console.log('Current Values:', values);
                                                    const matchedOption = leadsRecords.find(option => {
                                                        console.log(option, "option")
                                                        return option.id == values.leadid

                                                    });
                                                    console.log('Matched Option:', matchedOption);
                                                    return matchedOption || values.leaddetails || null;
                                                })()}
                                                getOptionLabel={option => option.leadname || ''}
                                                onChange={(e, value) => {
                                                    console.log('lead onchange', value);
                                                    if (!value) {
                                                        console.log('!value', value);
                                                        setFieldValue("leaddetails", '')
                                                        setFieldValue("leadid", '')
                                                        setFieldValue("leadname", '')
                                                    } else {
                                                        console.log('value', value);
                                                        setFieldValue("leaddetails", value)
                                                        setFieldValue("leadid", value.id)
                                                        setFieldValue("leadname", value.leadname)
                                                    }

                                                }}
                                                onInputChange={(event, newInputValue) => {
                                                    console.log('newInputValue', newInputValue);
                                                    if (newInputValue.length >= 3) {
                                                        FetchLeadsbyName(newInputValue);
                                                    }
                                                    else if (newInputValue.length == 0) {
                                                        FetchLeadsbyName(newInputValue);
                                                    }
                                                }}
                                                renderInput={params => (
                                                    <Field component={TextField} {...params} name="LeadId" />
                                                )}
                                            />
                                        </Grid>
                                        <Grid item xs={6} md={6}>
                                            <label htmlFor="stage">Deal Stage</label>
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
                                            <label htmlFor="leadSource"> Enquiry Source</label>
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
                                            <label htmlFor="closeDate">Close Date<span className="text-danger">*</span></label>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    name="closeDate"
                                                    value={values.closeDate}
                                                    onChange={(e) => {
                                                        setFieldValue('closeDate', e)
                                                    }}
                                                    renderInput={(params) => <TextField  {...params} style={{ width: '100%' }} error={false} />}
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
                                            <Field as="textarea" name="description" class="form-input-textarea" style={{ width: '100%' }} />
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
export default ModalInventoryOpportunity;
