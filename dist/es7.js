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
  },
  props: {
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
    preventSubmit: {
      type: Boolean,
      default: true
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
      isFalseFocus: false,
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
    onSubmit(e) {
      if (this.preventSubmit && e.key === 'Enter') {
        e.stopPropagation();
        e.preventDefault();
      }
    },
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

      if (this.preventSubmit === true) {
        let form = this.$el.closest('form');
        if (form) {
          form[listenerBinder]('keydown', this.onSubmit);
        }
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
    async showSuggestions() {
      if (this.suggestions.length === 0 && this.minLength === this.textLength) {
        await this.research();
      }

      this.showList();
    },
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
          this.isFalseFocus = true;
          this.$nextTick(() => {
            this.inputElement.focus();
          });
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
      if (e && !this.isFalseFocus) {
        this.$emit('focus', e);
      }
      this.isFalseFocus = false;

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
    async research() {
      try {
        if (this.canSend) {
          this.canSend = false;
          this.$set(this, 'suggestions', (await this.getSuggestions(this.text)));
        }
      } catch (e) {
        this.clearSuggestions();
        throw e;
      } finally {
        this.canSend = true;

        if (this.suggestions.length === 0 && this.miscSlotsAreEmpty()) {
          this.hideList();
        } else {
          this.showList();
        }

        return this.suggestions;
      }
    },
    async getSuggestions(value) {
      value = value || '';

      if (value.length < this.minLength) {
        if (this.listShown) {
          this.hideList();
          return [];
        }

        return this.suggestions;
      }

      this.selected = null;

      // Start request if can
      if (this.listIsRequest) {
        this.$emit('request-start', value);

        if (this.suggestions.length > 0 || !this.miscSlotsAreEmpty()) {
          this.showList();
        }
      }

      let result = [];
      try {
        if (this.listIsRequest) {
          result = (await this.list(value)) || [];
        } else {
          result = this.list;
        }

        // IFF the result is not an array (just in case!) - make it an array
        if (!Array.isArray(result)) {
          result = [result];
        }

        this.isPlainSuggestion = typeof result[0] !== 'object' || Array.isArray(result[0]);

        if (this.filterByQuery) {
          result = result.filter(el => this.filter(el, value));
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

export default VueSimpleSuggest;
