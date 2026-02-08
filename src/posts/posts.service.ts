import { Injectable, NotFoundException } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';

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

  async getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async paginatePosts(dto: PaginatePostDto) {
    const posts = await this.postsRepository.find({
      where: {
        id: MoreThan(dto.where__id_more_than ?? 0),
      },
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    return posts;
  }

  async createPost(authorId: number, createPostDto: CreatePostDto) {
    // 1) create: 저장할 객체를 생성
    // 2) save: create한 객체를 저장
    const post = this.postsRepository.create({
      author: { id: authorId },
      ...createPostDto,
      likeCount: 0,
      commentCount: 0,
    });
    return await this.postsRepository.save(post);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    // Save 의 기능
    // 1) 데이터가 존재하지 않는다면(id 기준) 새로 생성한다.
    // 2) 같은 id 가 존재한다면 데이터를 업데이트 한다.
    const existingPost = await this.postsRepository.findOne({ where: { id } });
    if (!existingPost) {
      throw new NotFoundException('Post not found');
    }
    return await this.postsRepository.save({ ...existingPost, ...updatePostDto });
  }

  async patchPost(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return await this.postsRepository.save({ ...post, ...updatePostDto });
  }

  async deletePost(id: number) {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Post not found');
    }
    return id;
  }
}
