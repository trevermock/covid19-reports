import {
  Entity,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';


@Entity()
export class AccessRequest extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.edipi)
  @JoinColumn({
    name: 'user_edipi',
  })
  user: User;

  @ManyToOne(() => Org, org => org.id)
  @JoinColumn({
    name: 'org_id',
  })
  org: Org;

  @CreateDateColumn({
    type: 'timestamp',
  })
  request_date: Date;

}
