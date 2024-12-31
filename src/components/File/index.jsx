import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Alert,
  Stack
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Description as DocIcon,
  TableChart as SpreadsheetIcon
} from '@mui/icons-material';

const getFileIcon = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'pdf':
      return <PdfIcon />;
    case 'jpg':
    case 'jpeg':
    case 'png':
      return <ImageIcon />;
    case 'doc':
    case 'docx':
      return <DocIcon />;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return <SpreadsheetIcon />;
    default:
      return <FileIcon />;
  }
};

const FileUpload = ({
  onUpload,
  maxFiles = 10,
  allowedTypes = ".jpeg,.pdf,.png,.csv,.xlsx,.doc"
}) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    if (files.length + newFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
    setError('');
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }
    onUpload(files);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          p: 4,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.300',
          backgroundColor: isDragging ? 'primary.50' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: 'primary.main'
          }
        }}
      >
        <input
          type="file"
          multiple
          accept={allowedTypes}
          onChange={handleFileInput}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0,
            cursor: 'pointer'
          }}
        />

        <Stack spacing={2} alignItems="center">
          <UploadIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          <Typography variant="h6" align="center">
            Drag and drop files here, or click to select
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Supported formats: {allowedTypes.replace(/\./g, '').toUpperCase()}
          </Typography>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files ({files.length})
          </Typography>

          <Paper variant="outlined">
            <List>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeFile(index)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <Box sx={{ mr: 2, color: 'text.secondary' }}>
                    {getFileIcon(file.name)}
                  </Box>
                  <ListItemText
                    primary={file.name}
                    secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                    primaryTypographyProps={{ style: { wordBreak: 'break-all' } }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={() => setFiles([])}
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={handleUpload}
              color="primary"
            >
              Upload Files
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;