import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, JoinRoomControllerDto } from './dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomsService.create(createRoomDto);
  }

  @Post(':code/join')
  @HttpCode(HttpStatus.OK)
  async joinRoom(
    @Param('code') code: string,
    @Body() joinRoomDto: JoinRoomControllerDto,
  ) {
    return await this.roomsService.joinRoom({
      ...joinRoomDto,
      code,
    });
  }
}
