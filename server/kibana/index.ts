import { Router } from 'express';
import proxy from 'http-proxy-middleware';
import { kibanaProxySettings } from './kibana-proxy-settings';

const router = Router();

// Proxy client browser to Kibana
router.use(
  '*',
  proxy(kibanaProxySettings as any),
);

export default router;
