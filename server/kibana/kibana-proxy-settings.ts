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
    // const es_indicies = req.user.FireDepartment.get().es_indices;
    proxyReq.setHeader('x-se-fire-department-all', '*');
  },

  router: (req: any) => {
    return config.kibana.uri;
  }
};
