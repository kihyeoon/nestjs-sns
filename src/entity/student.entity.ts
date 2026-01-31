import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { NameBase } from './name.base';

@Entity()
export class StudentModel extends NameBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  grade: number;

  @Column({ length: 50 })
  classroom: string;
}
