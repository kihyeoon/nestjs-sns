import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // DTO 클래스의 인스턴스로 자동 변환
      transform: true,
      transformOptions: {
        // 타입 데코레이터 없이도 DTO 타입 정의에 맞게 암묵적 타입 변환 (e.g. query string → number)
        enableImplicitConversion: true,
      },
      // DTO에 정의되지 않은 프로퍼티 자동 제거
      whitelist: true,
      // 정의되지 않은 프로퍼티가 포함되면 요청 자체를 거부 (400 에러)
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
