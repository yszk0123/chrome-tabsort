export const get = (key) => {
  const value = localStorage.getItem(key)
  return typeof value === 'string' ? JSON.parse(value) : null
}

export const set = (key, value) => {
  return localStorage.setItem(key, JSON.stringify(value))
}
