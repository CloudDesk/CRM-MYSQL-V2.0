export const getLoginUserRoleDept = (OBJECT_API) => {
  const userDetails = sessionStorage.getItem("loggedInUser");
  let res = JSON.parse(userDetails);
  console.log(res, "userDetails");

  const userRoleDpt = {
    role: res.userRole,
    departmentname: res.userDepartment,
    object: OBJECT_API,
  };

  return userRoleDpt;
};
