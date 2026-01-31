import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Name } from './name.embedded';

@Entity()
export class StudentModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 임베디드 컬럼: name_last_name, name_first_name
  @Column(() => Name)
  name: Name;

  @Column({ type: 'int' })
  grade: number;

  @Column({ length: 50 })
  classroom: string;
}
