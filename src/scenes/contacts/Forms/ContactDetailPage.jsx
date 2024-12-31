import React, { useEffect, useState } from "react";
import { DynamicForm } from "../../../components/Form/DynamicForm";
import { apiCheckPermission } from "../../Auth/apiCheckPermission";
import { useLocation, useNavigate } from "react-router-dom";
import { getLoginUserRoleDept } from "../../Auth/userRoleDept";
import { RequestServer } from "../../api/HttpReq";
import ToastNotification from "../../toast/ToastNotification";
import {
  contactformfields,
  generateContactInitialValues,
  metaDataFields,
} from "../../formik/InitialValues/initialValues";
import { Modal, Tooltip, IconButton } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
import WhatAppModalNew from "../../recordDetailPage/WhatsAppModalNew";
import EmailModalPage from "../../recordDetailPage/EmailModalPage";
import { appConfig } from "../../config";


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
  console.log(currentUser, "currentUser");

  const existingContact = props || location.state.record?.item; // This determines if it's an existing contact

  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [permissionValues, setPermissionValues] = useState({});
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);

  const userRoleDpt = getLoginUserRoleDept(CONSTANTS.OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");

  useEffect(() => {
    console.log("passed record", location.state.record?.item);
    fetchObjectPermissions();
  }, []);

  const fetchObjectPermissions = () => {
    if (userRoleDpt) {
      apiCheckPermission(userRoleDpt)
        .then((res) => {
          console.log(res, "apiCheckPermission promise res");
          setPermissionValues(res);
        })
        .catch((err) => {
          console.log(err, "apiCheckPermission error");
          setPermissionValues({});
        });
    }
  };

  const initialValues = generateContactInitialValues(existingContact);

  const formFields = [
    ...contactformfields(!!existingContact), // Pass true if it's an existing contact
    ...(existingContact ? metaDataFields : []),
  ];

  const handleSubmit = async (values, { setIsSubmitting }) => {
    console.log("Contact Form -> values", values);

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

    console.log(values, "values after modifying");

    try {
      const response = await RequestServer("post", CONSTANTS.upsert, values);
      console.log(response, "response");
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
      console.log(error);
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
        console.log(res, "res");
        if (res.success) {
          setNotify({
            isOpen: true,
            message:
              "Promotional Template sent successfully. Once the user replies, you can send more messages.",
            type: "success",
          });
        }
      } catch (error) {
        console.log(error, "error");
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
        {existingContact &&
          permissionValues.read &&
          permissionValues.create && (
            <>
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Tooltip title="Send Email">
                  <IconButton>
                    <EmailIcon
                      sx={{ color: "#DB4437" }}
                      onClick={() => setEmailModalOpen(true)}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="WhatsApp">
                  <IconButton>
                    <WhatsAppIcon
                      sx={{ color: "#34A853" }}
                      onClick={() => setWhatsAppModalOpen(true)}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Send WhatsApp Template">
                  <IconButton>
                    <SendIcon
                      sx={{ color: "#34A853" }}
                      onClick={handleSendWhatsAppTemplate}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </>
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
        permissionValues={permissionValues}
        renderActionButtons={renderActionButtons}
      />

      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)}>
        <div className="modal">
          <EmailModalPage
            data={existingContact}
            handleModal={() => setEmailModalOpen(false)}
            bulkMail={false}
          />
        </div>
      </Modal>

      <Modal
        open={whatsAppModalOpen}
        onClose={() => setWhatsAppModalOpen(false)}
      >
        <div className="modal">
          <WhatAppModalNew
            data={existingContact}
            handleModal={() => setWhatsAppModalOpen(false)}
            bulkMail={true}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ContactDetailPage;
