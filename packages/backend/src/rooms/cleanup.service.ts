import { Injectable } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  private isRunning = false;

  constructor(private readonly roomsService: RoomsService) {}

  @Interval('cleanup', 30_000)
  async cleanup() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    await this.roomsService.deleteStales();
    this.isRunning = false;
  }
}
