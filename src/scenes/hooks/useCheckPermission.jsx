import { useState, useEffect } from "react";
import { RequestServer } from "../api/HttpReq";
import { appConfig } from "../../config/appConfig";

/**
 * Custom hook to check user permissions for a given role, object, and department.
 * @param {object} params - The parameters containing role, object, and department name.
 * @returns {object} - Contains permission data, loading state, and error.
 */


export const useCheckPermission = ({ role, object, departmentname }) => {

    const CONSTANTS = {
        getAllObjects: (role, departmentname) =>
            appConfig.api.access.forAllObjects(role, departmentname),

        getObjectPermissionUrl: (role, departmentname, object) =>
            appConfig.api.access.forObject(role, departmentname, object),
    };

    console.log(CONSTANTS, "CONSTANTS")

    const [permissions, setPermissions] = useState({
        edit: false,
        read: false,
        create: false,
        delete: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!role || !object || !departmentname) return;

        const checkPermissions = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await RequestServer("get", CONSTANTS.getObjectPermissionUrl, {});
                if (response.success) {
                    setPermissions(response.data);
                } else {
                    throw new Error(response.error?.message || "Permission check failed");
                }
            } catch (err) {
                console.error("Permission check error:", err);
                setError(err);
                setPermissions({
                    edit: false,
                    read: false,
                    create: false,
                    delete: false,
                });
            } finally {
                setLoading(false);
            }
        };

        checkPermissions();
    }, [role, object, departmentname]);

    return { permissions, loading, error };
};
