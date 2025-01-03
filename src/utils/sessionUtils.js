/**
 * Retrieves the logged-in user's role and department information along with a specified object API.
 * @param {string} objectApi - The API object associated with the user.
 * @returns {object} Object containing the user's role, department name, and the provided object API.
 */
export const getUserRoleAndDepartment = (objectApi) => {
  const userDetails = sessionStorage.getItem("loggedInUser");

  if (!userDetails) {
    console.error("No logged-in user found in session storage.");
    return null;
  }

  try {
    const user = JSON.parse(userDetails);
    return {
      role: user.userRole,
      departmentname: user.userDepartment,
      object: objectApi,
    };
  } catch (error) {
    console.error("Error parsing user details:", error);
    return null;
  }
};
