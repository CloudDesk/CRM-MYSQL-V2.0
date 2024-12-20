import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Grid, Button, DialogActions, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"
import './Form.css'
import ToastNotification from '../toast/ToastNotification';
import { AccCitiesPickList, AccCountryPickList, InvStatusPicklist, InvTypePicklist } from '../../data/pickLists';
import CustomizedSelectForFormik from '../formik/CustomizedSelectForFormik';
import { InventoryInitialValues, InventorySavedValues } from '../formik/InitialValues/formValues';
import { getPermissions } from '../Auth/getPermission';
import { RequestServer } from '../api/HttpReq';
import { apiCheckPermission } from '../Auth/apiCheckPermission'
import { getLoginUserRoleDept } from '../Auth/userRoleDept';


const InventoryDetailPage = ({ item }) => {

    const OBJECT_API = "Inventory"
    const url = `/UpsertInventory`;

    const [singleInventory, setsingleInventory] = useState();
    const location = useLocation();
    const navigate = useNavigate();
    const [showNew, setshowNew] = useState(true)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [countryPicklist, setCountriesPicklist] = useState([])
    const [cityPicklist, setCitiesPicklist] = useState([])
    const [permissionValues, setPermissionValues] = useState({})

    const userRoleDpt = getLoginUserRoleDept(OBJECT_API)
    console.log(userRoleDpt, "userRoleDpt")

    useEffect(() => {
        console.log('passed record', location.state.record.item);
        setsingleInventory(location.state.record.item);
        setshowNew(!location.state.record.item)
        fetchObjectPermissions();
    }, [])

    const fetchObjectPermissions = () => {
        if (userRoleDpt) {
            apiCheckPermission(userRoleDpt)
                .then(res => {
                    console.log(res, "apiCheckPermission promise res")
                    setPermissionValues(res)
                })
                .catch(err => {
                    console.log(err, "res apiCheckPermission error")
                    setPermissionValues({})
                })
        }
        // const getPermission=getPermissions("Inventory")
        // console.log(getPermission,"getPermission")
        // setPermissionValues(getPermission)  
    }

    const initialValues = InventoryInitialValues
    const savedValues = InventorySavedValues(singleInventory)

    const handleCountryChange = (event, setFieldValue) => {
        const selectedCountry = event.target.value;
        setFieldValue("country", selectedCountry);
        setFieldValue("city", ""); // Reset the city field when the country changes
    };

    const getCitiesPicklist = (selectedCountry) => {
        // Correctly access cities for the selected country
        return AccCitiesPickList[selectedCountry] || [];
    };

    const validationSchema = Yup.object({
        projectName: Yup
            .string()
            .required('Required'),
        propertyName: Yup
            .string()
            .required('Required'),
        type: Yup
            .string()
            .required('Required'),
        status: Yup
            .string()
            .required('Required'),
    })

    const formSubmission = (values) => {

        console.log('form submission value', values);

        let dateSeconds = new Date().getTime();

        if (showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = dateSeconds;
            values.createdBy = (sessionStorage.getItem("loggedInUser"));
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
        }
        else if (!showNew) {
            values.modifiedDate = dateSeconds;
            values.createdDate = location.state.record.item.createddate;
            values.createdBy = singleInventory.createdBy;
            values.modifiedBy = (sessionStorage.getItem("loggedInUser"));
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
                } else {
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
                console.log('upsert record  error', error);
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

    const handleFormClose = () => {
        navigate(-1)
    }

    return (
        <>

            <Grid item xs={12} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    {
                        showNew ? <h3>New Inventory</h3> : <h3>Inventory Detail Page </h3>
                    }
                </div>
                <div>
                    <Formik
                        enableReinitialize={true}
                        initialValues={showNew ? initialValues : savedValues}
                        validationSchema={validationSchema}
                        onSubmit={(values) => { formSubmission(values) }}
                    >
                        {(props) => {
                            const { values, dirty, isSubmitting, handleChange, handleSubmit, handleReset, setFieldValue, errors, touched, } = props;

                            return (
                                <>
                                    <ToastNotification notify={notify} setNotify={setNotify} />
                                    <Form className='my-form'>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="projectName">Project Name <span className="text-danger">*</span> </label>
                                                <Field name="projectName" type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="projectName" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="propertyName">Property Name <span className="text-danger">*</span> </label>
                                                <Field name="propertyName" type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="propertyName" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="propertyUnitNumber">Property Unit Number</label>
                                                <Field name="propertyUnitNumber" type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="type">Type <span className="text-danger">*</span> </label>
                                                <Field name="type" component={CustomizedSelectForFormik}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}>
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    {
                                                        InvTypePicklist.map((i) => {
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                        })
                                                    }
                                                </Field>
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="type" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="status">Status <span className="text-danger">*</span> </label>
                                                <Field name="status" component={CustomizedSelectForFormik}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                >
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    {
                                                        InvStatusPicklist.map((i) => {
                                                            return <MenuItem value={i.value}>{i.text}</MenuItem>
                                                        })
                                                    }
                                                </Field>
                                                <div style={{ color: 'red' }}>
                                                    <ErrorMessage name="status" />
                                                </div>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="tower">Tower </label>
                                                <Field name="tower" type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="country">Country</label>
                                                <Field
                                                    className="form-input"
                                                    id="country"
                                                    name="country"
                                                    component={CustomizedSelectForFormik}
                                                    value={values.country}
                                                    onChange={(event) => handleCountryChange(event, setFieldValue)}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                >
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    {AccCountryPickList.map((country) => (
                                                        <MenuItem key={country.value} value={country.value}>
                                                            {country.text}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="city">City</label>
                                                <Field
                                                    className="form-input"
                                                    value={values.city}
                                                    id="city"
                                                    name="city"
                                                    component={CustomizedSelectForFormik}
                                                    onChange={handleChange}
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit}
                                                >
                                                    <MenuItem value=""><em>None</em></MenuItem>
                                                    {getCitiesPicklist(values.country).map((city) => (
                                                        <MenuItem key={city.value} value={city.value}>
                                                            {city.text}
                                                        </MenuItem>
                                                    ))}
                                                </Field>
                                            </Grid>

                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="floor">Floor</label>
                                                <Field name="floor" type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit} />
                                            </Grid>
                                            <Grid item xs={6} md={6}>
                                                <label htmlFor="totalArea">Total Area</label>
                                                <Field name="totalArea" type="text" class="form-input"
                                                    disabled={showNew ? !permissionValues.create : !permissionValues.edit} />
                                            </Grid>
                                            {!showNew && (
                                                <>
                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="createdDate" >Created Date</label>
                                                        <Field name='createdDate' type="text" class="form-input"
                                                            value={values.createdBy?.userFullName + " , " + values.createdDate} disabled />
                                                    </Grid>

                                                    <Grid item xs={6} md={6}>
                                                        <label htmlFor="modifiedDate" >Modified Date</label>
                                                        <Field name='modifiedDate' type="text" class="form-input"
                                                            value={values.modifiedBy?.userFullName + " , " + values.modifiedDate}
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
                                                <Button type="reset" variant="contained" onClick={handleFormClose}   >Cancel</Button>
                                            </DialogActions>
                                        </div>
                                    </Form>
                                </>
                            )
                        }}
                    </Formik>
                </div>
            </Grid>
        </>
    )
}
export default InventoryDetailPage;