import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { Grid, Button, DialogActions } from "@mui/material";
// import axios from 'axios'
import "../formik/FormStyles.css"
import ToastNotification from '../toast/ToastNotification';
import { RequestServerFiles } from "../api/HttpReqFiles";
import { RequestServer } from "../api/HttpReq";

const urlSendWhatsAppbulk = `/whatsapp/personal`

export default function WhatAppModalNew({ data, handleModal, bulkMail }) {

    const [parentRecord, setParentRecord] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // notification
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    useEffect(() => {
        console.log('whats app data', data);
        setParentRecord(data)

    }, [])

    const initialValues = {
        message: '',
    }

    const validationSchema = Yup.object({
        message: Yup
            .string()
            .required('Required'),
    })


    const formSubmission = async (values, { resetForm }) => {
        console.log('inside form Submission', values);

        values.recordsData = parentRecord;
        console.log('len', values.recordsData.length > 0);

        let arr = [];
        arr.push((values.recordsData));
        console.log('arr', arr);
        let RecordConvert = (values.recordsData.length > 0 ? (values.recordsData) : (arr))
        console.log('RecordConvert', RecordConvert)


        RecordConvert.forEach(element => {
            onebyoneWhatsapp(element, values)
        });

    }

    const onebyoneWhatsapp = (values, element) => {

        console.log('values', values);
        console.log('element', element)

        let mergeBody = `Hai ${values.fullname},` + '\n' + "\n" + element.message

        let obj = {
            to: `91${values.phone}`,
            message: element.message
        }




        RequestServer("post", urlSendWhatsAppbulk, obj)
            .then((res) => {
                console.log('email send res', res)
                if (res.success) {
                    setNotify({
                        isOpen: true,
                        message: "Whatsapp message send successfully",
                        type: 'success'
                    })
                    setTimeout(() => {
                        handleModal(false)
                    }, 2000)
                } else {
                    setNotify({
                        isOpen: true,
                        message: "Whatsapp message send Failed",
                        type: 'success'
                    })
                    setTimeout(() => {
                        handleModal(false)
                    }, 2000)
                }
            })
            .catch((error) => {
                console.log('email send error', error);
                setNotify({
                    isOpen: true,
                    message: "Whatsapp message send Failed",
                    type: 'error'
                })
                setTimeout(() => {
                    handleModal(false)
                }, 2000)
            })
    }

    return (
        <>
            <Grid item xs={12} style={{ margin: "20px" }}>
                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                    <h3>New Whats App</h3>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => formSubmission(values, { resetForm })}
                >
                    {(props) => {
                        const { isSubmitting, setFieldValue } = props;

                        return (
                            <>
                                <Form className="my-form">
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={12}>
                                            <label htmlFor="message">Message  <span className="text-danger">*</span></label>
                                            <Field name="message" as="textarea" class="form-input" />
                                            <div style={{ color: 'red' }}>
                                                <ErrorMessage name="message" />
                                            </div>
                                        </Grid>


                                    </Grid>
                                    <div className='action-buttons'>
                                        <DialogActions sx={{ justifyContent: "space-between" }}>

                                            <Button type='success' variant="contained" color="secondary" disabled={isSubmitting}>Send</Button>

                                            <Button type="reset" variant="contained" onClick={(e) => handleModal(false)} >Cancel</Button>

                                        </DialogActions>
                                    </div>
                                </Form>
                            </>
                        )
                    }}
                </Formik>
            </Grid>
            <ToastNotification notify={notify} setNotify={setNotify} />
        </>
    )
}


