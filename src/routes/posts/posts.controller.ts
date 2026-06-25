import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
// import { Auth } from 'src/shared/decorators/auth.decorator'
// import { AuthType } from 'src/shared/enums/auth-type.enum'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() bodyCreate: CreatePostDto) {
    return this.postsService.create(bodyCreate)
  }
  @Get()
  findAll() {
    return this.postsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() bodyUpdate: any) {
    return this.postsService.update(id, bodyUpdate)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id)
  }
}
