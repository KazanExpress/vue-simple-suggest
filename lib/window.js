import VueSimpleSuggest from './vue-simple-suggest.vue'

if (Vue || (window && window['Vue'])) {
  (Vue || window['Vue']).component('vue-simple-suggest', VueSimpleSuggest);
}

export default VueSimpleSuggest
