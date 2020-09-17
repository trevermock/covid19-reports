import { Response, NextFunction } from 'express';
import { ApiRequest } from '../../api';
import { User } from '../../api/user/user.model';
import config from '../../config';

const nJwt = require('njwt');

class ReadOnlyRestController {

  // Redirects user to Kibana login page. By attaching the rorJWT this will affectively login in the user seamlessly,
  // and store rorCookie in the browser.
  login(req: ApiRequest, res: Response) {
    console.log('ror login()');

    if (req.appUser == null) {
      throw new Error('req.appUser is not set');
    }

    const rorJwt = buildJWT(req.appUser);
    console.log('ror jwt', rorJwt);
    return res.redirect(`${config.kibana.appPath}/login?jwt=${rorJwt}`);
  }

  // Logs out of a Kibana session by clearing the rorCookie.
  logout(req: ApiRequest, res: Response, next: NextFunction) {
    console.log('ror logout()');

    res.clearCookie('rorCookie');
    next();
  }

}

// Builds ReadOnlyRest JWT token.
function buildJWT(user: User) {
  console.log('ror buildJWT()');

  const claims = {
    sub: user.edipi,
    iss: 'https://statusengine.mysymptoms.mil',
    roles: user.getKibanaRoles(),
    firecares_id: user.getKibanaUserClaim(), // TODO: Rename 'firecares_id'.
  };

  console.log('ror claims', claims);

  const jwt = nJwt.create(claims, config.ror.secret);
  jwt.setExpiration(new Date().getTime() + (86400 * 1000 * 30)); // 30d

  return jwt.compact();
}

export default new ReadOnlyRestController();
