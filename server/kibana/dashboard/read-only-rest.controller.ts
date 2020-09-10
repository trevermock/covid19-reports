import nJwt from 'njwt';
import config from '../../config/environment';

// Builds ReadOnlyRest JWT token.
export function buildJWT({ user, workspace, userWorkspace }: any) {
  // if(_.isNil(workspace)) throw new Error('workspace not set');

  // TODO: Make this stuff dynamic using session user data.
  // firecares_id is acting as tenant unti renamed in ROR settings
  let firecares_id = 'org1_unit1';//`${workspace.FireDepartment.firecares_id}_${workspace.slug}`;
  let roles;

  // if(!user.isGlobal) {
  //   if (_.isNil(userWorkspace)) throw new Error('userWorkspace not set');
  //   roles = `kibana_${userWorkspace.permission}`;
  // } else {
    roles = 'kibana_admin';
  // }

  const claims = {
    sub: 'user1',//user.username,
    iss: 'https://statusengine.mysymptoms.mil',
    roles,
    firecares_id,
  };

  const jwt = nJwt.create(claims, config.ror.secret);
  jwt.setExpiration(new Date().getTime() + (86400 * 1000 * 30)); // 30d

  return jwt.compact();
}

// redirects user to kibana login page.  By attaching the rorJWT this will affectively login in the user seamlessly, and store rorCookie in the browser
export function login(req: any, res: any) {
  const rorJwt = buildJWT({
    //req.user,
    // workspace: req.workspace,
    // userWorkspace: req.userWorkspace,
  });
  return res.redirect(`${config.kibana.appPath}/login?jwt=${rorJwt}`);
}

// logouts a kibana session by clearing the rorCookie
export function logout(req: any, res: any, next: any) {
  res.clearCookie("rorCookie");
  next();
}
