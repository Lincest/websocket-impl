import {Injectable} from '@angular/core';
import {AnonymousSubject, WebSocketSubject} from 'rxjs/internal-compatibility';
import {Observable, Subject, throwError, timer} from 'rxjs';
import {delayWhen, finalize, map, mergeMap, retry, retryWhen} from 'rxjs/operators';
import {webSocket} from 'rxjs/webSocket';

export interface WsMessage {
  source: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private subject: WebSocketSubject<WsMessage>;
  public messages$: Observable<WsMessage>; // receive messages
  public status$: Subject<boolean>;

  // reconnect automatically
  private retryStrategy = ({
                             maxRetryAttempts = 5,
                             scalingDuration = 1000,
                           }: {
    maxRetryAttempts?: number,
    scalingDuration?: number,
  } = {}) => (attempts: Observable<WsMessage>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1;
        if (
          retryAttempt > maxRetryAttempts
        ) {
          console.log(`[websocket] retry more than ${maxRetryAttempts} times. give up.`);
          return throwError(error);
        }
        console.log(
          `[websocket] Attempt ${retryAttempt}: retrying in ${retryAttempt *
          scalingDuration}ms`
        );
        return timer(retryAttempt * scalingDuration);
      }),
      finalize(() => console.log('[websocket] reconnect successfully!'))
    );
  };

  constructor() {
    this.messages$ = this.connect('ws://127.0.0.1:8080/echo').pipe(
      retryWhen(this.retryStrategy())
    );
    this.status$ = new Subject<boolean>();
  }

  public connect(url): WebSocketSubject<WsMessage> {
    if (!this.subject) {
      this.subject = webSocket({
        url,
        openObserver: {
          next: () => {
            this.status$.next(true);
            console.log('[websocket] is opened.');
          }
        },
        closeObserver: {
          next: () => {
            this.status$.next(false);
            console.log('[websocket] is closed.');
          }
        }
      });
    }
    return this.subject;
  }

  public send(msg: WsMessage) {
    this.subject.next(msg);
  }
}
