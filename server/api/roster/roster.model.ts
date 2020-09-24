import {
  Entity, Column, BaseEntity, JoinColumn, ManyToOne, PrimaryColumn,
} from 'typeorm';
import { Org } from '../org/org.model';

@Entity()
export class Roster extends BaseEntity {

  @PrimaryColumn({
    length: 10,
  })
  edipi: string;

  @ManyToOne(() => Org, org => org.id, { primary: true, cascade: true })
  @JoinColumn({
    name: 'org_id',
  })
  org: Org;

  @Column({
    length: 100,
  })
  first_name: string;

  @Column({
    length: 100,
  })
  last_name: string;

  @Column({
    length: 50,
  })
  unit: string;

  @Column({
    length: 50,
  })
  billet_workcenter: string;

  @Column({
    length: 100,
  })
  contract_number: string;

  @Column({
    length: 100,
    nullable: true,
  })
  rate_rank?: string;

  @Column({
    default: false,
  })
  pilot?: boolean;

  @Column({
    default: false,
  })
  aircrew?: boolean;

  @Column({
    default: false,
  })
  cdi?: boolean;

  @Column({
    default: false,
  })
  cdqar?: boolean;

  @Column({
    default: false,
  })
  dscacrew?: boolean;

  @Column({
    default: false,
  })
  advanced_party?: boolean;

  @Column({
    default: false,
  })
  pui?: boolean;

  @Column({
    nullable: true,
  })
  covid19_test_return_date?: Date;

  @Column({
    length: 50,
    nullable: true,
  })
  rom?: string;

  @Column({
    length: 100,
    nullable: true,
  })
  rom_release?: string;

}
