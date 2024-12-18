import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
    Grid, Button, DialogActions, Tooltip,
    Modal, Box, Autocomplete, TextField, IconButton, MenuItem
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"

// import "../formik/FormStyles.css"
import EmailModalPage from './EmailModalPage';
import ToastNotification from '../toast/ToastNotification';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SendIcon from '@mui/icons-material/Send';
import WhatAppModalPage from './WhatsAppModalPage';
import { LeadSourcePickList, NameSalutionPickList } from '../../data/pickLists'
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import './Form.css'
import { ContactInitialValues, ContactSavedValues } from '../formik/InitialValues/formValues';
import { getPermissions } from '../Auth/getPermission';
import { RequestServer } from '../api/HttpReq';
import { apiCheckPermission } from '../Auth/apiCheckPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';
import WhatAppModalNew from './WhatsAppModalNew';


const ContactDetailPage = ({ item }) => {

    const OBJECT_API = "Contact"
    const url = `/UpsertContact`;
    const fetchAccountsbyName = `/accountsname`;
    const whatsAppTemplate = 'whatsapp/template'

    const [singleContact, setsingleContact] = useState();
    const [accNames, setAccNames] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState(true)
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false)
    const [permissionValues, setPermissionValues] = useState({})

    const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt, "userRoleDpt")


    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleContact(location.state.record.item);
        setshowNew(!location.state.record.item)
        FetchAccountsbyName(false, '');
        fetchObjectPermissions()


    }, [])

    const fetchObjectPermissions = () => {
        if (userRoleDpt) {
            apiCheckPermission(userRoleDpt)
                .then(res => {
                    console.log(res, "apiCheckPermission res")
                    setPermissionValues(res)
                })
                .catch(err => {
                    console.log(err, "res apiCheckPermission error")
                    setPermissionValues({})
                })
        }
        // const getPermission = getPermissions("Contact")
        // console.log(getPermission, "getPermission")
        // setPermissionValues(getPermission)
    }

    const initialValues = ContactInitialValues
    const savedValues = ContactSavedValues(singleContact)
    console.log(savedValues, "savedValues")

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

    const validationSchema = Yup.object({
        firstName: Yup
            .string()
            // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .max(15, 'lastName must be less than 15 characters'),
        lastName: Yup
            .string()
            .required('Required')
            // .matches(/^[A-Za-z ]*$/, 'Numeric characters not accepted')
            .min(3, 'lastName must be more than 3 characters')
            .max(15, 'lastName must be less than 15 characters'),
        phone: Yup
            .string()
            .matches(phoneRegExp, 'Phone number is not valid')
            .min(10, "Phone number must be 10 characters, its short")
            .max(10, "Phone number must be 10 characters,its long"),

        email: Yup
            .string()
            .email('Invalid email address')
            .required('Required'),



    })

    const formSubmission = (values) => {

        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();

        // let dobSec = values.dob ? new Date(values.dob).getTime() : null

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            values.fullName = values.firstName + ' ' + values.lastName;
            // if (values.dob) {
            //     values.dob = dobSec ? dobSec : null;
            // }
            if (values.AccountId === '') {
                delete values.AccountId;
            }

        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = location.state.record.item.createddate;
            values.createdBy = singleContact.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
            values.fullName = values.firstName + ' ' + values.lastName;
            // if (values.dob) {
            //     values.dob = dobSec ? dobSec : null;
            // }
            if (values.AccountId === '') {
                delete values.AccountId;
            }
        }
        console.log('after change form submission value', values);

        RequestServer("post", url, values)
            .then((res) => {
                console.log('upsert record  response', res);
                if (res.success) {
                    console.log("res success", res)
                    setNotify({
                        isOpen: true,
                        message: res.data,
                        type: 'success'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000)
                }
                else {
                    console.log("res else success", res)
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: 'error'
                    })
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000)
                }
            })
            .catch((error) => {
                console.log('upsert record error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
                setTimeout(() => {
                    navigate(-1);
                }, 1000)
            })
    }

    const FetchAccountsbyName = (isNameSearch, newInputValue) => {
        let url = isNameSearch ? `${fetchAccountsbyName}` + `?accountname=${newInputValue}` : fetchAccountsbyName;

        RequestServer("get", url, {})
            .then(res => {
                if (res.success) {
                    console.log(res.data, "res.data")
                    res.data = res.data.map((item) => {
                        return {
                            id: item._id,
                            accountname: item.accountname
                        }
                    })

                    setAccNames(res.data)
                } else {
                    console.log("status error", res.error.message)
                }
            })
            .catch((error) => {
                console.log("error fetchAccountsbyName", error)
            })
    }

    const handleFormClose = () => {
        navigate(-1)
    }
    const handlesendEmail = () => {
        setEmailModalOpen(true)
    }
    const setEmailModalClose = () => {
        setEmailModalOpen(false)
    }
    const handlesendWhatsapp = () => {
        setWhatsAppModalOpen(true)
    }
    const setWhatAppModalClose = () => {
        setWhatsAppModalOpen(false)
    }

    const handlesendWhatsappTemplate = async () => {
        if (singleContact.phone) {
            try {
                let res = await RequestServer("post", whatsAppTemplate, { to: `91${singleContact.phone}` })
                console.log(res, "res")
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: "Promotional Template sent successfully , once user reply,we can send messages",
                        type: 'success'
                    })
                }
            } catch (error) {
                console.log(error, "error")
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: 'error'
                })
            }
        } else {
            setNotify({
                isOpen: true,
                message: 'Phone number is required to send template',
                type: 'error'
            })
        }

    }

    return (
        <div className="App" >
            <Grid item xs={12} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    {
                        showNew ? <h2>New Contact </h2> : <h2>Contact Detail Page </h2>
                    }
                </div>
                <div>

                    <div className='btn-test'>
                        {
                            !showNew && permissionValues.read && permissionValues.create ?
                                <>
                                    <Tooltip title="Send Email">
                                        <IconButton> <EmailIcon sx={{ color: '#DB4437' }} onClick={handlesendEmail} /> </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Whatsapp">
                                        <IconButton> <WhatsAppIcon sx={{ color: '#34A853' }} onClick={handlesendWhatsapp} /> </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Send Whatsapp Template">
                                        <IconButton>
                                            <SendIcon sx={{ color: '#34A853' }} onClick={handlesendWhatsappTemplate} />
                                        </IconButton>
                                    </Tooltip>
                                </>
                                : ''
                        }
                    </div>
                </div>
                <div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={showNew ? initialValues : savedValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => { formSubmission(values) }}
                    >
                        {(props) => {
                            const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue } = props;

                            return (
                                <>
                                    <ToastNotification notify={notify} setNotify={setNotify} />

                                    <Form className='my-form'>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={2}>
                                                <label htmlFor="salutation">Salutation  </label>
                                                <Field name="salutation" component={CustomizedSelectForFormik}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                >
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    {
                                                        NameSalutionPickList.map((i) => {
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                        })
                                                    }
                                                </Field>
                                            </Grid>
                                            <Grid item xs={6} md={4}>
                                                <label htmlFor="firstName" >First Name</label>
                                                <Field name='firstName' type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="firstName" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="lastName" >Last Name<span className="text-danger">*</span> </label>
                                                <Field name='lastName' type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="lastName" />
                                                </div>
                                            </Grid>
                                            {!showNew && (
                                                <>
                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="fullName" >Full Name</label>
                                                        <Field name='fullName' type="text" class="form-input" disabled
                                                        />
                                                    </Grid>
                                                </>
                                            )}
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="AccountId">Account Name </label>
                                                <Autocomplete
                                                    name="AccountId"
                                                    options={accNames}
                                                    value={
                                                        (() => {
                                                            console.log('Current Values:', values.accountdetails);
                                                            const matchedOption = accNames.find(option => {
                                                                console.log(option, "option")
                                                                return option.id == values.accountid

                                                            });
                                                            console.log('Matched Option:', matchedOption);
                                                            return matchedOption || values.accountdetails || null;
                                                        })()

                                                    }
                                                    getOptionLabel={option => option.accountname || ''}
                                                    onChange={(e, value) => {
                                                        if (!value) {
                                                            console.log('!value', value);
                                                            setFieldValue("accountdetails", '')
                                                            setFieldValue("accountname", '')
                                                            setFieldValue("accountid", '')
                                                        } else {
                                                            console.log('value', value);
                                                            setFieldValue("accountid", value.id)
                                                            setFieldValue("accountdetails", value)
                                                            setFieldValue("accountname", value.accountname)
                                                        }
                                                    }}
                                                    onInputChange={(event, newInputValue) => {
                                                        console.log('newInputValue', newInputValue);
                                                        if (newInputValue.length >= 3) {
                                                            // FetchAccountsbyName(newInputValue);
                                                        }
                                                        else if (newInputValue.length === 0) {
                                                            // FetchAccountsbyName(newInputValue);
                                                        }
                                                    }}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                    renderInput={params => (
                                                        <Field component={TextField} {...params} name="AccountId" />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="phone">Phone</label>
                                                <Field name="phone" type="phone" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="phone" />
                                                </div>
                                            </Grid>
                                            {/* <Grid item xs={6} md={6}>
                                                <label htmlFor="dob">Date of Birth </label><br />
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        name="dob"
                                                        value={values.dob}
                                                        onChange={(e) => {
                                                            setFieldValue('dob', e)
                                                        }}
                                                        disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                        renderInput={(params) => <TextField  {...params} style={{ width: '100%' }} error={false} />}
                                                    />
                                                </LocalizationProvider>
                                            </Grid> */}
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="department">Department</label>
                                                <Field name="department" type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="email">Email <span className="text-danger">*</span></label>
                                                <Field name="email" type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="email" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="leadSource">Lead Source</label>
                                                <Field name="leadSource" component={CustomizedSelectForFormik}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                >
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    {
                                                        LeadSourcePickList.map((i) => {
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                        })
                                                    }
                                                </Field>
                                            </Grid>
                                            <Grid Grid item xs={6} md={6}>
                                                <label htmlFor="fullAddress">Full Address</label>
                                                <Field as="textarea" name="fullAddress" class="form-input-textarea"
                                                    style={{ width: '100%' }}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </Grid>
                                            <Grid Grid item xs={6} md={12}>
                                                <label htmlFor="description">Description</label>
                                                <Field as="textarea" name="description" class="form-input-textarea"
                                                    style={{ width: '100%' }}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </Grid>
                                            {!showNew && (
                                                <>
                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="createdDate" >Created Date</label>
                                                        <Field name='createdDate' type="text" class="form-input" disabled
                                                            value={values.createdBy?.userFullName + " ," + values.createdDate}
                                                        />
                                                    </Grid>

                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="modifiedDate" >Modified Date</label>
                                                        <Field name='modifiedDate' type="text" class="form-input"
                                                            value={values.modifiedBy?.userFullName + " ," + values.modifiedDate}
                                                            disabled />
                                                    </Grid>
                                                </>
                                            )}
                                        </Grid>
                                        <div className='action-buttons'>
                                            <DialogActions sx={{ justifyContent: "space-between" }}>
                                                {
                                                    showNew ?
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Save</Button>
                                                        :
                                                        <Button type='success' variant="contained" color="secondary" disabled={isSubmitting || !dirty}>Update</Button>
                                                }
                                                <Button type="reset" variant="contained" onClick={handleFormClose}  >Cancel</Button>
                                            </DialogActions>
                                        </div>
                                    </Form>
                                </>
                            )
                        }}
                    </Formik>
                </div>
            </Grid>

            <Modal
                open={emailModalOpen}
                onClose={setEmailModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='modal'>
                    <EmailModalPage data={singleContact} handleModal={setEmailModalClose} bulkMail={false} />
                </div>
            </Modal>
            <Modal
                open={whatsAppModalOpen}
                onClose={setWhatAppModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className='modal'>
                    <WhatAppModalNew data={singleContact} handleModal={setWhatAppModalClose} bulkMail={true} />
                </div>
            </Modal>

        </div>
    )
}
export default ContactDetailPage;

