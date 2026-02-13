import { join } from 'node:path';

// 루트 경로
export const PROJECT_ROOT_PATH = process.cwd();
// 외부에서 접근 가능한 공개 폴더
export const PUBLIC_FOLDER_NAME = 'public';
// 포스트 이미지들을 저장할 폴더
export const POSTS_FOLDER_NAME = 'posts';

// 실제 공개 폴더의 절대경로
export const PUBLIC_FOLDER_PATH = join(PROJECT_ROOT_PATH, PUBLIC_FOLDER_NAME);
// 포스트 이미지들을 저장할 폴더의 절대경로
export const POSTS_IMAGE_PATH = join(PUBLIC_FOLDER_PATH, POSTS_FOLDER_NAME);
// 포스트 이미지들을 외부에서 접근 가능한 경로
export const POSTS_PUBLIC_IMAGE_PATH = join(PUBLIC_FOLDER_NAME, POSTS_FOLDER_NAME);
