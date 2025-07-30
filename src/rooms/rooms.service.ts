import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';

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
    this.rooms.push(room);
    return room;
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
