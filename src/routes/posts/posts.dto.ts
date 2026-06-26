import { PostModel } from 'src/shared/models/post.model'
import { UserModel } from 'src/shared/models/user.model'
import { Type } from 'class-transformer'
import { IsOptional, IsString } from 'class-validator'

export class GetPostItemDto extends PostModel {
  @Type(() => UserModel)
  author: Omit<UserModel, 'password'>
  constructor(partial: Partial<GetPostItemDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class CreatePostBodyDto {
  @IsString()
  title: string
  @IsString()
  content: string
}

export class UpdatePostBodyDto {
  @IsString()
  @IsOptional()
  title: string
  @IsString()
  @IsOptional()
  content: string
}
