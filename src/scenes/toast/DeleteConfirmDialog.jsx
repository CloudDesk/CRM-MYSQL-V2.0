import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    CircularProgress,
} from '@mui/material';

function DeleteConfirmDialog({ confirmDialog, setConfirmDialog, moreModalClose }) {

    const handleCloseNo = () => {
        setConfirmDialog({ ...confirmDialog, isOpen: false })
        if (moreModalClose) {
            moreModalClose()
        }
    }

    const handleCloseYes = () => {
        setConfirmDialog({ ...confirmDialog, isLoading: true });
        confirmDialog.onConfirm();
        if (moreModalClose) {
            moreModalClose()
        }
    }


    return (
        <Dialog open={confirmDialog.isOpen} onClose={() => !confirmDialog.isLoading && handleCloseNo()}>
            <DialogTitle>

            </DialogTitle>

            <DialogContent>
                <Typography variant='h5'>
                    {confirmDialog.title}
                </Typography>
                <Typography variant='subtitle2'>
                    {confirmDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    variant='contained'
                    color='inherit'
                    disabled={confirmDialog.isLoading}
                    onClick={handleCloseNo}>No</Button>
                <Button
                    variant='contained'
                    color='warning'
                    disabled={confirmDialog.isLoading}
                    onClick={handleCloseYes}>
                    {confirmDialog.isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Yes'
                    )}
                </Button>
            </DialogActions>

        </Dialog>
    )
}

export default DeleteConfirmDialog