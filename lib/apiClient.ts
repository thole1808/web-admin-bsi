// lib/apiClient.ts
import axios, { AxiosRequestConfig, AxiosResponse, Method } from "axios";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";
import { getSessionUser } from "./getSessionUser";

// Setup log directory
const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

// Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.printf(({ level, message }) => {
    return `[${new Date().toISOString()}] ${level.toUpperCase()} ${message}`;
  }),
  transports: [
    new DailyRotateFile({
      filename: path.join(logDir, "api-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: false,
      maxFiles: "7d",
    }),
  ],
});

const baseClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
});

// Fungsi utama dengan logger
export async function apiClient(config: AxiosRequestConfig) {
  const user = await getSessionUser();
  const finalConfig: AxiosRequestConfig = {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: user ? `Bearer ${user.accessToken}` : "",
    },
  };

  const startTime = new Date();
  try {
    const response = await baseClient.request(finalConfig);
    const duration = new Date().getTime() - startTime.getTime();
    logger.info(
      `${response.status} ${config.method?.toUpperCase()} ${config.url} - ${duration}ms`
    );
    return response;
  } catch (error: any) {
    const duration = new Date().getTime() - startTime.getTime();
    logger.error(
      `${error.response?.status || "ERR"} ${config.method?.toUpperCase()} ${config.url} - ${duration}ms - ${error.message}`
    );
    throw error;
  }
}

// 🔽 Helper Methods
export async function apiGet<T = any>(url: string, config: AxiosRequestConfig = {}) {
  return apiClient({ ...config, method: "get", url }) as Promise<AxiosResponse<T>>;
}

export async function apiPost<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}) {
  return apiClient({ ...config, method: "post", url, data }) as Promise<AxiosResponse<T>>;
}

export async function apiPut<T = any>(url: string, data?: any, config: AxiosRequestConfig = {}) {
  return apiClient({ ...config, method: "put", url, data }) as Promise<AxiosResponse<T>>;
}

export async function apiDelete<T = any>(url: string, config: AxiosRequestConfig = {}) {
  return apiClient({ ...config, method: "delete", url }) as Promise<AxiosResponse<T>>;
}