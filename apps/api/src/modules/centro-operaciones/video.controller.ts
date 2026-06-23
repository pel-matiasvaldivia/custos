import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('centro-operaciones/video')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('streams/:id')
  async getStream(@Param('id') id: string) {
    return this.videoService.getStreamUrl(id);
  }

  @Post('ptz/:id')
  async ptzCommand(
    @Param('id') id: string,
    @Body() command: { action: string; speed?: number },
  ) {
    return this.videoService.sendPTZCommand(id, command);
  }

  @Post('record/:id')
  async triggerRecord(
    @Param('id') id: string,
    @Body() data: { duration: number },
  ) {
    return this.videoService.triggerRecording(id, data.duration);
  }
}
