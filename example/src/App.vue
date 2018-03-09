<template>
  <div id="app">
    <div class="example">
      <p>v-model: {{ model || 'empty' }}</p>
      <vue-suggest class="asdad"
        v-model="model"
        :list="getList"
        :maxCount="10"
        :minLength="3"
        :debounce="200"
        :filterByQuery="false"
        ref="suggestComponent"
        valueAttribute="id"
        displayAttribute="volumeInfo.title"
        @select="onSuggestSelect"
        @hover="onSuggestHover"
        @focus="onFocus"
        @blur="onBlur"
        @requestStart="onRequestStart"
        @requestDone="onRequestDone"
        @requestFailed="onRequestFailed"
        @showList="onShowList"
        @hideList="onHideList">
        <!-- <input type="text"> -->

        <!-- <div class="g"><input type="text"></div> -->

        <test-input/>

        <template slot="miscItem-above" slot-scope="{ suggestions, query }">
          <div class="misc-item">
            <span>You're searching for {{ query }}.</span>
          </div>
          <div class="misc-item">
            <span>{{ suggestions.length }} suggestions are shown...</span>
          </div>
          <hr>
        </template>

        <!-- <div slot="suggestionItem" slot-scope="{ suggestion }">
          <div>{{ suggestion.title }}</div>
        </div> -->

        <div class="misc-item" slot="miscItem-below" slot-scope="{ suggestions }" v-if="loading">
          <span>Loading...</span>
        </div>
      </vue-suggest>

      <p v-if="selected">Selected element: <pre v-html="selected" class="selected"></pre></p>
    </div>
    <div class="log-container">
      <p class="title">
        Event Log: (<a href="#clear" @click.prevent="log.splice(0)">clear</a>)
      </p>
      <div class="log" ref="log" v-if="log.length > 0">
        <p v-for="(text, i) in log" :key="'p' + i" :ref="'p' + i"><pre v-html="text"></pre></p>
      </div>
      <p v-else>Empty</p>
    </div>
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
        model: '',
        loading: false,
        log: []
      }
    },
    methods: {
      addToLog (name, e) {
        this.log.push(name + (e ? ': ' + e.toString() : ''))
        this.$nextTick(() => {
          this.$refs.log.scrollTop = this.$refs.log.scrollHeight;
        })
      },
      onFocus (e) {
        this.addToLog('focus', e)
      },
      onBlur (e) {
        this.addToLog('blur', e)
      },
      onRequestStart (value) {
        this.addToLog('requestStart', value)
      },
      onRequestDone (e) {
        this.addToLog('requestDone', e)
      },
      onRequestFailed (e) {
        this.addToLog('requestFailed', e)
      },
      onShowList (e) {
        this.addToLog('showList', e)
      },
      onHideList (e) {
        this.addToLog('hideList', e)
      },
      onSuggestSelect (suggest) {
        this.addToLog('select', JSON.stringify(suggest))
        this.selected = suggest
      },
      onSuggestHover (suggestion) {
        this.addToLog('hover', JSON.stringify(suggestion));
      },
      getList (inputValue) {
        return new Promise((resolve, reject) => {
          let url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=${inputValue}`
          this.loading = true
          this.$refs.suggestComponent.clearSuggestions()
          fetch(url).then(response => {
            if (!response.ok) {
              reject()
            }

            response.json().then(json => {
              resolve([...(json.items || [])])
              this.loading = false
            }).catch(e => {
              this.loading = false
              reject(e)
            })
          }).catch(error => {
            this.loading = false
            reject(error)
          })
        })
        // return Math.random() > 0.2 ? [0,0,0,0,0,0,0,0,0,0,0,0].map((v) => {
        //   let id = Math.floor(Math.random() * Math.floor(300))
        //   return { id, title: 'suggest item ' + id };
        // }).filter((v, i, arr) => arr.findIndex(el => el.id === v.id) === i) : { id: 0, title: 'suggest item 0' }
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
    width: 800px;
    height: 374px;
    display: flex;
  }

  #app .log-container .title {
    position: sticky;
  }

  #app .example {
    width: 506px;
  }

  #app .example,
  #app .log-container,
  #app .log {
    padding: 0 16px;
  }

  #app .log-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 230px;
    max-width: 230px;
  }

  #app .log {
    height: 100%;
    border-radius: 3px;
    border: 1px solid #aaa;
    text-align: right;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  #app .log pre {
    white-space: pre-wrap;
    word-break: break-all;
  }

  #app pre.selected {
    width: 506px;
    height: 295px;
    overflow-x: scroll;
    overflow-y: scroll;
  }
</style>
