import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDto, RegisterBodyDto } from './auth.dto'
import { JwtService } from 'src/shared/services/jwt.service'
import { isNotFoundPrismaError } from 'src/shared/helper'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: RegisterBodyDto) {
    try {
      const hashPassword = await this.hashingService.hash(body.password)
      const user = await this.prismaService.user.create({
        data: {
          name: body.name,
          email: body.email,
          password: hashPassword,
        },
      })

      return user
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new ConflictException(`Email ${body.email} already exists`)
      }

      throw error
    }
  }

  async generateTokens(userId: number) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken({ userId }),
      this.jwtService.signRefreshToken({ userId }),
    ])

    const decodedRefreshToken = await this.jwtService.verifyRefreshToken(refreshToken)

    await this.prismaService.$transaction([
      this.prismaService.refreshToken.deleteMany({ where: { userId } }),
      this.prismaService.refreshToken.create({
        data: {
          token: refreshToken,
          userId,
          expiresAt: new Date(decodedRefreshToken.exp * 1000),
        },
      }),
    ])

    return { accessToken, refreshToken }
  }

  async login(body: LoginBodyDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: body.email },
    })

    if (!user) {
      throw new UnprocessableEntityException([{ field: 'email', error: 'Email không tồn tại' }])
    }

    const isPasswordValid = await this.hashingService.compare(body.password, user.password)

    if (!isPasswordValid) {
      throw new UnprocessableEntityException([{ field: 'password', error: 'Password is not correct' }])
    }

    return this.generateTokens(user.id)
  }

  async handleTokenRefresh(refreshToken: string) {
    try {
      const { userId } = await this.jwtService.verifyRefreshToken(refreshToken)

      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: { token: refreshToken },
      })

      return this.generateTokens(userId)
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new UnauthorizedException('Refresh token has been revoked')
      }
      throw error
    }
  }

  async logout({ userId, refreshToken }: { userId: number; refreshToken: string }) {
    await this.prismaService.refreshToken.delete({
      where: { token: refreshToken, userId },
    })
  }
}
