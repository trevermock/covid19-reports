export class AllowedRosterColumns {
  edipi: boolean = false;
  rateRank: boolean = false;
  firstName: boolean = false;
  lastName: boolean = false;
  unit: boolean = false;
  billetWorkcenter: boolean = false;
  contractNumber: boolean = false;
  pilot: boolean = false;
  aircrew: boolean = false;
  cdi: boolean = false;
  cdqar: boolean = false;
  dscacrew: boolean = false;
  advancedParty: boolean = false;
  pui: boolean = false;
  covid19TestReturnDate: boolean = false;
  rom: boolean = false;
  romRelease: boolean = false;
  lastReported: boolean = false;
}

export const RosterColumnDisplayName = {
  edipi: 'EDIPI',
  rateRank: 'Rate/Rank',
  firstName: 'First Name',
  lastName: 'Last Name',
  unit: 'Unit',
  billetWorkcenter: 'Billet Workcenter',
  contractNumber: 'Contract Number',
  pilot: 'Pilot',
  aircrew: 'Aircrew',
  cdi: 'CDI',
  cdqar: 'CDQAR',
  dscacrew: 'DSCA Crew',
  advancedParty: 'Advanced Party',
  pui: 'PUI',
  covid19TestReturnDate: 'COVID 19 Test Return Date',
  rom: 'ROM',
  romRelease: 'ROM Release',
  lastReported: 'Last Reported',
};

export const RosterPIIColumns = {
  edipi: false,
  firstName: true,
  lastName: true,
  unit: false,
  billetWorkcenter: false,
  contractNumber: false,
  rateRank: false,
  pilot: false,
  aircrew: false,
  cdi: false,
  cdqar: false,
  dscacrew: false,
  advancedParty: false,
  pui: false,
  covid19TestReturnDate: false,
  rom: false,
  romRelease: false,
  lastReported: false,
};
