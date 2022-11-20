import { Field, isReady } from 'snarkyjs';
import { exp } from './util';

describe('util.js', () => {
  beforeEach(async () => {
    await isReady;
  });

  describe('exp()', () => {
    it('should return 1 when power is 0', () => {
      expect(exp(Field.random(), Field(0).toBigInt())).toEqual(new Field(1));
    });

    it('should return the value when the power is 1', () => {
      const value = Field.random();
      expect(exp(value, new Field(1).toBigInt())).toEqual(value);
    });

    it('should properly exponentiate values', () => {
      // 2^3 = 8
      expect(exp(new Field(2), new Field(3).toBigInt())).toEqual(new Field(8));

      // 8^10 = 1073741824
      expect(exp(new Field(8), new Field(10).toBigInt())).toEqual(
        new Field(1073741824)
      );

      // 8^11 = 8589934592
      expect(exp(new Field(8), new Field(11).toBigInt())).toEqual(
        new Field(8589934592)
      );

      // TODO: Figure out the max field element and write a test to show proper wrap around logic
    });
  });
});
