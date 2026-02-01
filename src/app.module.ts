import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { StudentModel } from './entity/student.entity';
import { TeacherModel } from './entity/teacher.entity';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, ProfileModel, PostModel, TagModel]),
    TypeOrmModule.forRoot({
      type: 'postgres', // 데이터베이스 타입 (PostgreSQL 사용)
      host: 'localhost', // 데이터베이스 서버 호스트
      port: 5433, // 데이터베이스 연결 포트
      username: 'postgres', // 데이터베이스 접속 사용자명
      password: 'postgres', // 데이터베이스 접속 비밀번호
      database: 'typeorm-study', // 사용할 데이터베이스 이름
      entities: [UserModel, StudentModel, TeacherModel, ProfileModel, PostModel, TagModel], // Entity 클래스 배열 (자동 매핑할 테이블)
      synchronize: true, // Entity와 DB 스키마 자동 동기화 (개발용, 프로덕션에서는 false)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
