import assert from 'power-assert';
import { reverse } from '../../src/utils/utils';

describe('utils', () => {
  describe('reverse()', () => {
    it('returns an empty array if input is an empty arrray', () => {
      assert.deepEqual(reverse([]), []);
    });

    it('returns reverse array', () => {
      assert.deepEqual(reverse([10, 20, 30, 40]), [40, 30, 20, 10]);
    });

    it('returns new array', () => {
      const input = [10, 20, 30, 40];
      assert.ok(reverse(input) !== input);
    });
  });
});
