import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator'
import { JwtService } from '../services/jwt.service'
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt'
import { REQUEST_USER_KEY } from '../constants/auth.constants'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException('Access token is missing')
    }

    try {
      const payload = await this.jwtService.verifyAccessToken(token)
      request[REQUEST_USER_KEY] = payload
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token signature')
      }

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired')
      }
      throw new UnauthorizedException(error.message || 'Access token is invalid or expired')
    }

    return true
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : null
  }
}
