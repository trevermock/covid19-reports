/* eslint @typescript-eslint/no-unused-vars: "off" */
import { ClientRequest, IncomingMessage } from 'http';
import { Config } from 'http-proxy-middleware';
import { ApiRequest } from '../api';
import config from '../config';

const kibanaProxyConfig: Config = {
  target: config.kibana.uri,
  changeOrigin: true,
  logLevel: 'debug',
  secure: false,

  // Strip out the appPath, so kibana sees requested path
  pathRewrite: (path: string) => {
    return path.replace(`${config.kibana.appPath}`, '');
  },

  // add custom headers to request
  onProxyReq: (proxyReq: ClientRequest, req: ProxyRequest) => {
    if (req.appRole) {
      proxyReq.setHeader('x-se-fire-department-all', req.appUser.getKibanaIndex(req.appRole));
    }
  },

  router: () => {
    return config.kibana.uri;
  },
};

type ProxyRequest = IncomingMessage & ApiRequest;

export default kibanaProxyConfig;
