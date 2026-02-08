import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString({
    message: 'title은 string 타입이어야 합니다.',
  })
  @IsNotEmpty({
    message: 'title은 비어있을 수 없습니다.',
  })
  title: string;

  @IsString({
    message: 'content은 string 타입이어야 합니다.',
  })
  content: string;
}
