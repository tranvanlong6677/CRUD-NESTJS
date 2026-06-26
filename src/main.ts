import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import './shared/config'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },

      exceptionFactory: (errors) => {
        return new UnprocessableEntityException(
          errors?.map((error) => ({
            field: error.property,
            message: Object.values(error.constraints || {}).join(', '),
          })),
        )
      },
    }),
  )
  await app.listen(process.env.PORT ?? 8000)
}
void bootstrap()
