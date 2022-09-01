import { config } from '@Common/config';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';

const { uri, exchangeName } = config.rabbit;

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: exchangeName,
          type: 'fanout',
        },
      ],
      uri,

      channels: {
        'channel-1': {
          default: true,
        },
        'channel-2': {
          default: true,
        },
      },
    }),
  ],
  providers: [],
  controllers: [],
})
export class RabbitExampleModule {}
