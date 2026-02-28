import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chats' })
export class ChatsGateway {
  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
  }

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    console.log('createChatDto', createChatDto);
  }
}
