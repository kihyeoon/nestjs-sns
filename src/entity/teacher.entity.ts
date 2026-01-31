import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { NameBase } from './name.base';

@Entity()
export class TeacherModel extends NameBase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  subject: string;

  @Column({ length: 100 })
  office: string;
}
