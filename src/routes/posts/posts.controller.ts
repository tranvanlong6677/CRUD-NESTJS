import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthOptionsType, AuthType } from 'src/shared/enums/auth-type.enum'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { GetPostItemDto } from './posts.dto'
// import { Auth } from 'src/shared/decorators/auth.decorator'
// import { AuthType } from 'src/shared/enums/auth-type.enum'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @Auth([AuthType.Bearer])
  create(@Body() bodyCreate: any, @ActiveUser('userId') userId: number) {
    return this.postsService.create(bodyCreate, userId)
  }
  @Get()
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: AuthOptionsType.AND })
  findAll(@ActiveUser('userId') userId: number) {
    return this.postsService.getPosts(userId).then((res) => res.map((item) => new GetPostItemDto(item)))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id)
  }

  @Put(':id')
  @Auth(AuthType.Bearer)
  update(@Param('id') id: string, @Body() bodyUpdate: any) {
    return this.postsService.update(id, bodyUpdate)
  }

  @Delete(':id')
  @Auth(AuthType.Bearer)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id)
  }
}
