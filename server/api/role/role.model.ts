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
    default: false
  })
  canManageUsers: boolean;

  @Column({
    default: false
  })
  canManageRoster: boolean;

  @Column({
    default: false
  })
  canManageRoles: boolean;

  @Column({
    default: false
  })
  canViewRoster: boolean;

}
