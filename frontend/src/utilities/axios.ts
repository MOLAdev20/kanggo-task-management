import Axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export default {
  get: async (
    endpoint: string,
    param: null | any,
    successCb: any,
    errorCb?: any,
  ) => {
    try {
      const url = `${apiUrl}/api/${endpoint}`;
      const response = await Axios.get(url, param != null && param);
      successCb(response.data);
    } catch (err: any) {
      errorCb(err);
    }
  },

  post: async (endpoint: string, data: any, successCb: any, errorCb?: any) => {
    try {
      const url = `${apiUrl}/api/${endpoint}`;
      const response = await Axios.post(url, data);
      successCb(response.data);
    } catch (err: any) {
      errorCb(err);
    }
  },

  put: async (endpoint: string, data: any, successCb: any, errorCb?: any) => {
    try {
      const url = `${apiUrl}/api/${endpoint}`;
      const response = await Axios.put(url, data);
      successCb(response.data);
    } catch (err: any) {
      errorCb(err);
    }
  },

  delete: async (endpoint: string, successCb: any, errorCb?: any) => {
    try {
      const url = `${apiUrl}/api/${endpoint}`;
      const response = await Axios.delete(url);
      successCb(response.data);
    } catch (err: any) {
      errorCb(err);
    }
  },
};
