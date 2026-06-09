import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() bodyCreate: any) {
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
