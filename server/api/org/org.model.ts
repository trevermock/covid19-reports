import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../user/user.model';

@Entity()
export class Org extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 200,
  })
  name: string;

  @Column({
    length: 2048,
  })
  description: string;

  @Column({
    default: '',
  })
  indexPrefix: string;

  @ManyToOne(() => User, user => user.edipi, { onDelete: 'RESTRICT', nullable: false })
  @JoinColumn({
    name: 'contact_id',
  })
  contact: User;

}
