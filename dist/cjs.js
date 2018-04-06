'use strict';

var defaultControls = {
  selectionUp: [38],
  selectionDown: [40],
  select: [13],
  hideList: [27],
  autocomplete: [32, 13]
};

var modes = {
  input: String,
  select: Object
};

var inputProp = {
  type: String
};

var inputProps = {
  type: inputProp,
  accesskey: inputProp,
  autocomplete: inputProp,
  form: inputProp,
  formaction: inputProp,
  formenctype: inputProp,
  formmethod: inputProp,
  formtarget: inputProp,
  height: inputProp,
  width: inputProp,
  inputmode: inputProp,
  max: inputProp,
  min: inputProp,
  minlength: inputProp,
  maxlength: inputProp,
  name: inputProp,
  pattern: inputProp,
  placeholder: inputProp,
  selectionDirection: inputProp,
  selectionEnd: inputProp,
  selectionStart: inputProp,
  size: inputProp,
  src: inputProp,
  step: inputProp,
  tabindex: inputProp,
  title: inputProp,
  spellcheck: {},
  readonly: {},
  required: {},
  multiple: {},
  formnovalidate: {},
  autofocus: {},
  checked: {},
  disabled: {}
};

function fromPath(obj, path) {
  return path.split('.').reduce(function (o, i) {
    return o === Object(o) ? o[i] : o;
  }, obj);
}

function hasKeyCode(arr, event) {
  if (arr.length <= 0) return false;

  var has = function has(arr) {
    return arr.some(function (code) {
      return code === event.keyCode;
    });
  };
  if (Array.isArray(arr[0])) {
    return arr.some(function (array) {
      return has(array);
    });
  } else {
    return has(arr);
  }
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function _finally(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer();
  }if (result && result.then) {
    return result.then(finalizer, finalizer);
  }return finalizer();
}function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }if (result && result.then) {
    return result.then(void 0, recover);
  }return result;
}function _invokeIgnored(body) {
  var result = body();if (result && result.then) {
    return result.then(_empty);
  }
}function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }value = Promise.resolve(value);return then ? value.then(then) : value;
}var _async = function () {
  try {
    if (isNaN.apply(null, {})) {
      return function (f) {
        return function () {
          try {
            return Promise.resolve(f.apply(this, arguments));
          } catch (e) {
            return Promise.reject(e);
          }
        };
      };
    }
  } catch (e) {}return function (f) {
    // Pre-ES5.1 JavaScript runtimes don't accept array-likes in Function.apply
    return function () {
      try {
        return Promise.resolve(f.apply(this, Array.prototype.slice.call(arguments)));
      } catch (e) {
        return Promise.reject(e);
      }
    };
  };
}();function _invoke(body, then) {
  var result = body();if (result && result.then) {
    return result.then(then);
  }return then(result);
}function _awaitIgnored(value, direct) {
  if (!direct) {
    return Promise.resolve(value).then(_empty);
  }
}function _empty() {}
var event = 'input';

