<template>
  <div id="app">
    <vue-suggest @onSelect="onSuggestSelect" :getList="getList" class="asdad" :isDesigned="true">
      <!-- <test-input/> -->
      <!-- var1 -->
      <!-- <div class="g"><input type="text"></div> -->

      <!-- var2 -->
      <!-- <div class="h">
        <div class="e"></div>
      </div> -->

      <!-- var3 -->
      <test-input/>
      <div slot="suggestionItemTpl" slot-scope="{ suggest }">
        <p>My {{ suggest.title }}</p>
      </div>
    </vue-suggest>

    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consectetur iusto repellendus recusandae, distinctio ratione voluptate? Doloribus suscipit quibusdam atque perferendis quam consequatur dolore dolores nemo, quia exercitationem voluptatibus facere repellat.</p>
  </div>
</template>

<script>
  import VueSuggest from 'vue-simple-suggest'
  import TestInput from './TestInput'

  export default {
    components: {
      VueSuggest,
      TestInput
    },
    name: 'app',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    methods: {
      onSuggestSelect (suggest) {
        console.log(suggest)
      },
      getList (inputValue) {
        return [0,0,0,0,0].map(el => {
          let id = Math.floor(Math.random() * Math.floor(300))
          return el = {
            id,
            title: 'suggest item ' + id
          }
        })
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
