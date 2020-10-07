export interface ApiOrg {
  id: number,
  name: string,
  description: string,
  indexPrefix: string,
  contact?: ApiUser,
}

export interface ApiRole {
  id: number,
  org?: ApiOrg,
  name: string,
  description: string,
  indexPrefix: string,
  allowedRosterColumns: string,
  allowedNotificationEvents: string,
  canManageGroup: boolean,
  canManageRoster: boolean,
  canManageWorkspace: boolean,
  canViewRoster: boolean,
  canViewMuster: boolean,
  canViewPII: boolean,
}

export interface ApiUser {
  edipi: string,
  firstName: string,
  lastName: string,
  service: string,
  phone: string,
  email: string,
  roles?: ApiRole[],
  rootAdmin: boolean,
  isRegistered: boolean,
}

export interface ApiAccessRequest {
  id: number,
  org: ApiOrg,
  requestDate: Date,
  user: ApiUser,
  status: 'approved' | 'pending' | 'denied',
}

export interface ApiRosterEntry {
  edipi: string,
  rateRank: string,
  firstName: string,
  lastName: string,
  unit: string,
  billetWorkcenter: string,
  contractNumber: string,
  pilot?: boolean,
  aircrew?: boolean,
  cdi?: boolean,
  cdqar?: boolean,
  dscacrew?: boolean,
  advancedParty?: boolean,
  pui?: boolean,
  covid19TestReturnDate?: Date,
  rom?: string,
  romRelease?: string
  lastReported?: Date,
}
