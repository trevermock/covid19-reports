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

  @ManyToOne(() => Org, { cascade: true })
  @JoinColumn({
    name: 'org_id',
  })
  org: Org;

  @Column({
    default: '',
  })
  indexPrefix: string;

  @Column({
    default: false,
  })
  notifyOnAccessRequest: boolean;

  //
  // ROLE PERMISSIONS - Must be prefixed with "can_"
  // When adding new permissions, make sure to update the controller to handle them on add and update!
  //
  @Column({
    default: false,
  })
  canManageUsers: boolean = false;

  @Column({
    default: false,
  })
  canManageRoster: boolean = false;

  @Column({
    default: false,
  })
  canManageRoles: boolean = false;

  @Column({
    default: false,
  })
  canViewRoster: boolean = false;

  @Column({
    default: false,
  })
  canViewMuster: boolean = false;

  @Column({
    default: false,
  })
  canManageDashboards: boolean = false;

  isSupersetOf(role: Role) {
    // Loop through all permission properties and return false if the input role has
    // any permission that this role does not.
    for (const key of Object.keys(this)) {
      if (key.startsWith('can_') && Reflect.get(role, key) && !Reflect.get(this, key)) {
        return false;
      }
    }
    return true;
  }

  static admin(org: Org) {
    const adminRole = new Role();
    adminRole.id = 0;
    adminRole.name = 'Admin';
    adminRole.description = 'Site Administrator';
    adminRole.org = org;
    adminRole.indexPrefix = '';
    adminRole.notifyOnAccessRequest = false;

    // Allow all permissions
    for (const key of Object.keys(adminRole)) {
      if (key.startsWith('can_')) {
        Reflect.set(adminRole, key, true);
      }
    }

    return adminRole;
  }
}
