import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'Room code is required' })
  @IsString({ message: 'Room code must be a string' })
  @Length(4, 50, { message: 'Room code must be at least 4 characters long' })
  code: string;

  @IsNotEmpty({ message: 'Room password is required' })
  @IsString({ message: 'Room password must be a string' })
  @Length(4, 50, {
    message: 'Room password must be at least 4 characters long',
  })
  password: string;

  @IsNotEmpty({ message: 'Username is required' })
  @IsString({ message: 'Username must be a string' })
  @Length(4, 50, { message: 'Username must be between 4 and 50 characters' })
  username: string;
}
