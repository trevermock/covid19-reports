import { Response } from 'express';
import csv from 'csvtojson';
import fs from 'fs';
import { ApiRequest, OrgEdipiParams, OrgParam } from '../index';
import { Roster } from './roster.model';
import { BadRequestError, NotFoundError, UnprocessableEntity } from '../../util/error-types';
import { getOptionalParam, getRequiredParam } from '../../util/util';

class RosterController {

  async getRosterTemplate(req: ApiRequest, res: Response) {
    const file = `${__dirname}/uploads/roster_template.csv`;
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
        entry.first_name = getRequiredParam('first_name', row);
        entry.last_name = getRequiredParam('last_name', row);
        entry.rate_rank = getOptionalParam('rate_rank', row);
        entry.unit = getRequiredParam('unit', row);
        entry.billet_workcenter = getRequiredParam('billet_workcenter', row);
        entry.contract_number = getRequiredParam('contract_number', row);
        entry.pilot = getOptionalParam('pilot', row) === 'true';
        entry.aircrew = getOptionalParam('aircrew', row) === 'true';
        entry.cdi = getOptionalParam('cdi', row) === 'true';
        entry.cdqar = getOptionalParam('cdqar', row) === 'true';
        entry.dscacrew = getOptionalParam('dscacrew', row) === 'true';
        entry.advanced_party = getOptionalParam('advanced_party', row) === 'true';
        entry.pui = getOptionalParam('pui', row) === 'true';
        entry.rom = getOptionalParam('rom', row);
        entry.rom_release = getOptionalParam('rom_release', row);
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
  entry.first_name = getRequiredParam('first_name', body);
  entry.last_name = getRequiredParam('last_name', body);
  entry.unit = getRequiredParam('unit', body);
  entry.billet_workcenter = getRequiredParam('billet_workcenter', body);
  entry.contract_number = getRequiredParam('contract_number', body);
  entry.rate_rank = getOptionalParam('rate_rank', body);
  entry.pilot = getOptionalParam('pilot', body, 'boolean');
  entry.aircrew = getOptionalParam('aircrew', body, 'boolean');
  entry.cdi = getOptionalParam('cdi', body, 'boolean');
  entry.cdqar = getOptionalParam('cdqar', body, 'boolean');
  entry.dscacrew = getOptionalParam('dscacrew', body, 'boolean');
  entry.advanced_party = getOptionalParam('advanced_party', body, 'boolean');
  entry.pui = getOptionalParam('pui', body, 'boolean');
  const covid19TestReturnDate = getOptionalParam('covid19_test_return_date', body);
  if (covid19TestReturnDate) {
    entry.covid19_test_return_date = new Date(covid19TestReturnDate);
  }
  entry.rom = getOptionalParam('rom', body);
  entry.rom_release = getOptionalParam('rom_release', body);
  const lastReported = getOptionalParam('last_reported', body);
  if (lastReported) {
    entry.last_reported = new Date(lastReported);
  }
}

type GetRosterQuery = {
  limit: string
  page: string
};

type RosterFileRow = {
  edipi: string
  first_name: string
  last_name: string
  unit: string
  billet_workcenter: string
  contract_number: string
  rate_rank?: string
  pilot?: string
  aircrew?: string
  cdi?: string
  cdqar?: string
  dscacrew?: string
  advanced_party?: string
  pui?: string
  rom?: string
  rom_release?: string

  // NOTE
  // `covid19_test_return_date` and `last_reported` are intentionally excluded since they'll be updated by the ingest
  // process instead of through a file upload.
};

type RosterEntryData = {
  edipi: Roster['edipi']
  first_name: Roster['first_name']
  last_name: Roster['last_name']
  unit: Roster['unit']
  billet_workcenter: Roster['billet_workcenter']
  contract_number: Roster['contract_number']
  rate_rank: Roster['rate_rank']
  pilot: Roster['pilot']
  aircrew: Roster['aircrew']
  cdi: Roster['cdi']
  cdqar: Roster['cdqar']
  dscacrew: Roster['dscacrew']
  advanced_party: Roster['advanced_party']
  pui: Roster['pui']
  covid19_test_return_date: Roster['covid19_test_return_date']
  rom: Roster['rom']
  rom_release: Roster['rom_release']
  last_reported: Roster['last_reported']
};

export default new RosterController();
