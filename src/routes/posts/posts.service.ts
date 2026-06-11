import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../shared/services/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreatePostDto) {
    const post = await this.prismaService.post.create({
      data: {
        content:data.content,
        title:data.title,
        authorId:1,
      },
    })
    return post
  }

  async findAll() {
    return await this.prismaService.post.findMany()
  }

  async findOne(id: string) {
    return await this.prismaService.post.findUnique({ where: { id: Number(id) } })
  }

  update(id: string, bodyUpdate: UpdatePostDto) {
    return { bodyUpdate, id }
  }

  remove(id: string) {
    return `This action removes a #${id} post`
  }
}
