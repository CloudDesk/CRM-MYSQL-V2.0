import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import ToastNotification from "../toast/ToastNotification";
import { RequestServerFiles } from "../api/HttpReqFiles";
import { apiMethods } from "../api/methods";
import { useLocation } from "react-router-dom";
import FileUpload from "../../components/common/File";
import { appConfig } from "../../config/appConfig";

const URL_postRecords = `/upsertfiles`

const CONSTANTS = {
    upsert: appConfig.api.files.upsert,
    TASK_API: appConfig.objects.task.apiName
}

const ModalTaskFileUpload = ({ handleModal }) => {
    const location = useLocation();
    console.log(location.state, "ModalTaskFileUpload")
    const record = location.state.record.item;
    console.log(record, "record ModalTaskFileUpload")

    const [notify, setNotify] = useState({ isOpen: false, message: "", type: "", });

    const [fileUploadRes, setFileUploadResponse] = useState();


    const handleUploadButtonClick = (files) => {
        let dateSeconds = new Date().getTime();
        let userDetails = (sessionStorage.getItem("loggedInUser"))
        let relatedObj = { id: record.taskId || record._id, object: record.OBJECT_API || CONSTANTS.TASK_API }

        const commonFormData = new FormData();
        commonFormData.append("relatedto", JSON.stringify(relatedObj));
        commonFormData.append("createddate", dateSeconds);
        commonFormData.append("modifieddate", dateSeconds);
        commonFormData.append("createdby", (userDetails));
        commonFormData.append("modifiedby", (userDetails));
        commonFormData.append("eventid", (record.taskId || record._id));

        files && files.forEach((file) => {
            const formData = new FormData();
            formData.append("file", file);
            appendCommonFields(formData, commonFormData);
            uploadSingleFile(formData);
        });
    }

    const appendCommonFields = (formData, commonFormData) => {
        for (const [key, value] of commonFormData.entries()) {
            formData.append(key, value);
        }
    };

    const uploadSingleFile = (formData) => {
        RequestServerFiles(apiMethods.post, CONSTANTS.upsert, formData)
            .then(res => {
                console.log("RequestServerFiles response", res)
                if (res.success) {
                    console.log("file Submission  response", res);
                    setFileUploadResponse(res.data);
                    setNotify({
                        isOpen: true,
                        message: "file Uploaded successfully",
                        type: "success",
                    });
                } else {
                    console.log("RequestServer file then error", res.error.message)
                    setNotify({
                        isOpen: true,
                        message: res.error.message,
                        type: "error",
                    });
                }
            })
            .catch((error) => {
                console.log('RequestServer file form Submission  error', error);
                setNotify({
                    isOpen: true,
                    message: error.message,
                    type: "error",
                });
            })
            .finally(() => {
                setTimeout(() => {
                    handleModal()
                }, 1000)
            })
    };



    return (
        <>
            <ToastNotification notify={notify} setNotify={setNotify} />
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography fontWeight={'bold'} variant="h3">Upload Files</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", height: "100%", width: '100%', marginTop: '30px' }}>
                <FileUpload
                    onUpload={(files) => {
                        handleUploadButtonClick(files)
                    }}
                    maxFiles={1}
                    allowedTypes=".jpeg,.pdf,.png"

                />
            </Box>
        </>
    );

};
export default ModalTaskFileUpload;