import { Exclude, Expose, Type } from 'class-transformer'
import { IsDate, IsEmail, IsString } from 'class-validator'

export class LoginBodyDto {
  @IsString()
  @Expose()
  @IsEmail()
  email: string
  @IsString()
  @Expose()
  password: string
}

export class RegisterBodyDto extends LoginBodyDto {
  @IsString()
  @Expose()
  name: string
  @IsString()
  @Expose()
  confirmPassword: string
}

export class RegisterResDto {
  @IsString()
  @Expose()
  id: string
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
    Object.assign(this, partial)
  }

  @Expose()
  get emailName() {
    return `${this.email}-${this.name}`
  }
}
