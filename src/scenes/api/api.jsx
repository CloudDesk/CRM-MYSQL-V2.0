import axios from 'axios';
import { appConfig } from '../../config/appConfig';

const api = axios.create({
  baseURL: appConfig.server,
  headers: {
    'Content-Type': 'application/json'
  },
})

api.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

export default api;