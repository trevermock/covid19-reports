import {
  Entity, Column, BaseEntity, JoinColumn, ManyToOne, PrimaryColumn, CreateDateColumn,
} from 'typeorm';
import { Org } from '../org/org.model';

@Entity()
export class Roster extends BaseEntity {

  @PrimaryColumn({
    length: 10,
  })
  edipi!: string;

  @ManyToOne(() => Org, org => org.id, {
    primary: true,
    cascade: true,
  })
  @JoinColumn({
    name: 'org_id',
  })
  org?: Org;

  @Column({
    length: 100,
  })
  firstName!: string;

  @Column({
    length: 100,
  })
  lastName!: string;

  @Column({
    length: 50,
  })
  unit!: string;

  @Column({
    length: 50,
  })
  billetWorkcenter!: string;

  @Column({
    length: 100,
  })
  contractNumber!: string;

  @Column({
    length: 100,
    nullable: true,
  })
  rateRank?: string;

  @Column({
    nullable: true,
  })
  pilot?: boolean;

  @Column({
    nullable: true,
  })
  aircrew?: boolean;

  @Column({
    nullable: true,
  })
  cdi?: boolean;

  @Column({
    nullable: true,
  })
  cdqar?: boolean;

  @Column({
    nullable: true,
  })
  dscacrew?: boolean;

  @Column({
    nullable: true,
  })
  advancedParty?: boolean;

  @Column({
    nullable: true,
  })
  pui?: boolean;

  @Column({
    nullable: true,
  })
  covid19TestReturnDate?: Date;

  @Column({
    length: 50,
    nullable: true,
  })
  rom?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  romRelease?: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
    default: () => 'null',
  })
  lastReported?: Date;

  @Column('json', {
    nullable: false,
    default: '{}',
  })
  customColumns: any;
}

export enum RosterColumnType {
  String = 'string',
  Boolean = 'boolean',
  Date = 'date',
  Number = 'number',
}

export interface RosterColumnInfo {
  name: string,
  displayName: string,
  type: RosterColumnType,
  pii: boolean,
  phi: boolean,
  custom: boolean,
  required: boolean,
  updatable: boolean,
}

export const BaseRosterColumns: RosterColumnInfo[] = [
  {
    name: 'edipi',
    displayName: 'EDIPI',
    type: RosterColumnType.String,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: false,
  }, {
    name: 'firstName',
    displayName: 'First Name',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  }, {
    name: 'lastName',
    displayName: 'Last Name',
    type: RosterColumnType.String,
    pii: true,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  }, {
    name: 'unit',
    displayName: 'Unit',
    type: RosterColumnType.String,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  }, {
    name: 'billetWorkcenter',
    displayName: 'Billet Workcenter',
    type: RosterColumnType.String,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  }, {
    name: 'contractNumber',
    displayName: 'Contract Number',
    type: RosterColumnType.String,
    pii: false,
    phi: false,
    custom: false,
    required: true,
    updatable: true,
  }, {
    name: 'rateRank',
    displayName: 'Rate/Rank',
    type: RosterColumnType.String,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'pilot',
    displayName: 'Pilot',
    type: RosterColumnType.Boolean,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'aircrew',
    displayName: 'Aircrew',
    type: RosterColumnType.Boolean,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'cdi',
    displayName: 'CDI',
    type: RosterColumnType.Boolean,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'cdqar',
    displayName: 'CDQAR',
    type: RosterColumnType.Boolean,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'dscacrew',
    displayName: 'DSCA Crew',
    type: RosterColumnType.Boolean,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'advancedParty',
    displayName: 'Advanced Party',
    type: RosterColumnType.Boolean,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'pui',
    displayName: 'PUI',
    type: RosterColumnType.Boolean,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'covid19TestReturnDate',
    displayName: 'COVID 19 Test Return Date',
    type: RosterColumnType.Date,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'rom',
    displayName: 'ROM',
    type: RosterColumnType.String,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'romRelease',
    displayName: 'ROM Release',
    type: RosterColumnType.String,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  }, {
    name: 'lastReported',
    displayName: 'Last Reported',
    type: RosterColumnType.Date,
    pii: false,
    phi: false,
    custom: false,
    required: false,
    updatable: true,
  },
];
