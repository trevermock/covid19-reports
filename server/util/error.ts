import express, {NextFunction} from 'express';
import path from "path";

export class RequestError extends Error {
  type: string;
  statusCode: number;
  htmlError: boolean;

  constructor(message: string, type: string, statusCode: number, htmlError: boolean) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.htmlError = htmlError;
  }
}

export class BadRequestError extends RequestError {
  constructor(message:string, htmlError=false) {
    super(message, 'BadRequestError', 400, htmlError);
    Error.captureStackTrace(this, BadRequestError);
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string, htmlError=false) {
    super(message, 'UnathorizedError', 401, htmlError);
    Error.captureStackTrace(this, UnauthorizedError);
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string, htmlError=false) {
    super(message, 'ForbiddenError', 403, htmlError);
    Error.captureStackTrace(this, ForbiddenError);
  }
}

export class NotFoundError extends RequestError {
  constructor(message: string, htmlError=false) {
    super(message, 'NotFound', 404, htmlError);
    Error.captureStackTrace(this, NotFoundError);
  }
}

export class InternalServerError extends RequestError {
  constructor(message: string, htmlError=false) {
    super(message, 'InternalServerError', 500, htmlError);
    Error.captureStackTrace(this, InternalServerError);
  }
}

export function errorHandler(error: any, req: any, res: express.Response, next: NextFunction) {
  // Send an error response if one hasn't already been sent. Otherwise the reqeust will
  // fail and make the client hang.
  if (res.headersSent) {
    return;
  }

  let statusCode;
  let errors;
  let message;
  let htmlError = false;

  if (error.errors) {
    errors = error.errors;
  } else {
    let type;

    if (error instanceof RequestError) {
      statusCode = error.statusCode;
      message = error.message;
      type = error.type;
      htmlError = error.htmlError;
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
  if (htmlError && (statusCode === 401 || statusCode === 403)) {
    res.sendFile(path.join(__dirname, '../public', 'not_authorized.html'));
  } else {
    res.send({ errors });
    next();
  }
}
