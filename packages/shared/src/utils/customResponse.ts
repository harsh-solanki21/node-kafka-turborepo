import { Response } from "express";
import {
  ISuccessResponse,
  IErrorResponse,
  IPaginationData,
} from "../interfaces/response";
import { AppError } from "./customErrorHandler";

export const sendSuccessResponse = <T>(
  res: Response,
  message: string,
  data: T,
  statusCode: number = 200,
  meta?: IPaginationData
): void => {
  const response: ISuccessResponse<T> = {
    success: true,
    code: statusCode,
    message,
    data,
    meta,
  };
  res.status(statusCode).json(response);
};

export const sendErrorResponse = (error: AppError, res: Response): void => {
  const { statusCode, message, validationErrors } = error;
  const code = statusCode || 500;
  const response: IErrorResponse = {
    success: false,
    code,
    message,
    errors: validationErrors || [],
  };
  res.status(code).json(response);
};
