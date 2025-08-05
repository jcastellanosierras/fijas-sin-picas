import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Room, RoomState } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { JoinRoomServiceDto } from './dto/join-room.service.dto';
import { JoinRoomResponseDto } from './dto/join-room-response.dto';

@Injectable()
export class RoomsService {
  private readonly rooms: Room[] = [];

  constructor() {}

  /**
   * Validación semántica: verifica que el código de la room no exista ya
   * Esta validación va más allá de la sintaxis y verifica reglas de negocio
   */
  private validateRoomCodeUniqueness(code: string): void {
    if (this.rooms.find((room) => room.code === code)) {
      throw new BadRequestException('Room with this code already exists');
    }
  }

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    await Promise.resolve();
    // Validación semántica: verificar unicidad del código
    this.validateRoomCodeUniqueness(createRoomDto.code);

    const id = crypto.randomUUID();
    const room = new Room(id, createRoomDto.code, createRoomDto.password);

    room.players[0] = {
      id: crypto.randomUUID(),
      username: createRoomDto.username,
    };

    this.rooms.push(room);
    return room;
  }

  async joinRoom(
    joinRoomDto: JoinRoomServiceDto,
  ): Promise<JoinRoomResponseDto> {
    await Promise.resolve();
    const room = await this.getRoomByCode(joinRoomDto.code);

    if (room.password !== joinRoomDto.password) {
      throw new BadRequestException('Invalid password');
    }

    if (room.players[0] && room.players[1]) {
      throw new BadRequestException('Room is full');
    }

    const hostPlayer = room.players[0];
    if (hostPlayer && hostPlayer.username === joinRoomDto.username) {
      throw new BadRequestException('Username already exists');
    }

    room.players[1] = {
      id: crypto.randomUUID(),
      username: joinRoomDto.username,
    };

    room.state = RoomState.SETTING_SECRETS;

    return {
      playerId: crypto.randomUUID(),
      roomId: room.id,
      code: room.code,
      state: room.state,
      players: room.players.filter((player) => player !== null),
    };
  }

  async getRooms(): Promise<Room[]> {
    await Promise.resolve();
    return this.rooms;
  }

  async getRoomByCode(code: string): Promise<Room> {
    await Promise.resolve();
    const room = this.rooms.find((room) => room.code === code);
    if (!room) {
      throw new NotFoundException(`Room with code ${code} not found`);
    }
    return room;
  }
}
