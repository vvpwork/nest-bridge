import { Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

export const getAxiosInstance = (baseURL: string, headers?: { [key: string]: string }) => {
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  axiosInstance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      Logger.log('Request config: ', config.baseURL, config.url, config.data);
      return config;
    },
    (error: Error) => Logger.error(error),
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response.data,

    (error: AxiosError) => {
      if (error.response && error.response.data) {
        Logger.error(new Error(`error from response: ${error.config.url}`), error.response.data);
      }
      throw error;
    },
  );

  return axiosInstance;
};
