import assign from 'object-assign'
import { find, flatten, partition } from 'lodash'

const baseGroupProps = {
  priority: 0,
  id: 0,
  name: 'Unnamed',
  rules: [],
  tabsPerWindow: 10,
  position: null
}

export const fixGroupProps = (props) => {
  const fixed = assign({}, baseGroupProps, props)
  embedMatchFunctionIntoRules(fixed.rules)
  return fixed
}

export const groupTabs = (tabs, propsList, defaultGroupProps) => {
  const allTabInfoList = tabs.map((tab) => {
    const groupProps = findTabInGroup(tab, propsList) || defaultGroupProps
    return {
      tabId: tab.id,
      // windowId: tab.windowId,
      groupId: groupProps.id,
      groupProps
    }
  })

  const p = partition(allTabInfoList, (info) => info.groupId)
  const windows = flatten(
      p
      .filter((windows) => windows.length)
      .map((windows) => splitIntoBlock(windows, windows[0].groupProps.tabsPerWindow))
  )

  windows.sort((a, b) => a.priority - b.priority)

  return windows
}

export const executeTabSort = (tabs, propsList) => {
  const windows = groupTabs(tabs, propsList)

  windows.forEach((tabInfoList) => {
    const tabIds = tabInfoList.map((info) => info.tabId)
    const { position } = tabInfoList[0].groupProps
    const data = position ? {
      left: position.x,
      top: position.y,
      width: position.width,
      height: position.height
    } : {}
    chrome.windows.create(data, (wnd) => {
      chrome.tabs.move(tabIds, { windowId: wnd.id, index: 0 })
    })
  })
}

const splitIntoBlock = (array, n) => {
  const block = []
  const blockCount = Math.ceil(array.length / n)
  for (let i = 0; i < blockCount; i += 1) {
    block.push(array.slice(n * i, n * (i + 1)))
  }
  return block
}

const constantFalse = (value) => false

const createMapper = (fns, defaultFn = () => null) => {
  return (key) => {
    return fns.hasOwnProperty(key) ? fns[key] : defaultFn
  }
}

const defaultMatcherGenerator = (value) => constantFalse

const mapRuleTypeToMatcherGenerator = createMapper({
  regexp: (value) => {
    const re = new RegExp(value)
    return (tab) => re.test(tab.url)
  },
  domain: (value) => {
    const re = new RegExp('^https?://' + value)
    return (tab) => re.test(tab.url)
  },
  url: (value) => {
    return (tab) => getBefore(getBefore(tab.url, '?'), '#') === value
  },
  title: (value) => {
    return (tab) => tab.title.indexOf(value) !== -1
  }
}, defaultMatcherGenerator)

const getBefore = (input, mark) => {
  const index = input.indexOf(mark)
  return index < 0 ? input : input.slice(0, index)
}

const embedMatchFunctionIntoRules = (rules) => {
  rules.forEach((rule) => {
    rule.match = mapRuleTypeToMatcherGenerator(rule.type)(rule.value)
  })
}

const findTabInGroup = (tab, propsList) => {
  return find(propsList, (props) => props.rules.some((rule) => rule.match(tab)))
}
