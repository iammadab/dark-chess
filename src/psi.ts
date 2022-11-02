import { Field, Poseidon } from 'snarkyjs';

export default class PSI {
  private_key: Field;

  constructor() {
    this.private_key = Field.random();
  }

  static encrypt_field_elements(elems: Field[]): Field[] {
    return elems.map((element) => {
      let hashed_element = Poseidon.hash([element]);
      return hashed_element;
    });
  }

  // Need a method that takes a field array and generates
  static add(a: Field, b: Field): Field {
    return a.add(b);
  }
}
