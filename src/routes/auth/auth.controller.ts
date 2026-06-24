import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDto, RegisterBodyDto, RegisterResDto } from './auth.dto'
import { ResponseMessage } from 'src/shared/decorators/response-message.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResponseMessage('Đăng ký thành công')
  async register(@Body() body: RegisterBodyDto) {
    const res = await this.authService.register(body)
    return new RegisterResDto(res)
  }

  @Post('login')
  @ResponseMessage('Đăng nhập thành công')
  async login(@Body() body: LoginBodyDto) {
    return this.authService.login(body)
  }
}
