import { Response, NextFunction } from 'express';
import path from 'path';

export type RequestErrorType = (
  'BadRequest' |
  'Unauthorized' |
  'Forbidden' |
  'NotFound' |
  'UnprocessableEntity' |
  'InternalServerError'
);

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

export function errorHandler(error: any, req: any, res: Response, next: NextFunction) {
  // Send an error response if one hasn't already been sent. Otherwise the reqeust will
  // fail and make the client hang.
  if (res.headersSent) {
    return;
  }

  console.error(error);

  let statusCode;
  let errors;
  let message;

  if (error.errors) {
    errors = error.errors;
  } else {
    let type;

    if (error instanceof RequestError) {
      statusCode = error.statusCode;
      message = error.message;
      type = error.type;
    } else if (error instanceof String) {
      message = error;
    }

    if (process.env.NODE_ENV === 'development') {
      errors = [{
        message: message || 'An unknown error occurred!',
        type: type || 'InternalServerError',
        sourceError: error
      }];
    } else {
      errors = [{
        message: message || 'An unknown error occurred!',
        type: type || 'InternalServerError'
      }];
      if (!(error instanceof RequestError) || error instanceof BadRequestError) {
        console.log('Unknown Internal Server Error: ', error);
      }
    }
  }

  res.status(statusCode || 500);

  if (error.showErrorPage && error.errorPage) {
    res.sendFile(path.join(__dirname, '../public', error.errorPage));
  } else {
    res.send({ errors });
    next();
  }
}
