import { ValidationArguments } from 'class-validator';

export const lengthValidationMessage = (args: ValidationArguments) => {
  const [min, max] = args.constraints as [number, number?];

  if (min && max) {
    return `${args.property}은(는) ${min}~${max}글자를 입력해야 합니다.`;
  }

  return `${args.property}은(는) 최소 ${min}글자를 입력해야 합니다.`;
};
