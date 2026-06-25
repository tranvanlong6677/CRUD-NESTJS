import { Exclude, Expose, Type } from 'class-transformer'
import { IsDate, IsEmail, IsNumber, IsString, Length } from 'class-validator'
import { SuccessResDto } from 'src/shared/shared.dto'
import { Match } from 'src/shared/decorators/match.decorator'

export class LoginBodyDto {
  @IsString()
  @Expose()
  @IsEmail()
  email: string
  @IsString()
  @Expose()
  @Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
  password: string
}

export class RegisterBodyDto extends LoginBodyDto {
  @IsString()
  @Expose()
  name: string
  @IsString()
  @Expose()
  @Match('password', { message: 'Confirm password must match password' })
  confirmPassword: string
}

export class LoginResDto extends SuccessResDto {
  @IsString()
  @Expose()
  accessToken: string

  @IsString()
  @Expose()
  refreshToken: string

  @IsString()
  @Expose()
  @IsEmail()
  email: string

  @IsString()
  @Expose()
  name: string

  @Type(() => Date)
  @IsDate()
  @Expose()
  createdAt: Date

  @Type(() => Date)
  @IsDate()
  @Expose()
  updatedAt: Date

  constructor(partial: Partial<LoginResDto>) {
    super(partial)
    Object.assign(this, partial)
  }
}

export class RegisterResDto extends SuccessResDto {
  @IsNumber()
  @Expose()
  id: number
  @IsString()
  @Expose()
  name: string
  @IsString()
  @Expose()
  @IsEmail()
  email: string
  @Type(() => Date)
  @IsDate()
  @Expose()
  createdAt: Date
  @Type(() => Date)
  @IsDate()
  @Expose()
  updatedAt: Date

  @Type(() => String)
  @IsString()
  @Exclude()
  password: string

  constructor(partial: Partial<RegisterResDto>) {
    super(partial)
    Object.assign(this, partial)
  }

  @Expose()
  get emailName() {
    return `${this.email}-${this.name}`
  }
}

export class RefreshTokenBodyDTO {
  @IsString()
  @Expose()
  refreshToken: string
}
