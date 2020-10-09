import express, { Request } from 'express';
import orgRoutes from './org';
import userRoutes from './user';
import roleRoutes from './role';
import rosterRoutes from './roster';
import accessRequestRoutes from './access-request';
import workspaceRoutes from './workspace';
import { User } from './user/user.model';
import { Org } from './org/org.model';
import { Role } from './role/role.model';

const router = express.Router();

router.use('/org', orgRoutes);
router.use('/user', userRoutes);
router.use('/role', roleRoutes);
router.use('/roster', rosterRoutes);
router.use('/access-request', accessRequestRoutes);
router.use('/workspace', workspaceRoutes);

export interface ApiRequest<ReqParams = object, ReqBody = object, ReqQuery = object, ResBody = object> extends Request<ReqParams, ResBody, ReqBody, ReqQuery> {
  appUser: User,
  appOrg?: Org,
  appRole?: Role,
}

export type OrgParam = {
  orgId: string
};

export type RoleParam = {
  roleId: string
};

export type EdipiParam = {
  userEDIPI: string
};

export type WorkspaceParam = {
  workspaceId: string
};

export type OrgRoleParams = OrgParam & RoleParam;
export type OrgEdipiParams = OrgParam & EdipiParam;
export type OrgWorkspaceParams = OrgParam & WorkspaceParam;

export default router;
