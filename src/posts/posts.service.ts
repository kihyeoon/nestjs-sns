import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  private posts: PostModel[] = [
    {
      id: 1,
      author: 'author1',
      title: 'title1',
      content: 'content1',
      likeCount: 0,
      commentCount: 0,
    },
    {
      id: 2,
      author: 'author2',
      title: 'title2',
      content: 'content2',
      likeCount: 0,
      commentCount: 0,
    },
    {
      id: 3,
      author: 'author3',
      title: 'title3',
      content: 'content3',
      likeCount: 0,
      commentCount: 0,
    },
  ];

  async getAllPosts() {
    return this.postsRepository.find();
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async createPost(author: string, title: string, content: string) {
    // 1) create: 저장할 객체를 생성
    // 2) save: create한 객체를 저장
    const post = this.postsRepository.create({
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    });
    return await this.postsRepository.save(post);
  }

  async updatePost(id: number, post: PostModel) {
    // Save 의 기능
    // 1) 데이터가 존재하지 않는다면(id 기준) 새로 생성한다.
    // 2) 같은 id 가 존재한다면 데이터를 업데이트 한다.
    const existingPost = await this.postsRepository.findOne({ where: { id } });
    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }
    return await this.postsRepository.save({ ...existingPost, ...post });
  }

  async patchPost(id: number, author?: string, title?: string, content?: string) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (author) {
      post.author = author;
    }
    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }

    return await this.postsRepository.save(post);
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
    return id;
  }
}
