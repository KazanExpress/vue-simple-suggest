const defaultControls = {
  selectionUp: [38],
  selectionDown: [40],
  select: [13],
  hideList: [27],
  showList: [40],
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
  return hasKeyCodeByCode(arr, event.keyCode);
}

function hasKeyCodeByCode(arr, keyCode) {
  if (arr.length <= 0) return false;

  const has = arr => arr.some(code => code === keyCode);
  if (Array.isArray(arr[0])) {
    return arr.some(array => has(array));
  } else {
    return has(arr);
  }
}

var VueSimpleSuggest = {
  render: function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-simple-suggest", class: [_vm.styles.vueSimpleSuggest, { designed: !_vm.destyled, focus: _vm.isInFocus }], on: { "keydown": function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "tab", 9, $event.key, "Tab")) {
            return null;
          }_vm.isTabbed = true;
        } } }, [_c('div', { ref: "inputSlot", staticClass: "input-wrapper", class: _vm.styles.inputWrapper, attrs: { "role": "combobox", "aria-haspopup": "listbox", "aria-owns": _vm.listId, "aria-expanded": !!_vm.listShown && !_vm.removeList ? 'true' : 'false' } }, [_vm._t("default", [_c('input', _vm._b({ staticClass: "default-input", class: _vm.styles.defaultInput, domProps: { "value": _vm.text || '' } }, 'input', _vm.$attrs, false))])], 2), _vm._v(" "), _c('transition', { attrs: { "name": "vue-simple-suggest" } }, [!!_vm.listShown && !_vm.removeList ? _c('ul', { staticClass: "suggestions", class: _vm.styles.suggestions, attrs: { "id": _vm.listId, "role": "listbox", "aria-labelledby": _vm.listId } }, [!!this.$scopedSlots['misc-item-above'] ? _c('li', [_vm._t("misc-item-above", null, { "suggestions": _vm.suggestions, "query": _vm.text })], 2) : _vm._e(), _vm._v(" "), _vm._l(_vm.suggestions, function (suggestion, index) {
      return _c('li', { key: _vm.getId(suggestion, index), staticClass: "suggest-item", class: [_vm.styles.suggestItem, {
          selected: _vm.isSelected(suggestion),
          hover: _vm.isHovered(suggestion)
        }], attrs: { "role": "option", "aria-selected": _vm.isHovered(suggestion) || _vm.isSelected(suggestion) ? 'true' : 'false', "id": _vm.getId(suggestion, index) }, on: { "mouseenter": function ($event) {
            return _vm.hover(suggestion, $event.target);
          }, "mouseleave": function ($event) {
            return _vm.hover(undefined);
          }, "click": function ($event) {
            return _vm.suggestionClick(suggestion, $event);
          } } }, [_vm._t("suggestion-item", [_c('span', [_vm._v(_vm._s(_vm.displayProperty(suggestion)))])], { "autocomplete": function () {
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
    nullableSelect: {
      type: Boolean,
      default: false
    },
    value: {},
    mode: {
      type: String,
      default: 'input',
      validator: value => !!~Object.keys(modes).indexOf(value.toLowerCase())
    }
  },
  // Handle run-time mode changes (now working):
  watch: {
    mode: {
      handler(current, old) {
        this.constructor.options.model.event = current;

        // Can be null if the component is root
        this.$parent && this.$parent.$forceUpdate();

        this.$nextTick(() => {
          if (current === 'input') {
            this.$emit('input', this.text);
          } else {
            this.$emit('select', this.selected);
          }
        });
      },
      immediate: true
    },
    value: {
      handler(current) {
        if (typeof current !== 'string') {
          current = this.displayProperty(current);
        }
        this.updateTextOutside(current);
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
      isInFocus: false,
      isFalseFocus: false,
      isTabbed: false,
      controlScheme: {},
      listId: `${this._uid}-suggestions`
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
      for (let i = 0; i < this.suggestions.length; i++) {
        const el = this.suggestions[i];
        if (this.hovered && this.valueProperty(this.hovered) == this.valueProperty(el)) {
          return i;
        }
      }
      return -1;
    },
    textLength() {
      return this.text && this.text.length || this.inputElement.value.length || 0;
    },
    isSelectedUpToDate() {
      return !!this.selected && this.displayProperty(this.selected) === this.text;
    }
  },
  created() {
    this.controlScheme = Object.assign({}, defaultControls, this.controls);
  },
  mounted() {
    this.inputElement = this.$refs['inputSlot'].querySelector('input');

    this.setInputAriaAttributes();
    this.prepareEventHandlers(true);
  },
  beforeDestroy() {
    this.prepareEventHandlers(false);
  },
  methods: {
    isEqual(suggestion, item) {
      return item && this.valueProperty(suggestion) == this.valueProperty(item);
    },
    isSelected(suggestion) {
      return this.isEqual(suggestion, this.selected);
    },
    isHovered(suggestion) {
      return this.isEqual(suggestion, this.hovered);
    },
    setInputAriaAttributes() {
      this.inputElement.setAttribute('aria-activedescendant', '');
      this.inputElement.setAttribute('aria-autocomplete', 'list');
      this.inputElement.setAttribute('aria-controls', this.listId);
    },
    prepareEventHandlers(enable) {
      const binder = this[enable ? 'on' : 'off'];
      const keyEventsList = {
        click: this.showSuggestions,
        keydown: this.onKeyDown,
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
      if (this.isPlainSuggestion) {
        return obj;
      }

      let display = this.getPropertyByAttribute(obj, this.displayAttribute);

      if (typeof display === 'undefined') {
        display = JSON.stringify(obj);

        if (process && ~process.env.NODE_ENV.indexOf('dev')) {
          console.warn('[vue-simple-suggest]: Please, provide `display-attribute` as a key or a dotted path for a property from your object.');
        }
      }

      return String(display || '');
    },
    valueProperty(obj) {
      if (this.isPlainSuggestion) {
        return obj;
      }

      const value = this.getPropertyByAttribute(obj, this.valueAttribute);

      if (typeof value === 'undefined') {
        console.error(`[vue-simple-suggest]: Please, check if you passed 'value-attribute' (default is 'id') and 'display-attribute' (default is 'title') props correctly.
        Your list objects should always contain a unique identifier.`);
      }

      return value;
    },

    autocompleteText(suggestion) {
      this.setText(this.displayProperty(suggestion));
    },
    setText(text) {
      this.$nextTick(() => {
        this.inputElement.value = text;
        this.text = text;
        this.$emit('input', text);
      });
    },
    select(item) {
      if (this.selected !== item || this.nullableSelect && !item) {
        this.selected = item;
        this.$emit('select', item);

        if (item) {
          this.autocompleteText(item);
        }
      }

      this.hover(null);
    },
    hover(item, elem) {
      const elemId = !!item ? this.getId(item, this.hoveredIndex) : '';

      this.inputElement.setAttribute('aria-activedescendant', elemId);

      if (item && item !== this.hovered) {
        this.$emit('hover', item, elem);
      }

      this.hovered = item;
    },
    hideList() {
      if (this.listShown) {
        this.listShown = false;
        this.hover(null);
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
      if (this.suggestions.length === 0 && this.minLength <= this.textLength) {
        // try show misc slots while researching
        this.showList();
        await this.research();
      }

      this.showList();
    },
    onShowList(e) {
      if (hasKeyCode(this.controlScheme.showList, e)) {
        this.showSuggestions();
      }
    },
    moveSelection(e) {
      if (!this.listShown || !this.suggestions.length) return;
      if (hasKeyCode([this.controlScheme.selectionUp, this.controlScheme.selectionDown], e)) {
        e.preventDefault();

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
    onKeyDown(e) {
      const select = this.controlScheme.select,
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
    onListKeyUp(e) {
      const select = this.controlScheme.select,
            hideList = this.controlScheme.hideList;

      if (this.listShown && hasKeyCode([select, hideList], e)) {
        e.preventDefault();
        if (hasKeyCode(select, e)) {
          this.select(this.hovered);
        }

        this.hideList();
      }
    },
    onAutocomplete(e) {
      if (hasKeyCode(this.controlScheme.autocomplete, e) && (e.ctrlKey || e.shiftKey) && this.suggestions.length > 0 && this.suggestions[0] && this.listShown) {
        e.preventDefault();
        this.hover(this.suggestions[0]);
        this.autocompleteText(this.suggestions[0]);
      }
    },
    suggestionClick(suggestion, e) {
      this.$emit('suggestion-click', suggestion, e);
      this.select(suggestion);
      this.hideList();

      /// Ensure, that all needed flags are off before finishing the click.
      this.isClicking = false;
    },
    onBlur(e) {
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
          setTimeout(() => {
            this.inputElement.focus();
          }, 0);
        }
      } else {
        this.inputElement.blur();
        console.error(`This should never happen!
          If you encountered this error, please make sure that your input component emits 'focus' events properly.
          For more info see https://github.com/KazanExpress/vue-simple-suggest#custom-input.

          If your 'vue-simple-suggest' setup does not include a custom input component - please,
          report to https://github.com/KazanExpress/vue-simple-suggest/issues/new`);
      }

      this.isTabbed = false;
    },
    onFocus(e) {
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
    onInput(inputEvent) {
      const value = !inputEvent.target ? inputEvent : inputEvent.target.value;

      this.updateTextOutside(value);
      this.$emit('input', value);
    },
    updateTextOutside(value) {
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
    async research() {
      try {
        if (this.canSend) {
          this.canSend = false;
          // @TODO: fix when promises will be cancelable (never :D)
          let textBeforeRequest = this.text;
          let newList = await this.getSuggestions(this.text);

          if (textBeforeRequest === this.text) {
            this.$set(this, 'suggestions', newList);
          }
        }
      } catch (e) {
        this.clearSuggestions();
        throw e;
      } finally {
        this.canSend = true;

        if (this.suggestions.length === 0 && this.miscSlotsAreEmpty()) {
          this.hideList();
        } else if (this.isInFocus) {
          this.showList();
        }

        return this.suggestions;
      }
    },
    async getSuggestions(value) {
      value = value || '';

      if (value.length < this.minLength) {
        return [];
      }

      this.selected = null;

      // Start request if can
      if (this.listIsRequest) {
        this.$emit('request-start', value);
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
    },
    getId(value, i) {
      return `${this.listId}-suggestion-${this.isPlainSuggestion ? i : this.valueProperty(value) || i}`;
    }
  }
};

export default VueSimpleSuggest;
