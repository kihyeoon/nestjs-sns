import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Name } from './name.embedded';

@Entity()
export class TeacherModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 임베디드 컬럼: name_last_name, name_first_name
  @Column(() => Name)
  name: Name;

  @Column({ length: 50 })
  subject: string;

  @Column({ length: 100 })
  office: string;
}
