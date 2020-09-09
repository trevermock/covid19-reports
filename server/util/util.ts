import {BadRequestError} from "./error";

export function getOptionalParam(param: string, params: any, type: string = 'string') {
  if (!params.hasOwnProperty(param)) {
    return undefined;
  }
  if (typeof params[param] !== type) {
    throw new BadRequestError(`Expected type '${type}' for parameter: ${param}`)
  }
  return params[param];
}

export function getRequiredParam(param: string, params: any, type: string = 'string') {
  if (!params.hasOwnProperty(param)) {
    throw new BadRequestError(`Missing parameter: ${param}`);
  }
  if (typeof params[param] !== type) {
    throw new BadRequestError(`Expected type '${type}' for parameter: ${param}`);
  }
  return params[param];
}
