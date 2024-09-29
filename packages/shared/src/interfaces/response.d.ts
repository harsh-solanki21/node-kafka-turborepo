export interface IValidationError {
  field: string;
  message: string;
}

export interface IPaginationData {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ISuccessResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  meta?: IPaginationData;
}

export interface IErrorResponse {
  success: boolean;
  code: number;
  message: string;
  errors: IValidationError[];
  stack?: string;
}
