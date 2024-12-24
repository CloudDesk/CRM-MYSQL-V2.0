import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Grid,
  Button,
  DialogActions,
  Autocomplete,
  TextField,
  MenuItem,
} from "@mui/material";
import "../formik/FormStyles.css";
import PreviewFile from "../formik/PreviewFile";
import ToastNotification from "../toast/ToastNotification";
import { TaskObjectPicklist, TaskSubjectPicklist } from "../../data/pickLists";
import CustomizedSelectForFormik from "../formik/CustomizedSelectForFormik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import CustomizedSelectDisableForFormik from "../formik/CustomizedSelectDisableFormik";
import "./Form.css";
import {
  TaskInitialValues,
  TaskSavedValues,
} from "../formik/InitialValues/formValues";
import { getPermissions } from "../Auth/getPermission";
import { RequestServer } from "../api/HttpReq";
import { apiCheckPermission } from "../Auth/apiCheckPermission";
import { getLoginUserRoleDept } from "../Auth/userRoleDept";

const TaskDetailPage = ({ item, handleModal, showModel }) => {
  const OBJECT_API = "Event";
  const UpsertUrl = `/UpsertTask`;
  const fetchAccountUrl = `/accountsname?accountname=`;
  const fetchLeadUrl = `/LeadsbyName?leadname=`;
  const fetchOpportunityUrl = `/opportunitiesbyName?opportunityname=`;

  const fetchUsersbyName = `/usersByName`;

  const [singleTask, setSingleTask] = useState();
  const [showNew, setshowNew] = useState(true);
  const [url, setUrl] = useState();
  const navigate = useNavigate();
  const fileRef = useRef();
  const location = useLocation();
  const [parentObject, setParentObject] = useState("");
  const [relatedRecNames, setRelatedRecNames] = useState([]);
  const [notify, setNotify] = useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [file, setFile] = useState();
  const [showModal1, setShowModal1] = useState(showModel);
  const [permissionValues, setPermissionValues] = useState({});
  const [autocompleteReadOnly, setAutoCompleteReadOnly] = useState(false);
  const [usersRecord, setUsersRecord] = useState([]);
  const userRoleDpt = getLoginUserRoleDept(OBJECT_API);
  console.log(userRoleDpt, "userRoleDpt");

  useEffect(() => {
    console.log("passed record", location.state.record.item);
    setSingleTask(location.state.record.item);
    console.log("true", !location.state.record.item);
    setshowNew(!location.state.record.item);
    fetchObjectPermissions();
    FetchUsersbyName(false, "");
    if (location.state.record.item) {
      console.log("inside condition");
      callEvent(location.state.record.item.object);
      setAutoCompleteReadOnly(true);
    }
  }, []);

  const fetchObjectPermissions = () => {
    if (userRoleDpt) {
      apiCheckPermission(userRoleDpt)
        .then((res) => {
          console.log(res, "apiCheckPermission promise res");
          setPermissionValues(res);
        })
        .catch((err) => {
          console.log(err, "res apiCheckPermission error");
          setPermissionValues({});
        });
    }
    // const getPermission = getPermissions("Task")
    // console.log(getPermission, "getPermission")
    // setPermissionValues(getPermission)
  };

  const initialValues = TaskInitialValues;
  const savedValues = TaskSavedValues(singleTask);

  console.log(savedValues, "savedValues");
  const validationSchema = Yup.object({
    subject: Yup.string().required("Required"),
  });

  const formSubmission = async (values, { resetForm }) => {
    console.log("inside form Submission", values);

    let dateSeconds = new Date().getTime();
    let createDateSec = new Date(values.createdDate).getTime();
    let StartDateSec = new Date(values.StartDate).getTime();
    let EndDateSec = new Date(values.EndDate).getTime();

    if (showNew) {
      console.log("dateSeconds", dateSeconds);
      values.modifiedDate = dateSeconds;
      values.createdDate = dateSeconds;
      values.createdBy = sessionStorage.getItem("loggedInUser");
      values.modifiedBy = sessionStorage.getItem("loggedInUser");
      values.assignedto = values.assignedto;
      if (values.StartDate && values.EndDate) {
        values.StartDate = StartDateSec;
        values.EndDate = EndDateSec;
      } else if (values.StartDate) {
        values.StartDate = StartDateSec;
      } else if (values.EndDate) {
        values.EndDate = EndDateSec;
      }
      if (values.object === "Account") {
        delete values.opportunityid;
        delete values.leadid;
        values.accountid = values.accountdetails?.id;
        values.accountname = values.accountdetails?.accountname;
      } else if (values.object === "Deals") {
        delete values.accountId;
        delete values.leadid;
        values.opportunityid = values.opportunitydetails?.id;
        values.opportunityname = values.opportunitydetails?.opportunityname;
      } else if (values.object === "Enquiry") {
        console.log("else");
        delete values.opportunityid;
        delete values.accountId;
        values.leadName = values.leaddetails?.leadName;
        values.leadid = values.leaddetails?.id;
      } else {
        delete values.opportunityid;
        delete values.accountId;
        delete values.leadid;
        delete values.accountname;
        delete values.leadName;
        delete values.opportunityname;
      }
    } else if (!showNew) {
      let createDateSec = location.state.record.item.createddate;
      values.modifiedDate = dateSeconds;
      values.createdDate = createDateSec;

      values.createdBy = singleTask.createdBy;
      values.modifiedBy = sessionStorage.getItem("loggedInUser");
      values.assignedto = values.assignedto;
      if (values.StartDate && values.EndDate) {
        values.StartDate = StartDateSec;
        values.EndDate = EndDateSec;
      } else if (values.StartDate) {
        values.StartDate = StartDateSec;
      } else if (values.EndDate) {
        values.EndDate = EndDateSec;
      }
      if (values.object === "Account") {
        delete values.opportunityid;
        delete values.leadid;
        delete values.leaddetails;
        delete values.opportunitydetails;

        values.accountid = values.accountdetails.id;
        values.accountname = values.accountdetails.accountname;
      } else if (values.object === "Deals") {
        delete values.accountid;
        delete values.leadid;
        delete values.leaddetails;
        delete values.accountdetails;
        values.opportunityid = values.opportunitydetails.id;
        values.opportunityname = values.opportunitydetails.opportunityname;
      } else if (values.object === "Enquiry") {
        console.log("inside");
        delete values.opportunityid;
        delete values.accountid;
        delete values.opportunitydetails;
        delete values.accountdetails;
        values.leadname = values.leaddetails.leadname;
        values.leadid = values.leaddetails.id;
      } else {
        delete values.opportunityid;
        delete values.accountid;
        delete values.leadid;
        delete values.accountname;
        delete values.leadname;
        delete values.opportunityname;
      }
    }
    console.log("after change form submission value", values);

    await RequestServer("post", UpsertUrl, values)
      .then((res) => {
        console.log("task form Submission  response", res);
        if (res.success) {
          console.log("res success", res);
          setNotify({
            isOpen: true,
            message: res.data,
            type: "success",
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          console.log("res else success", res);
          setNotify({
            isOpen: true,
            message: res.error.message,
            type: "error",
          });
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log("task form Submission  error", error);
        setNotify({
          isOpen: true,
          message: error.message,
          type: "error",
        });
        setTimeout(() => {
          navigate(-1);
        }, 1000);
      });
  };

  const callEvent = (e) => {
    console.log("inside call event", initialValues.object);
    console.log("call event", e);
    let url1 =
      e === "Account"
        ? fetchAccountUrl
        : e === "Enquiry"
        ? fetchLeadUrl
        : e === "Deals"
        ? fetchOpportunityUrl
        : null;
    setUrl(url1);
    console.log(url1, "url1");
    FetchObjectsbyName("", url1, e);
    if (url == null) {
      console.log("url", url);
      setRelatedRecNames([]);
    }
  };

  const FetchUsersbyName = (isNameSearch, newInputValue) => {
    let url = isNameSearch
      ? `${fetchUsersbyName}` + `?firstname=${newInputValue}`
      : fetchUsersbyName;
    RequestServer("get", url, {})
      .then((res) => {
        console.log("res fetchUsersbyName", res.data);
        if (res.success) {
          setUsersRecord(res.data);
        } else {
          console.log("fetchUsersbyName status error", res.error.message);
        }
      })
      .catch((error) => {
        console.log("error fetchInventoriesbyName", error);
      });
  };

  const FetchObjectsbyName = (newInputValue, baseUrl, object) => {
    console.log("passed url", baseUrl);
    console.log("new Input  value", newInputValue);
    console.log(object, "object");
    let url;

    // If newInputValue has a value, append it to the URL
    if (newInputValue) {
      url = `${baseUrl}${newInputValue}`;
    }
    // If newInputValue is empty, keep only the base URL
    else {
      // Remove query parameters, keeping only the base path
      url = baseUrl.split("?")[0];
    }

    RequestServer("get", url, {})
      .then((res) => {
        console.log("res Fetch Objects byName", res.data);
        if (res.success) {
          if (object === "Account") {
            res.data = res.data.map((item) => {
              return {
                id: item._id,
                accountname: item.accountname,
              };
            });
          } else if (object === "Deals") {
            res.data = res.data.map((item) => {
              return {
                id: item._id,
                opportunityname: item.opportunityname,
              };
            });
          } else if (object === "Enquiry") {
            res.data = res.data.map((item) => {
              return {
                id: item._id,
                leadname: item.fullname,
              };
            });
          }
          console.log(res.data, "res.data");
          setRelatedRecNames(res.data);
        } else {
          setRelatedRecNames([]);
          console.log("res status error", res.error.message);
        }
      })
      .catch((error) => {
        console.log("error fetchAccountsbyName", error);
      });
  };

  const handleClosePage = () => {
    navigate(-1);
  };

  return (
    <Grid item xs={12} style={{ margin: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {showNew ? <h3>New Event</h3> : <h3>Event Detail Page </h3>}
      </div>

      <Formik
        enableReinitialize={true}
        initialValues={showNew ? initialValues : savedValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) =>
          formSubmission(values, { resetForm })
        }
      >
        {(props) => {
          const {
            values,
            dirty,
            isSubmitting,
            handleChange,
            handleSubmit,
            handleReset,
            setFieldValue,
          } = props;

          return (
            <>
              <ToastNotification notify={notify} setNotify={setNotify} />
              <Form className="my-form">
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <label htmlFor="subject">
                      Subject <span className="text-danger">*</span>
                    </label>
                    <Field
                      name="subject"
                      component={CustomizedSelectForFormik}
                      disabled={
                        showNew
                          ? !permissionValues.create
                          : !permissionValues.edit
                      }
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {TaskSubjectPicklist.map((i) => {
                        return <MenuItem value={i.value}>{i.text}</MenuItem>;
                      })}
                    </Field>
                    <div style={{ color: "red" }}>
                      <ErrorMessage name="subject" />
                    </div>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <label htmlFor="object">Object </label>
                    <Field
                      name="object"
                      component={
                        autocompleteReadOnly
                          ? CustomizedSelectDisableForFormik
                          : CustomizedSelectForFormik
                      }
                      testprop="testing"
                      disabled={
                        showNew
                          ? !permissionValues.create
                          : !permissionValues.edit
                      }
                      onChange={(e) => {
                        console.log("customSelect value", e.target.value);
                        callEvent(e.target.value);
                        setFieldValue("object", e.target.value);
                        setFieldValue("relatedto", "");
                        setFieldValue("leaddetails", null);
                        setFieldValue("accountdetails", null);
                        setFieldValue("opportunitydetails", null);
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {TaskObjectPicklist.map((i) => {
                        return <MenuItem value={i.value}>{i.text}</MenuItem>;
                      })}
                    </Field>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <label htmlFor="relatedto"> Realated To </label>
                    <Autocomplete
                      name="relatedto"
                      readOnly={autocompleteReadOnly}
                      options={relatedRecNames}
                      value={(() => {
                        console.log(
                          values.accountdetails,
                          "values.accountdetails"
                        );
                        console.log(
                          values.opportunitydetails,
                          "values.opportunitydetails"
                        );
                        console.log(values.leadDetails, "values.leadDetails");
                        console.log("RelatedTo Options:", relatedRecNames);
                        console.log("Current Values:", values);
                        const matchedOption = relatedRecNames.find((option) => {
                          // Adjust the comparison based on your object structure
                          if (values.object === "Enquiry") {
                            return option.id === values.leaddetails?.id;
                          } else if (values.object === "Deals") {
                            return option.id === values.opportunitydetails?.id;
                          } else if (values.object === "Account") {
                            return option.id === values.accountdetails?.id;
                          }
                          // Add similar conditions for other object types
                          return false;
                        });
                        console.log("Matched Option:", matchedOption);
                        return (
                          matchedOption ||
                          values.leaddetails ||
                          values.opportunitydetails ||
                          values.accountdetails ||
                          null
                        );
                      })()}
                      getOptionLabel={(option) =>
                        option.leadname ||
                        option.accountname ||
                        option.opportunityname ||
                        ""
                      }
                      isOptionEqualToValue={(option, value) => {
                        console.log(
                          option.id === value?.leaddetails?.id,
                          "*******"
                        );
                        if (values.object === "Enquiry") {
                          return option.id === value?.leaddetails?.id;
                        }
                        // Add similar conditions for other object types
                        return false;
                      }}
                      onChange={(e, value) => {
                        console.log("inside onchange values", value);
                        if (!value) {
                          console.log("!value", value);
                          if (values.object === "Account") {
                            // setFieldValue('AccountId', '')
                            setFieldValue("accountdetails", "");
                          } else if (values.object === "Deals") {
                            // setFieldValue('OpportunityId', '')
                            setFieldValue("opportunitydetails", "");
                          } else if (values.object === "Enquiry") {
                            // setFieldValue('LeadId', '')
                            setFieldValue("leaddetails", "");
                          }
                        } else {
                          console.log("inside else value", value);
                          if (values.object === "Account") {
                            setFieldValue("accountid", value.id);
                            setFieldValue("accountname", value.accountname);
                            setFieldValue("accountdetails", value);
                          } else if (values.object === "Deals") {
                            setFieldValue("opportunityid", value.id);
                            setFieldValue(
                              "opportunityname",
                              value.opportunityname
                            );
                            setFieldValue("opportunitydetails", value);
                          } else if (values.object === "Enquiry") {
                            // setFieldValue('LeadId', value.id)
                            setFieldValue("leadname", value.leadname);
                            setFieldValue("leadid", value.id);
                            setFieldValue("leaddetails", value);
                          }
                        }
                      }}
                      onInputChange={(event, newInputValue) => {
                        if (newInputValue.length >= 3) {
                          FetchObjectsbyName(newInputValue, url, values.object);
                        } else if (newInputValue.length === 0) {
                          FetchObjectsbyName(newInputValue, url, values.object);
                        }
                      }}
                      disabled={
                        showNew
                          ? !permissionValues.create
                          : !permissionValues.edit
                      }
                      renderInput={(params) => (
                        <Field
                          component={TextField}
                          {...params}
                          name="realatedTo"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <label htmlFor="assignedto">Assigned To </label>
                    <Autocomplete
                      name="assignedto"
                      options={usersRecord}
                      readOnly={autocompleteReadOnly}
                      value={(() => {
                        // console.log('Hard Coded Test - usersRecord:', usersRecord);
                        // console.log('Hard Coded Test - Current Values:', values);
                        // console.log(values.assignedto, "values.assignedTo, values.assignedto")
                        // // Try direct object
                        // const testValue = values.assignedto || values.assignedTo
                        // console.log('Attempting to bind:', testValue);

                        // return testValue;

                        const matchedOption = usersRecord.find((option) => {
                          console.log(option, "option");
                          return option._id == values.assignedto._id;
                        });
                        console.log("Matched Option:", matchedOption);
                        return matchedOption || values.assignedto || null;
                      })()}
                      getOptionLabel={(option) => option.fullname || ""}
                      onChange={(e, value) => {
                        if (!value) {
                          console.log("!value", value);
                          setFieldValue("assignedto", null);
                        } else {
                          console.log("value", value);
                          setFieldValue("assignedto", value);
                        }
                      }}
                      onInputChange={(event, newInputValue) => {
                        console.log("newInputValue", newInputValue);
                        if (newInputValue.length >= 3) {
                          FetchUsersbyName(true, newInputValue);
                        } else if (newInputValue.length === 0) {
                          FetchUsersbyName(false, "");
                        }
                      }}
                      renderInput={(params) => (
                        <Field
                          component={TextField}
                          {...params}
                          name="assignedto"
                        />
                      )}
                    />
                  </Grid>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="StartDate">Start Date </label> <br />
                      <DateTimePicker
                        name="StartDate"
                        value={values.StartDate}
                        onChange={(e) => {
                          setFieldValue("StartDate", e);
                        }}
                        disabled={
                          showNew
                            ? !permissionValues.create
                            : !permissionValues.edit
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            style={{ width: "100%" }}
                            error={false}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6} md={6}>
                      <label htmlFor="EndDate">EndDate </label> <br />
                      <DateTimePicker
                        value={values.EndDate}
                        onChange={(e) => {
                          setFieldValue("EndDate", e);
                        }}
                        disabled={
                          showNew
                            ? !permissionValues.create
                            : !permissionValues.edit
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            style={{ width: "100%" }}
                            error={false}
                          />
                        )}
                      />
                    </Grid>
                  </LocalizationProvider>
                  {/* <Grid item xs={12} md={12}>

                                        <label htmlFor="attachments">attachments</label>

                                        <Field name="attachments" type="file"
                                            className="form-input"
                                            onChange={(event) => {

                                                // var reader = new FileReader();
                                                // var url = reader.readAsDataURL(event.currentTarget.files[0]);
                                                // console.log('url ',url);
                                                console.log('ee', event.currentTarget.files[0]);
                                                setFieldValue("attachments", (event.currentTarget.files[0]));
                                                setFile(URL.createObjectURL(event.currentTarget.files[0]));


                                            }}
                                        />
                                        {
                                            file && <img src={file} />
                                        }

                                                //  <input id="attachments" name="attachments" type="file"
                                                //         ref={fileRef}
                                                //         onChange={(event) => {
                                                        
                                                //             setFieldValue("attachments", (event.target.files[0]));
                                                //         }} className="form-input" />
                                                        
                                                //       reader.readAsDataURL 
                                                //        {values.attachments && <PreviewFile file={values.attachments} />} 

                                        <div style={{ color: 'red' }}>
                                            <ErrorMessage name="attachments" />
                                        </div>
                                    </Grid> */}

                  <Grid item xs={12} md={12}>
                    <label htmlFor="description">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      class="form-input-textarea"
                      style={{ width: "100%" }}
                      disabled={
                        showNew
                          ? !permissionValues.create
                          : !permissionValues.edit
                      }
                    />
                  </Grid>
                  {!showNew && (
                    <>
                      <Grid item xs={6} md={6}>
                        <label htmlFor="createdDate">Created Date</label>
                        <Field
                          name="createdDate"
                          type="text"
                          class="form-input"
                          value={
                            values.createdBy?.userFullName +
                            " , " +
                            values.createdDate
                          }
                          disabled
                        />
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <label htmlFor="modifiedDate">Modified Date</label>
                        <Field
                          name="modifiedDate"
                          type="text"
                          class="form-input"
                          value={
                            values.modifiedBy?.userFullName +
                            " , " +
                            values.modifiedDate
                          }
                          disabled
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <div className="action-buttons">
                  <DialogActions sx={{ justifyContent: "space-between" }}>
                    {showNew ? (
                      <Button
                        type="success"
                        variant="contained"
                        color="secondary"
                        disabled={isSubmitting || !dirty}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        type="success"
                        variant="contained"
                        color="secondary"
                        disabled={isSubmitting || !dirty}
                      >
                        Update
                      </Button>
                    )}
                    <Button
                      type="reset"
                      variant="contained"
                      onClick={handleClosePage}
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </Grid>
  );
};
export default TaskDetailPage;
