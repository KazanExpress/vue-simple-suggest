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
  select: Object
}

export function fromPath(obj, path) {
  return path.split('.').reduce((o, i) => (o === Object(o) ? o[i] : o), obj)
}

export function hasKeyCode(arr, event) {
  return hasKeyCodeByCode(arr, event.keyCode)
}

export function hasKeyCodeByCode(arr, keyCode) {
  if (arr.length <= 0) return false

  const has = (arr) => arr.some((code) => code === keyCode)
  if (Array.isArray(arr[0])) {
    return arr.some((array) => has(array))
  } else {
    return has(arr)
  }
}

const onRE = /^on[^a-z]/

export function isOn(key) {
  return onRE.test(key)
}

export function getPropertyByAttribute(obj, attr) {
  return typeof obj !== 'undefined' ? fromPath(obj, attr) : obj
}

export function display(obj, attribute, isPlainSuggestion) {
  if (isPlainSuggestion) {
    return obj
  }

  let display = getPropertyByAttribute(obj, attribute)

  if (typeof display === 'undefined') {
    display = JSON.stringify(obj)

    if (process && ~process.env.NODE_ENV.indexOf('dev')) {
      console.warn(
        '[vue-simple-suggest]: Please, provide `display-attribute` as a key or a dotted path for a property from your object.'
      )
    }
  }

  return String(display || '')
}

const HAS_WINDOW_SUPPORT = typeof window !== 'undefined'

export const requestAF = HAS_WINDOW_SUPPORT
  ? window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    // Fallback, but not a true polyfill
    // Only needed for Opera Mini
    ((cb) => setTimeout(cb, 16))
  : (cb) => setTimeout(cb, 0)
