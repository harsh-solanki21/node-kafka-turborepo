import { ErrorRequestHandler, RequestHandler } from "express";
import errorHandler from "./errorHandler";
import notFoundHandler from "./notFoundHandler";

interface Middlewares {
  errorHandler: ErrorRequestHandler;
  notFoundHandler: RequestHandler;
}

const middlewares: Middlewares = {
  errorHandler,
  notFoundHandler,
};

export default middlewares;
