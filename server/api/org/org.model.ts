import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

@Entity()
export class Org extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200
  })
  name: string;

  @Column({
    length: 2048
  })
  description: string;

  @Column({
    default: ""
  })
  index_prefix: string;

}
