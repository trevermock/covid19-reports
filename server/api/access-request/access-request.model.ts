import {
  Entity,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn, Column,
} from 'typeorm';
import { Org } from '../org/org.model';
import { User } from '../user/user.model';

export enum AccessRequestStatus {
  Pending = 'pending',
  Rejected = 'rejected',
}

@Entity()
export class AccessRequest extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.edipi, { cascade: true })
  @JoinColumn({
    name: 'user_edipi',
  })
  user: User;

  @ManyToOne(() => Org, org => org.id, { cascade: true })
  @JoinColumn({
    name: 'org_id',
  })
  org: Org;

  @CreateDateColumn({
    type: 'timestamp',
  })
  request_date: Date;

  @Column({
    type: 'enum',
    enum: AccessRequestStatus,
    default: AccessRequestStatus.Pending,
  })
  status: AccessRequestStatus;

}
