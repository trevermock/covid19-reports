/* eslint @typescript-eslint/no-unused-vars: "off" */
import { User } from '../api/user/user.model';
import config from '../config/environment';

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
    const user: User = req.user;
    proxyReq.setHeader('x-se-fire-department-all', user.getKibanaIndex());
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  router: (req: any) => {
    return config.kibana.uri;
  },
};
