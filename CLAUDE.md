# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

SNS 앱 개발을 위한 NestJS 학습용 프로젝트입니다. Yarn PnP Zero-Install 설정을 사용합니다.

## 주요 명령어

```bash
# 개발 서버 (watch mode)
yarn start:dev

# 빌드
yarn build

# 프로덕션 실행
yarn start:prod

# 테스트
yarn test                    # 단위 테스트
yarn test:watch              # 테스트 watch mode
yarn test -- --testNamePattern="테스트명"  # 특정 테스트 실행
yarn test:e2e                # E2E 테스트
yarn test:cov                # 커버리지

# 코드 품질
yarn lint                    # ESLint (자동 수정 포함)
yarn format                  # Prettier 포맷팅
```

## 아키텍처

NestJS 표준 모듈 구조를 따릅니다:

- `src/main.ts` - 앱 진입점 (포트: 3000)
- `src/app.module.ts` - 루트 모듈
- `src/<feature>/` - 기능별 모듈 디렉토리
  - `*.module.ts` - 모듈 정의
  - `*.controller.ts` - HTTP 엔드포인트
  - `*.service.ts` - 비즈니스 로직
  - `*.spec.ts` - 테스트 파일

현재 구현된 모듈: `PostsModule` (게시글 CRUD)

## 코드 스타일

- ESLint: typescript-eslint + prettier 연동
- `===` 사용 필수 (eqeqeq)
- 중괄호 필수 (curly)
- console.log 금지 (warn/error만 허용)
- 미사용 변수: `_` prefix로 무시 가능
