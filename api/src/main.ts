import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { AppModule } from './modules/app.module'

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create(AppModule)

  // global middlewares
  app.use(cors())
  app.use(helmet())
  app.use(compression())
  app.use(morgan('combined'))

  await app.listen(8000)

  return app.getUrl()
}

bootstrap()
  .then((url: string) => Logger.log(url, 'Bootstrap'))
  .catch((err: Error) => Logger.error(err, 'Bootstrap'))
