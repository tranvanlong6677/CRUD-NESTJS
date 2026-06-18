import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDto, RegisterResDto } from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @SerializeOptions({ type: RegisterResDto })
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }
}
