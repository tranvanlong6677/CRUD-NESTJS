import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDto, RegisterResDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  // @SerializeOptions({ type: RegisterResDto })
  async register(@Body() body: RegisterBodyDto) {
    const res = await this.authService.register(body)
    return new RegisterResDto(res)
  }
}
