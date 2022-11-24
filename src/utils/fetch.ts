import axios, {AxiosRequestConfig} from 'axios';
import { Core } from "../global";

let headers = {
  // Authorization:

};

export const Fetch = axios.create({
  baseURL: Core.baseUrl,
});
