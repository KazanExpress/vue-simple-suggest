# vue-simple-suggest

> Suggest component for Vue.js

## Build Setup

``` bash
# install dependencies
npm install

# serve example with hot reload at localhost
npm run dev
```
-----

## What is it?

This is a simple yet feature-rich suggestion/autocomplete component for Vue.js.

It supports v-model, allows custom styling, custom input and suggestion list templates, API calls and more.

All of the props, events and slots are OPTIONAL for this component, so it can be used without any configuration at all.

-----
## Component API

### Example

```html
<vue-simple-suggest ref="vueSimpleSuggest"
  v-model="model"
  valueAttribute="id"
  displayAttribute="title"
  :placeholder="placeholder!!!"
  :get-list="getListFunction"
  :max-count="10"
  :min-length="3"
  :debounce="100"
  :destyled="false"
  :filter-by-query="false"
  :value="defaultValue"
  @input="onInputEvent"
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
  <input class="optionalCustomInput">
  <div slot="suggestionItem" slot-scope="{ suggestion }" class="custom">{{ suggestion.title }}</div>
</vue-simple-suggest>
```

-----
### API definitions

#### Data:
```js
const vueSimpleSuggest = this.$refs.vueSimpleSuggest;

// Currently selected element
vueSimpleSuggest.selected              // default: null,

// Currently hovered element
vueSimpleSuggest.hovered               // default: null,

// Current suggestions list
vueSimpleSuggest.suggestions           // default: [],

// Is suggestion list shown
vueSimpleSuggest.listShown              // default: false,

// Currently used HTMLInputElement
vueSimpleSuggest.inputElement          // default: null,

// Whether the assigned getListFuncion can be executed
vueSimpleSuggest.canSend               // default: true,

// The timeout until next getListFunction execution
vueSimpleSuggest.timeoutInstance       // default: null,

// Current input text
vueSimpleSuggest.text                  // default: vueSimpleSuggest.$props.value

// Whether this current custom input is a vue-component
vueSimpleSuggest.slotIsComponent

// Whether the list prop is a function
vueSimpleSuggest.listIsRequest

// A ref to the current input (component or vanilla)
vueSimpleSuggest.input

// The current hovered element index
vueSimpleSuggest.hoveredIndex
```

#### Props:
| Name                         | Type     | Default  | Description                                                                                                                    |
|------------------------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------|
| `maxSuggestions`               | Number   | `10`       | The maximum amount of suggestions to display. Set to 0 for infinite suggestions.                                                                                 |
| `displayAttribute`             | String   | `'title'`  | The property in a suggestion object to display in a list. Supports dotted paths.                                        |
| `valueAttribute`               | String   | `'id'`     | The property in a suggestion object to use as a unique key. Supports dotted paths.                                      |
| `getList`                      | Funciton | `() => []` | The array provider function, must accept a query as its only argument. Can return an array or a promise. Can be async. The component behaves as a simple input without this function. |
| `debounce`                     | Number   | `0`        | Determines the getList debounce (a time between the input event and a function execution).                                     |
| `destyled`                     | Boolean  | `false`    | Whether to cancel the default styling of input and suggestions list.                                                           |
| `filterByQuery`                     | Boolean  | `false`    | Whether to filter the resulting suggestions by input's text query (make it a search component).                                                           |
| type, value, pattern, etc... |          |          | All of the HTML5 input attributes with their respected default values.                                                         |

-----
#### Events:
| Name          | Arguments                   | Description                                                                                            |
|---------------|-----------------------------|--------------------------------------------------------------------------------------------------------|
| `input`         | HTML input event           | An outward projection of the current input's event.                                                    |
| `focus`         | HTML focus event           | An outward projection of the current input's event.                                                    |
| `blur`          | HTML focus event           | An outward projection of the current input's event.                                                    |
| `select`        | Selected suggestion         | Fires on suggestion selection (via a mouse click or enter keypress).                                   |
| `hover`         | Hovered suggestion          | Fires each time a new suggestion is highlighted (via a cursor movement or keyboard arrows).            |
| `showList`      | -                           | Fires each time the suggestion list is toggled to be shown.                                            |
| `hideList`      | -                           | Fires each time the suggestion list is being hidden.                                                   |
| `requestStart`  | Current input value (query) | Fires each time a `getList` function starts executing.                                                 |
| `requestDone`   | Resulting suggestions list  | Fires when a `getList` function successfully returns a result and forwards that result as an argument. |
| `requestFailed` | The interrrupting exception | Fires if an exception occurs during the execution of a `getList` funciton.                             |

-----

#### Methods:

| Name | Arguments | Description |
|      |           |             |
|------|-----------|-------------|
|`select`| `item` to select | Select the passed item (send it's value to input) |
|`hover`| `item` to hover ||

-----

#### Slots (all optional):

##### Custom input (default slot)
Supports nesting. Input props can be passed to a custom input to avoid their processing by vue-simple-suggest.
Defaults to a simple input with props passed to vue-simple-suggest.

**Warning:** `v-model` on a custom input IS NOT the same as `v-model` on vue-simple-suggest!
```html
<!--  Default HTMLInputElement example:  -->
<vue-simple-suggest v-model="model" placeholder="Text here" type="search" pattern="[a-z]+"/>
```
```html
<!--  Vanilla HTMLInputElement example 1:  -->
<vue-simple-suggest>
  <input pattern="[a-z]+">
</vue-simple-suggest>
```
```html
<!--  Vanilla HTMLInputElement example 2:  -->
<vue-simple-suggest v-model="model" placeholder="Text here" type="search">
  <input>
</vue-simple-suggest>
```
```html
<!--  Vanilla HTMLInputElement example 3 (fully equivalent to the second example):  -->
<vue-simple-suggest v-model="model">
  <input placeholder="Text here" type="search">
</vue-simple-suggest>
```
```html
<!--  Vanilla HTMLInputElement example 4 (nested):  -->
<vue-simple-suggest>
  <div>
    <section>
      <input type="email">
    </section>
  </div>
</vue-simple-suggest>
```
```html
<!--  Vue component example (also supports nesting):  -->
<vue-simple-suggest>
  <my-custom-input-somponent></my-custom-input-somponent>
</vue-simple-suggest>
```

##### Custom suggestion item (`suggestionItem` slot)

Allows custom html-definitons of the suggestion items in a list.
Defaults to `<span>{{ suggestion[displayAttribute] }}</span>`

```html
<!-- Example: -->
<vue-simple-suggest>
  <div slot="suggestionItem" slot-scope="{ suggestion }">
    <div>My {{ suggestion.title }}</div>
  </div>
</vue-simple-suggest>
```

##### Custom miscellanious item slots (`miscItem-above` and `miscItem-below` slots)

Allow custom elements to be shown in suggestion list. These elements never dissapear from the list, niether can they be selected nor hovered on.

These can be used for decoration, loaders, error messages and etc.

Do not have defaults, so are not shown until defined.

Accept the `suggestions` array and a `query` text as a `slot-scope` attribute values.

```html
<!-- Examples: -->
<vue-simple-suggest>
  <template slot="miscItem-above" slot-scope="{ suggestions, query }">
    <div class="misc-item">
      <span>You're searching for {{ query }}.</span>
    </div>
    <div class="misc-item">
      <span>{{ suggestions.length }} suggestions are shown...</span>
    </div>
  </template>

  <div slot="miscItem-below" slot-scope="{ suggestions }" v-if="isLoading" class="misc-item">
    <span>Loading...</span>
  </div>
</vue-simple-suggest>
```