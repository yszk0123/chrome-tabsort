import test from 'tape'
import { reverse } from '../../src/utils/utils'

test('utils', ({ test, end }) => {
  test('reverse()', ({ test, end }) => {
    test('returns an empty array if input is an empty arrray', ({ deepEqual, end }) => {
      deepEqual(reverse([]), [])
      end()
    })

    test('returns reverse array', ({ deepEqual, end }) => {
      deepEqual(reverse([10, 20, 30, 40]), [40, 30, 20, 10])
      end()
    })

    test('returns new array', ({ ok, end }) => {
      const input = [10, 20, 30, 40]
      ok(reverse(input) !== input)
      end()
    })

    end()
  })

  end()
})
