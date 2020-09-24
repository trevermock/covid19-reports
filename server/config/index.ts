import devConfig from './development';
import prodConfig from './production';
import testConfig from './test';

const baseConfig = {
  // Local vs AWS Kibana
  ror: {
    secret: process.env.ROR_JWT_SIGNATURE_KEY || 'woEayHiICafruph^gZJb3EG5Fnl1qou6XUT8xR^7OMwaCYxz^&@rr#Hi5*s*918tQS&iDJO&67xy0hP!F@pThb3#Aymx%XPV3x^',
  },

  kibana: {
    // App basepath: make sure your kibana.yml file isn't using the app root or it will mess up the proxy.
    appPath: process.env.KIBANA_BASEPATH || '/_plugin/kibana',
    uri: process.env.KIBANA_URI || 'http://localhost:5601',
  },
};

// Merge current environment config.
let config: Config = baseConfig;
if (process.env.NODE_ENV === 'development') {
  config = {
    ...config,
    ...devConfig,
  };
} else if (process.env.NODE_ENV === 'production') {
  config = {
    ...config,
    ...prodConfig,
  };
} else if (process.env.NODE_ENV === 'test') {
  config = {
    ...config,
    ...testConfig,
  };
}

type Config = typeof baseConfig
  & Partial<typeof devConfig>
  & Partial<typeof prodConfig>
  & Partial<typeof testConfig>;

const configExport = config;

export default configExport;
