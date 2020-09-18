import {
  Entity, PrimaryColumn, Column, BaseEntity, ManyToMany, JoinTable,
} from 'typeorm';
import { Role } from '../role/role.model';


@Entity()
export class User extends BaseEntity {

  @PrimaryColumn({
    length: 10,
  })
  edipi: string;

  @ManyToMany(() => Role)
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
  roles: Role[];

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  service: string;

  @Column({
    default: true,
  })
  enabled: boolean;

  @Column({
    default: false,
  })
  root_admin: boolean;

  @Column({
    default: false,
  })
  is_registered: boolean;

  getKibanaIndex(role: Role) {
    if (this.root_admin) {
      return '*';
    }
    return `${role.org.index_prefix}-${role.index_prefix}`;
  }

  getKibanaUserClaim(role: Role) {
    return `org${role.org.id}-role${role.id}`;
  }

  getKibanaRoles(role: Role) {
    if (role.can_manage_dashboards) {
      return 'kibana_admin';
    }
    return 'kibana_ro_strict';
  }

}
