import React, { useState } from "react";
import { DynamicForm } from "../../../../components/Form/DynamicForm";
import { useLocation, useNavigate } from "react-router-dom";
import { RequestServer } from "../../../api/HttpReq";
import ToastNotification from "../../../../components/UI/toast/ToastNotification";
import {
  contactformfields,
  generateContactInitialValues,
  metaDataFields,
} from "../../../formik/initialValues";
import { Tooltip, IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
import { appConfig } from "../../../../config/appConfig";
import WhatsAppModalNew from "../../../../components/common/communication/WhatsappModal";
import EmailModalPage from '../../../../components/common/communication/EmailModal';
import { getUserRoleAndDepartment } from "../../../../utils/sessionUtils";
import { useCheckPermission } from "../../../hooks/useCheckPermission";

const CONSTANTS = {
  OBJECT_API: appConfig.objects.contact.apiName,
  upsert: appConfig.objects.contact.upsert,
  list: appConfig.objects.contact.list,
  whatsAppTemplate: appConfig.api.whatsapp.template
}

const ContactDetailPage = ({ props }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
  const existingContact = props || location.state.record?.item;

  // State management
  const [notify, setNotify] = useState({ isOpen: false, message: "", type: "" });
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  // Get user role and department
  const userRoleDpt = getUserRoleAndDepartment(CONSTANTS.OBJECT_API);

  // Use the custom permission hook
  const { permissions } = useCheckPermission({
    role: userRoleDpt?.role,
    object: userRoleDpt?.object,
    departmentname: userRoleDpt?.departmentname
  });

  const initialValues = generateContactInitialValues(existingContact);
  const formFields = [
    ...contactformfields(!!existingContact),
    ...(existingContact ? metaDataFields : []),
  ];

  const handleSubmit = async (values, { setIsSubmitting }) => {
    let dateSeconds = new Date().getTime();

    if (existingContact) {
      values._id = existingContact._id;
      values.fullname = `${values.firstname} ${values.lastname}`;
      values.createddate = existingContact.createddate;
      values.createdby = existingContact.createdby;
      values.modifieddate = dateSeconds;
      values.modifiedby = currentUser;
    } else {
      values.fullname = `${values.firstname} ${values.lastname}`;
      values.createddate = dateSeconds;
      values.modifieddate = dateSeconds;
      values.createdby = currentUser;
      values.modifiedby = currentUser;
    }

    try {
      const response = await RequestServer("post", CONSTANTS.upsert, values);
      if (response.success) {
        setNotify({
          isOpen: true,
          message: "Contact created successfully",
          type: "success",
        });
        setTimeout(() => {
          navigate(CONSTANTS.list);
        }, 1500);
      } else {
        setNotify({
          isOpen: true,
          message: "Failed to create Contact",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      setNotify({
        isOpen: true,
        message: "Failed to create Contact",
        type: "error",
      });
    }
  };

  const handleSendWhatsAppTemplate = async () => {
    if (existingContact?.phone) {
      try {
        const res = await RequestServer("post", CONSTANTS.whatsAppTemplate, {
          to: `91${existingContact.phone}`,
        });
        if (res.success) {
          setNotify({
            isOpen: true,
            message: "Promotional Template sent successfully. Once the user replies, you can send more messages.",
            type: "success",
          });
        }
      } catch (error) {
        console.error("WhatsApp template error:", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
      }
    } else {
      setNotify({
        isOpen: true,
        message: "Phone number is required to send a template",
        type: "error",
      });
    }
  };

  const renderActionButtons = () => {
    return (
      <>
        {existingContact && permissions.read && permissions.create && (
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Tooltip title="Send Email">
              <IconButton onClick={() => setEmailModalOpen(true)}>
                <EmailIcon sx={{ color: "#DB4437" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="WhatsApp">
              <IconButton onClick={() => setWhatsAppModalOpen(true)}>
                <WhatsAppIcon sx={{ color: "#34A853" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Send WhatsApp Template">
              <IconButton onClick={handleSendWhatsAppTemplate}>
                <SendIcon sx={{ color: "#34A853" }} />
              </IconButton>
            </Tooltip>
          </div>
        )}
      </>
    );
  };

  return (
    <div>
      <ToastNotification notify={notify} setNotify={setNotify} />

      <DynamicForm
        fields={formFields}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        formTitle={existingContact ? "Edit Contact" : "New Contact"}
        submitButtonText={existingContact ? "Update Contact" : "Create Contact"}
        permissionValues={permissions}
        renderActionButtons={renderActionButtons}
      />

      {emailModalOpen && (
        <EmailModalPage
          data={existingContact}
          handleModal={() => setEmailModalOpen(false)}
          bulkMail={false}
        />
      )}
      {whatsAppModalOpen && (
        <WhatsAppModalNew
          data={existingContact}
          handleModal={() => setWhatsAppModalOpen(false)}
          bulkMail={true}
        />
      )}
    </div>
  );
};

export default ContactDetailPage;
