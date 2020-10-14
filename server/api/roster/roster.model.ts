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

}

enum ColumnType {
  String = 'string',
  Boolean = 'boolean',
  Date = 'date',
  Number = 'number',
}

interface ColumnInfo {
  displayName: string,
  type: ColumnType,
  pii: boolean,
  phi: boolean,
  required: boolean,
}

interface ColumnInfoDictionary {
  [Key: string]: ColumnInfo;
}

export const RosterColumnInfo: ColumnInfoDictionary = {
  edipi: {
    displayName: 'EDIPI',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: true,
  },
  firstName: {
    displayName: 'First Name',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: true,
  },
  lastName: {
    displayName: 'Last Name',
    type: ColumnType.String,
    pii: true,
    phi: false,
    required: true,
  },
  unit: {
    displayName: 'Unit',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: true,
  },
  billetWorkcenter: {
    displayName: 'Billet Workcenter',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: true,
  },
  contractNumber: {
    displayName: 'Contract Number',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: true,
  },
  rateRank: {
    displayName: 'Rate/Rank',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: false,
  },
  pilot: {
    displayName: 'Pilot',
    type: ColumnType.Boolean,
    pii: false,
    phi: false,
    required: false,
  },
  aircrew: {
    displayName: 'Aircrew',
    type: ColumnType.Boolean,
    pii: false,
    phi: false,
    required: false,
  },
  cdi: {
    displayName: 'CDI',
    type: ColumnType.Boolean,
    pii: false,
    phi: false,
    required: false,
  },
  cdqar: {
    displayName: 'CDQAR',
    type: ColumnType.Boolean,
    pii: false,
    phi: false,
    required: false,
  },
  dscacrew: {
    displayName: 'DSCA Crew',
    type: ColumnType.Boolean,
    pii: false,
    phi: false,
    required: false,
  },
  advancedParty: {
    displayName: 'Advanced Party',
    type: ColumnType.Boolean,
    pii: false,
    phi: false,
    required: false,
  },
  pui: {
    displayName: 'PUI',
    type: ColumnType.Boolean,
    pii: false,
    phi: false,
    required: false,
  },
  covid19TestReturnDate: {
    displayName: 'COVID 19 Test Return Date',
    type: ColumnType.Date,
    pii: false,
    phi: false,
    required: false,
  },
  rom: {
    displayName: 'ROM',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: false,
  },
  romRelease: {
    displayName: 'ROM Release',
    type: ColumnType.String,
    pii: false,
    phi: false,
    required: false,
  },
  lastReported: {
    displayName: 'Last Reported',
    type: ColumnType.Date,
    pii: false,
    phi: false,
    required: false,
  },
};
