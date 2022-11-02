import { Field, isReady } from 'snarkyjs';
import PSI from './psi';

describe('psi.js', () => {
  beforeEach(async () => {
    await isReady;
  });

  it('blah', () => {
    let psi_instance_1 = new PSI();
    let psi_instance_2 = new PSI();

    let set_a = [new Field(5), new Field(6), new Field(5)];
    let set_b = [new Field(4), new Field(5), new Field(7)];

    console.log('set a');
    print(set_a);

    console.log('set b');
    print(set_b);

    // a will encrypt their values
    let encrypted_set_a = psi_instance_1.encryptElements(set_a);

    console.log('encrypted set a');
    print(encrypted_set_a);

    // b will encrypt their values and encrypt b's values
    let encrypted_set_b = psi_instance_2.encryptElements(set_b);

    console.log('encrypted set b');
    print(encrypted_set_b);

    let shared_set_a = psi_instance_2.encryptElements(encrypted_set_a);
    let shared_set_b = psi_instance_1.encryptElements(encrypted_set_b);

    console.log('shared set a');
    print(shared_set_a);

    console.log('shared set b');
    print(shared_set_b);
  });
});

function print(a: Field[]) {
  a.map((b) => console.log(b.toString()));
}
