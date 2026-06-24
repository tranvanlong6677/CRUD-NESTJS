import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDto, RefreshTokenBodyDTO, RegisterBodyDto, RegisterResDto } from './auth.dto'
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

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Refresh token thành công')
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return this.authService.handleTokenRefresh(body.refreshToken)
  }
}
