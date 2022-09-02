import { Global, Module } from '@nestjs/common';

import { notificationProviders } from '@Modules/notification/notification.providers';
import { NotificationController } from './controllers';
import { NotificationService } from './services';

@Global()
@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService, ...notificationProviders],
  exports: [NotificationService],
})
export class NotificationModule {}
