//import nJwt from 'njwt';
import { User } from '../../api/user/user.model';
import config from '../../config/environment';
const nJwt = require('njwt');

// Builds ReadOnlyRest JWT token.
export function buildJWT(user: User) {
  console.log('ror buildJWT()');
  // console.log('ror user.getKibanaIndex()', user.getKibanaIndex());

  const claims = {
    sub: user.edipi,
    iss: 'https://statusengine.mysymptoms.mil',
    roles: user.getKibanaRoles(),
    firecares_id: user.edipi, // TODO: firecares_id is acting as tenant until renamed in ROR settings
  };

  console.log('ror claims', claims);

  const jwt = nJwt.create(claims, config.ror.secret);
  jwt.setExpiration(new Date().getTime() + (86400 * 1000 * 30)); // 30d

  return jwt.compact();
}

// Redirects user to Kibana login page. By attaching the rorJWT this will affectively login in the user seamlessly,
// and store rorCookie in the browser.
export function login(req: any, res: any) {
  console.log('ror login()');

  if (req.DDSUser == null) {
    throw new Error('req.DDSUser is not set');
  }

  const rorJwt = buildJWT(req.DDSUser);
  console.log('ror jwt', rorJwt);
  return res.redirect(`${config.kibana.appPath}/login?jwt=${rorJwt}`);
}

// Logs out of a Kibana session by clearing the rorCookie.
export function logout(req: any, res: any, next: any) {
  console.log('ror logout()');

  res.clearCookie('rorCookie');
  next();
}
