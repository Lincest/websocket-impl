import {Component} from '@angular/core';
import {WebsocketService, WsMessage} from './websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  content = '';
  receivedMessages = [];
  sendMessages = [];

  constructor(private wsService: WebsocketService) {
    wsService.messages.subscribe(msg => {
      this.receivedMessages.push(msg);
      console.log('received message: ', msg);
    });
  }

  send() {
    const msg: WsMessage = {source: 'angular', content: this.content};
    this.sendMessages.push(msg);
    this.wsService.messages.next(msg);
  }

}
