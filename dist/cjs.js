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
}
function _await(value, then, direct) {
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
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-simple-suggest", class: [_vm.styles.vueSimpleSuggest, { designed: !_vm.destyled, focus: _vm.isInFocus }], on: { "keydown": function keydown($event) {
          if (!('button' in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
            return null;
          }_vm.isTabbed = true;
        } } }, [_c('div', { ref: "inputSlot", staticClass: "input-wrapper", class: _vm.styles.inputWrapper }, [_vm._t("default", [_c('input', _vm._b({ staticClass: "default-input", class: _vm.styles.defaultInput, domProps: { "value": _vm.text || '' } }, 'input', _vm.$attrs, false))])], 2), _vm._v(" "), _c('transition', { attrs: { "name": "vue-simple-suggest" } }, [!!_vm.listShown && !_vm.removeList ? _c('div', { staticClass: "suggestions", class: _vm.styles.suggestions, on: { "mouseenter": function mouseenter($event) {
          _vm.hoverList(true);
        }, "mouseleave": function mouseleave($event) {
          _vm.hoverList(false);
        } } }, [_vm._t("misc-item-above", null, { suggestions: _vm.suggestions, query: _vm.text }), _vm._v(" "), _vm._l(_vm.suggestions, function (suggestion, index) {
      return _c('div', { key: _vm.isPlainSuggestion ? 'suggestion-' + index : _vm.valueProperty(suggestion), staticClass: "suggest-item", class: [_vm.styles.suggestItem, {
          selected: _vm.selected && _vm.valueProperty(suggestion) == _vm.valueProperty(_vm.selected),
          hover: _vm.hovered && _vm.valueProperty(_vm.hovered) == _vm.valueProperty(suggestion)
        }], on: { "mouseenter": function mouseenter($event) {
            _vm.hover(suggestion, $event.target);
          }, "mouseleave": function mouseleave($event) {
            _vm.hover(null, $event.target);
          }, "click": function click($event) {
            _vm.suggestionClick(suggestion, $event);
          } } }, [_vm._t("suggestion-item", [_c('span', [_vm._v(_vm._s(_vm.displayProperty(suggestion)))])], { autocomplete: function autocomplete() {
          return _vm.autocompleteText(_vm.displayProperty(suggestion));
        }, suggestion: suggestion, query: _vm.text })], 2);
    }), _vm._v(" "), _vm._t("misc-item-below", null, { suggestions: _vm.suggestions, query: _vm.text })], 2) : _vm._e()])], 1);
  },
  staticRenderFns: [],
  name: 'vue-simple-suggest',
  model: {
    prop: 'value',
    get event() {
      return event;
    }
  }, props: {
    styles: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
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
      default: 'title' },
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
  },
  // Handle run-time mode changes (not working):
  watch: {
    mode: {
      handler: function handler(current, old) {
        event = current;
      },

      immediate: true
    },
    value: {
      handler: function handler(current) {
        this.text = current;
      },

      immediate: true
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
    },
    textLength: function textLength() {
      return this.text && this.text.length || this.inputElement.value.length || 0;
    }
  },
  created: function created() {
    this.controlScheme = Object.assign({}, defaultControls, this.controls);
  },
  mounted: function mounted() {
    this.inputElement = this.$refs['inputSlot'].querySelector('input');

    this.prepareEventHandlers(true);
  },
  beforeDestroy: function beforeDestroy() {
    this.prepareEventHandlers(false);
  },

  methods: {
    prepareEventHandlers: function prepareEventHandlers(enable) {
      var _this2 = this;

      var binder = this[enable ? 'on' : 'off'];
      var keyEventsList = {
        click: this.showSuggestions,
        keydown: function keydown($event) {
          return _this2.moveSelection($event), _this2.onAutocomplete($event);
        },
        keyup: this.onListKeyUp
      };
      var eventsList = Object.assign({
        blur: this.onBlur,
        focus: this.onFocus,
        input: this.onInput
      }, keyEventsList);

      for (var _event in eventsList) {
        this.input[binder](_event, eventsList[_event]);
      }

      var listenerBinder = enable ? 'addEventListener' : 'removeEventListener';

      for (var _event2 in keyEventsList) {
        this.inputElement[listenerBinder](_event2, keyEventsList[_event2]);
      }
    },
    isScopedSlotEmpty: function isScopedSlotEmpty(slot) {
      if (slot) {
        var vNode = slot(this);
        return !(Array.isArray(vNode) || vNode && (vNode.tag || vNode.context || vNode.text || vNode.children));
      }

      return true;
    },
    miscSlotsAreEmpty: function miscSlotsAreEmpty() {
      var _this3 = this;

      var slots = ['misc-item-above', 'misc-item-below'].map(function (s) {
        return _this3.$scopedSlots[s];
      });

      if (slots.every(function (s) {
        return !!s;
      })) {
        return slots.every(this.isScopedSlotEmpty.bind(this));
      }

      var slot = slots.find(function (s) {
        return !!s;
      });

      return this.isScopedSlotEmpty.call(this, slot);
    },
    getPropertyByAttribute: function getPropertyByAttribute(obj, attr) {
      return this.isPlainSuggestion ? obj : (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== undefined ? fromPath(obj, attr) : obj;
    },
    displayProperty: function displayProperty(obj) {
      return String(this.getPropertyByAttribute(obj, this.displayAttribute));
    },
    valueProperty: function valueProperty(obj) {
      return this.getPropertyByAttribute(obj, this.valueAttribute);
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
        if (this.textLength >= this.minLength && (this.suggestions.length > 0 || !this.miscSlotsAreEmpty())) {
          this.listShown = true;
          this.$emit('show-list');
        }
      }
    },
    showSuggestions: _async(function () {
      var _this4 = this;

      return _invoke(function () {
        if (_this4.suggestions.length === 0 && _this4.minLength === _this4.textLength) {
          return _awaitIgnored(_this4.research());
        }
      }, function () {
        _this4.showList();
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
        } else if (e && e.isTrusted && !this.isTabbed) {
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
      if (e && e.sourceCapabilities) {
        this.$emit('focus', e);
      }

      // Show list only if the item has not been clicked
      if (!this.isClicking) {
        this.showSuggestions();
      }
    },
    onInput: function onInput(inputEvent) {
      var value = !inputEvent.target ? inputEvent : inputEvent.target.value;

      if (this.text === value) {
        return;
      }

      this.text = value;
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
      var _this5 = this;

      return _finally(function () {
        return _catch(function () {
          return _invokeIgnored(function () {
            if (_this5.canSend) {
              _this5.canSend = false;
              var _$set = _this5.$set;
              return _await(_this5.getSuggestions(_this5.text), function (_this5$getSuggestions) {
                _$set.call(_this5, _this5, 'suggestions', _this5$getSuggestions);
              });
            }
          });
        }, function (e) {
          _this5.clearSuggestions();
          throw e;
        });
      }, function () {
        _this5.canSend = true;

        if (_this5.suggestions.length === 0 && _this5.miscSlotsAreEmpty()) {
          _this5.hideList();
        } else {
          _this5.showList();
        }

        return _this5.suggestions;
      });
    }),
    getSuggestions: _async(function (value) {
      var _this6 = this;

      value = value || '';

      if (value.length < _this6.minLength) {
        if (_this6.listShown) {
          _this6.hideList();
          return [];
        }

        return _this6.suggestions;
      }

      _this6.selected = null;

      // Start request if can
      if (_this6.listIsRequest) {
        _this6.$emit('request-start', value);

        if (_this6.suggestions.length > 0 || !_this6.miscSlotsAreEmpty()) {
          _this6.showList();
        }
      }

      var result = [];
      return _finally(function () {
        return _catch(function () {
          return _invoke(function () {
            if (_this6.listIsRequest) {
              return _await(_this6.list(value), function (_this6$list) {
                result = _this6$list || [];
              });
            } else {
              result = _this6.list;
            }
          }, function () {
            // IFF the result is not an array (just in case!) - make it an array
            if (!Array.isArray(result)) {
              result = [result];
            }

            _this6.isPlainSuggestion = _typeof(result[0]) !== 'object' || Array.isArray(result[0]);

            if (_this6.filterByQuery) {
              result = result.filter(function (el) {
                return _this6.filter(el, value);
              });
            }

            if (_this6.listIsRequest) {
              _this6.$emit('request-done', result);
            }
          });
        }, function (e) {
          if (_this6.listIsRequest) {
            _this6.$emit('request-failed', e);
          } else {
            throw e;
          }
        });
      }, function () {
        if (_this6.maxSuggestions) {
          result.splice(_this6.maxSuggestions);
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
