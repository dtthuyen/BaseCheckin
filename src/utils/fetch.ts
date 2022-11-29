import axios, {AxiosRequestConfig} from 'axios';
import {Core} from '../global';

export const Fetch = axios.create({
  baseURL: Core.baseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
