import process from 'process';
import database from '.';
import { Org } from '../api/org/org.model';
import { Role } from '../api/role/role.model';
import { User } from '../api/user/user.model';
import { Workspace } from '../api/workspace/workspace.model';
import { Roster, RosterColumnType } from '../api/roster/roster.model';
import { CustomRosterColumn } from '../api/roster/custom-roster-column.model';

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

  await generateOrg(1, groupAdmin, 'Test Group', 'First Test Group', 5, 20);
  await generateOrg(2, groupAdmin, 'Test Group 2', 'Second Test Group', 5, 20);

  await connection.close();
  console.log('Finished!');
}());

async function generateOrg(orgNum: number, admin: User, name: string, description: string, numUsers: number, numRosterEntries: number) {
  const org = new Org();
  org.name = name;
  org.description = description;
  org.contact = admin;
  await org.save();

  const customColumn = new CustomRosterColumn();
  customColumn.org = org;
  customColumn.name = 'myCustomColumn';
  customColumn.display = 'My Custom Column';
  customColumn.type = RosterColumnType.String;
  customColumn.phi = false;
  customColumn.pii = false;
  customColumn.required = false;
  await customColumn.save();

  const groupAdminRole = await createGroupAdminRole(org).save();
  if (admin.roles) {
    admin.roles.push(groupAdminRole);
  } else {
    admin.roles = [groupAdminRole];
  }
  await admin.save();

  let userRole = createUserRole(org);
  userRole.allowedRosterColumns.push(customColumn.name);
  userRole = await userRole.save();

  for (let i = 0; i < numUsers; i++) {
    const user = new User();
    user.edipi = `${orgNum}00000000${i}`;
    user.firstName = 'User';
    user.lastName = `${i}`;
    user.phone = randomPhoneNumber();
    user.email = `user${i}@org${orgNum}.com`;
    user.service = 'Space Force';
    user.roles = [userRole];
    user.isRegistered = true;
    await user.save();
  }

  for (let i = 0; i < numRosterEntries; i++) {
    const rosterEntry = new Roster();
    rosterEntry.org = org;
    rosterEntry.edipi = `${orgNum}${`${i}`.padStart(9, '0')}`;
    rosterEntry.firstName = 'Roster';
    rosterEntry.lastName = `Entry${i}`;
    rosterEntry.rateRank = `Rank ${randomNumber(1, 10)}`;
    rosterEntry.pilot = Math.random() > 0.5;
    rosterEntry.aircrew = Math.random() > 0.5;
    rosterEntry.advancedParty = Math.random() > 0.5;
    rosterEntry.cdi = Math.random() > 0.5;
    rosterEntry.cdqar = Math.random() > 0.5;
    rosterEntry.dscacrew = Math.random() > 0.5;
    // Ensure at least some roster entries are in unit 1.
    rosterEntry.unit = (i % 2 === 0) ? 'unit1' : `unit${randomNumber(2, 5)}`;
    rosterEntry.billetWorkcenter = '';
    rosterEntry.contractNumber = '';
    rosterEntry.lastReported = new Date();
    const customColumns: any = {};
    customColumns[customColumn.name] = `custom column value`;
    rosterEntry.customColumns = customColumns;
    await rosterEntry.save();
  }

  return org;
}

function randomPhoneNumber() {
  return `${randomNumber(100, 999)}-${randomNumber(100, 999)}-${randomNumber(1000, 9999)}`;
}

function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGroupAdminRole(org: Org, workspace?: Workspace) {
  const role = new Role();
  role.name = 'Group Admin';
  role.description = 'For managing the group.';
  role.org = org;
  role.indexPrefix = '*';
  role.allowedRosterColumns = ['*'];
  role.allowedNotificationEvents = ['*'];
  role.canManageGroup = true;
  role.canManageRoster = true;
  role.canManageWorkspace = true;
  role.canViewMuster = true;
  role.canViewPII = true;
  role.canViewRoster = true;
  role.workspace = workspace;
  return role;
}

function createUserRole(org: Org, workspace?: Workspace) {
  const role = new Role();
  role.name = 'Group User';
  role.description = 'Basic role for all group users.';
  role.org = org;
  role.indexPrefix = 'unit1';
  role.allowedRosterColumns = ['edipi', 'unit', 'rateRank', 'lastReported'];
  role.allowedNotificationEvents = [];
  role.canManageRoster = true;
  role.canViewRoster = true;
  role.canViewMuster = true;
  role.workspace = workspace;
  return role;
}
