<template>
  <div class="vue-simple-suggest">
    <div class="input-wrapper" :class="{ designed: !destyled }"
      @click="onInputClick"
      @input="getSuggestions"
      @keydown.up.down.prevent="onArrowKeyDown"
      @keyup.enter.esc.prevent="onListKeyUp"
      ref="inputSlot">
      <slot>
        <input type="text" :placeholder="placeholder" :value="selected ? selected[displayAttribute] : text">
      </slot>
    </div>
    <div class="suggestions" v-if="!!show && suggestions.length > 0" :class="{ designed: !destyled }">
      <div class="suggest-item" v-for="suggest in suggestions"
        @mouseenter="hover(suggest)"
        @mouseleave="hover(null)"
        :key="suggest[valueAttribute]"
        :class="{
          selected: selected && (suggest[valueAttribute] == selected[valueAttribute]),
          hover: hovered && (hovered[valueAttribute] == suggest[valueAttribute])
        }">
        <slot name="suggestionItem" :suggest="suggest">
          <span>{{ suggest[displayAttribute] }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'vue-simple-suggest',
  props: {
    placeholder: {
      type: String
    },
    minLength: {
      type: Number,
      default: 1
    },
    maxCount: {
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
    getList: {
      type: Function,
      default: () => []
    },
    destyled: {
      type: Boolean,
      default: false
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
      show: false,
      inputElement: null,
      text: ''
    }
  },
  computed: {
    slotIsComponent () {
      return (this.$slots.default && this.$slots.default.length > 0) && !!this.$slots.default[0].componentInstance;
    },
    input () {
      return this.slotIsComponent ? this.$slots.default[0].componentInstance : this.inputElement;
    },
    on () {
      return this.slotIsComponent ? '$on' : 'addEventListener';
    },
    off () {
      return this.slotIsComponent ? '$off' : 'removeEventListener';
    },
    hoveredIndex () {
      return this.suggestions.findIndex(el => this.hovered && (this.hovered[this.valueAttribute] == el[this.valueAttribute]))
    }
  },
  mounted () {
    this.inputElement = this.$refs['inputSlot'].querySelector('input');
    this.input[this.on]('blur', this.onBlur)
    this.input[this.on]('focus', this.onFocus)
  },
  beforeDestroy () {
    this.input[this.off]('blur', this.onBlur);
    this.input[this.off]('focus', this.onFocus);
  },
  methods: {
    select (item) {
      this.selected = item
      this.$emit('select', item)
      this.$emit('input', item[this.displayAttribute]);
      this.hovered = null
    },
    hover (item) {
      this.hovered = item
      if (this.hovered != null) {
        this.$emit('hover', item)
      }
    },
    hideList (ignoreSelection = false) {
      if (this.hovered && this.text && !ignoreSelection) {
        this.select(this.hovered)
      }

      if (this.show) {
        this.show = false
        this.$emit('hideList')
      }
    },
    showList () {
      this.show = true
      this.$emit('showList')
    },
    onInputClick (event) {
      if (!this.show && this.suggestions.length > 0) {
        this.showList()
      }
    },
    onArrowKeyDown (event) {
      if (this.suggestions.length > 0) {
        if (!this.show) {
          this.showList()
        }

        const isArrowDown = event.key === 'ArrowDown';
        const direction = isArrowDown * 2 - 1;
        const listEdge = isArrowDown ? 0 : this.suggestions.length - 1
        const hoversBetweenEdges = isArrowDown ? this.hoveredIndex < this.suggestions.length - 1 : this.hoveredIndex > 0;

        let item = null;

        if (!this.hovered) {
          item = this.selected || this.suggestions[listEdge];
        } else if (hoversBetweenEdges) {
          item = this.suggestions[this.hoveredIndex + direction];
        } else /* if hovers on edge */ {
          item = this.suggestions[listEdge];
        }

        this.hover(item);
      }
    },
    onListKeyUp (event) {
      if (this.show) {
        this.hideList(event.key === 'Escape');
      }
    },
    onBlur (e) {
      this.hideList()
      this.$emit('blur', e)
    },
    onFocus (e) {
      if (this.suggestions.length > 0) {
        this.showList()
      }
      this.$emit('focus', e)
    },
    async getSuggestions (inputEvent) {
      this.selected = null
      this.text = inputEvent.target.value

      if (this.text.length >= this.minLength) {
        let res = (await this.getList(this.text)) || [];
        this.$set(this, 'suggestions', res.slice(0, this.maxCount))

        if (!this.show) {
          this.showList()
        }

        if (this.suggestions.length === 0) {
          this.hideList()
        }
      /* hide only if 0 text left and got no suggestions, mthrfckr */
      } else if (this.show && (this.suggestions.length === 0 || !this.text)) {
        this.hideList()
        this.suggestions.splice(0)
      }

      this.$emit('input', this.text)
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

.vue-simple-suggest .suggestions .suggest-item {
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

