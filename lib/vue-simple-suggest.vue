<template>
  <div class="vue-simple-suggest">
    <div class="input-wrapper" @input="getSuggestions" ref="inputSlot">
      <slot>
        <input type="text" :placeholder="placeholder" @blur="hideList" @focus="showList">
      </slot>
    </div>
    <div class="suggestions" v-if="!!show && suggestions.length > 0">
      <div class="suggest-item" v-for="suggest in suggestions" :key="suggest.id" @click="select(suggest)">
        <slot name="suggestionItemTpl" :suggest="suggest">
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
      type: String,
      default: ''
    },
    displayAttribute: {
      type: String,
      default: 'title'
    },
    getList: {
      type: Function,
      default: () => []
    }
  },
  data () {
    return {
      selected: null,
      suggestions: [],
      show: false,
      inputElement: null
    }
  },
  computed: {
    slotIsComponent() {
      return !!this.$slots.default[0].componentInstance;
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
    this.input[this.on]('blur', this.hideList)
    this.input[this.on]('focus', this.showList)
  },
  beforeDestroy () {
    this.$off('input', this.getSuggestions)
    this.input[this.off]('blur', this.hideList);
    this.input[this.off]('focus', this.showList);
  },
  methods: {
    select (item) {
      this.selected = item
      this.hideList()

      this.$emit('onSelect', item)
    },
    hideList () {
      console.log('hide')
      this.show = false
    },
    showList () {
      console.log('show')
      this.show = true
    },
    async getSuggestions (inputEvent) {
      if (!!inputEvent.target.value) {
        let res = (await this.getList()) || [];
        this.$set(this, 'suggestions', res)

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

.vue-simple-suggest .suggestions {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 5px);
  border: 1px solid #000;
}
</style>

