import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { CleanupService } from './cleanup.service';

@Module({
  controllers: [RoomsController],
  exports: [RoomsService],
  providers: [RoomsService, CleanupService],
})
export class RoomsModule {}
