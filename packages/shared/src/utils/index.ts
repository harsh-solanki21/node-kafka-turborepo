import { BadRequest, NotFound, ValidationError } from "./customErrorHandler";
import { sendSuccessResponse, sendErrorResponse } from "./customResponse";

const utils = {
  BadRequest,
  NotFound,
  ValidationError,
  sendSuccessResponse,
  sendErrorResponse,
};

export default utils;
