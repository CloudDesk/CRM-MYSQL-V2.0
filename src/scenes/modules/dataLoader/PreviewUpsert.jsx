import React, { useState } from 'react'
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography, DialogActions, Button,
  CircularProgress,
} from "@mui/material";
import ToastNotification from '../../shared/toast/ToastNotification';
import { DATALOADER_CONSTANTS } from '../../../config/constantConfigs';


// const upsertUrl = `${appConfig.server}/dataloader`;
// const CONSTANTS = {
//   upsert: appConfig.api.dataLoader.upsert
// }

function PreviewUpsert({ object, data, file, ModalClose, callBack }) {
  console.log("PreviewUpsert", object, data, file,)
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [isLoading, setIsLoading] = useState(false)

  const headers = Object.keys(data[0]);



  const hanldeSave = () => {
    console.log(data)
    setIsLoading(true)
    let formData = new FormData();
    formData.append('file', file)
    formData.append('createdBy', (sessionStorage.getItem("loggedInUser")))
    formData.append('modifiedBy', (sessionStorage.getItem("loggedInUser")))

    axios.post(`${DATALOADER_CONSTANTS.ROUTES.upsert}/${object}`, formData)

      .then((res) => {
        console.log('data import res', res);
        setNotify({
          isOpen: true,
          message: typeof (res.data) === 'string' ? res.data : 'Records Inserted Successfully',
          type: 'success'
        })
        callBack();
      })
      .catch((error) => {
        console.log('data import error', error);
        setNotify({
          isOpen: true,
          message: 'Records not Inserted ',
          type: 'error'
        })
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          ModalClose();
        }, 1000)
      })
  }

  return (
    <>
      <ToastNotification notify={notify} setNotify={setNotify} />

      {
        isLoading && <div style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>

      }


      <Paper style={{ maxWidth: '80vw', maxHeight: '80vh', overflow: 'auto', filter: isLoading ? 'blur(5px)' : 'none' }}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map(header => (
                <TableCell align="left">{header.toUpperCase()}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((emp, index) => (
              <TableRow key={index}>
                {headers.map(header => (
                  <TableCell align="left">{emp[header]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <div className='action-buttons'>
        <DialogActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button type='success' variant="contained" color="secondary" onClick={hanldeSave}>Upload</Button>
          <Button type="reset" variant="contained" onClick={ModalClose}>Cancel</Button>
        </DialogActions>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginLeft: '16px' }}>
          Record Count :{data.length}
        </div>
      </div>
    </>
  );
}



export default PreviewUpsert

