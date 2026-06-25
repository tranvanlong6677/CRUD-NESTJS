import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: any, userId: number) {
    const post = await this.prismaService.post.create({
      data: {
        content: data.content,
        title: data.title,
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    })
    return post
  }

  async getPosts(userId: number) {
    const data = await this.prismaService.post.findMany({
      where: {
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
      },
    })
    console.log({ data })
    return data
  }

  async findOne(id: string) {
    return await this.prismaService.post.findUnique({ where: { id: Number(id) } })
  }

  update(id: string, bodyUpdate: any) {
    return { bodyUpdate, id }
  }

  remove(id: string) {
    return `This action removes a #${id} post`
  }
}
