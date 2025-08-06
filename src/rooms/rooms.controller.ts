import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import {
  CreateRoomDto,
  JoinRoomControllerDto,
  SetSecretControllerBodyDto,
  SetSecretControllerParamsDto,
  MakeGuessControllerBodyDto,
  MakeGuessControllerParamsDto,
} from './dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  async createRoom(@Body() createRoomDto: CreateRoomDto) {
    return await this.roomsService.create(createRoomDto);
  }

  @Get(':code')
  async getRoomByCode(@Param('code') code: string) {
    return await this.roomsService.getRoomByCode(code);
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

  @Post(':roomId/secret/:playerId')
  @HttpCode(HttpStatus.OK)
  async setSecret(
    @Param() params: SetSecretControllerParamsDto,
    @Body() setSecretDto: SetSecretControllerBodyDto,
  ) {
    return await this.roomsService.setSecret({
      roomId: params.roomId,
      playerId: params.playerId,
      secret: setSecretDto.secret,
    });
  }

  @Post(':roomId/guess/:playerId')
  @HttpCode(HttpStatus.OK)
  async makeGuess(
    @Param() params: MakeGuessControllerParamsDto,
    @Body() guessDto: MakeGuessControllerBodyDto,
  ) {
    return await this.roomsService.makeGuess({
      roomId: params.roomId,
      playerId: params.playerId,
      guess: guessDto.guess,
    });
  }
}
