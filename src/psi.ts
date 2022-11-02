import { Field } from 'snarkyjs';
import { exp } from './util';

export default class PSI {
  private private_key: Field;
  private unencrypted_set: Field[];
  private encrypted_set: Field[];

  constructor(set_values: Field[]) {
    this.private_key = Field.random();
    this.unencrypted_set = set_values;
    this.encrypted_set = this.encryptElements(this.unencrypted_set);
  }

  // encrypts the element of the provided set using the generated private key
  private encryptElements(elements: Field[]): Field[] {
    return elements.map((element) => {
      return exp(element, this.private_key.toBigInt());
    });
  }

  getEncryptedSet(): Field[] {
    return this.encrypted_set;
  }

  generateSharedSet(other_encrypted_set: Field[]): Field[] {
    return this.encryptElements(other_encrypted_set);
  }

  processIntersectionGetIndex(
    shared_set: Field[],
    other_encrypted_set: Field[]
  ): number[] {
    const intersecting_index: number[] = [];
    // TODO: possible rename from other??
    const other_shared_set = this.encryptElements(other_encrypted_set);
    // build hashmap from shared set to index
    const shared_key_to_index_map: Map<string, number> = new Map();
    shared_set.map((value, index) => {
      console.log(value.toString());
      shared_key_to_index_map.set(value.toString(), index);
    });
    console.log(shared_key_to_index_map);
    // iterate over other shared set, checking for intersection
    other_shared_set.map((value) => {
      console.log(value.toString());
      let index = shared_key_to_index_map.get(value.toString());
      console.log(index);
      if (index != undefined) {
        intersecting_index.push(index);
      }
    });
    return intersecting_index;
  }

  processIntersectionGetValues(
    shared_set: Field[],
    other_encrypted_set: Field[]
  ): Field[] {
    const index_values = this.processIntersectionGetIndex(
      shared_set,
      other_encrypted_set
    );
    return index_values.map((index) => this.unencrypted_set[index]);
  }
}
