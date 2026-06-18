import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { RegisterBodyDto } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
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

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException(`Email ${body.email} already exists`)
      }

      throw error
    }
  }
}
