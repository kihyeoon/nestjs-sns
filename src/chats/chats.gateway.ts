import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
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

  // enter_chat
  @SubscribeMessage('enter_chat')
  async enterChat(@MessageBody() chatIds: number[], @ConnectedSocket() socket: Socket) {
    for (const chatId of chatIds) {
      await socket.join(chatId.toString());
    }
  }

  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody() message: { message: string; chatId: number },
    @ConnectedSocket() socket: Socket,
  ) {
    // this.server.to(message.chatId.toString()).emit('receive_message', message.message);
    socket.to(message.chatId.toString()).emit('receive_message', message.message);
  }
}
