import {Entity, PrimaryColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import {Role} from '../role/role.model';

@Entity()
export class User extends BaseEntity {

  @PrimaryColumn({
    length: 10
  })
  edipi: string;

  @ManyToMany(type => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user',
      referencedColumnName: 'edipi'
    },
    inverseJoinColumn: {
      name: 'role',
      referencedColumnName: 'id'
    }
  })
  roles: Role[];

  @Column({
    nullable: true
  })
  first_name: string;

  @Column({
    nullable: true
  })
  last_name: string;

  @Column({
    default: true
  })
  enabled: boolean;

  @Column({
    default: false
  })
  root_admin: boolean;

  getKibanaIndex() {
    if (this.root_admin) {
      return '*';
    }

    // HACK: We should figure out which role based on which org they're trying to view.
    const role = this.roles[0];
    return `${role.org.index_prefix}-${role.index_prefix}`;
  }

  getKibanaRoles() {
    // HACK: This should be based on their permissions somehow.
    return 'kibana_admin';
  }

}
