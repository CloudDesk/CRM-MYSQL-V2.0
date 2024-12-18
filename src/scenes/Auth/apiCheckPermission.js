import { RequestServer } from "../api/HttpReq";
export const apiCheckPermission = (obj) => {
  console.log(obj, "obj checkPermission");
  const { role, object, departmentname } = obj;
  const urlCheck = `/checkAccess?roledetails=${role}&object=${object}&department=${departmentname}`;

  return new Promise((resolve, reject) => {
    RequestServer("get", urlCheck, {})
      .then((res) => {
        console.log(res, "res checkPermission2");
        if (res.success) {
          console.log(res.data, "res.data checkPermission2");
          resolve(res.data);
        } else {
          reject(new Error(res.error.message));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
