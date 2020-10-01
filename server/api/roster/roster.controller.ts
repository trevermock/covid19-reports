import { Response } from 'express';
import csv from 'csvtojson';
import fs from 'fs';
import { ApiRequest, OrgEdipiParams, OrgParam } from '../index';
import { Roster } from './roster.model';
import { BadRequestError, NotFoundError, UnprocessableEntity } from '../../util/error-types';
import { getOptionalParam, getRequiredParam } from '../../util/util';

class RosterController {

  async getRosterTemplate(req: ApiRequest, res: Response) {
    const file = `${__dirname}/uploads/roster-template.csv`;
    res.download(file);
  }

  async getRoster(req: ApiRequest<OrgParam, any, GetRosterQuery>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const limit = (req.query.limit != null) ? parseInt(req.query.limit) : 100;
    const page = (req.query.page != null) ? parseInt(req.query.page) : 0;

    const roster = await Roster.find({
      skip: page * limit,
      take: limit,
      where: {
        org: req.appOrg.id,
      },
      order: {
        edipi: 'ASC',
      },
    });

    res.json(roster);
  }

  async getRosterCount(req: ApiRequest<OrgParam>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const count = await Roster.count({
      where: {
        org: req.appOrg.id,
      },
    });

    res.json({ count });
  }

  async uploadRosterEntries(req: ApiRequest<OrgParam>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const org = req.appOrg;

    if (!req.file || !req.file.path) {
      throw new BadRequestError('No file to process.');
    }

    const rosterEntries: Roster[] = [];
    try {
      const roster = await csv().fromFile(req.file.path) as RosterFileRow[];
      roster.forEach(row => {
        const entry = new Roster();
        entry.edipi = getRequiredParam('edipi', row);
        entry.org = org;
        entry.firstName = getRequiredParam('firstName', row);
        entry.lastName = getRequiredParam('lastName', row);
        entry.rateRank = getOptionalParam('rateRank', row);
        entry.unit = getRequiredParam('unit', row);
        entry.billetWorkcenter = getRequiredParam('billetWorkcenter', row);
        entry.contractNumber = getRequiredParam('contractNumber', row);
        entry.pilot = getOptionalParam('pilot', row) === 'true';
        entry.aircrew = getOptionalParam('aircrew', row) === 'true';
        entry.cdi = getOptionalParam('cdi', row) === 'true';
        entry.cdqar = getOptionalParam('cdqar', row) === 'true';
        entry.dscacrew = getOptionalParam('dscacrew', row) === 'true';
        entry.advancedParty = getOptionalParam('advancedParty', row) === 'true';
        entry.pui = getOptionalParam('pui', row) === 'true';
        entry.rom = getOptionalParam('rom', row);
        entry.romRelease = getOptionalParam('romRelease', row);
        rosterEntries.push(entry);
      });
      await Roster.save(rosterEntries);
    } catch (err) {
      throw new UnprocessableEntity('Roster file was unable to be processed. Check that it is formatted correctly.');
    } finally {
      fs.unlinkSync(req.file.path);
    }

    res.json({
      count: rosterEntries.length,
    });
  }

  async addRosterEntry(req: ApiRequest<OrgParam, RosterEntryData>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const entry = new Roster();
    entry.edipi = getRequiredParam('edipi', req.body);
    entry.org = req.appOrg;
    setRosterParamsFromBody(entry, req.body);
    const newRosterEntry = await entry.save();

    await res.status(201).json(newRosterEntry);
  }

  async getRosterEntry(req: ApiRequest<OrgEdipiParams>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const userEDIPI = req.params.userEDIPI;

    const rosterEntry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: req.appOrg.id,
      },
    });

    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }

    res.json(rosterEntry);
  }

  async deleteRosterEntry(req: ApiRequest<OrgEdipiParams>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const userEDIPI = req.params.userEDIPI;

    const rosterEntry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: req.appOrg.id,
      },
    });

    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }

    const deletedEntry = await rosterEntry.remove();

    res.json(deletedEntry);
  }

  async updateRosterEntry(req: ApiRequest<OrgEdipiParams, RosterEntryData>, res: Response) {
    if (!req.appOrg) {
      throw new NotFoundError('Organization was not found.');
    }

    const userEDIPI = req.params.userEDIPI;

    const entry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: req.appOrg.id,
      },
    });

    if (!entry) {
      throw new NotFoundError('User could not be found.');
    }

    setRosterParamsFromBody(entry, req.body);
    const updatedRosterEntry = await entry.save();

    res.json(updatedRosterEntry);
  }

}

function setRosterParamsFromBody(entry: Roster, body: RosterEntryData) {
  entry.firstName = getRequiredParam('firstName', body);
  entry.lastName = getRequiredParam('lastName', body);
  entry.unit = getRequiredParam('unit', body);
  entry.billetWorkcenter = getRequiredParam('billetWorkcenter', body);
  entry.contractNumber = getRequiredParam('contractNumber', body);
  entry.rateRank = getOptionalParam('rateRank', body);
  entry.pilot = getOptionalParam('pilot', body, 'boolean');
  entry.aircrew = getOptionalParam('aircrew', body, 'boolean');
  entry.cdi = getOptionalParam('cdi', body, 'boolean');
  entry.cdqar = getOptionalParam('cdqar', body, 'boolean');
  entry.dscacrew = getOptionalParam('dscacrew', body, 'boolean');
  entry.advancedParty = getOptionalParam('advancedParty', body, 'boolean');
  entry.pui = getOptionalParam('pui', body, 'boolean');
  const covid19TestReturnDate = getOptionalParam('covid19TestReturnDate', body);
  if (covid19TestReturnDate) {
    entry.covid19TestReturnDate = new Date(covid19TestReturnDate);
  }
  entry.rom = getOptionalParam('rom', body);
  entry.romRelease = getOptionalParam('romRelease', body);
  const lastReported = getOptionalParam('lastReported', body);
  if (lastReported) {
    entry.lastReported = new Date(lastReported);
  }
}

type GetRosterQuery = {
  limit: string
  page: string
};

type RosterFileRow = {
  edipi: string
  firstName: string
  lastName: string
  unit: string
  billetWorkcenter: string
  contractNumber: string
  rateRank?: string
  pilot?: string
  aircrew?: string
  cdi?: string
  cdqar?: string
  dscacrew?: string
  advancedParty?: string
  pui?: string
  rom?: string
  romRelease?: string

  // NOTE
  // `covid19TestReturnDate` and `lastReported` are intentionally excluded since they'll be updated by the ingest
  // process instead of through a file upload.
};

type RosterEntryData = {
  edipi: Roster['edipi']
  firstName: Roster['firstName']
  lastName: Roster['lastName']
  unit: Roster['unit']
  billetWorkcenter: Roster['billetWorkcenter']
  contractNumber: Roster['contractNumber']
  rateRank: Roster['rateRank']
  pilot: Roster['pilot']
  aircrew: Roster['aircrew']
  cdi: Roster['cdi']
  cdqar: Roster['cdqar']
  dscacrew: Roster['dscacrew']
  advancedParty: Roster['advancedParty']
  pui: Roster['pui']
  covid19TestReturnDate: Roster['covid19TestReturnDate']
  rom: Roster['rom']
  romRelease: Roster['romRelease']
  lastReported: Roster['lastReported']
};

export default new RosterController();
