import { Column } from 'typeorm';

// 공용 이름 컬럼 상속용 베이스 클래스
export abstract class NameBase {
  @Column({ name: 'last_name', length: 50 })
  lastName: string;

  @Column({ name: 'first_name', length: 50 })
  firstName: string;
}