var VueSimpleSuggest = {
  render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-simple-suggest", class: { designed: !_vm.destyled, focus: _vm.isInFocus }, on: { "keydown": function keydown($event) {
          if (!('button' in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
            return null;
          }_vm.isTabbed = true;
        } } }, [_c('div', { ref: "inputSlot", staticClass: "input-wrapper", on: { "click": _vm.showSuggestions, "input": _vm.onInput, "keydown": function keydown($event) {
          _vm.moveSelection($event), _vm.onAutocomplete($event);
        }, "keyup": _vm.onListKeyUp } }, [_vm._t("default", [_c('input', _vm._b({ staticClass: "default-input", domProps: { "value": _vm.text || '' } }, 'input', _vm.$props, false))])], 2), _vm._v(" "), !!_vm.listShown && !_vm.removeList ? _c('div', { staticClass: "suggestions", on: { "mouseenter": function mouseenter($event) {
          _vm.hoverList(true);
        }, "mouseleave": function mouseleave($event) {
          _vm.hoverList(false);
        } } }, [_vm._t("misc-item-above", null, { suggestions: _vm.suggestions, query: _vm.text }), _vm._v(" "), _vm._l(_vm.suggestions, function (suggestion, index) {
      return _c('div', { key: _vm.isPlainSuggestion ? 'suggestion-' + index : _vm.valueProperty(suggestion), staticClass: "suggest-item", class: {
          selected: _vm.selected && _vm.valueProperty(suggestion) == _vm.valueProperty(_vm.selected),
          hover: _vm.hovered && _vm.valueProperty(_vm.hovered) == _vm.valueProperty(suggestion)
        }, on: { "mouseenter": function mouseenter($event) {
            _vm.hover(suggestion, $event.target);
          }, "mouseleave": function mouseleave($event) {
            _vm.hover(null, $event.target);
          }, "click": function click($event) {
            _vm.suggestionClick(suggestion, $event);
          } } }, [_vm._t("suggestion-item", [_c('span', [_vm._v(_vm._s(_vm.displayProperty(suggestion)))])], { autocomplete: function autocomplete() {
          return _vm.autocompleteText(suggestion);
        }, suggestion: suggestion, query: _vm.text })], 2);
    }), _vm._v(" "), _vm._t("misc-item-below", null, { suggestions: _vm.suggestions, query: _vm.text })], 2) : _vm._e()]);
  },
  staticRenderFns: [],
  name: 'vue-simple-suggest',
  model: {
    prop: 'value',
    get event() {
      return event;
    }
  },
  props: Object.assign({}, inputProps, {
    controls: {
      type: Object,
      default: function _default() {
        return defaultControls;
      }
    },
    minLength: {
      type: Number,
      default: 1
    },
    maxSuggestions: {
      type: Number,
      default: 10
    },
    displayAttribute: {
      type: String,
      default: 'title'
    },
    valueAttribute: {
      type: String,
      default: 'id'
    },
    list: {
      type: [Function, Array],
      default: function _default() {
        return [];
      }
    },
    removeList: {
      type: Boolean,
      default: false
    },
    destyled: {
      type: Boolean,
      default: false
    },
    filterByQuery: {
      type: Boolean,
      default: false
    },
    filter: {
      type: Function,
      default: function _default(el, value) {
        return value ? ~this.displayProperty(el).toLowerCase().indexOf(value.toLowerCase()) : true;
      }
    },
    debounce: {
      type: Number,
      default: 0
    },
    value: {},
    mode: {
      type: String,
      default: event,
      validator: function validator(value) {
        return !!~Object.keys(modes).indexOf(value.toLowerCase());
      }
    }
  }),
  // Handle run-time mode changes:
  watch: {
    mode: function mode(v) {
      return event = v;
    }
  },
  //
  data: function data() {
    return {
      selected: null,
      hovered: null,
      suggestions: [],
      listShown: false,
      inputElement: null,
      canSend: true,
      timeoutInstance: null,
      text: this.value,
      isPlainSuggestion: false,
      isClicking: false,
      isOverList: false,
      isInFocus: false,
      isTabbed: false,
      controlScheme: {}
    };
  },

  computed: {
    listIsRequest: function listIsRequest() {
      return typeof this.list === 'function';
    },
    inputIsComponent: function inputIsComponent() {
      return this.$slots.default && this.$slots.default.length > 0 && !!this.$slots.default[0].componentInstance;
    },
    input: function input() {
      return this.inputIsComponent ? this.$slots.default[0].componentInstance : this.inputElement;
    },
    on: function on() {
      return this.inputIsComponent ? '$on' : 'addEventListener';
    },
    off: function off() {
      return this.inputIsComponent ? '$off' : 'removeEventListener';
    },
    hoveredIndex: function hoveredIndex() {
      var _this = this;

      return this.suggestions.findIndex(function (el) {
        return _this.hovered && _this.valueProperty(_this.hovered) == _this.valueProperty(el);
      });
    }
  },
  created: function created() {
    this.controlScheme = Object.assign({}, defaultControls, this.controls);
    event = this.mode;
  },
  mounted: function mounted() {
    this.inputElement = this.$refs['inputSlot'].querySelector('input');
    this.input[this.on]('blur', this.onBlur);
    this.input[this.on]('focus', this.onFocus);
  },
  beforeDestroy: function beforeDestroy() {
    this.input[this.off]('blur', this.onBlur);
    this.input[this.off]('focus', this.onFocus);
  },

  methods: {
    isScopedSlotEmpty: function isScopedSlotEmpty(slot) {
      return slot && typeof slot === 'function' ? !slot(this) : !slot;
    },
    miscSlotsAreEmpty: function miscSlotsAreEmpty() {
      var _this2 = this;

      return ['above', 'below'].some(function (slotName) {
        return _this2.isScopedSlotEmpty(_this2.$scopedSlots['misc-item-' + slotName]);
      });
    },
    displayProperty: function displayProperty(obj) {
      return (this.isPlainSuggestion ? obj : fromPath(obj, this.displayAttribute)) + '';
    },
    valueProperty: function valueProperty(obj) {
      return this.isPlainSuggestion ? obj : fromPath(obj, this.valueAttribute);
    },
    autocompleteText: function autocompleteText(text) {
      this.$emit('input', text);
      this.inputElement.value = text;
      this.text = text;
    },
    select: function select(item) {
      this.hovered = null;
      this.selected = item;

      this.$emit('select', item);

      this.autocompleteText(this.displayProperty(item));
    },
    hover: function hover(item, elem) {
      this.hovered = item;

      if (this.hovered != null) {
        this.$emit('hover', item, elem);
      }
    },
    hoverList: function hoverList(isOverList) {
      this.isOverList = isOverList;
    },
    hideList: function hideList() {
      if (this.listShown) {
        this.listShown = false;
        this.$emit('hide-list');
      }
    },
    showList: function showList() {
      if (!this.listShown) {
        var textLength = this.text && this.text.length || 0;
        if (textLength >= this.minLength && (this.suggestions.length > 0 || !this.miscSlotsAreEmpty())) {
          this.listShown = true;
          this.$emit('show-list');
        }
      }
    },
    showSuggestions: _async(function () {
      var _this3 = this;

      return _invoke(function () {
        if (_this3.suggestions.length === 0 && _this3.minLength === 0 && !_this3.text) {
          return _awaitIgnored(_this3.research());
        }
      }, function () {
        _this3.showList();
      });
    }),
    moveSelection: function moveSelection(e) {
      if (hasKeyCode([this.controlScheme.selectionUp, this.controlScheme.selectionDown], e)) {
        e.preventDefault();
        this.showSuggestions();

        var isMovingDown = hasKeyCode(this.controlScheme.selectionDown, e);
        var direction = isMovingDown * 2 - 1;
        var listEdge = isMovingDown ? 0 : this.suggestions.length - 1;
        var hoversBetweenEdges = isMovingDown ? this.hoveredIndex < this.suggestions.length - 1 : this.hoveredIndex > 0;

        var item = null;

        if (!this.hovered) {
          item = this.selected || this.suggestions[listEdge];
        } else if (hoversBetweenEdges) {
          item = this.suggestions[this.hoveredIndex + direction];
        } else /* if hovers on edge */{
            item = this.suggestions[listEdge];
          }

        this.hover(item);
      }
    },
    onListKeyUp: function onListKeyUp(e) {
      var select = this.controlScheme.select,
          hideList = this.controlScheme.hideList;

      if (hasKeyCode([select, hideList], e)) {
        e.preventDefault();
        if (this.listShown) {
          if (hasKeyCode(select, e) && this.hovered) {
            this.select(this.hovered);
          }

          this.hideList();
        } else if (hasKeyCode(select, e)) {
          this.research();
        }
      }
    },
    onAutocomplete: function onAutocomplete(e) {
      if (hasKeyCode(this.controlScheme.autocomplete, e) && (e.ctrlKey || e.shiftKey) && this.suggestions.length > 0 && this.suggestions[0] && this.listShown) {
        e.preventDefault();
        this.hover(this.suggestions[0]);
        this.autocompleteText(this.displayProperty(this.suggestions[0]));
      }
    },
    suggestionClick: function suggestionClick(suggestion, e) {
      this.$emit('suggestion-click', suggestion, e);
      this.select(suggestion);
      this.hideList();

      /// Ensure, that all needed flags are off before finishing the click.
      this.isClicking = this.isOverList = false;
    },
    onBlur: function onBlur(e) {
      if (this.isInFocus) {

        /// Clicking starts here, because input's blur occurs before the suggestionClick
        /// and exactly when the user clicks the mouse button or taps the screen.
        this.isClicking = this.isOverList && !this.isTabbed;

        if (!this.isClicking) {
          this.isInFocus = false;
          this.hideList();

          this.$emit('blur', e);
        } else if (e.isTrusted && !this.isTabbed) {
          this.inputElement.focus();
        }
      } else {
        this.inputElement.blur();
        console.error('This should never happen!\n          If you encouneterd this error, please report at https://github.com/KazanExpress/vue-simple-suggest/issues');
      }

      this.isTabbed = false;
    },
    onFocus: function onFocus(e) {
      this.isInFocus = true;

      // Only emit, if it was a native input focus
      if (e.sourceCapabilities) {
        this.$emit('focus', e);
      }

      // Show list only if the item has not been clicked
      if (!this.isClicking) {
        this.showList();
      }
    },
    onInput: function onInput(inputEvent) {
      this.text = inputEvent.target.value;
      this.$emit('input', this.text);

      if (this.selected) {
        this.selected = null;
        this.$emit('select', null);
      }

      if (this.debounce) {
        clearTimeout(this.timeoutInstance);
        this.timeoutInstance = setTimeout(this.research, this.debounce);
      } else {
        this.research();
      }
    },
    research: _async(function () {
      var _this4 = this;

      return _finally(function () {
        return _catch(function () {
          return _invokeIgnored(function () {
            if (_this4.canSend) {
              _this4.canSend = false;
              var _$set = _this4.$set;
              return _await(_this4.getSuggestions(_this4.text), function (_this4$getSuggestions) {
                _$set.call(_this4, _this4, 'suggestions', _this4$getSuggestions);
                _this4.canSend = true;
              });
            }
          });
        }, function (e) {
          _this4.clearSuggestions();
          throw e;
        });
      }, function () {
        if (_this4.suggestions.length === 0 && _this4.miscSlotsAreEmpty()) {
          _this4.hideList();
        } else {
          _this4.showList();
        }

        return _this4.suggestions;
      });
    }),
    getSuggestions: _async(function () {
      var _this5 = this;

      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (_this5.listShown && !value) {
        _this5.hideList();
        _this5.clearSuggestions();
        return _this5.suggestions;
      }

      if (_this5.minLength > 0 && value.length < _this5.minLength) {
        return _this5.suggestions;
      }

      _this5.selected = null;

      // Start request if can
      if (_this5.listIsRequest) {
        _this5.$emit('request-start', value);
      }

      var result = [];
      return _finally(function () {
        return _catch(function () {
          return _invoke(function () {
            if (_this5.listIsRequest) {
              return _await(_this5.list(value), function (_this5$list) {
                result = _this5$list || [];
              });
            } else {
              result = _this5.list;
            }
          }, function () {
            // IFF the result is not an array (just in case!) - make it an array
            if (!Array.isArray(result)) {
              result = [result];
            }

            _this5.isPlainSuggestion = _typeof(result[0]) !== 'object' || Array.isArray(result[0]);

            if (_this5.filterByQuery) {
              result = result.filter(function (el) {
                return _this5.filter(el, value);
              });
            }

            if (_this5.listIsRequest) {
              _this5.$emit('request-done', result);
            }
          });
        }, function (e) {
          if (_this5.listIsRequest) {
            _this5.$emit('request-failed', e);
          } else {
            throw e;
          }
        });
      }, function () {
        if (_this5.maxSuggestions) {
          result.splice(_this5.maxSuggestions);
        }

        return result;
      });
    }),
    clearSuggestions: function clearSuggestions() {
      this.suggestions.splice(0);
    }
  }
};

module.exports = VueSimpleSuggest;
