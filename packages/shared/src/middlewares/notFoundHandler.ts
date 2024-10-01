import { RequestHandler } from "express";
import { NotFound } from "../utils/customErrorHandler";

const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new NotFound());
};

export default notFoundHandler;
