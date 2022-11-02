import { Field, isReady } from 'snarkyjs';
import PSI from './psi';

describe('psi.js', () => {
  beforeEach(async () => {
    await isReady;
  });

  describe('add()', () => {
    it('should add two field elements correctly', () => {
      const a = new Field(2);
      const b = new Field(3);
      const c = PSI.add(a, b);
      expect(c).toEqual(new Field(5));
    });

    it('should list out all elements in the field', () => {
      let a = Field.random();
      let b = Field.random();
      let c = a.mul(b);

      console.log(a.toString());
      console.log(b.toString());
      console.log(c.toString());
    });
  });
});
