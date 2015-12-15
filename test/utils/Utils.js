import assert from 'power-assert';
import { validateRegExp, reverse } from '../../src/utils/CommonUtils';

describe('utils', () => {
  describe('validateRegExp()', () => {
    it('returns false if input is empty', () => {
      assert(!validateRegExp(''));
    });

    it('returns false if input is a invalid regular expression', () => {
      assert(!validateRegExp('\\'));
    });

    it('otherwise returns true', () => {
      assert(validateRegExp('foo'));
    });
  });

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
