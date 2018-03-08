<template>
  <div class="vue-simple-suggest">
    <div class="input-wrapper" :class="{ designed: !destyled }"
      @click="onInputClick"
      @input="onInput"
      @keydown.up.down.prevent="onArrowKeyDown"
      @keyup.enter.esc.prevent="onListKeyUp"
      ref="inputSlot">
      <slot>
        <input v-bind="$props">
      </slot>
    </div>
    <div class="suggestions" v-if="!!listShown" :class="{ designed: !destyled }">
      <slot name="miscItem-above" :suggestions="suggestions" :query="text"></slot>

      <div class="suggest-item" v-for="suggestion in suggestions"
        @mouseenter="hover(suggestion, $event.target)"
        @mouseleave="hover(null, $event.target)"
        :key="valueProperty(suggestion)"
        :class="{
          selected: selected && (valueProperty(suggestion) == valueProperty(selected)),
          hover: hovered && (valueProperty(hovered) == valueProperty(suggestion))
        }">
        <slot name="suggestionItem" :suggestion="suggestion">
          <span>{{ displayProperty(suggestion) }}</span>
        </slot>
      </div>

      <slot name="miscItem-below" :suggestions="suggestions" :query="text"></slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

function fromPath(obj, path) {
  return path.split('.').reduce((o, i) => (o === Object(o) ? o[i] : o), obj);
}

export default {
  name: 'vue-simple-suggest',
  props: {
    placeholder: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
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
    destyled: {
      type: Boolean,
      default: false
    },
    filterByQuery: {
      type: Boolean,
      default: false
    },
    debounce: {
      type: Number,
      default: 0
    },
    value: {
      type: String
    }
  },
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
      isSuggestionConverted: false
    }
  },
  computed: {
    slotIsComponent () {
      return (this.$slots.default && this.$slots.default.length > 0) && !!this.$slots.default[0].componentInstance
    },
    listIsRequest() {
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
      return this.suggestions.findIndex(el => this.hovered && (this.hovered[this.valueAttribute] == el[this.valueAttribute]))
    }
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
      return fromPath(obj, this.displayAttribute);
    },
    valueProperty (obj) {
      return fromPath(obj, this.valueAttribute);
    },
    select (item) {
      this.selected = item
      this.$emit('select', item)

      // Ya know, input stuff
      this.$emit('input', this.displayProperty(item))
      this.inputElement.value = this.displayProperty(item);
      this.text = this.displayProperty(item);

      this.inputElement.focus();
      //

      this.hovered = null
    },
    hover (item, elem) {
      this.hovered = item
      if (this.hovered != null) {
        this.$emit('hover', item, elem)
      }
    },
    hideList (ignoreSelection = false) {
      if (this.listShown) {
        if (this.hovered && this.text && !ignoreSelection) {
          this.select(this.hovered)
        }
        this.listShown = false
        this.$emit('hideList')
      }
    },
    showList () {
      this.listShown = true
      this.$emit('showList')
    },
    onInputClick (event) {
      if (!this.listShown && this.suggestions.length > 0) {
        this.showList()
      }
    },
    onArrowKeyDown (event) {
      if (this.suggestions.length > 0) {
        if (!this.listShown) {
          this.showList()
        }

        const isArrowDown = event.keyCode === 40
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
      if (this.listShown) {
        this.hideList(event.key === 'Escape');
      } else if (event.key !== 'Escape') {
        this.debounceCallback();
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

      if (this.debounce) {
        clearTimeout(this.timeoutInstance)
        this.timeoutInstance = setTimeout(this.debounceCallback, this.debounce)
      } else {
        this.debounceCallback()
      }
    },
    async debounceCallback () {
      if (this.canSend) {
        this.canSend = false
        await this.getSuggestions(this.text)
        this.canSend = true
      }
    },
    async getSuggestions (value = '') {
      this.selected = null

      let res;
      if (value.length >= this.minLength) {
        this.listIsRequest && this.$emit('requestStart', value)
        try {
          if (this.listIsRequest) {
            res = (await this.list(value)) || []
          } else {
            res = this.list;
          }

          if (!Array.isArray(res)) {
            res = [res]
          }

          if (typeof res[0] === 'object' && !Array.isArray(res[0])) {
            this.isSuggestionConverted = false;
          } else {
            res = res.map((el, i) => ({
              [this.valueAttribute]: i,
              [this.displayAttribute]: el
            }));
            this.isSuggestionConverted = true;
          }

          if (this.filterByQuery) {
            res = res.filter(el => ~this.displayProperty(el).toLowerCase().indexOf(value.toLowerCase()));
          }

          this.listIsRequest && this.$emit('requestDone', res)
        } catch (e) {
          if (this.listIsRequest) {
            this.$emit('requestFailed', e)
          } else {
            throw e;
          }
        }

        if (this.maxSuggestions) {
          res.splice(this.maxSuggestions);
        }

        this.$set(this, 'suggestions', res);

        if (!this.listShown) {
          this.showList()
        }
      }
      /* hide only if 0 text left, mthrfckr */
      else if (this.listShown && !value) {
        this.hideList()
        this.suggestions.splice(0)
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

