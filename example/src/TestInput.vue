<template>
  <input type="text" @input="onInput" @blur="onBlur" @focus="onFocus">
</template>

<script>
export default {
  methods: {
    onInput (e) {
      this.$emit('input', e)
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
