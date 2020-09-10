import express from 'express';
import csv from 'csvtojson';
import * as path from 'path';
import { Roster } from "./roster.model";
import { Org } from "../org/org.model";
import { NotFoundError } from "../../util/error";
import { getOptionalParam, getRequiredParam } from "../../util/util";

export namespace RosterController {

  export async function getRoster(req: any, res: express.Response) {
    const orgId = req.params['orgId'];

    let limit = req.query.hasOwnProperty('limit') ? parseInt(req.query['limit']) : 100;
    let page = req.query.hasOwnProperty('page') ? parseInt(req.query['page']) : 0;

    // We'll get 1 extra so that we know if there is another page
    const roster = await Roster.find({
      skip: page * limit,
      take: limit + 1,
      where: {
        org: parseInt(orgId)
      }
    });

    let result = {
      roster: roster,
      has_more_data: false
    }
    if (roster.length > limit) {
      // Remove the 1 extra
      result.roster.pop();
      result.has_more_data = true;
    }
    res.json(result);
    res.send();
  }

  export async function uploadRosterEntries(req: any, res: express.Response) {
    console.log('filename', req.file.filename);
    // const roster = await csv().fromFile(path.join(__dirname, './uploads/mockData.csv'));

    res.json({
      message: 'upload complete'
    });
  }

  export async function addRosterEntry(req: any, res: express.Response) {
    const orgId = req.params['orgId'];

    const entry = new Roster();
    entry.edipi = getRequiredParam('edipi', req.body);

    const org = await Org.findOne({
      where: {
        id: parseInt(orgId)
      }
    });
    if (!org) {
      throw new NotFoundError('Organization for role was not found.');
    }
    entry.org = org;

    getRosterParamsFromBody(entry, req.body);

    const newRosterEntry = await entry.save();
    res.status(201);
    res.json(newRosterEntry);
    res.send();
  }

  export async function getRosterEntry(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const userEDIPI = req.params['userEDIPI'];
    const rosterEntry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: parseInt(orgId)
      }
    });
    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }
    res.json(rosterEntry);
    res.send();
  }

  export async function deleteRosterEntry(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const userEDIPI = req.params['userEDIPI'];
    const rosterEntry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: parseInt(orgId)
      }
    });
    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }
    const deletedEntry = await rosterEntry.remove();
    res.json(deletedEntry);
    res.send();
  }

  export async function updateRosterEntry(req: any, res: express.Response) {
    const orgId = req.params['orgId'];
    const userEDIPI = req.params['userEDIPI'];
    const entry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: parseInt(orgId)
      }
    });
    if (!entry) {
      throw new NotFoundError('User could not be found.');
    }

    getRosterParamsFromBody(entry, req.body);

    const updatedRosterEntry = await entry.save();
    res.json(updatedRosterEntry);
    res.send();
  }

  function getRosterParamsFromBody(entry: Roster, body: any) {
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
}
