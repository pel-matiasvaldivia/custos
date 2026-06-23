import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  namespace: 'co',
  cors: {
    origin: '*',
  },
})
export class COGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(COGateway.name);

  handleConnection(client: Socket) {
    const tenantId = client.handshake.query.tenantId as string;
    if (tenantId) {
      client.join(`tenant:${tenantId}`);
      this.logger.log(`Client ${client.id} joined tenant room: ${tenantId}`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('subscribeObjetivo')
  handleSubscribeObjetivo(client: Socket, objetivoId: string) {
    client.join(`objetivo:${objetivoId}`);
    return { status: 'ok', joined: objetivoId };
  }

  // Helper to emit events to a specific tenant
  emitToTenant(tenantId: string, event: string, payload: any) {
    this.server.to(`tenant:${tenantId}`).emit(event, payload);
  }

  // Helper to emit events to a specific incident/objective
  emitToRoom(roomId: string, event: string, payload: any) {
    this.server.to(roomId).emit(event, payload);
  }
}
