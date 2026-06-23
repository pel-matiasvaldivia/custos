import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private readonly MEDIAMTX_API = 'http://mediamtx:9997/v3';

  constructor(private readonly prisma: PrismaService) {}

  async getStreamUrl(dispositivoId: string) {
    const dispositivo = await this.prisma.dispositivo.findUnique({
      where: { id: dispositivoId },
    });

    if (
      !dispositivo ||
      !['CAMARA_IP', 'DVR', 'NVR'].includes(dispositivo.tipo)
    ) {
      throw new Error('Device is not a valid camera');
    }

    // In a real scenario, we would register the path in MediaMTX if not already there
    // For now, we assume the path corresponds to the dispositivo ID or a slug
    const path = dispositivo.id;

    // Check if path exists in mediamtx, otherwise we might need to add it dynamically
    // (MediaMTX can auto-add paths if configured with a source)

    // Return the WebRTC URL for the frontend
    // Note: The frontend will access it via proxy or direct IP
    return {
      webrtc: `/webrtc/${path}`,
      hls: `/hls/${path}`,
      rtsp: `rtsp://localhost:8554/${path}`,
    };
  }

  async sendPTZCommand(
    dispositivoId: string,
    command: { action: string; speed?: number },
  ) {
    this.logger.log(`Sending PTZ ${command.action} to ${dispositivoId}`);

    // Placeholder for ONVIF Implementation (using a library like 'onvif')
    // We would fetch device credentials from 'params' JSON field
    const device = await this.prisma.dispositivo.findUnique({
      where: { id: dispositivoId },
    });
    if (!device) return null;

    // Simulate ONVIF call
    return { status: 'success', command: command.action };
  }

  async triggerRecording(dispositivoId: string, durationSec: number = 30) {
    this.logger.log(
      `Triggering recording for ${dispositivoId} for ${durationSec}s`,
    );
    // MediaMTX V3 API allows starting recordings if configured
    try {
      // POST /v3/config/paths/add/ID/recording ...
      return { status: 'recording_started', ref: Date.now() };
    } catch (err) {
      this.logger.error(`Failed to trigger recording: ${err.message}`);
      return null;
    }
  }
}
