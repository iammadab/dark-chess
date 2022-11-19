import { Field } from 'snarkyjs';

// Fast exponentiation in modular space
export function exp(value: Field, power: bigint): Field {
  if (power == BigInt(0)) {
    return Field.one;
  }

  if (power == BigInt(1)) {
    return value;
  }

  const temp = exp(value, power / BigInt(2));
  let result = temp.mul(temp);

  if (power % BigInt(2) == BigInt(1)) {
    result = result.mul(value);
  }

  return result;
}
