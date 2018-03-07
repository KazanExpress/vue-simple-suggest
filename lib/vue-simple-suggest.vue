<template>
  <div class="vue-simple-suggest">
    <div class="input-wrapper" @input="getSuggestions" ref="inputSlot" :class="{ designed: isDesigned }">
      <slot>
        <input type="text" :placeholder="placeholder" :value="selected ? selected[displayAttribute] : text">
      </slot>
    </div>
    <div class="suggestions" v-if="!!show && suggestions.length > 0" :class="{ designed: isDesigned }">
      <div class="suggest-item" v-for="suggest in suggestions" @mouseover="hover(suggest)" @mouseout="hover(null)" :key="suggest[valueAttribute]" :class="{ selected: selected ? suggest[valueAttribute] == selected[valueAttribute] : false }">
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
    isDesigned: {
      type: Boolean,
      default: false
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
    slotIsComponent() {
      return (this.$slots.default && this.$slots.default.length > 0) && !!this.$slots.default[0].componentInstance;
    },
    input() {
      return this.slotIsComponent ? this.$slots.default[0].componentInstance : this.inputElement;
    },
    on() {
      return this.slotIsComponent ? '$on' : 'addEventListener';
    },
    off() {
      return this.slotIsComponent ? '$off' : 'removeEventListener';
    }
  },
  created () {
    this.$on('input', this.getSuggestions)
  },
  mounted () {
    this.inputElement = this.$refs['inputSlot'].querySelector('input');
    this.input[this.on]('blur', this.onBlur)
    this.input[this.on]('focus', this.onFocus)
  },
  beforeDestroy () {
    this.$off('input', this.getSuggestions)
    this.input[this.off]('blur', this.onBlur);
    this.input[this.off]('focus', this.onFocus);
  },
  methods: {
    select (item) {
      this.selected = item
      this.$emit('onSelect', item)
      this.hovered = null
    },
    hover (item) {
      this.hovered = item
    },
    hideList () {
      if (this.hovered && this.text) {
        this.select(this.hovered)
      }

      this.show = false
      this.$emit('onHideList')
    },
    showList () {
      this.show = true
      this.$emit('onShowList')
    },
    onBlur () {
      this.hideList()
    },
    onFocus () {
      if (this.suggestions.length > 0) {
        this.showList()
      }
    },
    async getSuggestions (inputEvent) {
      this.selected = null
      this.text = inputEvent.target.value
      if (!!inputEvent.target.value) {
        let res = (await this.getList(inputEvent.target.value)) || [];
        this.$set(this, 'suggestions', res.slice(0, this.maxCount))

        if (!this.show) {
          this.showList()
        }

        if (this.suggestions.length === 0) {
          this.hideList()
        }
      } else {
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
  top: calc(100% + 5px);
  border-radius: 3px;
  border: 1px solid #aaa;
  background-color: #fff;
}

.vue-simple-suggest .suggestions .suggest-item {
  padding: 5px 10px;
}

.vue-simple-suggest .suggestions .suggest-item:hover,
.vue-simple-suggest .suggestions .suggest-item.hover {
  background-color: #2874D5;
  color: #fff;
}

.vue-simple-suggest .suggestions .suggest-item.selected {
  background-color: #2832D5;
  color: #fff;
}
</style>

