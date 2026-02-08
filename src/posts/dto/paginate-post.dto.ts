import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginatePostDto {
  /**
   * 이전 마지막 데이터의 id 값보다 큰 데이터를 조회
   */
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  /**
   * 생성일자 기준 오름차순 정렬 -> 내림/오름 구현 예정
   */
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  /**
   * 조회할 데이터 개수
   */
  @IsNumber()
  @IsOptional()
  take = 10;
}
