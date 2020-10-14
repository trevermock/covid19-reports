import process from 'process';
import database from '.';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import { User } from '../api/user/user.model';
import { Workspace } from '../api/workspace/workspace.model';
import { Roster } from '../api/roster/roster.model';

export default (async function() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('You can only seed the database in a development environment.');
  }

  console.log('Seeding database...');

  const connection = await database;

  // Create users
  const groupAdmin = new User();
  groupAdmin.edipi = '1';
  groupAdmin.firstName = 'Group';
  groupAdmin.lastName = 'Admin';
  groupAdmin.phone = '123-456-7890';
  groupAdmin.email = 'groupadmin@statusengine.com';
  groupAdmin.service = 'Space Force';
  groupAdmin.isRegistered = true;
  await groupAdmin.save();

  // Create orgs
  const testOrg = new Org();
  testOrg.name = 'Test Org';
  testOrg.description = 'First test org';
  testOrg.contact = groupAdmin;
  await testOrg.save();

  const testOrg2 = new Org();
  testOrg2.name = 'Test Org 2';
  testOrg2.description = 'Second test org';
  testOrg2.contact = groupAdmin;
  await testOrg2.save();

  // Create roles
  const testOrgGroupAdminRole = await createGroupAdminRole(testOrg);
  await createRosterManagerRole(testOrg);

  const testOrg2GroupAdminRole = await createGroupAdminRole(testOrg2);
  await createRosterManagerRole(testOrg2);

  // Assign roles
  groupAdmin.roles = [testOrgGroupAdminRole, testOrg2GroupAdminRole];
  await groupAdmin.save();

  // Create roster entries
  const rosterEntry1 = new Roster();
  rosterEntry1.org = testOrg;
  rosterEntry1.edipi = '1000000001';
  rosterEntry1.firstName = 'Luke';
  rosterEntry1.lastName = 'Skywalker';
  rosterEntry1.pilot = true;
  rosterEntry1.unit = 'unit1';
  rosterEntry1.billetWorkcenter = '';
  rosterEntry1.contractNumber = '';
  await rosterEntry1.save();

  const rosterEntry2 = new Roster();
  rosterEntry2.org = testOrg;
  rosterEntry2.edipi = '1000000002';
  rosterEntry2.firstName = 'Han';
  rosterEntry2.lastName = 'Solo';
  rosterEntry2.pilot = true;
  rosterEntry2.unit = 'unit1';
  rosterEntry2.billetWorkcenter = '';
  rosterEntry2.contractNumber = '';
  await rosterEntry2.save();

  await connection.close();
  console.log('Finished!');
}());

async function createGroupAdminRole(org: Org, workspace?: Workspace) {
  const role = new Role();
  role.name = 'Group Admin';
  role.description = 'For managing the group.';
  role.org = org;
  role.allowedRosterColumns = ['*'];
  role.allowedNotificationEvents = ['*'];
  role.canManageGroup = true;
  role.canManageRoster = true;
  role.canManageWorkspace = true;
  role.canViewMuster = true;
  role.canViewPII = true;
  role.canViewRoster = true;
  role.workspace = workspace;
  return role.save();
}

async function createRosterManagerRole(org: Org, workspace?: Workspace) {
  const role = new Role();
  role.name = 'Roster Manager';
  role.description = 'For managing the roster.';
  role.org = org;
  role.allowedRosterColumns = ['edipi', 'unit', 'rateRank'];
  role.allowedNotificationEvents = [];
  role.canManageRoster = true;
  role.canViewRoster = true;
  role.workspace = workspace;
  return role.save();
}
