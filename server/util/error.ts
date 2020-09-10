import express, {NextFunction} from 'express';

export class RequestError extends Error {
  type: string;
  statusCode: number;

  constructor(message: string, type: string, statusCode: number) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends RequestError {
  constructor(message:string) {
    super(message, 'BadRequestError', 400);
    Error.captureStackTrace(this, BadRequestError);
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string) {
    super(message, 'UnathorizedError', 401);
    Error.captureStackTrace(this, UnauthorizedError);
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string) {
    super(message, 'ForbiddenError', 403);
    Error.captureStackTrace(this, ForbiddenError);
  }
}

export class NotFoundError extends RequestError {
  constructor(message: string) {
    super(message, 'NotFound', 404);
    Error.captureStackTrace(this, NotFoundError);
  }
}

export class InternalServerError extends RequestError {
  constructor(message: string) {
    super(message, 'InternalServerError', 500);
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

  if (error.errors) {
    errors = error.errors;
  } else {
    let message;
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
      console.log('Unknown Internal Server Error: ', error);
    }
  }

  res.status(statusCode || 500).send({ errors });

  next();
}
