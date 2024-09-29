import { IValidationError } from "../interfaces/response";

export class AppError extends Error {
  readonly statusCode: number;
  readonly validationErrors?: IValidationError[];

  constructor(
    statusCode: number,
    message: string,
    validationErrors?: IValidationError[]
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }

  serialize() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      validationErrors: this.validationErrors || null,
    };
  }
}

export class BadRequest extends AppError {
  constructor(message = "Something went wrong!") {
    super(400, message);
  }
}

export class NotFound extends AppError {
  constructor(message = "The page you are looking for doesn't exist!") {
    super(404, message);
  }
}

export class ValidationError extends AppError {
  constructor(
    validationErrors: IValidationError[],
    message = "Validation Error!"
  ) {
    super(422, message, validationErrors);
  }
}
