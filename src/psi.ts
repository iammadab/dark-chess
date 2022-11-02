import { Field } from 'snarkyjs';
import { exp } from './util';

export default class PSI {
  private private_key: Field;

  constructor() {
    this.private_key = Field.random();
  }

  getPrivateKey(): Field {
    return this.private_key;
  }

  encryptElements(elements: Field[]): Field[] {
    return elements.map((element) => {
      return exp(element, this.private_key.toBigInt());
    });
  }
}
