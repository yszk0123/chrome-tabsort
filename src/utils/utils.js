export const createMapper = (fns, defaultFn = () => null) => {
  return (key) => {
    return fns.hasOwnProperty(key) ? fns[key] : defaultFn
  }
}

// 該当要素を配列の最後尾に移動する
export const moveToTail = (arr, target) => {
  const index = arr.indexOf(target)
  if (index > -1) {
    arr.push(arr.splice(index, 1)[0])
  }
}

export function arrayGroupBy(items, getIndex, maxSize) {
  let dest = []
  dest.length = maxSize
  for (let i = 0; i < maxSize; i += 1) {
    dest[i] = []
  }
  items.forEach((item) => dest[getIndex(item)].push(item))
  return dest
}
