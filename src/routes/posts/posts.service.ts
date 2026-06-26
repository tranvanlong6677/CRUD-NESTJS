import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service'
import { CreatePostBodyDto, UpdatePostBodyDto } from './posts.dto'
import { isNotFoundPrismaError } from 'src/shared/helper'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreatePostBodyDto, userId: number) {
    return this.prismaService.post.create({
      data: {
        content: data.content,
        title: data.title,
        authorId: userId,
        deletedAt: null,
      },
      include: {
        author: { omit: { password: true } },
      },
    })
  }

  async getPosts(userId: number) {
    return this.prismaService.post.findMany({
      where: { authorId: userId, deletedAt: null },
      include: {
        author: { omit: { password: true } },
      },
    })
  }

  async findOne(id: string) {
    return this.prismaService.post.findUnique({
      where: { id: Number(id), deletedAt: null },
      include: {
        author: { omit: { password: true } },
      },
    })
  }

  async update({ postId, userId, body }: { postId: number; userId: number; body: UpdatePostBodyDto }) {
    try {
      return await this.prismaService.post.update({
        where: { id: postId, authorId: userId, deletedAt: null },
        data: { content: body.content, title: body.title },
        include: { author: { omit: { password: true } } },
      })
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found or you are not the author')
      }
      throw error
    }
  }

  async remove({ postId, userId }: { postId: number; userId: number }) {
    try {
      await this.prismaService.post.update({
        where: { id: postId, authorId: userId, deletedAt: null },
        data: { deletedAt: new Date() },
      })
      return true
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new NotFoundException('Post not found or you are not the author')
      }
      throw error
    }
  }
}
