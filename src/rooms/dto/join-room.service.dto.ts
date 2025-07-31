import { IsNotEmpty, IsString, Length } from 'class-validator';
import { JoinRoomControllerDto } from './join-room.controller.dto';

export class JoinRoomServiceDto extends JoinRoomControllerDto {
  @IsNotEmpty({ message: 'Room code is required' })
  @IsString({ message: 'Room code must be a string' })
  @Length(4, 50, { message: 'Room code must be at least 4 characters long' })
  code: string;
}
