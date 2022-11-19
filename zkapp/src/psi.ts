import { Field } from 'snarkyjs';
import { exp } from './util';

export default class PSI {
  private private_key: Field;
  private unencrypted_set: Field[];
  private encrypted_set: Field[];

  constructor(set_values: Field[]) {
    this.private_key = Field.random();
    // TODO: Implement set shuffling to prevent known plain text attack
    this.unencrypted_set = set_values;
    this.encrypted_set = this.encryptElements(this.unencrypted_set);
  }

  // encrypts the element of the provided set using the generated private key
  // i.e g^a
  private encryptElements(elements: Field[]): Field[] {
    return elements.map((element) => {
      return exp(element, this.private_key.toBigInt());
    });
  }

  getEncryptedSet(): Field[] {
    return this.encrypted_set;
  }

  // takes an encrypted set from the other party and computes a shared set
  // by re-encrypting those values resulting in g^a^b
  generateSharedSet(other_encrypted_set: Field[]): Field[] {
    return this.encryptElements(other_encrypted_set);
  }

  // given g^a^b and g^b, compute g^b^a if g is the same for both sets, then the shared value
  // will be the same.
  // returns the index associated with the intersecting shared values.
  processIntersectionGetIndex(
    shared_set: Field[],
    other_encrypted_set: Field[]
  ): number[] {
    const intersecting_index: number[] = [];
    const other_shared_set = this.encryptElements(other_encrypted_set);

    // build hashmap for shared key to index
    const shared_key_to_index_map: Map<string, number> = new Map();
    shared_set.map((value, index) => {
      shared_key_to_index_map.set(value.toString(), index);
    });

    // iterate over other shared set, checking for intersection
    other_shared_set.map((value) => {
      let index = shared_key_to_index_map.get(value.toString());
      if (index != undefined) {
        intersecting_index.push(index);
      }
    });
    return intersecting_index;
  }

  // get's the intersecting index, but maps it to the actual value and returns that
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
