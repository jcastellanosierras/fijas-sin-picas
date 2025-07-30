import { Body, Controller, Post } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }
}
