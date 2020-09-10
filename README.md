# vue-simple-suggest

> Simple yet feature-rich autocomplete component for Vue.js


[![npm](https://img.shields.io/npm/v/vue-simple-suggest.svg?style=flat-square)](https://www.npmjs.com/package/vue-simple-suggest "NPM package page")
[![live demo](https://img.shields.io/badge/demo-live-brightgreen.svg?style=flat-square)](https://kazanexpress.github.io/vue-simple-suggest/ "Live playground")
[![github repo](https://img.shields.io/badge/github-repo-lightgray.svg?style=flat-square)](https://github.com/KazanExpress/vue-simple-suggest "GitHub repository")
[![vue-awesome link](https://img.shields.io/badge/very-awesome-orange.svg?style=flat-square)](https://github.com/vuejs/awesome-vue#autocomplete "Our section at the vue-awesome repository")
[![npm](https://img.shields.io/npm/dm/vue-simple-suggest.svg?style=flat-square)](https://www.npmjs.com/package/vue-simple-suggest "Downloads per month")
[![All Contributors](https://img.shields.io/badge/contributors-25-blueviolet.svg?style=flat-square)](#contributors "Our awesome contributors!")

## Install

```bash
npm install --save vue-simple-suggest
```

See [installation guide](#installation) for more options.

## Table of contents

- [vue-simple-suggest](#vue-simple-suggest)
  - [Install](#install)
  - [Table of contents](#table-of-contents)
  - [What is it](#what-is-it)
    - [Features](#features)
    - [New features?](#new-features)
  - [Examples:](#examples)
    - [Simple example](#simple-example)
    - [Async example](#async-example)
  - [Installation](#installation)
    - [NPM](#npm)
    - [Unpkg](#unpkg)
    - [Importing](#importing)
      - [Polyfills](#polyfills)
    - [Usage](#usage)
  - [Build Setup](#build-setup)
  - [Default Controls](#default-controls)
  - [Component API](#component-api)
    - [TLDR](#tldr)
    - [CSS class structure](#css-class-structure)
      - [Transitions](#transitions)
    - [API definitions](#api-definitions)
      - [Props](#props)
        - [mode](#mode)
      - [Emitted Events](#emitted-events)
      - [Ref Methods](#ref-methods)
      - [Ref Event Handlers](#ref-event-handlers)
      - [Ref Data](#ref-data)
    - [Slots](#slots)
        - [Custom input](#custom-input)
        - [Accessibility on custom input](#accessibility-on-custom-input)
        - [Custom suggestion item](#custom-suggestion-item)
        - [Custom miscellanious item slots](#custom-miscellanious-item-slots)
  - [Contributors](#contributors)


## What is it

This is a simple yet feature-rich suggestion/autocomplete component for Vue.js.

Actually, it's so feature rich, that it's possible to do crazy stuff with it, like
  - Imitating drop-downs and drop-down menus
  - Turn suggestions list into an actual suggestions table
  - Work with ANY type of custom input passed (like type=button, radio and etc.)
  - ... And many more things

And, as a bonus, it is very light.

### Features

- `v-model` support.
- Automatic [accessibility attributes](#accessibility-on-custom-input) (WAI-ARIA complete)
- Switching `v-model` type (select/input).
- [Custom input](#custom-input) element through default slot.
- [Custom list items](#custom-suggestion-item) through named scoped slots.
- All HTML5-valid props for default input element are provided (`type`, `tabindex` and etc...).
- Customizable [keyboard controls](#default-controls).
- Rich and simple [API](#api-definitions).
- [CSS classes](#css-class-structure) for quick and easy restyling.
- Many build variants to choose from.
- Flexible and customizable component design.
- Optional polyfills for IE importable from the lib.

All of the props, events and slots are OPTIONAL for this component, so it can be used without any configuration at all.

### New features?

If you feel that something important is missing (or found a bug) - feel free to [create an issue](https://github.com/KazanExpress/vue-simple-suggest/issues/new). :)

-----

## Examples:

To use the component just install via NPM:

`npm install --save vue-simple-suggest`

Then, in your Vue.js component/page do the following...

### Simple example

If you need to suggest things from a static array:

```html
<!-- Some component.vue -->
<template>
  <vue-simple-suggest
    v-model="chosen"
    :list="simpleSuggestionList"
    :filter-by-query="true">
<!-- Filter by input text to only show the matching results -->
  </vue-simple-suggest>

  <br>

  <p>Chosen element: {{ chosen }}</p>
</template>

<script>
  import VueSimpleSuggest from 'vue-simple-suggest'
  import 'vue-simple-suggest/dist/styles.css' // Optional CSS

  export default {
    components: {
      VueSimpleSuggest
    },
    data() {
      return {
        chosen: ''
      }
    },
    methods: {
      simpleSuggestionList() {
        return [
          'Vue.js',
          'React.js',
          'Angular.js'
        ]
      }
    }
  }
</script>
```

### Async example

If you're dealing with async data from server (example using https://swapi.co/):

```html
<!-- Some component.vue -->
<template>
  <vue-simple-suggest
    v-model="chosen"
    display-attribute="name"
    value-attribute="url"
    :list="getSuggestionList"
  ></vue-simple-suggest>

  <br>

  <p>Chosen element: {{ chosen }}</p>
</template>

<script>
  import VueSimpleSuggest from 'vue-simple-suggest'
  import 'vue-simple-suggest/dist/styles.css' // Optional CSS

  export default {
    components: {
      VueSimpleSuggest
    },
    data() {
      return {
        chosen: ''
      }
    },
    methods: {
      // Function returning a promise as a factory for suggestion lists.
      //
      // vue-simple-suggest calls it automatically when an update to the list is needed,
      // no need for watchers here!
      getSuggestionList() {
        return fetch('https://swapi.co/api/people', { method: 'GET' })
          .then(response => response.json())
          .then(json => json.results); /*
          returns a promise with a list of star-wars characters
        */
      }
    }
  }
</script>
```

For a more advanced example (using wikipedia search)
see our [example source](https://github.com/KazanExpress/vue-simple-suggest/blob/master/example/src/App.vue).

-----

## Installation

### NPM

```bash
npm install --save vue-simple-suggest
# or
yarn add vue-simple-suggest
```

### Unpkg

If including via this method - the component will automatically install itself.

```html
<!-- UMD Component, async/await polyfills through promises -->
<script type="text/javascript" src="https://unpkg.com/vue-simple-suggest"></script>
<script type="text/javascript" src="https://unpkg.com/vue-simple-suggest@1.5.1"></script>
                                                              <!-- Specific version -->

<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/vue-simple-suggest/dist/styles.css">

<!-- If you need polyfills, use IIFE verision below -->
<!-- IIFE build includes ALL polyfills: Object.assign, Promises, Generators, Async/Await! -->
<script type="text/javascript" src="https://unpkg.com/vue-simple-suggest/dist/iife.js"></script>
```

### Importing

```js
/// ESNext (original code, no pollyfills, single-file .vue component, css included)
import VueSimpleSuggest from 'vue-simple-suggest/lib'
///

/// ES6 (async polyfills)
import VueSimpleSuggest from 'vue-simple-suggest'
// or, if you have problems importing:
import VueSimpleSuggest from 'vue-simple-suggest/dist/es6'
///

/// ES7 and above (no polyfills)
import VueSimpleSuggest from 'vue-simple-suggest/dist/es7'
///

/// CommonJS (async, arrow-functions and promises are polyfilled)
const VueSimpleSuggest = require('vue-simple-suggest')
// or, if you have problems importing:
const VueSimpleSuggest = require('vue-simple-suggest/dist/cjs')
///

// Optional - import css separately with css loaders:
import 'vue-simple-suggest/dist/styles.css'
```

#### Polyfills
> New in `v1.8.3`

`vue-simple-suggest` comes with minimal optional polyfills for IE11+ - `Object.assign`, `Element.prototype.closest` and `Element.prototype.matches`.
You can import them like this:
```js
import 'vue-simple-suggest/lib/polyfills';
// or
require('vue-simple-suggest/lib/polyfills');
```

### Usage

**Globaly:**

```js
// You don't need to do it, if including via <script> (umd, iife)
Vue.component('vue-simple-suggest', VueSimpleSuggest)
```

**In single-file .vue components:**

```html
<script>
  import VueSimpleSuggest from 'vue-simple-suggest'
  import 'vue-simple-suggest/dist/styles.css' // Using a css-loader

  export default {
    components: {
      VueSimpleSuggest
    }
  }
</script>
```

-----

## Build Setup

``` bash
# clone the repo
git clone https://github.com/KazanExpress/vue-simple-suggest.git
cd ./vue-simple-suggest

# install dependencies
npm install

# serve example with hot reload at localhost
npm run dev

# build example & readme for static serving
npm run docs
```

-----
## Default Controls

> New in [v1.2.0](https://github.com/KazanExpress/vue-simple-suggest/releases/tag/v1.2.0)

These are default keyboard shortcuts.

Can be customized with the [`controls` prop](#props). All fields in this `controls` object are optional.

Default scheme:

|Key (key code) | Description|
|-|-|
|`Escape` (27) | If the suggestions list is shown - hide it. Defined by `hideList` property. |
|`ArrowDown` (40) | If the suggestions list is hidden - show it.  Defined by `showList` property. |
|`ArrowUp` (38) / `ArrowDown` (40) | Cycle (hover) through suggestions.  Defined by `selectionUp`/`selectionDown` properties respectfully. |
|`Enter` (13) | If the list is shown - chooses the highlighted element.  Defined by `select` property.|
|`(Ctrl/Shift) + Space` (32) | Select the first element in the list.  Defined by `autocomplete` property. Works with `Ctrl` modifier key or `Shift` modifier key. |
|`(Ctrl/Shift) + Enter` (13) | Same as previous, but also hides the suggestions list. |

JS object:
```js
{
  selectionUp: [38],
  selectionDown: [40],
  select: [13],
  showList: [40],
  hideList: [27],
  autocomplete: [32, 13]
}
```

-----
## Component API

### TLDR
<details><summary>Click to expand</summary>

```html
<!-- Ref to access the API, v-model for efficient query binding -->
<vue-simple-suggest ref="vueSimpleSuggest" v-model="model"
  value-attribute="id"
  display-attribute="title"
  mode="input"
  placeholder="placeholder!!!"
  :list="getListFunction"
  :max-suggestions="10"
  :min-length="3"
  :debounce="100"
  :destyled="false"
  :remove-list="false"
  :filter-by-query="false"
  :filter="customFilterFunction"
  :value="defaultValue"
  :nullable-select="true"
  :controls="{
    selectionUp: [38, 33],
    selectionDown: [40, 34],
    select: [13, 36],
    showList: [40],
    hideList: [27, 35],
    autocomplete: [32, 13],
  }"
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
  <!-- v-model on input itself is useless -->
  <input class="optional-custom-input">

  <!-- Appears o top of the list -->
  <template slot="misc-item-above" slot-scope="{ suggestions, query }">
    <div class="misc-item">
      <span>You're searching for {{ query }}.</span>
    </div>
    <div class="misc-item">
      <span>{{ suggestions.length }} suggestions are shown...</span>
    </div>
    <hr>
  </template>

  <div slot="suggestion-item" slot-scope="{ suggestion }" class="custom">{{ suggestion.title }}</div>

  <!-- Appears below the list -->
  <div class="misc-item" slot="misc-item-below" slot-scope="{ suggestions }" v-if="loading">
    <span>Loading...</span>
  </div>
</vue-simple-suggest>
```

</details>

-----

### CSS class structure

If there's a need to customize the appearance of the component, here's the internal class-structure:

```less
// .designed is applied only if `destyled` prop is false.
.vue-simple-suggest.designed.focus // .focus is applied whenever the component is focused.
  .input-wrapper
    .default-input // Replaced with your custom input if default slot is provided.
  .suggestions // Also has transition classes, see below.
    .suggest-item
```

If you wish to use your existing classes, or frameworks like Bootstrap you can inject your own classes using the `'styles'` prop:

```html
<!-- Some component.vue -->
<template>
  <vue-simple-suggest
    v-model="chosen"
    :list="simpleSuggestionList"
    :styles="autoCompleteStyle"
    :destyled=true
    :filter-by-query="true">
  </vue-simple-suggest>
</template>

<script>
  ...
  export default {
    ...
    data() {
      return {
        autoCompleteStyle : {
          vueSimpleSuggest: "position-relative",
          inputWrapper: "",
          defaultInput : "form-control",
          suggestions: "position-absolute list-group z-1000",
          suggestItem: "list-group-item"
        }
      }
    },
    ...
  }
</script>`

<style lang="scss">
.z-1000 {
  z-index: 1000;
}
.hover {
  background-color: #007bff;
  color: #fff;
}
</style>
```

#### Transitions
> New in [v1.8.0](https://github.com/KazanExpress/vue-simple-suggest/releases/tag/v1.8.0)

You can also define custom list transitions by defining css rules for the transition named `vue-simple-suggest` on the `.suggestions` div:

```css
.suggestions {
  /* It's improtant to have a cpecific pivot point for transition:*/
  opacity: 1;
}

.vue-simple-suggest-enter-active.suggestions,
.vue-simple-suggest-leave-active.suggestions {
  /* Transition length here:*/
  transition: opacity .2s;
}

.vue-simple-suggest-enter.suggestions,
.vue-simple-suggest-leave-to.suggestions {
  /* Transition rule for "disengaged" element:*/
  opacity: 0;
}
```



-----
### API definitions

#### Props

| Name                           | Type     | Default  | Description         |
|--------------------------------|----------|----------|--------------------------------------------------------------|
| `controls` <sup>[v1.2.0](https://github.com/KazanExpress/vue-simple-suggest/releases/tag/v1.2.0)</sup>                    | Object   | See [default controls](#default-controls)  | Determines the keyboard shortcuts in key-codes (for browser-compatibility purposes). Arrays provide the ability to assign multiple keys to one action. Consists of 5 array fields: `selectionUp`, `selectionDown`, `select`, `hideList` and `autocomplete`, all of which are optional. |
| `max-suggestions`               | Number   | `10`       | The maximum amount of suggestions to display. Set to 0 for infinite suggestions. |
| `min-length`               | Number   | `1`       | The minimum amount of symbols in input to trigger suggestion list. `vue-simple-suggest` starts behaving as a dropdown menu, if the value is 0. |
| `display-attribute`             | String   | `'title'`  | The property in a suggestion object to display in a list. Supports dotted paths. |
| `value-attribute`               | String   | `'id'`     | The property in a suggestion object to use as a unique key. Supports dotted paths. |
| `list`                      | Function or Array | `() => []` | The array provider function, must accept a query as its only argument. Can return an array or a promise. Can be async. The component behaves as a simple input without this function. |
| `debounce`                     | Number   | `0`        | Determines the `list` debounce (a time between the input event and a function execution). |
| `destyled`                     | Boolean  | `false`    | Whether to cancel the default styling of input and suggestions list. |
| `styles` <sup>[v1.8.0](https://github.com/KazanExpress/vue-simple-suggest/releases/tag/v1.8.0)</sup>                    | Object  | `{}`    | CSS classes to attach with current component style. |
| `remove-list`                   | Boolean  | `false`    | If true - the suggestion list will be always hidden. |
| `filter-by-query`                | Boolean  | `false`    | Whether to filter the resulting suggestions by input's text query (make it a search component). |
| `filter` | Function | - | A custom function for filtering the suggestion results that accepts a single item and a query to filter by as its 2 arguments. Used only if `filter-by-query` is set to `true`. |
| `mode` <sup>[v1.4.0](https://github.com/KazanExpress/vue-simple-suggest/releases/tag/v1.4.0)</sup>                         | String | `'input'` | The `v-model` event. Determines the event, that triggers `v-model`. Can be one of `'input'` (`v-model` binds a displayed property) or `'select'` (`v-model` binds a selected item). |
| `type`, `value`, `pattern`, etc...   |          |            | All of the HTML5 input attributes with their respected default values. |
| `nullable-select` <sup>[v1.9.0](https://github.com/KazanExpress/vue-simple-suggest/releases/tag/v1.4.0)</sup>                    | Boolean  | `false`    | Whether the `select` should accept `null` or not. |

##### mode
> New in [v1.4.0](https://github.com/KazanExpress/vue-simple-suggest/releases/tag/v1.4.0)

Determines the event, that triggers `v-model`. Can be one of `'input'` (default) or `'select'`.

For example, if `'input'` is chosen - then v-model will update the value each time an [`input`](#emitted-events) event is fired, setting the input's string.

Same is for `'select'` - v-model changes only when something is selected from the list, setting the selected value (string, object or whatever) to its argument.

A proper use-case for it being when one wants to use the component only for selection binding and custom input for text binding:

```html
<vue-simple-suggest v-model="selected" mode="select">
  <input v-model="text">
</vue-simple-suggest>
```

-----
#### Emitted Events
| Name            | Arguments                   | Description                                                                                            |
|-----------------|-----------------------------|--------------------------------------------------------------------------------------------------------|
| `input`         | HTML input event            | An outward projection of the current input's event.                                                    |
| `focus`         | HTML focus event            | An outward projection of the current input's event.                                                    |
| `blur`          | HTML focus event            | An outward projection of the current input's event.                                                    |
| `select`        | Selected suggestion         | Fires on suggestion selection (via a mouse click or enter keypress).                                   |
| `hover`         | Hovered suggestion, target element          | Fires each time a new suggestion is highlighted (via a cursor movement or keyboard arrows).            |
| `suggestion-click`        | Selected suggestion, HTML click event        | Fires on suggestion element click.                                   |
| `show-list`      | -                           | Fires each time the suggestion list is toggled to be shown.                                            |
| `hide-list`      | -                           | Fires each time the suggestion list is being hidden.                                                   |
| `request-start`  | Current input value (query) | Fires each time a `list` function starts executing.                                                 |
| `request-done`   | Resulting suggestions list  | Fires when a `list` function successfully returns a result and forwards that result as an argument. |
| `request-failed` | The interrrupting exception | Fires if an exception occurs during the execution of a `list` funciton.                             |

-----

#### Ref Methods
> accessed via `$refs.*your ref name here*`

| Name | Arguments | Description |
|------|-----------|-------------|
|`showList`| - | Shows the suggestion list. Emits the respected [event](#emitted-events). |
|`hideList`| - | Hides the suggestion list. Emits the respected [event](#emitted-events). |
|`getSuggestions`| `query`: string | Gets and processes suggestions from the `list` prop. Returns a promise. Emits the `requestStart`, `requestDone` and `requestFailed` [events](#emitted-events). |
|`research`| - | Debounced `getSuggestions` on the current input value. |
|`clearSuggestions`| - | Clears the `suggestions` array. |
|`select`| suggestion | Selects the passed suggestion. Emits the respected [event](#emitted-events). |
|`hover`| suggestion | Hovers over the passed suggestion. Emits the respected [event](#emitted-events). |
|`displayProperty`| suggestion | Returns the displayed property of a suggestion. |
|`valueProperty`| suggestion | Returns the value property of a suggestion. |
|`setText` <sup>v1.9.0</sup> | text | Reliably sets custom text to the input field. |
|`autocompleteText` <sup>v1.10.0</sup> | suggestion | Autocompletes the input text using the suggestion passed as the only argument. |

-----

#### Ref Event Handlers
> accessed via `$refs.*your ref name here*`

You can use these to imitate some of the component's behaviours.

| Name | Arguments | Description |
|------|-----------|-------------|
|`onShowList`|| Invoked when a suggestion list needs to be shown. |
|`showSuggestions`|| Shows suggestion list, refreshes the data if needed. |
|`onInput`| HTML input event | Invoked whenever the input text is changed. Emits the [`input`](#emitted-events) event. |
|`onFocus`| HTML focus event | Invoked whenever the input comes into focus, emits the [`focus`](#emitted-events) event. |
|`onBlur`| HTML focus event | Antonym to `onFocus`. |
|`onAutocomplete`| - | Invoked when the autocomplete [keyboard shortcut](#default-controls) is pressed. Selects the first suggestion. |
|`onListKeyUp`| HTML keyup event | Invoked on component keyup. Internally used for hiding the list. |
|`onKeyDown`| HTML keydown event | Invoked on component keydown. Internally used for showing the list, updating suggestions and preventing form submit. |
|`moveSelection`|| Invoked when hovered element needs to be changed. |
|`suggestionClick`| `suggestion`, HTML click event | Invoked on any suggestion click. Can be used to emulate such a click from ouside of the component. |

-----

#### Ref Data
> accessed via `$refs.*your ref name here*`

| Name | Default | Description |
|------|-----------|-------------|
|`selected`| `null` | Currently selected element. |
|`hovered`| `null` | Currently hovered element. |
|`suggestions`| `[]` | Current suggestions list. |
|`textLength`| `0` | Length of the text in the input. |
|`listShown`| `false` | Is suggestion list shown. |
|`inputElement`| `null` | Currently used HTMLInputElement. |
|`canSend`| `true` | Whether the assigned getListFuncion can be executed. |
|`timeoutInstance`| `null` | The timeout until next getListFunction execution. |
|`text`| `$props.value` | Current input text. |
|`slotIsComponent`| `false` | Whether this current custom input is a vue-component. |
|`listIsRequest`| - | Whether the list prop is a function. |
|`input`| - | A ref to the current input (component or vanilla). |
|`hoveredIndex`| - | The current hovered element index. |
|`controlScheme`| [Default Controls](#default-controls) | The current controls scheme. |
|`isPlainSuggestion`| `false` | Whether the current suggestions list consists of plain strings (not objects). |
|`isClicking`| `false` | `true` if the user currently clicks. |
|`isOverList`| `false` | `true` if the user currently hovers over suggestions list. |
|`isInFocus`| `false` | `true` if the component is currently in focus. |
|`isTabbed`| `false` | `true` if the user pressed tab, while the component is in focus. |
|`isSelectedUpToDate`| `false` | `true` if the user hasn't done any inputs since the last selection, so the selection is still relevant. |

-----

### Slots

##### Custom input
> default slot (optional)

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
<vue-simple-suggest v-model="model">
  <div>
    <section>
      <input type="email">
    </section>
  </div>
</vue-simple-suggest>
```
```html
<!--  Vue component example (also supports nesting):  -->
<vue-simple-suggest v-model="vModelGoesHere">
  <my-custom-input-somponent :value="initialInputValueGoesHere"></my-custom-input-somponent>
</vue-simple-suggest>
```

**Custom input component caveats:**

To work with the `vue-simple-suggest` your custom input component has to follow certain standard behaviours.

Custom input component **must** (in order to work properly):
 - Emit an `input` event.
 - Emit `focus` and `blur` events.
 - Have a `value` prop.

Custom input component **should** (in order to avoid usage limitations):
 - Not stop any event propagations from internal input HTML element.
 - Forward an original event argument with `focus` and `blur` events.

If `vue-simple-suggest` with your custom component doesn't seem to react to outside variable changes - bind both components' v-model to the same variable, like so:
```html
<vue-simple-suggest v-model="model">
  <my-custom-input-somponent v-model="model"></my-custom-input-somponent>
</vue-simple-suggest>
```

##### Accessibility on custom input

> New in [v1.9.0](https://github.com/KazanExpress/vue-simple-suggest/releases/tag/v1.9.0)

`vue-simple-suggest` automatically injects 3 necessary ARIA attributes for the default `<input>` element
and any custom input, as long as your custom input component contains an html `<input>` element.

These attributes ensure that the autocomplete can be used by users who rely on Screen Readers.

| Name                  | Value                              | Description                            |
|-----------------------|------------------------------------|----------------------------------------|
| aria-autocomplete     | `"list"`                           | Indicates that the autocomplete behavior of the text input is to suggest a list of possible values in a popup. |
| aria-controls         | IDREF of `suggestions` list        | IDREF of the popup element that lists suggested values. |
| aria-activedescendant | IDREF of hovered option            | Enables assistive technologies to know which element the application regards as focused while DOM focus remains on the input element. |


##### Custom suggestion item
> `suggestion-item` slot (optional)

**Description**

Allows custom html-definitons of the suggestion items in a list.
Defaults to `<span>{{ displayAttribute(suggestion) }}</span>`

Accepts the `suggestion` object and a `query` text as a `slot-scope` attribute values.

```html
<!-- Example (book suggestions): -->
<vue-simple-suggest>
  <div slot="suggestion-item" slot-scope="{ suggestion, query }">
    <div>{{ suggestion.title }} by {{ suggestion.author }}</div>
  </div>
</vue-simple-suggest>
```

**Custom buttons inside of suggestion items**

If you want to add some action buttons to the suggetion items,
just use the `.stop` directive modifier to prevent the default `suggestion-click`:

```html
<!-- Example (editable book suggestion): -->
<vue-simple-suggest>
  <div slot="suggestion-item" slot-scope="{ suggestion, query }">
    <span>{{ suggestion.title }} by {{ suggestion.author }}</span>
    <button @click.stop="remove(suggestion)">remove from list</button>
    <button @click.stop="like(suggestion)">add to favorites</button>
  </div>
</vue-simple-suggest>
```

In this case, the buttons will ONLY execute the bound method and will not select the suggested item.

**Manual autocomplete**

If there's a need to autocomplete the suggestion in the input instead of selecting it (like in mobile suggestions of google search),
you can use the `autocomplete()` function in the slot's scope:

```html
<!-- Example: -->
<vue-simple-suggest>
  <div slot="suggestion-item" slot-scope="{ suggestion, autocomplete }">
    <span>{{ suggestion.title }} by {{ suggestion.author }}</span>
    <button @click.stop="autocomplete()">Complete input</button>
  </div>
</vue-simple-suggest>
```

or in the [ref methods](#ref-methods):

```html
<template>
  <vue-simple-suggest ref="suggest">
    <div slot="suggestion-item" slot-scope="{ suggestion }">
      <span>{{ suggestion.title }} by {{ suggestion.author }}</span>
      <button @click.stop="onAutocompleteButtonClick(suggestion)">Complete input</button>
    </div>
  </vue-simple-suggest>
</template>

<script>
export default {
  //...
  methods: {
    onAutocompleteButtonClick(suggestion) {
      this.$refs.suggest.autocompleteText(suggestion);
    }
  }
  //...
}
</script>
```


**Ref Data**

In cooperation with [ref fields](#ref-methods) this slot can be used to drastically transform the suggestion list behaviour.

One of the simplest examples - highlighting the query text in the results:

```html
<div slot="suggestion-item" slot-scope="scope">
  <span v-html="boldenSuggestion(scope)"></span>
</div>
```

```js
boldenSuggestion(scope) {
  if (!scope) return scope;

  const { suggestion, query } = scope;

  let result = this.$refs.suggestComponent.displayProperty(suggestion);

  if (!query) return result;

  const texts = query.split(/[\s-_/\\|\.]/gm).filter(t => !!t) || [''];
  return result.replace(new RegExp('(.*?)(' + texts.join('|') + ')(.*?)','gi'), '$1<b>$2</b>$3');
}
```
Result via Google Books search API:

![](assets/screenshot.jpg)

##### Custom miscellanious item slots
> `misc-item-above` and `misc-item-below` slots (optional)

Allow custom elements to be shown in suggestion list. These elements never dissapear from the list, neither can they be selected nor hovered on.

They can be used for decoration, loaders, error messages and etc.

These slots don't have defaults, so they are not shown until defined.

Accept the `suggestions` array and a `query` text as a `slot-scope` attribute values.

```html
<!-- Examples: -->
<vue-simple-suggest>
  <template slot="misc-item-above" slot-scope="{ suggestions, query }">
    <div class="misc-item">
      <span>You're searching for {{ query }}.</span>
    </div>
    <div class="misc-item">
      <span>{{ suggestions.length }} suggestions are shown...</span>
    </div>
  </template>

  <div slot="misc-item-below" slot-scope="{ suggestions }" v-if="isLoading" class="misc-item">
    <span>Loading...</span>
  </div>
</vue-simple-suggest>
```

These slots can also be used to handle empty results, like this:

```html
<!-- Main slot template -->
<template slot="misc-item-above" slot-scope="{ suggestions, query }">
  <div class="misc-item">
    <span>You're searching for '{{ query }}'.</span>
  </div>

  <!-- Sub-template if have any suggestions -->
  <template v-if="suggestions.length > 0">
    <div class="misc-item">
      <span>{{ suggestions.length }} suggestions are shown...</span>
    </div>
    <hr>
  </template>

  <!-- Show "No result" otherwise, if not loading new ones -->
  <div class="misc-item" v-else-if="!loading">
    <span>No results</span>
  </div>
</template>
```

----

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Raiondesu"><img src="https://avatars3.githubusercontent.com/u/19854420?v=4" width="100px;" alt=""/><br /><sub><b>Alexey</b></sub></a><br /><a href="#creator-Raiondesu" title="Original creator">😇</a></td>
    <td align="center"><a href="https://github.com/kaskar2008"><img src="https://avatars3.githubusercontent.com/u/6456858?v=4" width="100px;" alt=""/><br /><sub><b>Karen</b></sub></a><br /><a href="#creator-pokerface-kaskar2008" title="Original creator">😐</a></td>
    <td align="center"><a href="http://simeon.fyi"><img src="https://avatars3.githubusercontent.com/u/28311328?v=4" width="100px;" alt=""/><br /><sub><b>Simeon Kerkola</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=sssmi" title="Code">💻</a> <a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=sssmi" title="Documentation">📖</a> <a href="#ideas-sssmi" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/rcostalenz"><img src="https://avatars0.githubusercontent.com/u/4765136?v=4" width="100px;" alt=""/><br /><sub><b>Roberson Costa</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=rcostalenz" title="Code">💻</a> <a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=rcostalenz" title="Documentation">📖</a> <a href="#ideas-rcostalenz" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/rosdi"><img src="https://avatars2.githubusercontent.com/u/5094028?v=4" width="100px;" alt=""/><br /><sub><b>Rosdi Kasim</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=rosdi" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/antoinematyja"><img src="https://avatars2.githubusercontent.com/u/9961462?v=4" width="100px;" alt=""/><br /><sub><b>antoinematyja</b></sub></a><br /><a href="#ideas-antoinematyja" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://www.contoweb.ch/"><img src="https://avatars1.githubusercontent.com/u/24254923?v=4" width="100px;" alt=""/><br /><sub><b>Matthias Martin</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Amatthiascw" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://robjbrain.com"><img src="https://avatars0.githubusercontent.com/u/10143910?v=4" width="100px;" alt=""/><br /><sub><b>Rob Brain</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Arobjbrain" title="Bug reports">🐛</a> <a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Arobjbrain" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/MrWook"><img src="https://avatars1.githubusercontent.com/u/20294042?v=4" width="100px;" alt=""/><br /><sub><b>MrWook</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3AMrWook" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/nattam"><img src="https://avatars3.githubusercontent.com/u/19463672?v=4" width="100px;" alt=""/><br /><sub><b>nattam</b></sub></a><br /><a href="#ideas-nattam" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/petyunchik"><img src="https://avatars1.githubusercontent.com/u/673497?v=4" width="100px;" alt=""/><br /><sub><b>Petr</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Apetyunchik" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/RMFogarty"><img src="https://avatars0.githubusercontent.com/u/10094132?v=4" width="100px;" alt=""/><br /><sub><b>RMFogarty</b></sub></a><br /><a href="#question-RMFogarty" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://brickgale.github.io"><img src="https://avatars3.githubusercontent.com/u/6366161?v=4" width="100px;" alt=""/><br /><sub><b>Brian Monsales</b></sub></a><br /><a href="#question-brickgale" title="Answering Questions">💬</a></td>
    <td align="center"><a href="http://www.mila76.it"><img src="https://avatars3.githubusercontent.com/u/378500?v=4" width="100px;" alt=""/><br /><sub><b>Mila76</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Amila76" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Lofbergio"><img src="https://avatars3.githubusercontent.com/u/1188259?v=4" width="100px;" alt=""/><br /><sub><b>Andriy Löfberg</b></sub></a><br /><a href="#question-Lofbergio" title="Answering Questions">💬</a> <a href="#ideas-Lofbergio" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=Lofbergio" title="Code">💻</a></td>
    <td align="center"><a href="http://buno.com.br"><img src="https://avatars3.githubusercontent.com/u/5221494?v=4" width="100px;" alt=""/><br /><sub><b>Bruno Monteiro</b></sub></a><br /><a href="#ideas-bunomonteiro" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/hannesaasamets"><img src="https://avatars1.githubusercontent.com/u/20644595?v=4" width="100px;" alt=""/><br /><sub><b>hannesaasamets</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Ahannesaasamets" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/Geminii"><img src="https://avatars1.githubusercontent.com/u/9429420?v=4" width="100px;" alt=""/><br /><sub><b>Jimmy</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3AGeminii" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.lastmileretail.com"><img src="https://avatars0.githubusercontent.com/u/10226784?v=4" width="100px;" alt=""/><br /><sub><b>Will Plaehn</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=willplaehn" title="Code">💻</a> <a href="#ideas-willplaehn" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=willplaehn" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/lauri911"><img src="https://avatars2.githubusercontent.com/u/12371449?v=4" width="100px;" alt=""/><br /><sub><b>lauri911</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Alauri911" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/alexhyriavets"><img src="https://avatars2.githubusercontent.com/u/19614509?v=4" width="100px;" alt=""/><br /><sub><b>Alex Hyriavets</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Aalexhyriavets" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/behnoodk"><img src="https://avatars3.githubusercontent.com/u/12370595?v=4" width="100px;" alt=""/><br /><sub><b>Behnood Khani</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Abehnoodk" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.haykranen.nl"><img src="https://avatars3.githubusercontent.com/u/129681?v=4" width="100px;" alt=""/><br /><sub><b>Hay Kranen</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=hay" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/shrpne"><img src="https://avatars1.githubusercontent.com/u/392907?v=4" width="100px;" alt=""/><br /><sub><b>shrpne</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Ashrpne" title="Bug reports">🐛</a> <a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=shrpne" title="Code">💻</a> <a href="#ideas-shrpne" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/DragosPeta"><img src="https://avatars3.githubusercontent.com/u/10923419?v=4" width="100px;" alt=""/><br /><sub><b>Peta Dragos-Andrei</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3ADragosPeta" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/shoito"><img src="https://avatars1.githubusercontent.com/u/37051?v=4" width="100px;" alt=""/><br /><sub><b>shoito</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=shoito" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/yamagen0915"><img src="https://avatars1.githubusercontent.com/u/2683573?v=4" width="100px;" alt=""/><br /><sub><b>yamagen0915</b></sub></a><br /><a href="https://github.com/KazanExpress/vue-simple-suggest/issues?q=author%3Ayamagen0915" title="Bug reports">🐛</a> <a href="https://github.com/KazanExpress/vue-simple-suggest/commits?author=yamagen0915" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind are welcome!
