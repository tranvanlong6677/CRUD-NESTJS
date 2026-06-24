import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'
import { JwtService } from './services/jwt.service'

const sharedServices = [PrismaService, HashingService, JwtService]

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ?? '1h') as unknown as number },
    }),
  ],
  providers: sharedServices,
  exports: [...sharedServices, JwtModule],
})
export class SharedModule {}
