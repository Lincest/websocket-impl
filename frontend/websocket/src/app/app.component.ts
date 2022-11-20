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
  status = false;

  constructor(private wsService: WebsocketService) {
    wsService.messages$.subscribe(msg => {
      this.receivedMessages.push(msg);
      console.log('received message: ', msg);
    });
    wsService.status$.subscribe(s => {
      this.status = s;
    });
  }

  send() {
    const msg: WsMessage = {source: 'angular', content: this.content};
    this.sendMessages.push(msg);
    this.wsService.send(msg);
  }

}
