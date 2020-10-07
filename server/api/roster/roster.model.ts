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
