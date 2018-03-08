<template>
  <input type="text" @input="onInput" @blur="onBlur" @focus="onFocus" :value="value">
</template>

<script>
export default {
  props: ['value'],
  methods: {
    onInput (e) {
      this.$emit('input', e.target.value)
      // console.log('input', e)
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
