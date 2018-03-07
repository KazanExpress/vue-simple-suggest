<template>
  <div id="app">
    <vue-suggest @onSelect="onSuggestSelect" :getList="getList" class="asdad" :maxCount="10" :isDesigned="true" @onShowList="onShowList" @onHideList="onHideList">
      <!-- <input type="text" v-model="val"> -->

      <div class="g"><input type="text" v-model="val"></div>

      <!-- <test-input v-model="val" /> -->
      <div slot="suggestionItem" slot-scope="{ suggest }">
        <div>My {{ suggest.title }}</div>
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
        selected: null,
        val: ''
      }
    },
    methods: {
      onShowList () {
        console.log('showList')
      },
      onHideList () {
        console.log('hideList')
      },
      onSuggestSelect (suggest) {
        this.selected = suggest
        this.val = this.selected.title
      },
      getList (inputValue) {
        return [0,0,0,0,0,0,0,0,0,0,0,0].map((v) => {
          let id = Math.floor(Math.random() * Math.floor(300))
          return { id, title: 'suggest item ' + id };
        }).filter((v, i, arr) => arr.findIndex(el => el.id === v.id) === i)
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
    margin: 60px auto 0;
    width: 500px;
  }
</style>
