import Axios, { type AxiosRequestConfig } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const publicRouteNames = new Set(["login", "register"]);

const getToken = () => localStorage.getItem("token");

const redirectToLogin = async () => {
  localStorage.removeItem("token");

  const { default: router } = await import("../routes");
  if (!publicRouteNames.has(String(router.currentRoute.value.name))) {
    await router.replace({ name: "login" });
  }
};

void import("../routes").then(({ default: router }) => {
  router.beforeEach((to) => {
    if (publicRouteNames.has(String(to.name)) || getToken()) return true;

    return { name: "login" };
  });
});

Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) await redirectToLogin();
    return Promise.reject(error);
  },
);

const authenticatedConfig = (): AxiosRequestConfig => {
  const token = getToken();
  if (!token) {
    void redirectToLogin();
    throw new Error("Unauthorized: token is not available");
  }

  return { headers: { Authorization: `Bearer ${token}` } };
};

export default {
  get: async (
    endpoint: string,
    param: null | any,
    successCb: any,
    errorCb?: any,
  ) => {
    try {
      const response = await Axios.get(`${apiUrl}/api/${endpoint}`, {
        ...authenticatedConfig(),
        ...(param && { params: param }),
      });
      successCb(response.data);
    } catch (err: any) {
      errorCb?.(err);
    }
  },

  post: async (endpoint: string, data: any, successCb: any, errorCb?: any) => {
    try {
      const config = endpoint.startsWith("auth/")
        ? undefined
        : authenticatedConfig();
      const response = await Axios.post(
        `${apiUrl}/api/${endpoint}`,
        data,
        config,
      );
      successCb(response.data);
    } catch (err: any) {
      errorCb?.(err);
    }
  },

  put: async (endpoint: string, data: any, successCb: any, errorCb?: any) => {
    try {
      const response = await Axios.put(
        `${apiUrl}/api/${endpoint}`,
        data,
        authenticatedConfig(),
      );
      successCb(response.data);
    } catch (err: any) {
      errorCb?.(err);
    }
  },

  delete: async (endpoint: string, successCb: any, errorCb?: any) => {
    try {
      const response = await Axios.delete(
        `${apiUrl}/api/${endpoint}`,
        authenticatedConfig(),
      );
      successCb(response.data);
    } catch (err: any) {
      errorCb?.(err);
    }
  },
};
