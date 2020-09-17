import { Response } from 'express';
import csv from 'csvtojson';
import fs from 'fs';
import { Roster } from './roster.model';
import { Org } from '../org/org.model';
import { BadRequestError, NotFoundError, UnprocessableEntity } from '../../util/error';
import { getOptionalParam, getRequiredParam } from '../../util/util';

export namespace RosterController {

  export async function getRosterTemplate(req: any, res: Response) {
    const file = `${__dirname}/uploads/roster_template.csv`;
    res.download(file);
  }

  export async function getRoster(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);

    const limit = (req.query.limit != null) ? parseInt(req.query.limit) : 100;
    const page = (req.query.page != null) ? parseInt(req.query.page) : 0;

    const roster = await Roster.find({
      skip: page * limit,
      take: limit,
      where: {
        org: orgId,
      },
      order: {
        edipi: 'ASC',
      },
    });

    await res.json(roster);
  }

  export async function getRosterCount(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);

    const count = await Roster.count({
      where: {
        org: orgId,
      },
    });

    await res.json({ count });
  }

  export async function uploadRosterEntries(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization for role was not found.');
    }

    if (!req.file || !req.file.path) {
      throw new BadRequestError('No file to process.');
    }

    const rosterEntries: Roster[] = [];
    try {
      const roster = await csv().fromFile(req.file.path);
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

    await res.json({
      count: rosterEntries.length,
    });
  }

  export async function addRosterEntry(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);

    const org = await Org.findOne({
      where: {
        id: orgId,
      },
    });

    if (!org) {
      throw new NotFoundError('Organization for role was not found.');
    }

    const entry = new Roster();
    entry.edipi = getRequiredParam('edipi', req.body);
    entry.org = org;
    setRosterParamsFromBody(entry, req.body);
    const newRosterEntry = await entry.save();

    await res.status(201).json(newRosterEntry);
  }

  export async function getRosterEntry(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const userEDIPI = req.params.userEDIPI;

    const rosterEntry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: orgId,
      },
    });

    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }

    await res.json(rosterEntry);
  }

  export async function deleteRosterEntry(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const userEDIPI = req.params.userEDIPI;

    const rosterEntry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: orgId,
      },
    });

    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }

    const deletedEntry = await rosterEntry.remove();

    await res.json(deletedEntry);
  }

  export async function updateRosterEntry(req: any, res: Response) {
    const orgId = parseInt(req.params.orgId);
    const userEDIPI = req.params.userEDIPI;

    const entry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: orgId,
      },
    });

    if (!entry) {
      throw new NotFoundError('User could not be found.');
    }

    setRosterParamsFromBody(entry, req.body);
    const updatedRosterEntry = await entry.save();

    await res.json(updatedRosterEntry);
  }

}

function setRosterParamsFromBody(entry: Roster, body: any) {
  entry.rate_rank = getOptionalParam('rate_rank', body);
  entry.first_name = getRequiredParam('first_name', body);
  entry.last_name = getRequiredParam('last_name', body);
  entry.unit = getRequiredParam('unit', body);
  entry.billet_workcenter = getRequiredParam('billet_workcenter', body);
  entry.contract_number = getRequiredParam('contract_number', body);
  entry.pilot = getOptionalParam('pilot', body, 'boolean');
  entry.aircrew = getOptionalParam('aircrew', body, 'boolean');
  entry.cdi = getOptionalParam('cdi', body, 'boolean');
  entry.cdqar = getOptionalParam('cdqar', body, 'boolean');
  entry.dscacrew = getOptionalParam('dscacrew', body, 'boolean');
  entry.advanced_party = getOptionalParam('advanced_party', body, 'boolean');
  entry.pui = getOptionalParam('pui', body, 'boolean');
  const date = getOptionalParam('covid19_test_return_date', body);
  if (date) {
    entry.covid19_test_return_date = new Date(date);
  }
  entry.rom = getOptionalParam('rom', body);
  entry.rom_release = getOptionalParam('rom_release', body);
}
