export class RequestError extends Error {
  type: RequestErrorType;
  statusCode: number;
  errorPage?: string;
  showErrorPage: boolean;

  constructor(message: string, type: RequestErrorType, statusCode: number, showErrorPage: boolean) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.showErrorPage = showErrorPage;
  }
}

export class BadRequestError extends RequestError {
  constructor(message: string, showErrorPage = false) {
    super(message, 'BadRequest', 400, showErrorPage);
    Error.captureStackTrace(this, BadRequestError);
  }
}

export class UnauthorizedError extends RequestError {
  errorPage = 'not-authorized.html';

  constructor(message: string, showErrorPage = false) {
    super(message, 'Unauthorized', 401, showErrorPage);
    Error.captureStackTrace(this, UnauthorizedError);
  }
}

export class ForbiddenError extends RequestError {
  errorPage = 'not-authorized.html';

  constructor(message: string, showErrorPage = false) {
    super(message, 'Forbidden', 403, showErrorPage);
    Error.captureStackTrace(this, ForbiddenError);
  }
}

export class NotFoundError extends RequestError {
  constructor(message: string, showErrorPage = false) {
    super(message, 'NotFound', 404, showErrorPage);
    Error.captureStackTrace(this, NotFoundError);
  }
}

export class UnprocessableEntity extends RequestError {
  constructor(message: string, showErrorPage = false) {
    super(message, 'UnprocessableEntity', 422, showErrorPage);
    Error.captureStackTrace(this, UnprocessableEntity);
  }
}

export class InternalServerError extends RequestError {
  constructor(message: string, showErrorPage = false) {
    super(message, 'InternalServerError', 500, showErrorPage);
    Error.captureStackTrace(this, InternalServerError);
  }
}

export type RequestErrorType = (
  'BadRequest' |
  'Unauthorized' |
  'Forbidden' |
  'NotFound' |
  'UnprocessableEntity' |
  'InternalServerError'
);
