import { Response } from 'express';
import csv from 'csvtojson';
import fs from 'fs';
import { snakeCase } from 'typeorm/util/StringUtils';
import {
  ApiRequest, EdipiParam, OrgEdipiParams, OrgParam,
} from '../index';
import {
  BaseRosterColumns, Roster, RosterColumnInfo, RosterColumnType,
} from './roster.model';
import { BadRequestError, NotFoundError, UnprocessableEntity } from '../../util/error-types';
import { getOptionalParam, getRequiredParam } from '../../util/util';
import { Org } from '../org/org.model';
import { CustomRosterColumn } from './custom-roster-column.model';
import { Role } from '../role/role.model';

class RosterController {

  async getRosterTemplate(req: ApiRequest, res: Response) {
    const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
    const headers: string[] = [];
    const example: string[] = [];
    columns.forEach(column => {
      headers.push(column.name);
      if (column.name === 'edipi') {
        example.push('0000000001');
      } else {
        switch (column.type) {
          case RosterColumnType.Number:
            example.push('12345');
            break;
          case RosterColumnType.Boolean:
            example.push('false');
            break;
          case RosterColumnType.String:
            example.push('Example Text');
            break;
          case RosterColumnType.Date:
            example.push(new Date().toISOString());
            break;
          default:
            example.push('');
            break;
        }
      }
    });
    const csvContents = `${headers.join(',')}\n${example.join(',')}`;
    res.header('Content-Type', 'text/csv');
    res.attachment('roster-template.csv');
    res.send(csvContents);
  }

  async getRoster(req: ApiRequest<OrgParam, any, GetRosterQuery>, res: Response) {
    const limit = (req.query.limit != null) ? parseInt(req.query.limit) : 100;
    const page = (req.query.page != null) ? parseInt(req.query.page) : 0;

    const queryBuilder = await queryAllowedRoster(req.appOrg!, req.appRole!);
    const roster = await queryBuilder
      .skip(page * limit)
      .take(limit)
      .orderBy({
        edipi: 'ASC',
      })
      .getRawMany<RosterEntryData>();

    res.json(roster);
  }

  async getRosterCount(req: ApiRequest<OrgParam>, res: Response) {
    const count = await (await queryAllowedRoster(req.appOrg!, req.appRole!)).getCount();

    res.json({ count });
  }

