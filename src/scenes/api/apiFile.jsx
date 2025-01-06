import axios from 'axios';
import { appConfig } from '../../config/appConfig';

const apiFile = axios.create({
  baseURL: appConfig.server,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

apiFile.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default apiFile;