import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/customErrorHandler";
import { sendErrorResponse } from "../utils/customResponse";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return sendErrorResponse(error, res);
  }

  const unexpectedError = new AppError(500, "Internal Server Error!");

  return sendErrorResponse(unexpectedError, res);
};

export default errorHandler;
