<template>
  <div class="vue-simple-suggest">
    <div class="input-wrapper" :class="{ designed: !destyled }"
      @click="onInputClick"
      @input="onInput"
      @keydown="onArrowKeyDown"
      @keyup="onListKeyUp($event), onAutocomplete($event)"
      ref="inputSlot">
      <slot>
        <input v-bind="$props" :value="mode === 'input' ? value : text">
      </slot>
    </div>
    <div class="suggestions" v-if="listShown && !removeList" :class="{ designed: !destyled }">
      <slot name="miscItem-above"
        :suggestions="suggestions"
        :query="text"
      ></slot>

      <div class="suggest-item" v-for="(suggestion, index) in suggestions"
        @mouseenter="hover(suggestion, $event.target)"
        @mouseleave="hover(null, $event.target)"
        :key="isPlainSuggestion ? 'suggestion-' + index : valueProperty(suggestion)"
        :class="{
          selected: selected && (valueProperty(suggestion) == valueProperty(selected)),
          hover: hovered && (valueProperty(hovered) == valueProperty(suggestion))
        }">
        <slot name="suggestionItem"
          :suggestion="suggestion"
          :query="text">
          <span>{{ displayProperty(suggestion) }}</span>
        </slot>
      </div>

      <slot name="miscItem-below"
        :suggestions="suggestions"
        :query="text"
      ></slot>
    </div>
  </div>
</template>

<script>
import {
  defaultControls,
  modes,
  fromPath,
  hasKeyCode
} from './misc'

let event = 'input'

