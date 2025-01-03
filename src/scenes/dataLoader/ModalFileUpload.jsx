import { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Alert,
    Button,
    IconButton,
} from "@mui/material";
import {
    CloudUpload as UploadIcon,
    Close as CloseIcon,
    Description as FileIcon,
    Error as ErrorIcon,
} from '@mui/icons-material';
import axios from 'axios';
import PreviewUpsert from "./PreviewUpsert";
import { DATALOADER_CONSTANTS } from "../../config/constantConfigs";


const FileUploadComponent = ({ object, handleModal, callBack }) => {
    const [uploadedData, setUploadedData] = useState([]);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSend = async (file) => {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(DATALOADER_CONSTANTS.ROUTES.preview, formData);
            setUploadedData(response.data);
        } catch (error) {
            setError(error.message || 'Error uploading file');
            setUploadedFile(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type === 'text/csv') {
            setUploadedFile(file);
            handleFileSend(file);
        } else {
            setError('Please upload a CSV file');
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            setUploadedFile(file);
            handleFileSend(file);
        } else {
            setError('Please upload a CSV file');
        }
    };

    if (uploadedData.length > 0) {
        return (
            <PreviewUpsert
                callBack={callBack}
                object={object}
                data={uploadedData}
                file={uploadedFile}
                ModalClose={handleModal}
            />
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
                Data Loader
            </Typography>

            <Paper
                sx={{
                    p: 4,
                    border: '2px dashed',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        borderColor: 'primary.dark',
                        bgcolor: 'action.hover',
                    },
                }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {isLoading ? (
                        <CircularProgress />
                    ) : uploadedFile ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FileIcon sx={{ fontSize: 24 }} />
                            <Typography>{uploadedFile.name}</Typography>
                            <IconButton
                                size="small"
                                onClick={() => setUploadedFile(null)}
                                sx={{ ml: 1 }}
                            >
                                <CloseIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>
                    ) : (
                        <>
                            <UploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" gutterBottom>
                                    Drag and drop your CSV file here
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                    or
                                </Typography>
                                <Button
                                    component="label"
                                    variant="contained"
                                    startIcon={<UploadIcon />}
                                    sx={{ mt: 1 }}
                                >
                                    Browse Files
                                    <input
                                        type="file"
                                        hidden
                                        accept=".csv"
                                        onChange={handleFileSelect}
                                    />
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Paper>

            {error && (
                <Alert
                    severity="error"
                    icon={<ErrorIcon />}
                    sx={{ mt: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <Typography
                variant="caption"
                color="textSecondary"
                display="block"
                textAlign="center"
                sx={{ mt: 2 }}
            >
                Supported file type: CSV
            </Typography>
        </Box>
    );
};

export default FileUploadComponent;