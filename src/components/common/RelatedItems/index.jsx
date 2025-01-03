import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Modal, Box } from "@mui/material";
import { RequestServer } from '../../../scenes/api/HttpReq';
import { apiCheckPermission } from '../../../scenes/shared/Auth/apiCheckPermission';
import { getUserRoleAndDepartment } from '../../../utils/sessionUtils';
import ToastNotification from '../../../scenes/shared/toast/ToastNotification';
import DeleteConfirmDialog from '../../../scenes/shared/toast/DeleteConfirmDialog';
import RelatedSection from './RelatedSection';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
    maxWidth: '90vw',
    width: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
};

const RelatedItems = ({
    parentId,
    sections = [],
    modals = []
}) => {
    const navigate = useNavigate();
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' });
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
    const [modalStates, setModalStates] = useState({});
    const [sectionData, setSectionData] = useState({});
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        if (!parentId) return;

        const initialModalStates = {};
        modals.forEach(modal => {
            initialModalStates[modal.key] = false;
        });
        setModalStates(initialModalStates);

        sections.forEach(section => {
            fetchSectionData(section);
            fetchPermissions(section);
        });
    }, [parentId]);

    const fetchSectionData = async (section) => {
        if (!section.fetchUrl || !parentId) return;

        try {
            const response = await RequestServer("get", `${section.fetchUrl}${parentId}`);
            if (response.success) {
                setSectionData(prev => ({
                    ...prev,
                    [section.key]: response.data || []
                }));
            }
        } catch (error) {
            console.error(`Error fetching ${section.key} data:`, error);
            setSectionData(prev => ({
                ...prev,
                [section.key]: []
            }));
        }
    };

    const fetchPermissions = async (section) => {
        if (!section.objectApi) return;

        const userRoleDept = getUserRoleAndDepartment(section.objectApi);
        if (userRoleDept) {
            try {

                const response = await apiCheckPermission(userRoleDept);
                setPermissions(prev => ({
                    ...prev,
                    [section.key]: response
                }));
            } catch (error) {
                console.error(`Error fetching ${section.key} permissions:`, error);
                setPermissions(prev => ({
                    ...prev,
                    [section.key]: {}
                }));
            }
        }
    };

    const handleDelete = async (section, itemId) => {
        try {
            const deleteURL = `${section.deleteUrl}/${itemId}`;
            const response = await RequestServer("delete", deleteURL);

            if (response.success) {
                setNotify({
                    isOpen: true,
                    message: 'Record deleted successfully',
                    type: "success"
                });
                fetchSectionData(section);
            } else {
                setNotify({
                    isOpen: true,
                    message: response.error?.message || 'Failed to delete record',
                    type: "error"
                });
            }
        } catch (error) {
            setNotify({
                isOpen: true,
                message: error.message || 'Error deleting record',
                type: "error"
            });
        } finally {
            setConfirmDialog(prev => ({
                ...prev,
                isOpen: false
            }));
        }
    };

    const handleModalClose = async (modalKey) => {
        try {
            const section = sections.find(s => s.key === modalKey);
            if (section) {
                await fetchSectionData(section);
            }
        } catch (error) {
            console.error('Error refreshing data after modal close:', error);
        } finally {
            setModalStates(prev => ({
                ...prev,
                [modalKey]: false
            }));
        }
    };

    const handleItemClick = (section, item) => {
        if (section.onItemClick) {
            section.onItemClick(item);
        } else {

            navigate(`${section.detailUrl}/${item._id}`, {
                state: { record: { item } }
            });
        }
    };


    return (
        <div>
            <Typography variant="h2" sx={{ textAlign: "center", mb: 2 }}>
                Related Items
            </Typography>

            {sections.map(section => (
                <RelatedSection
                    key={section.key}
                    title={section.title}
                    items={sectionData[section.key] || []}
                    permissions={permissions[section.key] || {}}
                    displayFields={section.displayFields}
                    onAdd={() => setModalStates(prev => ({ ...prev, [section.key]: true }))}
                    onEdit={(item) => handleItemClick(section, item)}
                    onDelete={(e, item) => {
                        e.stopPropagation();
                        setConfirmDialog({
                            isOpen: true,
                            title: 'Are you sure to delete this Record?',
                            subTitle: "You can't undo this Operation",
                            onConfirm: () => handleDelete(section, item._id)
                        });
                    }}
                    icon={section.icon}
                />
            ))}

            {modals.map(modal => (
                <Modal
                    key={modal.key}
                    open={modalStates[modal.key] || false}
                    onClose={() => handleModalClose(modal.key)}
                    sx={{ backdropFilter: "blur(5px)" }}
                >
                    <Box sx={modalStyle}>
                        <modal.component
                            handleModal={() => handleModalClose(modal.key)}
                            parentId={parentId}
                            onSuccess={() => handleModalClose(modal.key)}
                        />
                    </Box>
                </Modal>
            ))}

            <ToastNotification notify={notify} setNotify={setNotify} />
            <DeleteConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </div>
    );
};

export default RelatedItems;