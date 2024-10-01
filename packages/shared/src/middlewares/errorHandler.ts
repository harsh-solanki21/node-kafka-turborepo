import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/customErrorHandler";
import { sendErrorResponse } from "../utils/customResponse";

const errorHandler: ErrorRequestHandler = (error: Error, _req, res, _next) => {
  if (error instanceof AppError) {
    return sendErrorResponse(error, res);
  }

  const unexpectedError = new AppError(500, "Internal Server Error!");
  return sendErrorResponse(unexpectedError, res);
};

export default errorHandler;
