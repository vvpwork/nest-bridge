/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-relative-packages */
import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { DATE } from 'sequelize/types';
import { ISseMessage } from './interfaces';

@Injectable()
export class SseService {
  private events: Subject<any> = new Subject();

  addEvent(event: ISseMessage) {
    this.events.next({ id: Date.now(), ...event });
  }

  sendEvents() {
    return this.events.asObservable();
  }
}
