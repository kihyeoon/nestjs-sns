import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Generated,
} from 'typeorm';

// 데이터베이스 테이블로 매핑되는 클래스 선언
@Entity()
export class UserModel {
  // 자동 생성되는 기본키 (uuid 형식)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 일반 컬럼
  @Column()
  title: string;

  // 생성 시각 자동 기록
  @CreateDateColumn()
  createdAt: Date;

  // 수정 시각 자동 갱신
  @UpdateDateColumn()
  updatedAt: Date;

  // 낙관적 락용 버전 (save 시 자동 증가)
  @VersionColumn()
  version: number;

  // 자동 증가하는 시퀀스 값 생성
  @Column()
  @Generated('increment')
  additionalId: number;
}
