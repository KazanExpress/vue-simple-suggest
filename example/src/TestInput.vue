<template>
  <input type="text" @input.stop="onInput" @blur.stop="onBlur" @focus.stop="onFocus" :value="value">
</template>

<script>
export default {
  props: ['value'],
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value)
    },
    onBlur (e) {
      this.$emit('blur', e)
      // console.log('blur')
    },
    onFocus (e) {
      this.$emit('focus', e)
      // console.log('focus')
    }
  }
}
</script>

<style scoped>
 input {
   color: red
 }
</style>