export default {
  name: 'vue-simple-suggest',
  model: {
    prop: 'value',
    get event() {
      return event;
    }
  },
  props: {
    placeholder: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
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

    // TODO: Document this!
    filter: {
      type: Function,
      default: el => value ? ~this.displayProperty(el).toLowerCase().indexOf(value.toLowerCase()) : true
    },
    //

    debounce: {
      type: Number,
      default: 0
    },
    value: {
      type: Object.values(modes),
      validator: (value) => value.constructor.name === modes[event].name
    },
    mode: {
      type: String,
      default: event,
      validator: (value) => !!~Object.keys(modes).indexOf(value.toLowerCase())
    }
  },
  // Handle run-time mode changes:
  watch: { mode: v => event = v },
  //
  data () {
    return {
      selected: null,
      hovered: null,
      suggestions: [],
      listShown: false,
      inputElement: null,
      canSend: true,
      timeoutInstance: null,
      text: this.value,

      // TODO: Document this!
      isPlainSuggestion: false,
      //

      controlScheme: {}
    }
  },
  computed: {
    slotIsComponent () {
      return (this.$slots.default && this.$slots.default.length > 0) && !!this.$slots.default[0].componentInstance
    },
    listIsRequest () {
      return typeof this.list === 'function';
    },
    input () {
      return this.slotIsComponent ? this.$slots.default[0].componentInstance : this.inputElement
    },
    on () {
      return this.slotIsComponent ? '$on' : 'addEventListener'
    },
    off () {
      return this.slotIsComponent ? '$off' : 'removeEventListener'
    },
    hoveredIndex () {
      return this.suggestions.findIndex(el => this.hovered && (this.valueProperty(this.hovered) == this.valueProperty(el)))
    }
  },
  created() {
    this.controlScheme = Object.assign({}, defaultControls, this.controls);
    event = this.mode;
  },
  mounted () {
    this.inputElement = this.$refs['inputSlot'].querySelector('input')
    this.input[this.on]('blur', this.onBlur)
    this.input[this.on]('focus', this.onFocus)
  },
  beforeDestroy () {
    this.input[this.off]('blur', this.onBlur)
    this.input[this.off]('focus', this.onFocus)
  },
  methods: {
    displayProperty (obj) {
      return this.isPlainSuggestion ? obj : fromPath(obj, this.displayAttribute);
    },
    valueProperty (obj) {
      return this.isPlainSuggestion ? obj : fromPath(obj, this.valueAttribute);
    },
    select (item) {
      this.selected = item

      // Get current item regardless of internal structure
      this.$emit('select', item)

      // Ya know, input stuff
      this.$emit('input', this.displayProperty(item))
      this.inputElement.value = this.displayProperty(item)
      this.text = this.displayProperty(item)

      this.inputElement.focus()
      //

      this.hovered = null
    },
    hover (item, elem) {
      this.hovered = item
      if (this.hovered != null) {
        // Send current item regardless of internal structure
        this.$emit('hover', item, elem)
      }
    },
    hideList (ignoreSelection = false) {
      if (this.listShown) {
        if (this.hovered && !ignoreSelection) {
          this.select(this.hovered)
        }
        this.listShown = false
        this.$emit('hide-list')
      }
    },
    showList () {
      if (!this.listShown) {
        this.listShown = true
        this.$emit('show-list')
      }
    },
    async onInputClick (event) {
      if (this.minLength === 0 && !this.text) {
        await this.research();
      }

      if (!this.listShown && this.suggestions.length > 0) {
        this.showList()
      }
    },
    onArrowKeyDown (event) {
      if (this.suggestions.length > 0
        && hasKeyCode([this.controlScheme.selectionUp, this.controlScheme.selectionDown], event)
      ) {
        event.preventDefault()
        this.showList()

        const isArrowDown = hasKeyCode(this.controlScheme.selectionDown, event)
        const direction = isArrowDown * 2 - 1
        const listEdge = isArrowDown ? 0 : this.suggestions.length - 1
        const hoversBetweenEdges = isArrowDown ? this.hoveredIndex < this.suggestions.length - 1 : this.hoveredIndex > 0

        let item = null

        if (!this.hovered) {
          item = this.selected || this.suggestions[listEdge]
        } else if (hoversBetweenEdges) {
          item = this.suggestions[this.hoveredIndex + direction]
        } else /* if hovers on edge */ {
          item = this.suggestions[listEdge]
        }

        this.hover(item)
      }
    },
    onListKeyUp (event) {
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
    onAutocomplete (event) {
      if (hasKeyCode(this.controlScheme.autocomplete, event)
        && (event.ctrlKey || event.shiftKey)
      ) {
        event.preventDefault();
        this.select(this.suggestions[0]);
        this.hover(this.suggestions[0]);
      }
    },
    onBlur (e) {
      this.hideList()
      this.$emit('blur', e)
    },
    onFocus (e) {
      this.$emit('focus', e)
      if (this.suggestions.length > 0) {
        this.showList()
      }
    },
    onInput (inputEvent) {
      this.text = inputEvent.target.value
      this.$emit('input', this.text)

      if (this.selected) {
        this.selected = null;
        this.$emit('select', null);
      }

      if (this.debounce) {
        clearTimeout(this.timeoutInstance)
        this.timeoutInstance = setTimeout(this.research, this.debounce)
      } else {
        this.research()
      }
    },
    async research () {
      try {
        if (this.canSend) {
          this.canSend = false
          var result = await this.getSuggestions(this.text)
          this.canSend = true
        } else {
          result = this.suggestions;
        }
      }

      catch (e) {
        result = [];
        throw e;
      }

      finally {
        return result;
      }
    },
    async getSuggestions (value = '') {
      if (this.listShown && !value) {
        this.hideList()
        this.suggestions.splice(0)
        return this.suggestions
      }

      if ((this.minLength > 0) && value.length < this.minLength) {
        return this.suggestions
      }

      this.selected = null

      // Start request if can
      if (this.listIsRequest) {
        this.$emit('request-start', value)
      }

      let result = [];
      try {
        result = this.listIsRequest ? (await this.list(value)) || [] : this.list;

        // IFF the result is not an array (just in case!) - make it an array
        if (!Array.isArray(result)) { result = [result] }

        if (typeof result[0] === 'object' && !Array.isArray(result[0])) {
          this.isPlainSuggestion = false;
        } else {
          this.isPlainSuggestion = true;
        }

        if (this.filterByQuery) {
          result = result.filter(this.filter);
        }

        if (this.listIsRequest) {
          this.$emit('request-done', result)
        }
      }

      catch (e) {
        if (this.listIsRequest) {
          this.$emit('request-failed', e)
        } else {
          throw e;
        }
      }

      finally {
        if (this.maxSuggestions) {
          result.splice(this.maxSuggestions);
        }

        this.$set(this, 'suggestions', result);
        this.showList()

        return this.suggestions;
      }
    },
    clearSuggestions () {
      this.suggestions.splice(0)
    }
  }
}
</script>

<style scoped>
.vue-simple-suggest {
  position: relative;
}

.vue-simple-suggest, .vue-simple-suggest * {
  box-sizing: border-box;
}

.vue-simple-suggest .input-wrapper.designed input {
  display: block;
  width: 100%;
  padding: 10px;
  border: 1px solid #cde;
  border-radius: 3px;
  color: black;
  background: white;
  outline:none;
  transition: all .1s;
}

.vue-simple-suggest .input-wrapper.designed input:focus {
  border: 1px solid #aaa;
}

.vue-simple-suggest .suggestions {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  top: calc(100% + 5px);
  border-radius: 3px;
  border: 1px solid #aaa;
  background-color: #fff;
  z-index: 1000;
}

.vue-simple-suggest .suggestions .suggest-item {
  cursor: pointer;
  user-select: none;
}

.vue-simple-suggest .suggestions .suggest-item,
.vue-simple-suggest .suggestions .misc-item {
  padding: 5px 10px;
}

.vue-simple-suggest .suggestions .suggest-item.hover {
  background-color: #2874D5 !important;
  color: #fff !important;
}

.vue-simple-suggest .suggestions .suggest-item.selected {
  background-color: #2832D5;
  color: #fff;
}
</style>

