import Axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export default {
  get: async (
    endpoint: string,
    successCallback: (res: any) => {},
    errorCallback: (err: any) => {},
  ) => {
    try {
      const data = Axios.get(`${apiUrl}${endpoint}`);
      successCallback(data);
    } catch (err: any) {
      errorCallback(err);
    }
  },
};
