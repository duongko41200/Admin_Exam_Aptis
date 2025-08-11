import { ToastError } from "../../utils/Toast";
import axiosBase from "axios";

const apiUrl = "/v1/api";

const axios = axiosBase.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL || "http://localhost:3333/",
  timeout: 10_000,
  withCredentials: true,
});

axios.defaults.headers = {
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  Expires: "0",
};

// ✅ Gắn token tự động trước mỗi request
axios.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");
    const clientId = localStorage.getItem("userId");
    const apiKey = process.env.NEXT_PUBLIC_APP_API_KEY;

    if (token) {
      config.headers["authorization"] = token;
    }

    if (clientId) {
      config.headers["x-client-id"] = clientId;
    }

    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// ✅ Middleware xử lý lỗi response
axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const status = error.response?.status;

    if (
      (status === 401 || status === 500) &&
      window.location.pathname !== "/login"
    ) {
      ToastError(
        "Chúng tôi cần xác minh danh tính của bạn. Vui lòng đăng nhập lại."
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// ✅ Hàm xử lý lỗi chung
const catchError = (error) => {
  console.log(`ApiService: ${error}`);
  if (error.response) {
    return [undefined, error.response.data];
  } else if (error.request) {
    return [undefined, error];
  } else {
    return [undefined, error];
  }
};

const responseCallback = (res) => {
  return [res.data, undefined];
};

// ✅ API Service
const ApiService = {
  query(resource, parameters, headers) {
    return axios
      .get(`${apiUrl}/${resource}`, {
        params: parameters,
        headers,
      })
      .then(responseCallback)
      .catch(catchError);
  },

  get(resource, headers, queryParameters) {
    return axios
      .get(`${apiUrl}/${resource}`, {
        headers,
        params: queryParameters,
      })
      .then(responseCallback)
      .catch(catchError);
  },

  post(resource, body, headers) {
    return axios
      .post(`${apiUrl}/${resource}`, body, { headers })
      .then(responseCallback)
      .catch(catchError);
  },

  patch(resource, body, headers) {
    return axios
      .patch(`${apiUrl}/${resource}`, body, { headers })
      .then(responseCallback)
      .catch(catchError);
  },

  delete(resource, headers, queryParameters) {
    return axios
      .delete(`${apiUrl}/${resource}`, {
        headers,
        params: queryParameters,
      })
      .then(responseCallback)
      .catch(catchError);
  },
};

export default ApiService;
