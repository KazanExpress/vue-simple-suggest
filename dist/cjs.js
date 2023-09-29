'use strict';

var vue = require('vue');

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

var onRE = /^on[^a-z]/;

function isOn(key) {
  return onRE.test(key);
}

function getPropertyByAttribute(obj, attr) {
  return typeof obj !== 'undefined' ? fromPath(obj, attr) : obj;
}

function display(obj, attribute, isPlainSuggestion) {
  if (isPlainSuggestion) {
    return obj;
  }

  var display = getPropertyByAttribute(obj, attribute);

  if (typeof display === 'undefined') {
    display = JSON.stringify(obj);

    if (process && ~process.env.NODE_ENV.indexOf('dev')) {
      console.warn('[vue-simple-suggest]: Please, provide `display-attribute` as a key or a dotted path for a property from your object.');
    }
  }

  return String(display || '');
}

var HAS_WINDOW_SUPPORT = typeof window !== 'undefined';

var requestAF = HAS_WINDOW_SUPPORT ? window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
// Fallback, but not a true polyfill
// Only needed for Opera Mini
function (cb) {
  return setTimeout(cb, 16);
} : function (cb) {
  return setTimeout(cb, 0);
};

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
}var script = {
  name: 'vue-simple-suggest',
  inheritAttrs: false,
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
      type: Function
    },
    debounce: {
      type: Number,
      default: 0
    },
    nullableSelect: {
      type: Boolean,
      default: false
    },
    modelValue: {},
    modelSelect: {},
    mode: {
      type: String,
      default: 'input',
      validator: function validator(value) {
        return !!~Object.keys(modes).indexOf(value.toLowerCase());
      }
    },
    preventHide: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    mode: {
      handler: function handler() {
        var _this = this;

        // Can be null if the component is root
        this.$parent && this.$parent.$forceUpdate();

        this.$nextTick(function () {
          _this.$emit('update:modelValue', _this.text);
          _this.$emit('update:modelSelect', _this.selected);
          // For backward compatibility:
          _this.$emit('select', _this.selected);
        });
      },

      immediate: true
    },
    filter: {
      handler: function handler(current) {
        var _this2 = this;

        this.filterResult = current != null ? current : function (el, value) {
          return value ? ~display(el, _this2.displayAttribute).toLowerCase().indexOf(value.toLowerCase()) : true;
        };
      },

      immediate: true
    },
    modelValue: {
      handler: function handler(current) {
        if (this.mode === 'input') {
          if (typeof current !== 'string') {
            current = this.displayProperty(current);
          }
          this.updateTextOutside(current);
        }
      },

      immediate: true
    },
    modelSelect: {
      handler: function handler(current) {
        if (this.mode === 'select') {
          if (typeof current !== 'string') {
            current = this.displayProperty(current);
          }
          this.updateTextOutside(current);
        }
      },

      immediate: true
    }
  },
  //
  data: function data(vm) {
    return {
      filterResult: null,
      selected: null,
      hovered: null,
      suggestions: [],
      listShown: false,
      inputElement: null,
      canSend: true,
      timeoutInstance: null,
      text: vm.modelValue,
      isPlainSuggestion: false,
      isClicking: false,
      isInFocus: false,
      isFalseFocus: false,
      isTabbed: false,
      controlScheme: {},
      listId: this.$.uid + '-suggestions'
    };
  },

  computed: {
    listIsRequest: function listIsRequest() {
      return typeof this.list === 'function';
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
      return this.text && this.text.length || this.inputElement && this.inputElement.value.length || 0;
    },
    isSelectedUpToDate: function isSelectedUpToDate() {
      return !!this.selected && this.displayProperty(this.selected) === this.text;
    },
    attrsWithoutListeners: function attrsWithoutListeners() {
      var _this3 = this;

      var o = {};
      Object.keys(this.$attrs).forEach(function (key) {
        return !isOn(key) && (o[key] = _this3.$attrs[key]);
      });
      return o;
    },
    field: function field() {
      return Object.assign({}, this.attrsWithoutListeners, {
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        onInput: this.onInput,
        onClick: this.showSuggestions,
        onKeydown: this.onKeyDown,
        onKeyup: this.onListKeyUp
      });
    },
    componentField: function componentField() {
      return Object.assign({}, this.attrsWithoutListeners, {
        onBlur: this.onBlur,
        onFocus: this.onFocus,
        'onUpdate:modelValue': this.onInput,
        onClick: this.showSuggestions,
        onKeydown: this.onKeyDown,
        onKeyup: this.onListKeyUp
      });
    }
  },
  created: function created() {
    this.controlScheme = Object.assign({}, defaultControls, this.controls);
  },
  mounted: function mounted() {
    var _this4 = this;

    this.$nextTick(function () {
      return requestAF(function () {
        _this4.inputElement = _this4.$refs['inputSlot'].querySelector('input');

        if (_this4.inputElement) {
          _this4.setInputAriaAttributes();
        } else {
          console.error('No input element found');
        }
      });
    });
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
      if (this.inputElement) {
        this.inputElement.setAttribute('aria-activedescendant', '');
        this.inputElement.setAttribute('aria-autocomplete', 'list');
        this.inputElement.setAttribute('aria-controls', this.listId);
      }
    },
    isScopedSlotEmpty: function isScopedSlotEmpty(slot) {
      if (slot) {
        var slotContent = slot(this);
        // https://github.com/vuejs/core/issues/4733#issuecomment-1024816095
        // https://github.com/vuejs/core/issues/3056#issuecomment-786560172
        return slotContent.some(function (vnode) {
          if (vnode.type === Comment) return false;
          if (Array.isArray(vnode.children) && !vnode.children.length) return false;
          return vnode.type !== Text || typeof vnode.children === 'string' && vnode.children.trim() !== '';
        });
      }

      return true;
    },
    miscSlotsAreEmpty: function miscSlotsAreEmpty() {
      var _this5 = this;

      var slots = ['misc-item-above', 'misc-item-below'].map(function (s) {
        return _this5.$slots[s];
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
    displayProperty: function displayProperty(suggestion) {
      return display(suggestion, this.displayAttribute);
    },
    valueProperty: function valueProperty(obj) {
      if (this.isPlainSuggestion) {
        return obj;
      }

      var value = getPropertyByAttribute(obj, this.valueAttribute);

      if (typeof value === 'undefined') {
        console.error('[vue-simple-suggest]: Please, check if you passed \'value-attribute\' (default is \'id\') and \'display-attribute\' (default is \'title\') props correctly.\n        Your list objects should always contain a unique identifier.');
      }

      return value;
    },
    autocompleteText: function autocompleteText(suggestion) {
      this.setText(this.displayProperty(suggestion));
    },
    setText: function setText(text) {
      var _this6 = this;

      this.$nextTick(function () {
        if (_this6.inputElement) {
          _this6.inputElement.value = text;
        }
        _this6.text = text;
        _this6.$emit('update:modelValue', text);
      });
    },
    select: function select(item) {
      if (item && this.selected !== item || this.nullableSelect && !item) {
        this.selected = item;
        this.$emit('update:modelSelect', item);
        // For backward compatibility:
        this.$emit('select', item);

        if (item) {
          this.autocompleteText(item);
        }
      }

      this.hover(null);
    },
    hover: function hover(item, elem) {
      var elemId = item ? this.getId(item, this.hoveredIndex) : '';

      if (this.inputElement) {
        this.inputElement.setAttribute('aria-activedescendant', elemId);
      }

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
        var _this8 = this;

        return _await(_invoke(function () {
          if (_this8.suggestions.length === 0 && _this8.minLength <= _this8.textLength) {
            // try show misc slots while researching
            _this8.showList();
            return _awaitIgnored(_this8.research());
          }
        }, function () {

          _this8.showList();
        }));
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
        } /* if hovers on edge */else {
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
      var _this9 = this;

      this.$emit('suggestion-click', suggestion, e);
      this.select(suggestion);

      if (!this.preventHide) this.hideList();

      if (this.isClicking) {
        setTimeout(function () {
          if (_this9.inputElement) {
            _this9.inputElement.focus();
          }

          /// Ensure, that all needed flags are off before finishing the click.
          _this9.isClicking = false;
        }, 0);
      }
    },
    onBlur: function onBlur(e) {
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
        }
      } else {
        if (this.inputElement) {
          this.inputElement.blur();
        }
        console.error('This should never happen!\n          If you encountered this error, please make sure that your input component emits \'focus\' events properly.\n          For more info see https://github.com/KazanExpress/vue-simple-suggest#custom-input.\n\n          If your \'vue-simple-suggest\' setup does not include a custom input component - please,\n          report to https://github.com/KazanExpress/vue-simple-suggest/issues/new');
      }

      this.isTabbed = false;
    },
    onFocus: function onFocus(e) {
      this.isInFocus = true;

      // Only emit, if it was a native input focus
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
      this.$emit('update:modelValue', value);
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
        var _this11 = this;

        return _await(_finally(function () {
          return _catch(function () {
            return _invokeIgnored(function () {
              if (_this11.canSend) {
                _this11.canSend = false;
                // @TODO: fix when promises will be cancelable (never :D)
                var textBeforeRequest = _this11.text;
                return _await(_this11.getSuggestions(_this11.text), function (newList) {
                  if (textBeforeRequest === _this11.text) {
                    _this11.suggestions = newList;
                  }
                });
              }
            });
          }, function (e) {
            _this11.clearSuggestions();
            throw e;
          });
        }, function () {
          _this11.canSend = true;

          if (_this11.suggestions.length === 0 && _this11.miscSlotsAreEmpty()) {
            _this11.hideList();
          } else if (_this11.isInFocus) {
            _this11.showList();
          }

          // eslint-disable-next-line no-unsafe-finally
          return _this11.suggestions;
        }));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    getSuggestions: function getSuggestions(value) {
      try {
        var _this13 = this;

        value = value || '';

        if (value.length < _this13.minLength) {
          return _await([]);
        }

        _this13.selected = null;

        // Start request if can
        if (_this13.listIsRequest) {
          _this13.$emit('request-start', value);
        }

        var nextIsPlainSuggestion = false;
        var result = [];
        return _await(_finally(function () {
          return _catch(function () {
            return _invoke(function () {
              if (_this13.listIsRequest) {
                return _await(_this13.list(value), function (_this12$list) {
                  result = _this12$list || [];
                });
              } else {
                result = _this13.list;
              }
            }, function () {

              // IFF the result is not an array (just in case!) - make it an array
              if (!Array.isArray(result)) {
                result = [result];
              }

              nextIsPlainSuggestion = _typeof(result[0]) !== 'object' && typeof result[0] !== 'undefined' || Array.isArray(result[0]);

              if (_this13.filterByQuery) {
                result = result.filter(function (el) {
                  return _this13.filterResult(el, value);
                });
              }

              if (_this13.listIsRequest) {
                _this13.$emit('request-done', result);
              }
            });
          }, function (e) {
            if (_this13.listIsRequest) {
              _this13.$emit('request-failed', e);
            } else {
              throw e;
            }
          });
        }, function () {
          if (_this13.maxSuggestions) {
            result = result.slice(0, _this13.maxSuggestions);
          }

          _this13.isPlainSuggestion = nextIsPlainSuggestion;
          // eslint-disable-next-line no-unsafe-finally
          return result;
        }));
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

var _hoisted_1 = ["aria-owns", "aria-expanded"];
var _hoisted_2 = ["value"];
var _hoisted_3 = ["id", "aria-labelledby"];
var _hoisted_4 = ["onMouseenter", "onClick", "aria-selected", "id"];

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", {
    class: vue.normalizeClass(["vue-simple-suggest", [$props.styles.vueSimpleSuggest, { designed: !$props.destyled, focus: $data.isInFocus }]]),
    onKeydown: _cache[1] || (_cache[1] = vue.withKeys(function ($event) {
      return $data.isTabbed = true;
    }, ["tab"]))
  }, [vue.createElementVNode("div", {
    class: vue.normalizeClass(["input-wrapper", $props.styles.inputWrapper]),
    ref: "inputSlot",
    role: "combobox",
    "aria-haspopup": "listbox",
    "aria-owns": $data.listId,
    "aria-expanded": !!$data.listShown && !$props.removeList ? 'true' : 'false'
  }, [vue.renderSlot(_ctx.$slots, "default", {
    field: $options.field,
    componentField: $options.componentField
  }, function () {
    return [vue.createElementVNode("input", vue.mergeProps({ class: "default-input" }, $options.field, {
      value: $data.text || '',
      class: $props.styles.defaultInput
    }), null, 16 /* FULL_PROPS */, _hoisted_2)];
  })], 10 /* CLASS, PROPS */, _hoisted_1), vue.createVNode(vue.Transition, { name: "vue-simple-suggest" }, {
    default: vue.withCtx(function () {
      return [!!$data.listShown && !$props.removeList ? (vue.openBlock(), vue.createElementBlock("ul", {
        key: 0,
        id: $data.listId,
        class: vue.normalizeClass(["suggestions", $props.styles.suggestions]),
        role: "listbox",
        "aria-labelledby": $data.listId
      }, [!!_ctx.$slots['misc-item-above'] ? (vue.openBlock(), vue.createElementBlock("li", {
        key: 0,
        class: vue.normalizeClass($props.styles.miscItemAbove)
      }, [vue.renderSlot(_ctx.$slots, "misc-item-above", {
        suggestions: $data.suggestions,
        query: $data.text
      })], 2 /* CLASS */)) : vue.createCommentVNode("v-if", true), (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList($data.suggestions, function (suggestion, index) {
        return vue.openBlock(), vue.createElementBlock("li", {
          class: vue.normalizeClass(["suggest-item", [$props.styles.suggestItem, {
            selected: $options.isSelected(suggestion),
            hover: $options.isHovered(suggestion)
          }]]),
          role: "option",
          onMouseenter: function onMouseenter($event) {
            return $options.hover(suggestion, $event.target);
          },
          onMouseleave: _cache[0] || (_cache[0] = function ($event) {
            return $options.hover(null);
          }),
          onClick: function onClick($event) {
            return $options.suggestionClick(suggestion, $event);
          },
          "aria-selected": $options.isHovered(suggestion) || $options.isSelected(suggestion) ? 'true' : 'false',

          id: $options.getId(suggestion, index),
          key: $options.getId(suggestion, index)
        }, [vue.renderSlot(_ctx.$slots, "suggestion-item", {
          autocomplete: function autocomplete() {
            return $options.autocompleteText(suggestion);
          },
          suggestion: suggestion,
          query: $data.text
        }, function () {
          return [vue.createElementVNode("span", null, vue.toDisplayString($options.displayProperty(suggestion)), 1 /* TEXT */)];
        })], 42 /* CLASS, PROPS, HYDRATE_EVENTS */, _hoisted_4);
      }), 128 /* KEYED_FRAGMENT */)), !!_ctx.$slots['misc-item-below'] ? (vue.openBlock(), vue.createElementBlock("li", {
        key: 1,
        class: vue.normalizeClass($props.styles.miscItemBelow)
      }, [vue.renderSlot(_ctx.$slots, "misc-item-below", {
        suggestions: $data.suggestions,
        query: $data.text
      })], 2 /* CLASS */)) : vue.createCommentVNode("v-if", true)], 10 /* CLASS, PROPS */, _hoisted_3)) : vue.createCommentVNode("v-if", true)];
    }),
    _: 3 /* FORWARDED */
  })], 34 /* CLASS, HYDRATE_EVENTS */);
}

script.render = render;
script.__file = "lib/vue-simple-suggest.vue";

module.exports = script;
