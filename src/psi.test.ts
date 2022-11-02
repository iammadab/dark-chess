import { Field, isReady } from 'snarkyjs';
import PSI from './psi';

describe('psi.js', () => {
  beforeEach(async () => {
    await isReady;
  });

  it('blah', () => {
    let set_a = [new Field(5), new Field(6), new Field(4)];
    let set_b = [new Field(4), new Field(5), new Field(7)];

    let psi_instance_1 = new PSI(set_a);
    let psi_instance_2 = new PSI(set_b);

    let encrypted_a = psi_instance_1.getEncryptedSet();

    let shared_set_a = psi_instance_2.generateSharedSet(encrypted_a);
    let encrypted_b = psi_instance_2.getEncryptedSet();

    let index_values = psi_instance_1.processIntersectionGetIndex(
      shared_set_a,
      encrypted_b
    );
    let actual_values = psi_instance_1.processIntersectionGetValues(
      shared_set_a,
      encrypted_b
    );

    console.log(index_values);
    print(actual_values);
  });
});

function print(a: Field[]) {
  a.map((b) => console.log(b.toString()));
}
