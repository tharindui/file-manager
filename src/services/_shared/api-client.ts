import type { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

const isServer = typeof window === "undefined";

export interface ApiClientConfig {
  headers?: Record<string, string>;
}

class ApiClient {
  readonly axiosInstance: AxiosInstance;

  constructor(config?: ApiClientConfig) {
    this.axiosInstance = axios.create({
      headers: {
        ...config?.headers,
      },
      baseURL: "https://api.github.com/",
      timeout: isServer ? 120 * 1000 : undefined,
    });
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig | undefined
  ): Promise<T> {
    try {
      const res = await this.axiosInstance.get(url, config);

      return res.data as T;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  }

  async post<T, K = void>(
    url: string,
    data?: K,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const res = await this.axiosInstance.post(url, data || {}, config);

      return res.data as T;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  }

  put() {
    throw new Error("Method not implemented.");
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<number> {
    try {
      const res = await this.axiosInstance.delete(url, config);

      return res.status;
    } catch (error) {
      return handleError(error as AxiosError);
    }
  }
}

export default ApiClient;

async function handleError(error: AxiosError) {
  if (!error.isAxiosError) {
    console.error(error);

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({ error });
  }

  if (
    !!error.response?.status &&
    (error.response.status < 500 || error.response.status === 502)
  ) {
    return Promise.reject(error);
  }

  console.error(error);

  if (!error.request?.path) {
    return Promise.reject(error.toString().substring(0, 60));
  }

  const errMessage = `Axios Error : ${error.request?.method} ${error.request?.path} : ${error.response?.status}  ${error.response?.statusText}`;

  // eslint-disable-next-line prefer-promise-reject-errors
  return Promise.reject({
    statusCode: error.response?.status || 500,
    message: errMessage,
  });
}
