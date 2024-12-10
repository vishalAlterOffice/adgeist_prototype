import { Validate } from 'class-validator';
import { IsValidType } from './IsValidType';

export function ValidateWithType(validTypes: string[]) {
  return Validate(IsValidType, [validTypes]);
}
