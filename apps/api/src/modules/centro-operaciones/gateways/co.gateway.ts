import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { getJwtSecret } from '../../../common/config/jwt.config';

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

  /**
   * El tenant se deriva del JWT verificado (no de un query del cliente, que sería
   * falsificable y dejaría a cualquiera escuchar los eventos en vivo de otra
   * empresa). Sin token válido, se cierra la conexión (fail-closed).
   */
  handleConnection(client: Socket) {
    const token =
      (client.handshake.auth?.token as string) ||
      (client.handshake.query?.token as string) ||
      (client.handshake.headers?.authorization || '').replace(/^Bearer /, '');

    try {
      const decoded: any = jwt.verify(token, getJwtSecret());
      const tenantId = decoded?.tenant_id;
      if (!tenantId) throw new Error('JWT sin tenant_id');

      client.data.tenantId = tenantId;
      client.join(`tenant:${tenantId}`);
      this.logger.log(`Cliente ${client.id} unido a la sala del tenant`);
    } catch {
      this.logger.warn(`Cliente ${client.id} rechazado: token inválido`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente ${client.id} desconectado`);
  }

  @SubscribeMessage('subscribeObjetivo')
  handleSubscribeObjetivo(client: Socket, objetivoId: string) {
    // La sala se namespacea por el tenant verificado: no se puede escuchar el
    // objetivo de otra empresa.
    const tenantId = client.data.tenantId;
    if (!tenantId) return { status: 'error' };
    client.join(`tenant:${tenantId}:objetivo:${objetivoId}`);
    return { status: 'ok', joined: objetivoId };
  }

  emitToTenant(tenantId: string, event: string, payload: any) {
    this.server.to(`tenant:${tenantId}`).emit(event, payload);
  }

  emitToRoom(roomId: string, event: string, payload: any) {
    this.server.to(roomId).emit(event, payload);
  }
}
