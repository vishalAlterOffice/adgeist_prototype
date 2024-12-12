import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class IdTokenDto {
  @IsString({ message: 'IDToken must be a string' })
  @IsNotEmpty({ message: 'IDToken is required' })
  idToken: string;
}
