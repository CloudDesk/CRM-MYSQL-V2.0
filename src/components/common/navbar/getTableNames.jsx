import React, { useEffect, useState } from 'react';
import { RequestServer } from '../../../scenes/api/HttpReq';
import queryString from 'query-string';

export const GetTableNames = () => {

  console.log("inside GetTableNames")
  const URL_getTabs = '/getTabs'
  const userDetails = JSON.parse(sessionStorage.getItem("loggedInUser"))
  console.log(userDetails, "userDetailsuserDetails")
  const userRoleDpt = {
    role: userDetails.userRole || "VP",
    department: userDetails.userDepartment
  };
  console.log(userRoleDpt, "userRoleDpt");

  let URL_GetTabsByUser = URL_getTabs + '?' + queryString.stringify(userRoleDpt)
  console.log(URL_GetTabsByUser, "URL_GetTabsByUser")
  return new Promise((resolve, reject) => {
    RequestServer("get", URL_GetTabsByUser)
      .then(res => {
        console.log(res, "getObjectTabs ")
        if (res.success) {
          console.log(res.data, "res data getObjectTabs")
          resolve(res.data)
        }
        else {
          console.log(res.data, "error res data getObjectTabs")
          reject(res.error)
        }
      })
      .catch(err => {
        console.log(err, "catch error getObjectTabs")
        reject(err)
      })
  })

};
