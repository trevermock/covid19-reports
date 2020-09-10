import { User } from '../api/user/user.model';
import config from '../config/environment';
// import { Options } from 'http-proxy-middleware';

export const kibanaProxySettings = {
  target: config.kibana.uri,
  changeOrigin: true,
  logLevel: 'debug',

  // Strip out the appPath, so kibana sees requested path
  pathRewrite: (path: string, req: any) => {
    return path.replace(`${config.kibana.appPath}`, '');
  },

  // add custom headers to request
  onProxyReq: (proxyReq: any, req: any) => {
    const user: User = req.DDSUser;
    proxyReq.setHeader('x-se-fire-department-all', user.getKibanaIndex());
  },

  router: (req: any) => {
    return config.kibana.uri;
  }
};
