import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidType', async: false })
export class IsValidType implements ValidatorConstraintInterface {
  private validTypes: string[];

  constructor(validTypes?: string[]) {
    this.validTypes = validTypes || [];
  }

  validate(values: string[], args: ValidationArguments): boolean {
    return (
      Array.isArray(values) &&
      values.every((value) => this.validTypes.includes(value))
    );
  }

  defaultMessage(args: ValidationArguments): string {
    return `Each value must be one of the following: ${this.validTypes.join(', ')}`;
  }
}
