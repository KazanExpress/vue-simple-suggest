export const defaultControls = {
  selectionUp: [38],
  selectionDown: [40],
  select: [13],
  hideList: [27],
  showList: [40],
  autocomplete: [32, 13]
}

export const modes = {
  input: String,
  select: Object,
}

export function fromPath(obj, path) {
  return path.split('.').reduce((o, i) => (o === Object(o) ? o[i] : o), obj)
}

export function hasKeyCode(arr, event) {
  return hasKeyCodeByCode(arr, event.keyCode)
}

export function hasKeyCodeByCode(arr, keyCode) {
  if (arr.length <= 0) return false

  const has = arr => arr.some(code => code === keyCode)
  if (Array.isArray(arr[0])) {
    return arr.some(array => has(array))
  } else {
    return has(arr)
  }
}
