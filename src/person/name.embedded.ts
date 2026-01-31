import { Column } from 'typeorm';

// 공용 이름 값 객체
export class Name {
  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;
}
