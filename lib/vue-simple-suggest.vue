<template>
  <div class="vue-simple-suggest">
    <div class="input-wrapper" @input="getSuggestions" ref="inputSlot">
      <slot>
        <input type="text" :placeholder="placeholder" @blur="hideList" @focus="showList">
      </slot>
    </div>
    <div class="suggestions" v-if="!!show && !!suggestions.length">
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
      show: false
    }
  },
  created () {
    this.$on('input', this.getSuggestions)
  },
  mounted () {
    if (this.$slots.default[0].componentInstance) {
      this.$slots.default[0].componentInstance.$on('blur', this.hideList)
      this.$slots.default[0].componentInstance.$on('focus', this.showList)
      console.log('Component found')
    } else {
      let slotElement = this.$refs['inputSlot']
      let inputElement = slotElement.querySelector('input')
      if (!!inputElement) {
        inputElement.addEventListener('blur', this.hideList)
        inputElement.addEventListener('focus', this.showList)
        console.log('Input found')
      }
    }
    console.log(this.$slots.default[0])
  },
  beforeDestroy () {
    this.$off('input', this.getSuggestions)
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
        let res =  await this.getList()
        this.$set(this, 'suggestions', res)

        if (!this.suggestions.length) {
          this.hideList()
        }
      } else {
        this.hideList()
        this.$set(this, 'suggestions', [])
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

