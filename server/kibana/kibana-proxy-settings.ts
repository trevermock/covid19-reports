import { ClientRequest, IncomingMessage } from 'http';
import { Config } from 'http-proxy-middleware';
import { ApiRequest } from '../api';
import config from '../config';

const kibanaProxyConfig: Config = {
  target: config.kibana.uri,
  changeOrigin: true,
  logLevel: 'debug',
  secure: false,

  // add custom headers to request
  onProxyReq: (proxyReq: ClientRequest, req: ProxyRequest) => {
    if (req.appRole) {
      proxyReq.setHeader('x-se-fire-department-all', req.appRole.getKibanaIndex());
    }
  },

  router: () => {
    return config.kibana.uri;
  },
};

type ProxyRequest = IncomingMessage & ApiRequest;

export default kibanaProxyConfig;
