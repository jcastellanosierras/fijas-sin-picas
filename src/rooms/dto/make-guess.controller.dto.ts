import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class MakeGuessControllerParamsDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  playerId: string;
}

export class MakeGuessControllerBodyDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'Guess must be exactly 4 characters long' })
  @Matches(/^\d{4}$/, { message: 'Guess must be exactly 4 numeric digits' })
  guess: string;
}
