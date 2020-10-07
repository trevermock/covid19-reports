import {
  Entity, PrimaryColumn, Column, BaseEntity, ManyToMany, JoinTable,
} from 'typeorm';
import { Role } from '../role/role.model';


@Entity()
export class User extends BaseEntity {

  @PrimaryColumn({
    length: 10,
  })
  edipi!: string;

  @ManyToMany(() => Role, {
    cascade: true,
    onDelete: 'RESTRICT',
  })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user',
      referencedColumnName: 'edipi',
    },
    inverseJoinColumn: {
      name: 'role',
      referencedColumnName: 'id',
    },
  })
  roles?: Role[];

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  phone!: string;

  @Column()
  email!: string;

  @Column()
  service!: string;

  @Column({
    default: true,
  })
  enabled?: boolean;

  @Column({
    default: false,
  })
  rootAdmin?: boolean;

  @Column({
    default: false,
  })
  isRegistered?: boolean;

  getKibanaIndex(role: Role) {
    if (this.rootAdmin) {
      return '*';
    }
    return `${role.org!.indexPrefix}-${role.indexPrefix}`;
  }

  getKibanaUserClaim(role: Role) {
    return `org${role.org!.id}-role${role.id}`;
  }

  getKibanaRoles(role: Role) {
    if (role.canManageWorkspace) {
      return 'kibana_admin';
    }
    return 'kibana_ro_strict';
  }

}
