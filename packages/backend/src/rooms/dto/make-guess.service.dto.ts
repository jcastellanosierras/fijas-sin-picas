import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class MakeGuessServiceDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'Guess must be exactly 4 characters long' })
  @Matches(/^\d{4}$/, { message: 'Guess must be exactly 4 numeric digits' })
  guess: string;
}
