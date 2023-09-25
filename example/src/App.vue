<template>
  <div class="example">
    <p>
      v-model mode:
      <button
        :class="{ selected: mode === 'input', 'v-model-event': true }"
        @click="mode = 'input'"
      >
        input
      </button>

      <button
        :class="{ selected: mode === 'select', 'v-model-event': true }"
        @click="mode = 'select'"
      >
        select
      </button>
    </p>
    <vue-suggest
      class="asdad"
      pattern="\w+"
      v-model="model"
      v-model:modelSelect="modelSelect"
      :list="getList"
      :max-suggestions="10"
      :min-length="3"
      :debounce="200"
      :filter-by-query="false"
      :controls="{
        selectionUp: [38, 33],
        selectionDown: [40, 34],
        select: [13, 36],
        showList: [40],
        hideList: [27, 35]
      }"
      :mode="mode"
      :nullable-select="true"
      ref="suggestComponent"
      placeholder="Search information..."
      value-attribute="id"
      display-attribute="text"
      @suggestion-click="onSuggestClick"
      @select="onSuggestSelect"
      @hover="onSuggestHover"
      @focus="onFocus"
      @blur="onBlur"
      @request-start="onRequestStart"
      @request-done="onRequestDone"
      @request-failed="onRequestFailed"
      @show-list="onShowList"
      @hide-list="onHideList"
    >
      <!-- <input type="text"> -->

      <template v-slot="{ field }">
        <div class="g">
          <input v-bind="field" type="text" />
        </div>
      </template>

      <!-- <test-input placeholder="Search information..." /> -->

      <template v-slot:misc-item-above="{ suggestions, query }">
        <div class="misc-item">
          <span>You're searching for '{{ query }}'.</span>
        </div>

        <template v-if="suggestions.length > 0">
          <div class="misc-item">
            <span>{{ suggestions.length }} suggestions are shown...</span>
          </div>
          <hr />
        </template>

        <div class="misc-item" v-else-if="!loading">
          <span>No results</span>
        </div>
      </template>

      <template v-slot:suggestion-item="scope">
        <div :title="scope.suggestion.description">
          <div class="text">
            <span v-html="boldenSuggestion(scope)"></span>
          </div>
          <button @click.stop="addToLog(scope.suggestion.description)">
            Log
          </button>
          <button @click.stop="goto(scope.suggestion.link)">Open WIKI</button>
        </div>
      </template>

      <template v-slot:misc-item-below v-if="loading">
        <div class="misc-item">
          <span>Loading...</span>
        </div>
      </template>
    </vue-suggest>

    <div v-if="selected">
      Selected element ({{ typeof selected }}):
      <pre class="selected hljs"><code v-html="selected"></code></pre>
    </div>
    <div v-if="model && mode === 'input'">
      v-model ({{ typeof model }}):
      <pre class="selected hljs"><code v-html="stringify(model)"></code></pre>
    </div>
    <div v-if="modelSelect && mode === 'select'">
      v-model ({{ typeof modelSelect }}):
      <pre
        class="selected hljs"
      ><code v-html="stringify(modelSelect)"></code></pre>
    </div>
  </div>
  <div class="log-container">
    <p class="title">
      Event Log: (<a href="#clear" @click.prevent="log.splice(0)">clear</a>)
    </p>
    <div class="log" ref="log">
      <div v-for="(text, i) in log" :key="'p' + i" :ref="'p' + i">
        <pre v-html="text"></pre>
      </div>
    </div>
  </div>
</template>

<script>
import VueSuggest from 'vue-simple-suggest/lib'
import { toRaw } from 'vue'

