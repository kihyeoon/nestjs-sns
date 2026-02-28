import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Socket, Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  @SubscribeMessage('send_message')
  sendMessage(@MessageBody() message: string) {
    this.server.emit('receive_message', 'hello from server');
  }
}
