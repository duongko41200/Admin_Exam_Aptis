import axiosBase from "axios";

const apiUrl = "";

const axios = axiosBase.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://api.aptisacademy.com.vn/v1/api",
  timeout: 600000, // 10 minutes for large video uploads
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
    const apiKey =
      process.env.NEXT_PUBLIC_APP_API_KEY ||
      "4379e3b406e606110a01e8fbe364120fdc58be39a9f30431476dd53ad14b20fe66f52423a3e4546dfa272f4c389822299709414bb44b6b3ffce7f04292be2556";

    if (token) {
      config.headers["authorization"] = token;
    }
    if (clientId) {
      config.headers["x-client-id"] = clientId;
    }
    if (apiKey) {
      config.headers["x-api-key"] = apiKey;
    }

    // ❌ Không set cứng Content-Type ở đây
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

    console.log("ApiService Response Error:", { status, error });

    if (
      (status === 401 || status === 500) &&
      window.location.pathname !== "/login"
    ) {
      ToastError(
        "Chúng tôi cần xác minh danh tính của bạn. Vui lòng đăng nhập lại."
      );
      localStorage.clear();
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
  query(resource, parameters, headers = {}) {
    return axios
      .get(`${apiUrl}/${resource}`, {
        params: parameters,
        headers,
      })
      .then(responseCallback)
      .catch(catchError);
  },

  get(resource, headers = {}, queryParameters = {}) {
    return axios
      .get(`${apiUrl}/${resource}`, {
        headers,
        params: queryParameters,
      })
      .then(responseCallback)
      .catch(catchError);
  },

  post(
    resource,
    body,
    headers = {},
    isFormData = false,
    onUploadProgress = null
  ) {
    const config = { headers: { ...headers } };

    if (isFormData) {
      // để axios tự set Content-Type multipart/form-data

      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] =
        config.headers["Content-Type"] || "application/json";
    }

    // Add upload progress callback if provided
    if (onUploadProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress({
          loaded: progressEvent.loaded,
          total: progressEvent.total,
          percent: percentCompleted,
          stage: "upload",
        });
      };
    }

    // Increase timeout for large file uploads
    if (isFormData) {
      config.timeout = 1800000; // 30 minutes for file uploads
    }

    return axios
      .post(`${apiUrl}/${resource}`, body, config)
      .then(responseCallback)
      .catch(catchError);
  },

  // ✅ Method for direct upload to external URLs (like R2 presigned URLs)
  putToExternalUrl(url, data, headers = {}, onUploadProgress = null) {
    // Create a clean axios instance for external uploads (no interceptors)
    const externalAxios = axiosBase.create({
      timeout: 1800000, // 30 minutes for large file uploads
      withCredentials: false,
    });

    const config = {
      headers: {
        // Only set specific headers for R2 uploads
        ...headers,
      },
    };

    // Add upload progress callback if provided
    if (onUploadProgress) {
      config.onUploadProgress = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress({
          loaded: progressEvent.loaded,
          total: progressEvent.total,
          percent: percentCompleted,
          stage: "upload",
        });
      };
    }

    console.log("🚀 PUT to external URL:", {
      url: url.substring(0, 100) + "...",
      dataSize: data.size,
      headers: config.headers,
    });

    return externalAxios
      .put(url, data, config)
      .then(responseCallback)
      .catch(catchError);
  },

  // ✅ Alternative method using fetch for R2 uploads (to avoid CORS issues)
  async putToExternalUrlWithFetch(
    url,
    data,
    headers = {},
    onUploadProgress = null
  ) {
    try {
      console.log("🚀 FETCH PUT to external URL:", {
        url: url.substring(0, 100) + "...",
        dataSize: data.size,
        headers,
      });

      // Create XMLHttpRequest to track progress
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onUploadProgress) {
            const percentCompleted = Math.round(
              (event.loaded * 100) / event.total
            );
            onUploadProgress({
              loaded: event.loaded,
              total: event.total,
              percent: percentCompleted,
              stage: "upload",
            });
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve([{ status: xhr.status, statusText: xhr.statusText }, null]);
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("Upload failed"));
        });

        xhr.open("PUT", url);

        // Set headers
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });

        xhr.send(data);
      });
    } catch (error) {
      console.error("❌ Fetch upload error:", error);
      return [null, error];
    }
  },

  patch(resource, body, headers = {}, isFormData = false) {
    const config = { headers: { ...headers } };

    if (isFormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] =
        config.headers["Content-Type"] || "application/json";
    }

    return axios
      .patch(`${apiUrl}/${resource}`, body, config)
      .then(responseCallback)
      .catch(catchError);
  },

  delete(resource, headers = {}, queryParameters = {}) {
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
