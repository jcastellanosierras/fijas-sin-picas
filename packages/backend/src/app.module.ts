import { Module } from '@nestjs/common';
import { RoomsModule } from './rooms/rooms.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), RoomsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
