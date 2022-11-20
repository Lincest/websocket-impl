import {Injectable} from '@angular/core';
import {AnonymousSubject} from 'rxjs/internal-compatibility';
import {Observable, Observer, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

export interface WsMessage {
  source: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private subject: AnonymousSubject<MessageEvent>;
  public messages: Subject<WsMessage>;

  constructor() {
    this.messages = (this.connect('ws://127.0.0.1:8080/echo').pipe(
      map(
        res => {
          return JSON.parse(res.data);
        }
      )
    ) as Subject<WsMessage>);
  }

  public connect(url): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  private create(url): AnonymousSubject<MessageEvent> {
    const ws = new WebSocket(url);
    const observable = new Observable((ob: Observer<MessageEvent>) => {
      ws.onmessage = ob.next.bind(ob);
      ws.onerror = ob.error.bind(ob);
      ws.onclose = ob.complete.bind(ob);
      return ws.close.bind(ws);
    });
    const observer = {
      error: () => console.log('websocket error: '),
      complete: () => console.log('websocket close: '),
      next: data => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };
    return new AnonymousSubject<MessageEvent>(observer, observable); // (source, destination)
  }
}
