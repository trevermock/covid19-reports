import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne,
} from 'typeorm';
import { Org } from '../org/org.model';

@Entity()
export class Role extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    length: 2048,
  })
  name: string;

  @Column({
    nullable: false,
    length: 2048,
  })
  description: string;

  @ManyToOne(() => Org, { cascade: true })
  @JoinColumn({
    name: 'org_id',
  })
  org: Org;

  @Column({
    nullable: false,
    default: '',
  })
  indexPrefix: string;

  @Column({
    nullable: false,
    default: '',
  })
  allowedRosterColumns: string;

  @Column({
    default: false,
  })
  notifyOnAccessRequest: boolean;

  //
  // ROLE PERMISSIONS - Must be prefixed with "can"
  // When adding new permissions, make sure to update the controller to handle them on add and update!
  //
  @Column({
    default: false,
  })
  canManageGroup: boolean = false;

  @Column({
    default: false,
  })
  canManageRoster: boolean = false;

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
  canViewPII: boolean = false;

  @Column({
    default: false,
  })
  canManageWorkspace: boolean = false;

  isSupersetOf(role: Role) {
    // Loop through all permission properties and return false if the input role has
    // any permission that this role does not.
    for (const key of Object.keys(this)) {
      if (key.startsWith('can') && Reflect.get(role, key) && !Reflect.get(this, key)) {
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
      if (key.startsWith('can')) {
        Reflect.set(adminRole, key, true);
      }
    }

    return adminRole;
  }
}
