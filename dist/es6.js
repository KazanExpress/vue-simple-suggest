const defaultControls = {
  selectionUp: [38],
  selectionDown: [40],
  select: [13],
  hideList: [27],
  autocomplete: [32, 13]
};

const modes = {
  input: String,
  select: Object
};

function fromPath(obj, path) {
  return path.split('.').reduce((o, i) => o === Object(o) ? o[i] : o, obj);
}

function hasKeyCode(arr, event) {
  if (arr.length <= 0) return false;

  const has = arr => arr.some(code => code === event.keyCode);
  if (Array.isArray(arr[0])) {
    return arr.some(array => has(array));
  } else {
    return has(arr);
  }
}

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
}const _async = function () {
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
let event = 'input';

var VueSimpleSuggest = {
  render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-simple-suggest", class: [_vm.styles.vueSimpleSuggest, { designed: !_vm.destyled, focus: _vm.isInFocus }], on: { "keydown": function ($event) {
          if (!('button' in $event) && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
            return null;
          }_vm.isTabbed = true;
        } } }, [_c('div', { ref: "inputSlot", staticClass: "input-wrapper", class: _vm.styles.inputWrapper }, [_vm._t("default", [_c('input', _vm._b({ staticClass: "default-input", class: _vm.styles.defaultInput, domProps: { "value": _vm.text || '' } }, 'input', _vm.$attrs, false))])], 2), _vm._v(" "), _c('transition', { attrs: { "name": "vue-simple-suggest" } }, [!!_vm.listShown && !_vm.removeList ? _c('div', { staticClass: "suggestions", class: _vm.styles.suggestions, on: { "mouseenter": function ($event) {
          _vm.hoverList(true);
        }, "mouseleave": function ($event) {
          _vm.hoverList(false);
        } } }, [_vm._t("misc-item-above", null, { suggestions: _vm.suggestions, query: _vm.text }), _vm._v(" "), _vm._l(_vm.suggestions, function (suggestion, index) {
      return _c('div', { key: _vm.isPlainSuggestion ? 'suggestion-' + index : _vm.valueProperty(suggestion), staticClass: "suggest-item", class: [_vm.styles.suggestItem, {
          selected: _vm.selected && _vm.valueProperty(suggestion) == _vm.valueProperty(_vm.selected),
          hover: _vm.hovered && _vm.valueProperty(_vm.hovered) == _vm.valueProperty(suggestion)
        }], on: { "mouseenter": function ($event) {
            _vm.hover(suggestion, $event.target);
          }, "mouseleave": function ($event) {
            _vm.hover(null, $event.target);
          }, "click": function ($event) {
            _vm.suggestionClick(suggestion, $event);
          } } }, [_vm._t("suggestion-item", [_c('span', [_vm._v(_vm._s(_vm.displayProperty(suggestion)))])], { autocomplete: function () {
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
      default: () => ({})
    },
    controls: {
      type: Object,
      default: () => defaultControls
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
      default: () => []
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
      default(el, value) {
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
      validator: value => !!~Object.keys(modes).indexOf(value.toLowerCase())
    }
  },
  // Handle run-time mode changes (not working):
  watch: {
    mode: {
      handler(current, old) {
        event = current;
      },
      immediate: true
    },
    value: {
      handler(current) {
        this.text = current;
      },
      immediate: true
    }
  },
  //
  data() {
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
    listIsRequest() {
      return typeof this.list === 'function';
    },
    inputIsComponent() {
      return this.$slots.default && this.$slots.default.length > 0 && !!this.$slots.default[0].componentInstance;
    },
    input() {
      return this.inputIsComponent ? this.$slots.default[0].componentInstance : this.inputElement;
    },
    on() {
      return this.inputIsComponent ? '$on' : 'addEventListener';
    },
    off() {
      return this.inputIsComponent ? '$off' : 'removeEventListener';
    },
    hoveredIndex() {
      return this.suggestions.findIndex(el => this.hovered && this.valueProperty(this.hovered) == this.valueProperty(el));
    },
    textLength() {
      return this.text && this.text.length || this.inputElement.value.length || 0;
    }
  },
  created() {
    this.controlScheme = Object.assign({}, defaultControls, this.controls);
  },
  mounted() {
    this.inputElement = this.$refs['inputSlot'].querySelector('input');

    this.prepareEventHandlers(true);
  },
  beforeDestroy() {
    this.prepareEventHandlers(false);
  },
  methods: {
    prepareEventHandlers(enable) {
      const binder = this[enable ? 'on' : 'off'];
      const keyEventsList = {
        click: this.showSuggestions,
        keydown: $event => (this.moveSelection($event), this.onAutocomplete($event)),
        keyup: this.onListKeyUp
      };
      const eventsList = Object.assign({
        blur: this.onBlur,
        focus: this.onFocus,
        input: this.onInput
      }, keyEventsList);

      for (const event in eventsList) {
        this.input[binder](event, eventsList[event]);
      }

      const listenerBinder = enable ? 'addEventListener' : 'removeEventListener';

      for (const event in keyEventsList) {
        this.inputElement[listenerBinder](event, keyEventsList[event]);
      }
    },
    isScopedSlotEmpty(slot) {
      if (slot) {
        const vNode = slot(this);
        return !(Array.isArray(vNode) || vNode && (vNode.tag || vNode.context || vNode.text || vNode.children));
      }

      return true;
    },
    miscSlotsAreEmpty() {
      const slots = ['misc-item-above', 'misc-item-below'].map(s => this.$scopedSlots[s]);

      if (slots.every(s => !!s)) {
        return slots.every(this.isScopedSlotEmpty.bind(this));
      }

      const slot = slots.find(s => !!s);

      return this.isScopedSlotEmpty.call(this, slot);
    },
    getPropertyByAttribute(obj, attr) {
      return this.isPlainSuggestion ? obj : typeof obj !== undefined ? fromPath(obj, attr) : obj;
    },
    displayProperty(obj) {
      return String(this.getPropertyByAttribute(obj, this.displayAttribute));
    },
    valueProperty(obj) {
      return this.getPropertyByAttribute(obj, this.valueAttribute);
    },
    autocompleteText(text) {
      this.$emit('input', text);
      this.inputElement.value = text;
      this.text = text;
    },
    select(item) {
      this.hovered = null;
      this.selected = item;

      this.$emit('select', item);

      this.autocompleteText(this.displayProperty(item));
    },
    hover(item, elem) {
      this.hovered = item;

      if (this.hovered != null) {
        this.$emit('hover', item, elem);
      }
    },
    hoverList(isOverList) {
      this.isOverList = isOverList;
    },
    hideList() {
      if (this.listShown) {
        this.listShown = false;
        this.$emit('hide-list');
      }
    },
    showList() {
      if (!this.listShown) {
        if (this.textLength >= this.minLength && (this.suggestions.length > 0 || !this.miscSlotsAreEmpty())) {
          this.listShown = true;
          this.$emit('show-list');
        }
      }
    },
    showSuggestions: _async(function () {
      var _this = this;

      return _invoke(function () {
        if (_this.suggestions.length === 0 && _this.minLength === _this.textLength) {
          return _awaitIgnored(_this.research());
        }
      }, function () {
        _this.showList();
      });
    }),

    moveSelection(e) {
      if (hasKeyCode([this.controlScheme.selectionUp, this.controlScheme.selectionDown], e)) {
        e.preventDefault();
        this.showSuggestions();

        const isMovingDown = hasKeyCode(this.controlScheme.selectionDown, e);
        const direction = isMovingDown * 2 - 1;
        const listEdge = isMovingDown ? 0 : this.suggestions.length - 1;
        const hoversBetweenEdges = isMovingDown ? this.hoveredIndex < this.suggestions.length - 1 : this.hoveredIndex > 0;

        let item = null;

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
    onListKeyUp(e) {
      const select = this.controlScheme.select,
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
    onAutocomplete(e) {
      if (hasKeyCode(this.controlScheme.autocomplete, e) && (e.ctrlKey || e.shiftKey) && this.suggestions.length > 0 && this.suggestions[0] && this.listShown) {
        e.preventDefault();
        this.hover(this.suggestions[0]);
        this.autocompleteText(this.displayProperty(this.suggestions[0]));
      }
    },
    suggestionClick(suggestion, e) {
      this.$emit('suggestion-click', suggestion, e);
      this.select(suggestion);
      this.hideList();

      /// Ensure, that all needed flags are off before finishing the click.
      this.isClicking = this.isOverList = false;
    },
    onBlur(e) {
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
        console.error(`This should never happen!
          If you encouneterd this error, please report at https://github.com/KazanExpress/vue-simple-suggest/issues`);
      }

      this.isTabbed = false;
    },
    onFocus(e) {
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
    onInput(inputEvent) {
      const value = !inputEvent.target ? inputEvent : inputEvent.target.value;

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
      var _this2 = this;

      return _finally(function () {
        return _catch(function () {
          return _invokeIgnored(function () {
            if (_this2.canSend) {
              _this2.canSend = false;
              var _$set = _this2.$set;
              return _await(_this2.getSuggestions(_this2.text), function (_this2$getSuggestions) {
                _$set.call(_this2, _this2, 'suggestions', _this2$getSuggestions);
              });
            }
          });
        }, function (e) {
          _this2.clearSuggestions();
          throw e;
        });
      }, function () {
        _this2.canSend = true;

        if (_this2.suggestions.length === 0 && _this2.miscSlotsAreEmpty()) {
          _this2.hideList();
        } else {
          _this2.showList();
        }

        return _this2.suggestions;
      });
    }),
    getSuggestions: _async(function (value) {
      var _this3 = this;

      value = value || '';

      if (value.length < _this3.minLength) {
        if (_this3.listShown) {
          _this3.hideList();
          return [];
        }

        return _this3.suggestions;
      }

      _this3.selected = null;

      // Start request if can
      if (_this3.listIsRequest) {
        _this3.$emit('request-start', value);

        if (_this3.suggestions.length > 0 || !_this3.miscSlotsAreEmpty()) {
          _this3.showList();
        }
      }

      let result = [];
      return _finally(function () {
        return _catch(function () {
          return _invoke(function () {
            if (_this3.listIsRequest) {
              return _await(_this3.list(value), function (_this3$list) {
                result = _this3$list || [];
              });
            } else {
              result = _this3.list;
            }
          }, function () {
            // IFF the result is not an array (just in case!) - make it an array
            if (!Array.isArray(result)) {
              result = [result];
            }

            _this3.isPlainSuggestion = typeof result[0] !== 'object' || Array.isArray(result[0]);

            if (_this3.filterByQuery) {
              result = result.filter(el => _this3.filter(el, value));
            }

            if (_this3.listIsRequest) {
              _this3.$emit('request-done', result);
            }
          });
        }, function (e) {
          if (_this3.listIsRequest) {
            _this3.$emit('request-failed', e);
          } else {
            throw e;
          }
        });
      }, function () {
        if (_this3.maxSuggestions) {
          result.splice(_this3.maxSuggestions);
        }

        return result;
      });
    }),

    clearSuggestions() {
      this.suggestions.splice(0);
    }
  }
};

export default VueSimpleSuggest;
