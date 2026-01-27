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

  /**
   * @Column 주요 옵션:
   * - type: 컬럼 타입 ('varchar', 'int', 'boolean', 'text', 'json' 등)
   * - nullable: null 허용 여부 (기본값: false)
   * - default: 기본값 설정
   * - unique: 유니크 제약 조건
   * - length: 문자열 최대 길이 (varchar 등)
   * - name: 실제 DB 컬럼명 지정 (기본값: 프로퍼티명)
   * - select: find 시 기본 조회 포함 여부 (기본값: true)
   * - update: update 시 변경 허용 여부 (기본값: true)
   * - enum: enum 타입 사용 시 값 배열
   */
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
