import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne,
} from 'typeorm';
import { Org } from '../org/org.model';

@Entity()
export class Role extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 2048,
  })
  name: string;

  @Column({
    length: 2048,
  })
  description: string;

  @ManyToOne(() => Org)
  @JoinColumn({
    name: 'org_id',
  })
  org: Org;

  @Column({
    default: '',
  })
  index_prefix: string;

  @Column({
    default: false,
  })
  can_manage_users: boolean;

  @Column({
    default: false,
  })
  can_manage_roster: boolean;

  @Column({
    default: false,
  })
  can_manage_roles: boolean;

  @Column({
    default: false,
  })
  can_view_roster: boolean;

  @Column({
    default: false,
  })
  can_view_muster: boolean;

  @Column({
    default: false,
  })
  can_manage_dashboards: boolean;

  @Column({
    default: false,
  })
  notify_on_access_request: boolean;

  static admin(org: Org) {
    const adminRole = new Role();
    adminRole.id = 0;
    adminRole.name = 'Admin';
    adminRole.description = 'Site Administrator';
    adminRole.org = org;
    adminRole.index_prefix = '';
    adminRole.can_manage_users = true;
    adminRole.can_manage_roster = true;
    adminRole.can_manage_roles = true;
    adminRole.can_view_roster = true;
    adminRole.can_manage_dashboards = true;
    return adminRole;
  }
}
