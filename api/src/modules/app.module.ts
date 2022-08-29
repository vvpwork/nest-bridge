import { config } from '@/common/config'
import { ExceptionsFilter } from '@/common/filters'
import { Module, ValidationPipe } from '@nestjs/common'
import { APP_FILTER, APP_PIPE, RouterModule } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ExampleModule } from './example'

const imports = [
  // DB
  TypeOrmModule.forRoot(config.db),

  ExampleModule,
  RouterModule.register([
    {
      path: '/example',
      module: ExampleModule,
    },
  ]),
]

const providers = [
  // Global Guard, Authentication check on all routers
  // { provide: APP_GUARD, useClass: AuthenticatedGuard },

  // Global Filter, Exception check
  { provide: APP_FILTER, useClass: ExceptionsFilter },

  // Global Pipe, Validation check
  // https://docs.nestjs.com/pipes#global-scoped-pipes
  // https://docs.nestjs.com/techniques/validation
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({
      // disableErrorMessages: true,
      transform: true, // transform object to DTO class
      whitelist: true,
    }),
  },
]

@Module({
  imports,
  controllers: [],
  providers,
})
export class AppModule {}
