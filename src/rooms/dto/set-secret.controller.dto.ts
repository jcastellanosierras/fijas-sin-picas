import { IsNotEmpty, IsString, IsUUID, Length, Matches } from 'class-validator';

export class SetSecretControllerBodyDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'Secret must be exactly 4 characters long' })
  @Matches(/^\d{4}$/, { message: 'Secret must be exactly 4 numeric digits' })
  secret: string;
}

export class SetSecretControllerParamsDto {
  @IsUUID()
  id: string;

  @IsUUID()
  player_id: string;
}
