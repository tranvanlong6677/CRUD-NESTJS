import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'
import { REQUEST_USER_KEY } from '../constants/auth.constants'
import type { AccessTokenPayload } from '../types/jwt.type'

export const ActiveUser = createParamDecorator((_: unknown, ctx: ExecutionContext): AccessTokenPayload => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request[REQUEST_USER_KEY] as AccessTokenPayload
})
