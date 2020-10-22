import axios, { AxiosError, AxiosInstance } from 'axios';
import { NextFunction, Response } from 'express';
import axiosCookieJarSupport from 'axios-cookiejar-support';
import tough from 'tough-cookie';
import * as https from 'https';
import fs from 'fs';
import process from 'process';
import { ApiRequest } from '../api';
import config from '../config';
import { buildJWT } from './dashboard/read-only-rest.controller';

export class KibanaApi {

  private axiosInstance?: AxiosInstance;

  static async connect(req: ApiRequest, res?: Response, next?: NextFunction) {
    if (!req.appRole) {
      throw new Error('KibanaApi.connect() requires req.appRole to be set');
    }
    if (!req.appOrg) {
      throw new Error('KibanaApi.connect() requires req.appOrg to be set');
    }
    if (!req.appWorkspace) {
      throw new Error('KibanaApi.connect() requires req.appWorkspace to be set');
    }

    const kibanaApi = new KibanaApi();

    // Create a new axios instance. This object will have its own cookie jar.
    kibanaApi.axiosInstance = axios.create({
      baseURL: `${config.kibana.uri}`,
      headers: {
        'kbn-xsrf': 'true', // Kibana requires 'kbn-xsrf' to be set or it will return an error. It can be any string.
        'x-se-fire-department-all': req.appRole.getKibanaIndex(),
      },
      maxRedirects: 0,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      withCredentials: true,
    });

    // The cookie jar MUST be set in the defaults. If it's set in axio.create() then the cookie jar will be ignored.
    axiosCookieJarSupport(kibanaApi.axiosInstance);
    kibanaApi.axiosInstance.defaults.jar = new tough.CookieJar();

    // Start a Kibana Session on behalf of the requesting user, storing rorCookie in cookie jar.
    const rorJwt = buildJWT(req.appUser, req.appRole, req.appWorkspace);

    try {
      await kibanaApi.axiosInstance.get(`login?jwt=${rorJwt}`);
    } catch (err) {
      const axiosError = err as AxiosError;
      if (axiosError.response?.status === 302) {
        // Kibana always redirects on login, so just make sure the ror cookie is set to validate that we've logged in.
        // const headers = axiosError.response.headers as {[key: string]: any};
        const setCookie = axiosError.response.headers['set-cookie'] as string[] | undefined;
        const rorCookieExists = setCookie?.some(cookie => cookie.indexOf('rorCookie=') >= 0);
        if (!rorCookieExists) {
          console.error(err);
          throw new Error('Failed to login to Kibana API. Kibana appears to be running, but ROR cookie was not found.');
        }
      } else {
        console.error(err);
        throw new Error('Failed to login to Kibana API. Make sure that Kibana is running.');
      }
    }

    req.kibanaApi = kibanaApi;

    if (next) {
      next();
    }
  }

  get axios() {
    if (!this.axiosInstance) {
      throw new Error('KibanaApi has not been initialized. Make sure that KibanaApi.connect middleware has been added, or that KibanaApi.connect() has been called.');
    }

    return this.axiosInstance;
  }

}