export default {
  components: {
    VueSuggest
  },
  name: 'app',
  data() {
    return {
      selected: null,
      model: null,
      modelSelect: null,
      mode: 'input',
      loading: false,
      log: []
    }
  },
  methods: {
    boldenSuggestion(scope) {
      if (!scope) return scope

      const { suggestion, query } = scope

      let result = this.$refs.suggestComponent.displayProperty(suggestion)

      if (!query) return result

      const texts = query.split(/[\s-_/\\|.]/gm).filter((t) => !!t) || ['']
      return result.replace(
        new RegExp('(.*?)(' + texts.join('|') + ')(.*?)', 'gi'),
        '$1<b>$2</b>$3'
      )
    },
    goto(url) {
      window.open(url, '_blank').focus()
    },
    stringify(value) {
      return JSON.stringify(value, null, 2)
    },
    addToLog(name) {
      this.log.push(toRaw(name))

      console.log.apply(
        console,
        Array.from(arguments).map((e) => toRaw(e))
      )

      this.$nextTick(() => {
        this.$refs.log.scrollTop = this.$refs.log.scrollHeight
      })
    },
    onFocus(e) {
      this.addToLog('focus', e)
    },
    onBlur(e) {
      this.addToLog('blur', e)
    },
    onShowList() {
      this.addToLog('show-list')
    },
    onHideList() {
      this.addToLog('hide-list')
    },
    onSuggestClick(suggest, e) {
      this.addToLog('suggestion-click', suggest, e)
    },
    onSuggestSelect(suggest) {
      this.addToLog('select', suggest)
      this.selected = this.stringify(suggest)
    },
    onSuggestHover(suggestion) {
      this.addToLog('hover', suggestion)
    },
    onRequestStart(value) {
      this.loading = true

      this.addToLog('request-start', value)
    },
    onRequestDone(e) {
      this.loading = false

      this.addToLog('request-done', e)
    },
    onRequestFailed(e) {
      this.loading = false

      this.addToLog('request-failed', e)
    },
    getList(inputValue) {
      return new Promise((resolve, reject) => {
        // let url = `https://www.googleapis.com/books/v1/volumes?printType=books&q=${inputValue}`
        let url = `https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&namespace=*&search=${inputValue}&limit=10&namespace=0&format=json`
        // this.$refs.suggestComponent.clearSuggestions()
        fetch(url)
          .then((response) => {
            if (!response.ok) {
              reject()
            }

            response
              .json()
              .then((json) => {
                json.shift()
                let result = []
                const fields = ['text', 'description', 'link']
                json.forEach((part, i) => {
                  part.forEach((el, j) => {
                    if (!result[j]) {
                      result.push({
                        id: j + 1
                      })
                    }
                    result[j][fields[i]] = el
                  })
                })
                resolve(result)
                // resolve([...(json.items || [])])
              })
              .catch((e) => {
                reject(e)
              })
          })
          .catch((error) => {
            this.loading = false
            reject(error)
          })
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
  margin: 60px auto 0;
  width: 800px;
  height: 792px;
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
}

#app pre.selected {
  margin: 8px 0;
  height: 295px;
  overflow-x: scroll;
  overflow-y: scroll;
  border: 1px solid #cde;
  border-radius: 4px;
}

#app .v-model-event {
  background-color: white;
  color: black;
  border: 1px solid #cde;
  border-radius: 4px;
}

#app .v-model-event.selected {
  color: red;
}

#app .v-model-event:hover {
  border: 1px solid #2874d5;
  background-color: #2874d5;
  color: white;
}

#app .vue-simple-suggest .suggest-item .text {
  display: inline-block;
  line-height: 1;
  vertical-align: text-bottom;
  overflow: hidden;
  max-width: 72%;
  text-overflow: ellipsis;
}

#app .vue-simple-suggest .suggest-item .text span {
  white-space: nowrap;
}

#app .vue-simple-suggest .suggest-item button {
  float: right;
  line-height: 1;
  margin-left: 4px;
}

.vue-simple-suggest-enter-active.suggestions,
.vue-simple-suggest-leave-active.suggestions {
  transition: opacity 0.2s;
}

.vue-simple-suggest-enter.suggestions,
.vue-simple-suggest-leave-to.suggestions {
  opacity: 0 !important;
}
</style>
