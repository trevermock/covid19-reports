import {
  Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, ManyToMany,
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
  index_prefix: string;

  @ManyToOne(() => User, user => user.edipi, { onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'contact_id',
  })
  contact: User;

}
