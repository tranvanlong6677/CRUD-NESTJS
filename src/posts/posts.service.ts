import { Injectable } from '@nestjs/common'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  create(bodyCreate: CreatePostDto) {
    return bodyCreate
  }

  findAll() {
    return `This action returns all posts`
  }

  findOne(id: string) {
    return `This action returns a #${id} post`  
  }

  update(id: string, bodyUpdate: UpdatePostDto) {
    return { bodyUpdate, id }
  }

  remove(id: string) {
    return `This action removes a #${id} post`
  }
}
