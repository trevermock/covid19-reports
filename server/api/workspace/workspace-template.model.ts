import {
  Entity, Column, BaseEntity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class WorkspaceTemplate extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  pii!: boolean;

  @Column()
  phi!: boolean;

  @Column('simple-json')
  kibanaSavedObjects?: any;

}
