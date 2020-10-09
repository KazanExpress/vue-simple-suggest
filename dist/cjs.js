'use strict';

var defaultControls = {
  selectionUp: [38],
  selectionDown: [40],
  select: [13],
  hideList: [27],
  showList: [40],
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
  return hasKeyCodeByCode(arr, event.keyCode);
}

function hasKeyCodeByCode(arr, keyCode) {
  if (arr.length <= 0) return false;

  var has = function has(arr) {
    return arr.some(function (code) {
      return code === keyCode;
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

function _empty() {}function _awaitIgnored(value, direct) {
  if (!direct) {
    return value && value.then ? value.then(_empty) : Promise.resolve();
  }
}function _invoke(body, then) {
  var result = body();if (result && result.then) {

    return result.then(then);
  }return then(result);
}function _await(value, then, direct) {
  if (direct) {
    return then ? then(value) : value;
  }if (!value || !value.then) {
    value = Promise.resolve(value);
  }return then ? value.then(then) : value;
}function _invokeIgnored(body) {
  var result = body();if (result && result.then) {
    return result.then(_empty);
  }
}function _catch(body, recover) {
  try {
    var result = body();
  } catch (e) {
    return recover(e);
  }if (result && result.then) {
    return result.then(void 0, recover);
  }return result;
}function _finally(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer();
  }if (result && result.then) {
    return result.then(finalizer, finalizer);
  }return finalizer();
}var VueSimpleSuggest = {
  render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-simple-suggest", class: [_vm.styles.vueSimpleSuggest, { designed: !_vm.destyled, focus: _vm.isInFocus }], on: { "keydown": function keydown($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
            return null;
          }_vm.isTabbed = true;
        } } }, [_c('div', { ref: "inputSlot", staticClass: "input-wrapper", class: _vm.styles.inputWrapper, attrs: { "role": "combobox", "aria-haspopup": "listbox", "aria-owns": _vm.listId, "aria-expanded": !!_vm.listShown && !_vm.removeList ? 'true' : 'false' } }, [_vm._t("default", [_c('input', _vm._b({ staticClass: "default-input", class: _vm.styles.defaultInput, domProps: { "value": _vm.text || '' } }, 'input', _vm.$attrs, false))])], 2), _vm._v(" "), _c('transition', { attrs: { "name": "vue-simple-suggest" } }, [!!_vm.listShown && !_vm.removeList ? _c('ul', { staticClass: "suggestions", class: _vm.styles.suggestions, attrs: { "id": _vm.listId, "role": "listbox", "aria-labelledby": _vm.listId } }, [!!this.$scopedSlots['misc-item-above'] ? _c('li', [_vm._t("misc-item-above", null, { "suggestions": _vm.suggestions, "query": _vm.text })], 2) : _vm._e(), _vm._v(" "), _vm._l(_vm.suggestions, function (suggestion, index) {
      return _c('li', { key: _vm.getId(suggestion, index), staticClass: "suggest-item", class: [_vm.styles.suggestItem, {
          selected: _vm.isSelected(suggestion),
          hover: _vm.isHovered(suggestion)
        }], attrs: { "role": "option", "aria-selected": _vm.isHovered(suggestion) || _vm.isSelected(suggestion) ? 'true' : 'false', "id": _vm.getId(suggestion, index) }, on: { "mouseenter": function mouseenter($event) {
            return _vm.hover(suggestion, $event.target);
          }, "mouseleave": function mouseleave($event) {
            return _vm.hover(undefined);
          }, "click": function click($event) {
            return _vm.suggestionClick(suggestion, $event);
          } } }, [_vm._t("suggestion-item", [_c('span', [_vm._v(_vm._s(_vm.displayProperty(suggestion)))])], { "autocomplete": function autocomplete() {
          return _vm.autocompleteText(suggestion);
        }, "suggestion": suggestion, "query": _vm.text })], 2);
    }), _vm._v(" "), !!this.$scopedSlots['misc-item-below'] ? _c('li', [_vm._t("misc-item-below", null, { "suggestions": _vm.suggestions, "query": _vm.text })], 2) : _vm._e()], 2) : _vm._e()])], 1);
  },
  staticRenderFns: [],
  name: 'vue-simple-suggest',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
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
    nullableSelect: {
      type: Boolean,
      default: false
    },
    value: {},
    mode: {
      type: String,
      default: 'input',
      validator: function validator(value) {
        return !!~Object.keys(modes).indexOf(value.toLowerCase());
      }
    }
  },
  // Handle run-time mode changes (now working):
  watch: {
    mode: {
      handler: function handler(current, old) {
        var _this = this;

        this.constructor.options.model.event = current;

        // Can be null if the component is root
        this.$parent && this.$parent.$forceUpdate();

        this.$nextTick(function () {
          if (current === 'input') {
            _this.$emit('input', _this.text);
          } else {
            _this.$emit('select', _this.selected);
          }
        });
      },

      immediate: true
    },
    value: {
      handler: function handler(current) {
        if (typeof current !== 'string') {
          current = this.displayProperty(current);
        }
        this.updateTextOutside(current);
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
      isInFocus: false,
      isFalseFocus: false,
      isTabbed: false,
      controlScheme: {},
      listId: this._uid + '-suggestions'
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
      for (var i = 0; i < this.suggestions.length; i++) {
        var el = this.suggestions[i];
        if (this.hovered && this.valueProperty(this.hovered) == this.valueProperty(el)) {
          return i;
        }
      }
      return -1;
    },
    textLength: function textLength() {
      return this.text && this.text.length || this.inputElement.value.length || 0;
    },
    isSelectedUpToDate: function isSelectedUpToDate() {
      return !!this.selected && this.displayProperty(this.selected) === this.text;
    }
  },
  created: function created() {
    this.controlScheme = Object.assign({}, defaultControls, this.controls);
  },
  mounted: function mounted() {
    this.inputElement = this.$refs['inputSlot'].querySelector('input');

    this.setInputAriaAttributes();
    this.prepareEventHandlers(true);
  },
  beforeDestroy: function beforeDestroy() {
    this.prepareEventHandlers(false);
  },

  methods: {
    isEqual: function isEqual(suggestion, item) {
      return item && this.valueProperty(suggestion) == this.valueProperty(item);
    },
    isSelected: function isSelected(suggestion) {
      return this.isEqual(suggestion, this.selected);
    },
    isHovered: function isHovered(suggestion) {
      return this.isEqual(suggestion, this.hovered);
    },
    setInputAriaAttributes: function setInputAriaAttributes() {
      this.inputElement.setAttribute('aria-activedescendant', '');
      this.inputElement.setAttribute('aria-autocomplete', 'list');
      this.inputElement.setAttribute('aria-controls', this.listId);
    },
    prepareEventHandlers: function prepareEventHandlers(enable) {
      var binder = this[enable ? 'on' : 'off'];
      var keyEventsList = {
        click: this.showSuggestions,
        keydown: this.onKeyDown,
        keyup: this.onListKeyUp
      };
      var eventsList = Object.assign({
        blur: this.onBlur,
        focus: this.onFocus,
        input: this.onInput
      }, keyEventsList);

      for (var event in eventsList) {
        this.input[binder](event, eventsList[event]);
      }

      var listenerBinder = enable ? 'addEventListener' : 'removeEventListener';

      for (var _event in keyEventsList) {
        this.inputElement[listenerBinder](_event, keyEventsList[_event]);
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
      var _this2 = this;

      var slots = ['misc-item-above', 'misc-item-below'].map(function (s) {
        return _this2.$scopedSlots[s];
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
      if (this.isPlainSuggestion) {
        return obj;
      }

      var display = this.getPropertyByAttribute(obj, this.displayAttribute);

      if (typeof display === 'undefined') {
        display = JSON.stringify(obj);

        if (process && ~process.env.NODE_ENV.indexOf('dev')) {
          console.warn('[vue-simple-suggest]: Please, provide `display-attribute` as a key or a dotted path for a property from your object.');
        }
      }

      return String(display || '');
    },
    valueProperty: function valueProperty(obj) {
      if (this.isPlainSuggestion) {
        return obj;
      }

      var value = this.getPropertyByAttribute(obj, this.valueAttribute);

      if (typeof value === 'undefined') {
        console.error('[vue-simple-suggest]: Please, check if you passed \'value-attribute\' (default is \'id\') and \'display-attribute\' (default is \'title\') props correctly.\n        Your list objects should always contain a unique identifier.');
      }

      return value;
    },
    autocompleteText: function autocompleteText(suggestion) {
      this.setText(this.displayProperty(suggestion));
    },
    setText: function setText(text) {
      var _this3 = this;

      this.$nextTick(function () {
        _this3.inputElement.value = text;
        _this3.text = text;
        _this3.$emit('input', text);
      });
    },
    select: function select(item) {
      if (this.selected !== item || this.nullableSelect && !item) {
        this.selected = item;
        this.$emit('select', item);

        if (item) {
          this.autocompleteText(item);
        }
      }

      this.hover(null);
    },
    hover: function hover(item, elem) {
      var elemId = !!item ? this.getId(item, this.hoveredIndex) : '';

      this.inputElement.setAttribute('aria-activedescendant', elemId);

      if (item && item !== this.hovered) {
        this.$emit('hover', item, elem);
      }

      this.hovered = item;
    },
    hideList: function hideList() {
      if (this.listShown) {
        this.listShown = false;
        this.hover(null);
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
    showSuggestions: function showSuggestions() {
      try {
        var _this5 = this;

        return _invoke(function () {
          if (_this5.suggestions.length === 0 && _this5.minLength <= _this5.textLength) {
            // try show misc slots while researching
            _this5.showList();
            return _awaitIgnored(_this5.research());
          }
        }, function () {

          _this5.showList();
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    onShowList: function onShowList(e) {
      if (hasKeyCode(this.controlScheme.showList, e)) {
        this.showSuggestions();
      }
    },
    moveSelection: function moveSelection(e) {
      if (!this.listShown || !this.suggestions.length) return;
      if (hasKeyCode([this.controlScheme.selectionUp, this.controlScheme.selectionDown], e)) {
        e.preventDefault();

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
    onKeyDown: function onKeyDown(e) {
      var select = this.controlScheme.select,
          hideList = this.controlScheme.hideList;

      // prevent form submit on keydown if Enter key registered in the keyup list
      if (e.key === 'Enter' && this.listShown && hasKeyCodeByCode([select, hideList], 13)) {
        e.preventDefault();
      }

      if (e.key === 'Tab' && this.hovered) {
        this.select(this.hovered);
      }

      this.onShowList(e);
      this.moveSelection(e);
      this.onAutocomplete(e);
    },
    onListKeyUp: function onListKeyUp(e) {
      var select = this.controlScheme.select,
          hideList = this.controlScheme.hideList;

      if (this.listShown && hasKeyCode([select, hideList], e)) {
        e.preventDefault();
        if (hasKeyCode(select, e)) {
          this.select(this.hovered);
        }

        this.hideList();
      }
    },
    onAutocomplete: function onAutocomplete(e) {
      if (hasKeyCode(this.controlScheme.autocomplete, e) && (e.ctrlKey || e.shiftKey) && this.suggestions.length > 0 && this.suggestions[0] && this.listShown) {
        e.preventDefault();
        this.hover(this.suggestions[0]);
        this.autocompleteText(this.suggestions[0]);
      }
    },
    suggestionClick: function suggestionClick(suggestion, e) {
      this.$emit('suggestion-click', suggestion, e);
      this.select(suggestion);
      this.hideList();

      /// Ensure, that all needed flags are off before finishing the click.
      this.isClicking = false;
    },
    onBlur: function onBlur(e) {
      var _this6 = this;

      if (this.isInFocus) {

        /// Clicking starts here, because input's blur occurs before the suggestionClick
        /// and exactly when the user clicks the mouse button or taps the screen.
        this.isClicking = this.hovered && !this.isTabbed;

        if (!this.isClicking) {
          this.isInFocus = false;
          this.hideList();

          this.$emit('blur', e);
        } else if (e && e.isTrusted && !this.isTabbed) {
          this.isFalseFocus = true;
          setTimeout(function () {
            _this6.inputElement.focus();
          }, 0);
        }
      } else {
        this.inputElement.blur();
        console.error('This should never happen!\n          If you encountered this error, please make sure that your input component emits \'focus\' events properly.\n          For more info see https://github.com/KazanExpress/vue-simple-suggest#custom-input.\n\n          If your \'vue-simple-suggest\' setup does not include a custom input component - please,\n          report to https://github.com/KazanExpress/vue-simple-suggest/issues/new');
      }

      this.isTabbed = false;
    },
    onFocus: function onFocus(e) {
      this.isInFocus = true; // Only emit, if it was a native input focus
      if (e && !this.isFalseFocus) {
        this.$emit('focus', e);
      }

      // Show list only if the item has not been clicked (isFalseFocus indicates that click was made earlier)
      if (!this.isClicking && !this.isFalseFocus) {
        this.showSuggestions();
      }

      this.isFalseFocus = false;
    },
    onInput: function onInput(inputEvent) {
      var value = !inputEvent.target ? inputEvent : inputEvent.target.value;

      this.updateTextOutside(value);
      this.$emit('input', value);
    },
    updateTextOutside: function updateTextOutside(value) {
      if (this.text === value) {
        return;
      }

      this.text = value;
      if (this.hovered) this.hover(null);

      if (this.text.length < this.minLength) {
        this.hideList();
        return;
      }

      if (this.debounce) {
        clearTimeout(this.timeoutInstance);
        this.timeoutInstance = setTimeout(this.research, this.debounce);
      } else {
        this.research();
      }
    },
    research: function research() {
      try {
        var _this8 = this;

        return _finally(function () {
          return _catch(function () {
            return _invokeIgnored(function () {
              if (_this8.canSend) {
                _this8.canSend = false;
                // @TODO: fix when promises will be cancelable (never :D)
                var textBeforeRequest = _this8.text;
                return _await(_this8.getSuggestions(_this8.text), function (newList) {
                  if (textBeforeRequest === _this8.text) {
                    _this8.$set(_this8, 'suggestions', newList);
                  }
                });
              }
            });
          }, function (e) {
            _this8.clearSuggestions();
            throw e;
          });
        }, function () {
          _this8.canSend = true;

          if (_this8.suggestions.length === 0 && _this8.miscSlotsAreEmpty()) {
            _this8.hideList();
          } else if (_this8.isInFocus) {
            _this8.showList();
          }

          return _this8.suggestions;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    getSuggestions: function getSuggestions(value) {
      try {
        var _this10 = this;

        value = value || '';

        if (value.length < _this10.minLength) {
          return [];
        }

        _this10.selected = null;

        // Start request if can
        if (_this10.listIsRequest) {
          _this10.$emit('request-start', value);
        }

        var result = [];
        return _finally(function () {
          return _catch(function () {
            return _invoke(function () {
              if (_this10.listIsRequest) {
                return _await(_this10.list(value), function (_this9$list) {
                  result = _this9$list || [];
                });
              } else {
                result = _this10.list;
              }
            }, function () {

              // IFF the result is not an array (just in case!) - make it an array
              if (!Array.isArray(result)) {
                result = [result];
              }

              _this10.isPlainSuggestion = _typeof(result[0]) !== 'object' || Array.isArray(result[0]);

              if (_this10.filterByQuery) {
                result = result.filter(function (el) {
                  return _this10.filter(el, value);
                });
              }

              if (_this10.listIsRequest) {
                _this10.$emit('request-done', result);
              }
            });
          }, function (e) {
            if (_this10.listIsRequest) {
              _this10.$emit('request-failed', e);
            } else {
              throw e;
            }
          });
        }, function () {
          if (_this10.maxSuggestions) {
            result.splice(_this10.maxSuggestions);
          }

          return result;
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    clearSuggestions: function clearSuggestions() {
      this.suggestions.splice(0);
    },
    getId: function getId(value, i) {
      return this.listId + '-suggestion-' + (this.isPlainSuggestion ? i : this.valueProperty(value) || i);
    }
  }
};

module.exports = VueSimpleSuggest;
