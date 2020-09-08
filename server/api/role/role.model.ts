import {Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, ManyToOne} from "typeorm";
import {Org} from "../org/org.model";

@Entity()
export class Role extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 2048
  })
  name: string;

  @Column({
    length: 2048
  })
  description: string;

  @ManyToOne(type => Org)
  @JoinColumn({
    name: 'org_id'
  })
  org: Org;

  @Column({
    default: ""
  })
  index_prefix: string;

  @Column({
    default: false
  })
  can_manage_users: boolean;

  @Column({
    default: false
  })
  can_manage_roster: boolean;

  @Column({
    default: false
  })
  can_manage_roles: boolean;

  @Column({
    default: false
  })
  can_view_roster: boolean;

}
