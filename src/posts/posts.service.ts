import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommonService } from 'src/common/common.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsModel } from './entities/posts.entity';

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
    private readonly commonService: CommonService,
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
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      { relations: ['author'] },
      'posts',
    );
  }

  async generatePosts(authorId: number) {
    const posts = Array.from({ length: 100 }, (_, i) =>
      this.postsRepository.create({
        author: { id: authorId },
        title: `임의 포스트 ${i + 1}`,
        content: `임의로 생성된 포스트 내용 ${i + 1}`,
        likeCount: Math.floor(Math.random() * 100),
        commentCount: Math.floor(Math.random() * 50),
      }),
    );

    return this.postsRepository.save(posts);
  }

  async createPost(authorId: number, createPostDto: CreatePostDto, image?: string) {
    const post = this.postsRepository.create({
      author: { id: authorId },
      ...createPostDto,
      likeCount: 0,
      commentCount: 0,
      image,
    });
    return await this.postsRepository.save(post);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
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
