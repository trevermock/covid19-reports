import {Entity, PrimaryColumn, Column, BaseEntity, ManyToMany, JoinTable} from "typeorm";
import {Role} from '../role/role.model';

@Entity()
export class User extends BaseEntity {

  @PrimaryColumn({
    length: 10
  })
  EDIPI: string;

  @ManyToMany(type => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user',
      referencedColumnName: 'EDIPI'
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
  FirstName: string;

  @Column({
    nullable: true
  })
  LastName: string;

  @Column({
    default: true
  })
  enabled: boolean;

  @Column({
    default: false
  })
  rootAdmin: boolean;

}
