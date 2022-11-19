import { Field, isReady } from 'snarkyjs';
import PSI from './psi';

describe('psi.js', () => {
  beforeEach(async () => {
    await isReady;
  });

  it('psi protocol: should find correct intersection', () => {
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

    expect(index_values.length).toBe(2);
    expect(index_values[0]).toBe(2); // 4 will be in the intersection first
    expect(index_values[1]).toBe(0); // 5 will be the second element

    expect(actual_values.length).toBe(2);
    expect(actual_values[0].toString()).toBe(new Field(4).toString());
    expect(actual_values[1].toString()).toBe(new Field(5).toString());
  });
});
