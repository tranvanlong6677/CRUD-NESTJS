import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthOptionsType, AuthType } from 'src/shared/enums/auth-type.enum'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { CreatePostBodyDto, GetPostItemDto, UpdatePostBodyDto } from './posts.dto'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: AuthOptionsType.AND })
  findAll(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId).then((res) => res.map((item) => new GetPostItemDto(item)))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id).then((res) => new GetPostItemDto(res || {}))
  }

  @Post()
  @Auth([AuthType.Bearer])
  create(@Body() bodyCreate: CreatePostBodyDto, @ActiveUser('userId') userId: number) {
    return this.postsService.create(bodyCreate, userId).then((res) => new GetPostItemDto(res))
  }

  @Put(':id')
  @Auth(AuthType.Bearer)
  update(@Param('id') id: string, @Body() bodyUpdate: UpdatePostBodyDto, @ActiveUser('userId') userId: number) {
    return this.postsService
      .update({ postId: Number(id), userId, body: bodyUpdate })
      .then((res) => new GetPostItemDto(res))
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  remove(@Param('id') id: string, @ActiveUser('userId') userId: number) {
    return this.postsService.remove({ postId: Number(id), userId })
  }
}
