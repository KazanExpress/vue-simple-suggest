(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueSimpleSuggest = factory());
}(this, (function () { 'use strict';

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

  const inputProp = {
    type: String
  };

  const inputProps = {
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

  let event = 'input';

  var VueSimpleSuggest = {
    render: function () {
      var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-simple-suggest" }, [_c('div', { ref: "inputSlot", staticClass: "input-wrapper", class: { designed: !_vm.destyled }, on: { "click": _vm.onInputClick, "input": _vm.onInput, "keydown": _vm.onArrowKeyDown, "keyup": function ($event) {
            _vm.onListKeyUp($event), _vm.onAutocomplete($event);
          } } }, [_vm._t("default", [_c('input', _vm._b({ staticClass: "default-input", domProps: { "value": _vm.text || '' } }, 'input', _vm.$props, false))])], 2), _vm._v(" "), !!_vm.listShown && !_vm.removeList && !_vm.miscSlotsAreEmpty() ? _c('div', { staticClass: "suggestions", class: { designed: !_vm.destyled } }, [_vm._t("misc-item-above", null, { suggestions: _vm.suggestions, query: _vm.text }), _vm._v(" "), _vm._l(_vm.suggestions, function (suggestion, index) {
        return _c('div', { key: _vm.isPlainSuggestion ? 'suggestion-' + index : _vm.valueProperty(suggestion), staticClass: "suggest-item", class: {
            selected: _vm.selected && _vm.valueProperty(suggestion) == _vm.valueProperty(_vm.selected),
            hover: _vm.hovered && _vm.valueProperty(_vm.hovered) == _vm.valueProperty(suggestion)
          }, on: { "mouseenter": function ($event) {
              _vm.hover(suggestion, $event.target);
            }, "mouseleave": function ($event) {
              _vm.hover(null, $event.target);
            } } }, [_vm._t("suggestion-item", [_c('span', [_vm._v(_vm._s(_vm.displayProperty(suggestion)))])], { suggestion: suggestion, query: _vm.text })], 2);
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
        default: 'title'
      },
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
        default(el) {
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
    }),
    // Handle run-time mode changes:
    watch: {
      mode: v => event = v
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
        controlScheme: {}
      };
    },
    computed: {
      slotIsComponent() {
        return this.$slots.default && this.$slots.default.length > 0 && !!this.$slots.default[0].componentInstance;
      },
      listIsRequest() {
        return typeof this.list === 'function';
      },
      input() {
        return this.slotIsComponent ? this.$slots.default[0].componentInstance : this.inputElement;
      },
      on() {
        return this.slotIsComponent ? '$on' : 'addEventListener';
      },
      off() {
        return this.slotIsComponent ? '$off' : 'removeEventListener';
      },
      hoveredIndex() {
        return this.suggestions.findIndex(el => this.hovered && this.valueProperty(this.hovered) == this.valueProperty(el));
      }
    },
    created() {
      this.controlScheme = Object.assign({}, defaultControls, this.controls);
      event = this.mode;
    },
    mounted() {
      this.inputElement = this.$refs['inputSlot'].querySelector('input');
      this.input[this.on]('blur', this.onBlur);
      this.input[this.on]('focus', this.onFocus);
    },
    beforeDestroy() {
      this.input[this.off]('blur', this.onBlur);
      this.input[this.off]('focus', this.onFocus);
    },
    methods: {
      miscSlotsAreEmpty() {
        const slot = name => this.$scopedSlots['misc-item-' + name];
        const isFunction = slotName => slot(slotName) && typeof slot(slotName) === 'function';

        return ['above', 'below'].some(slotName => isFunction(slotName) ? !slot(slotName)(this) : !slot(slotName));
      },
      displayProperty(obj) {
        return (this.isPlainSuggestion ? obj : fromPath(obj, this.displayAttribute)) + '';
      },
      valueProperty(obj) {
        return this.isPlainSuggestion ? obj : fromPath(obj, this.valueAttribute);
      },
      select(item) {
        this.hovered = null;
        this.selected = item;

        this.$emit('select', item);

        // Ya know, input stuff
        this.$emit('input', this.displayProperty(item));
        this.inputElement.value = this.displayProperty(item);
        this.text = this.displayProperty(item);

        this.inputElement.focus();
      },
      hover(item, elem) {
        this.hovered = item;
        if (this.hovered != null) {
          this.$emit('hover', item, elem);
        }
      },
      hideList(ignoreSelection = false) {
        if (this.listShown) {
          if (this.hovered && !ignoreSelection) {
            this.select(this.hovered);
          }
          this.listShown = false;
          this.$emit('hide-list');
        }
      },
      showList() {
        if (!this.listShown && this.text && this.text.length >= this.minLength) {
          if (this.suggestions.length > 0) {
            this.listShown = true;
            this.$emit('show-list');
          }
        }
      },
      async onInputClick(event) {
        if (this.minLength === 0 && !this.text) {
          await this.research();
        }

        this.showList();
      },
      onArrowKeyDown(event) {
        if (hasKeyCode([this.controlScheme.selectionUp, this.controlScheme.selectionDown], event)) {
          event.preventDefault();
          this.showList();

          const isArrowDown = hasKeyCode(this.controlScheme.selectionDown, event);
          const direction = isArrowDown * 2 - 1;
          const listEdge = isArrowDown ? 0 : this.suggestions.length - 1;
          const hoversBetweenEdges = isArrowDown ? this.hoveredIndex < this.suggestions.length - 1 : this.hoveredIndex > 0;

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
      onListKeyUp(event) {
        const select = this.controlScheme.select,
              hideList = this.controlScheme.hideList;

        if (hasKeyCode([select, hideList], event)) {
          event.preventDefault();
          if (this.listShown) {
            this.hideList(hasKeyCode(hideList, event));
          } else if (hasKeyCode(select, event)) {
            this.research();
          }
        }
      },
      onAutocomplete(event) {
        if (hasKeyCode(this.controlScheme.autocomplete, event) && (event.ctrlKey || event.shiftKey)) {
          event.preventDefault();
          this.select(this.suggestions[0]);
          this.hover(this.suggestions[0]);
        }
      },
      onBlur(e) {
        this.hideList();
        this.$emit('blur', e);
      },
      onFocus(e) {
        this.$emit('focus', e);
        this.showList();
      },
      onInput(inputEvent) {
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
      async research() {
        try {
          if (this.canSend) {
            this.canSend = false;
            this.$set(this, 'suggestions', (await this.getSuggestions(this.text)));
            this.canSend = true;
          }
        } catch (e) {
          this.clearSuggestions();
          throw e;
        } finally {
          this.$nextTick(() => {
            if (this.suggestions.length === 0 && this.miscSlotsAreEmpty()) {
              this.hideList(true);
            } else {
              this.showList();
            }
          });

          return this.suggestions;
        }
      },
      async getSuggestions(value = '') {
        if (this.listShown && !value) {
          this.hideList();
          this.clearSuggestions();
          return this.suggestions;
        }

        if (this.minLength > 0 && value.length < this.minLength) {
          return this.suggestions;
        }

        this.selected = null;

        // Start request if can
        if (this.listIsRequest) {
          this.$emit('request-start', value);
        }

        let result = [];
        try {
          result = this.listIsRequest ? (await this.list(value)) || [] : this.list;

          // IFF the result is not an array (just in case!) - make it an array
          if (!Array.isArray(result)) {
            result = [result];
          }

          if (typeof result[0] === 'object' && !Array.isArray(result[0])) {
            this.isPlainSuggestion = false;
          } else {
            this.isPlainSuggestion = true;
          }

          if (this.filterByQuery) {
            result = result.filter(this.filter);
          }

          if (this.listIsRequest) {
            this.$emit('request-done', result);
          }
        } catch (e) {
          if (this.listIsRequest) {
            this.$emit('request-failed', e);
          } else {
            throw e;
          }
        } finally {
          if (this.maxSuggestions) {
            result.splice(this.maxSuggestions);
          }

          return result;
        }
      },
      clearSuggestions() {
        this.suggestions.splice(0);
      }
    }
  };

  return VueSimpleSuggest;

})));
