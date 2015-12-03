import test from 'tape'
import { getTabsNeedToBeSorted } from '../../src/utils/backgroundUtils'

test('background', ({ test, end }) => {
  test('getTabsNeedToBeSorted()', ({ test, end }) => {
    test('include only normal windows', ({ ok, end }) => {
      const windows = [
        { type: 'normal', tabs: [{ id: 1, url: 'http://a.com/1' }] },
        { type: 'popup', tabs: [{ id: 2, url: 'http://b.com/2' }] },
        { type: 'panel', tabs: [{ id: 3, url: 'http://c.com/3' }] },
        { type: 'app', tabs: [{ id: 4, url: 'http://d.com/4' }] },
        { type: 'devtools', tabs: [{ id: 5, url: 'http://e.com/4' }] }
      ]

      const result = getTabsNeedToBeSorted(windows)
      console.log(result)
      ok(result.length === 1)
      ok(result[0].id === 1)

      end()
    })

    test('returns only id and url', ({ deepEqual, end }) => {
      const windows = [
        { type: 'normal', tabs: [{ id: 1, url: 'http://a.com/1' }] },
        { type: 'normal', tabs: [{ id: 2, url: 'http://b.com/2', foo: 3 }] }
      ]

      deepEqual(getTabsNeedToBeSorted(windows), [
        { id: 1, url: 'http://a.com/1' },
        { id: 2, url: 'http://b.com/2' }
      ])

      end()
    })

    end()
  })

  end()
})