  async uploadRosterEntries(req: ApiRequest<OrgParam>, res: Response) {
    const org = req.appOrg!;

    if (!req.file || !req.file.path) {
      throw new BadRequestError('No file to process.');
    }

    const rosterEntries: Roster[] = [];
    try {
      const roster = await csv().fromFile(req.file.path) as RosterFileRow[];
      const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
      roster.forEach(row => {
        const entry = new Roster();
        entry.org = org;
        for (const column of columns) {
          getColumnFromCSV(entry, row, column);
        }
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

  async getFullRosterInfo(req: ApiRequest<OrgParam>, res: Response) {
    const columns = await getRosterColumns(req.appOrg!.id);
    res.json(columns);
  }

  async getRosterInfo(req: ApiRequest<OrgParam>, res: Response) {
    const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
    res.json(columns);
  }

  async getRosterInfosForIndividual(req: ApiRequest<EdipiParam>, res: Response) {
    const entries = await Roster.find({
      relations: ['org'],
      where: {
        edipi: req.params.edipi,
      },
    });

    const responseData: RosterInfo[] = [];
    for (const roster of entries) {
      const columns = (await getRosterColumns(roster.org!.id)).map(column => {
        const columnValue : RosterColumnWithValue = {
          ...column,
          value: column.custom ? roster.customColumns[column.name] : Reflect.get(roster, column.name),
        };
        return columnValue;
      });

      const rosterInfo :RosterInfo = {
        org: roster.org!,
        columns,
      };
      responseData.push(rosterInfo);
    }

    res.json({
      rosters: responseData,
    });
  }

  async addRosterEntry(req: ApiRequest<OrgParam, RosterEntryData>, res: Response) {

    const edipi = req.body.edipi as string;
    const rosterEntry = await Roster.findOne({
      where: {
        edipi,
        org: req.appOrg!.id,
      },
    });

    if (rosterEntry) {
      throw new BadRequestError('The individual is already in the roster.');
    }

    const entry = new Roster();
    entry.org = req.appOrg;
    const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
    setRosterParamsFromBody(entry, req.body, columns, true);
    const newRosterEntry = await entry.save();

    res.status(201).json(newRosterEntry);
  }

  async getRosterEntry(req: ApiRequest<OrgEdipiParams>, res: Response) {
    const userEDIPI = req.params.edipi;

    const queryBuilder = await queryAllowedRoster(req.appOrg!, req.appRole!);
    const rosterEntry = await queryBuilder
      .andWhere('edipi=\':edipi\'', {
        edipi: userEDIPI,
      })
      .getRawOne<RosterEntryData>();

    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }

    res.json(rosterEntry);
  }

  async deleteRosterEntry(req: ApiRequest<OrgEdipiParams>, res: Response) {
    const userEDIPI = req.params.edipi;

    const rosterEntry = await Roster.findOne({
      where: {
        edipi: userEDIPI,
        org: req.appOrg!.id,
      },
    });

    if (!rosterEntry) {
      throw new NotFoundError('User could not be found.');
    }

    const deletedEntry = await rosterEntry.remove();

    res.json(deletedEntry);
  }

  async updateRosterEntry(req: ApiRequest<OrgEdipiParams, RosterEntryData>, res: Response) {
    const userEDIPI = req.params.edipi;

    const entry = await Roster.findOne({
      relations: ['org'],
      where: {
        edipi: userEDIPI,
        org: req.appOrg!.id,
      },
    });

    if (!entry) {
      throw new NotFoundError('User could not be found.');
    }
    const columns = await getAllowedRosterColumns(req.appOrg!, req.appRole!);
    setRosterParamsFromBody(entry, req.body, columns);
    const updatedRosterEntry = await entry.save();

    res.json(updatedRosterEntry);
  }

}

async function queryAllowedRoster(org: Org, role: Role) {
  const columns = await getAllowedRosterColumns(org, role);
  const queryBuilder = Roster.createQueryBuilder().select([]);
  columns.forEach(column => {
    if (column.custom) {
      let typeStr: string;
      switch (column.type) {
        case RosterColumnType.Boolean:
          typeStr = ' AS BOOLEAN';
          break;
        case RosterColumnType.Number:
          typeStr = ' AS INTEGER';
          break;
        default:
          typeStr = '';
          break;
      }
      queryBuilder.addSelect(`custom_columns ->> '${column.name}' ${typeStr}`, column.name);
    } else {
      queryBuilder.addSelect(snakeCase(column.name), column.name);
    }
  });
  return queryBuilder
    .where({
      org: org.id,
    })
    .andWhere('unit like :name', { name: role.indexPrefix.replace('*', '%') });
}

async function getAllowedRosterColumns(org: Org, role: Role) {
  const allColumns = await getRosterColumns(org.id);
  const fineGrained = !(role.allowedRosterColumns.length === 1 && role.allowedRosterColumns[0] === '*');
  return allColumns.filter(column => {
    if (fineGrained && role.allowedRosterColumns.indexOf(column.name) < 0) {
      return false;
    }
    if (!role.canViewPII && column.pii) {
      return false;
    }
    return role.canViewPHI || !column.phi;
  });
}

export async function getRosterColumns(orgId: number) {
  const customColumns = (await CustomRosterColumn.find({
    where: {
      org: orgId,
    },
  })).map(customColumn => {
    const columnInfo: RosterColumnInfo = {
      ...customColumn,
      displayName: customColumn.display,
      custom: true,
      updatable: true,
    };
    return columnInfo;
  });
  return [...BaseRosterColumns, ...customColumns];
}

function setRosterParamsFromBody(entry: Roster, body: RosterEntryData, columns: RosterColumnInfo[], newEntry: boolean = false) {
  columns.forEach(column => {
    if (newEntry || column.updatable) {
      getColumnFromBody(entry, body, column, newEntry);
    }
  });
}

function getColumnFromBody(roster: Roster, row: RosterEntryData, column: RosterColumnInfo, newEntry: boolean) {
  let objectValue: any | undefined;
  if (column.required && newEntry) {
    objectValue = getRequiredParam(column.name, row, column.type === RosterColumnType.Date ? 'string' : column.type);
  } else {
    objectValue = getOptionalParam(column.name, row, column.type === RosterColumnType.Date ? 'string' : column.type);
  }
  if (objectValue !== undefined) {
    if (RosterColumnType.Date === column.type) {
      objectValue = new Date(objectValue as string);
    }
    if (column.custom) {
      roster.customColumns[column.name] = objectValue;
    } else {
      Reflect.set(roster, column.name, objectValue);
    }
  }
}

function getColumnFromCSV(roster: Roster, row: RosterFileRow, column: RosterColumnInfo) {
  let stringValue: string | undefined;
  if (column.required) {
    stringValue = getRequiredParam(column.name, row);
  } else {
    stringValue = getOptionalParam(column.name, row);
  }
  if (stringValue !== undefined) {
    let value: any;
    switch (column.type) {
      case RosterColumnType.String:
        value = stringValue;
        break;
      case RosterColumnType.Number:
        value = +stringValue;
        break;
      case RosterColumnType.Date:
        value = new Date(stringValue);
        break;
      case RosterColumnType.Boolean:
        value = stringValue === 'true';
        break;
      default:
        break;
    }
    if (value !== undefined) {
      if (column.custom) {
        roster.customColumns[column.name] = value;
      } else {
        Reflect.set(roster, column.name, value);
      }
    }
  }
}

interface RosterColumnWithValue extends RosterColumnInfo {
  value: any,
}

interface RosterInfo {
  org: Org,
  columns: RosterColumnInfo[],
}

type GetRosterQuery = {
  limit: string
  page: string
};

type RosterFileRow = {
  [Key: string]: string
};

type RosterEntryData = {
  [Key: string]: any
};

export default new RosterController();
