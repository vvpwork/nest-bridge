import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private events: Subject<any> = new Subject();

  addEvent(event: any) {
    this.events.next(event);
  }

  sendEvents() {
    return this.events.asObservable();
  }
}
