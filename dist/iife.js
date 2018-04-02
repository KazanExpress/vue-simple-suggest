/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

var VueSimpleSuggest = (function () {
  'use strict';

  var defaultControls = {
    selectionUp: [38],
    selectionDown: [40],
    select: [13],
    hideList: [27],
    autocomplete: [32, 13]
  };

  var modes = {
    input: String,
    select: Object
  };

  var inputProp = {
    type: String
  };

  var inputProps = {
    type: inputProp,
    accesskey: inputProp,
    autocomplete: inputProp,
    form: inputProp,
    formaction: inputProp,
    formenctype: inputProp,
    formmethod: inputProp,
    formtarget: inputProp,
    height: inputProp,
    width: inputProp,
    inputmode: inputProp,
    max: inputProp,
    min: inputProp,
    minlength: inputProp,
    maxlength: inputProp,
    name: inputProp,
    pattern: inputProp,
    placeholder: inputProp,
    selectionDirection: inputProp,
    selectionEnd: inputProp,
    selectionStart: inputProp,
    size: inputProp,
    src: inputProp,
    step: inputProp,
    tabindex: inputProp,
    title: inputProp,
    spellcheck: {},
    readonly: {},
    required: {},
    multiple: {},
    formnovalidate: {},
    autofocus: {},
    checked: {},
    disabled: {}
  };

  function fromPath(obj, path) {
    return path.split('.').reduce(function (o, i) {
      return o === Object(o) ? o[i] : o;
    }, obj);
  }

  function hasKeyCode(arr, event) {
    if (arr.length <= 0) return false;

    var has = function has(arr) {
      return arr.some(function (code) {
        return code === event.keyCode;
      });
    };
    if (Array.isArray(arr[0])) {
      return arr.some(function (array) {
        return has(array);
      });
    } else {
      return has(arr);
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var event = 'input';

  var VueSimpleSuggest = {
    render: function render() {
      var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "vue-simple-suggest" }, [_c('div', { ref: "inputSlot", staticClass: "input-wrapper", class: { designed: !_vm.destyled }, on: { "click": _vm.onInputClick, "input": _vm.onInput, "keydown": _vm.onArrowKeyDown, "keyup": function keyup($event) {
            _vm.onListKeyUp($event), _vm.onAutocomplete($event);
          } } }, [_vm._t("default", [_c('input', _vm._b({ staticClass: "default-input", domProps: { "value": _vm.text || '' } }, 'input', _vm.$props, false))])], 2), _vm._v(" "), !!_vm.listShown && !_vm.removeList && !_vm.miscSlotsAreEmpty() ? _c('div', { staticClass: "suggestions", class: { designed: !_vm.destyled } }, [_vm._t("misc-item-above", null, { suggestions: _vm.suggestions, query: _vm.text }), _vm._v(" "), _vm._l(_vm.suggestions, function (suggestion, index) {
        return _c('div', { key: _vm.isPlainSuggestion ? 'suggestion-' + index : _vm.valueProperty(suggestion), staticClass: "suggest-item", class: {
            selected: _vm.selected && _vm.valueProperty(suggestion) == _vm.valueProperty(_vm.selected),
            hover: _vm.hovered && _vm.valueProperty(_vm.hovered) == _vm.valueProperty(suggestion)
          }, on: { "mouseenter": function mouseenter($event) {
              _vm.hover(suggestion, $event.target);
            }, "mouseleave": function mouseleave($event) {
              _vm.hover(null, $event.target);
            } } }, [_vm._t("suggestion-item", [_c('span', [_vm._v(_vm._s(_vm.displayProperty(suggestion)))])], { suggestion: suggestion, query: _vm.text })], 2);
      }), _vm._v(" "), _vm._t("misc-item-below", null, { suggestions: _vm.suggestions, query: _vm.text })], 2) : _vm._e()]);
    },
    staticRenderFns: [],
    name: 'vue-simple-suggest',
    model: {
      prop: 'value',
      get event() {
        return event;
      }
    },
    props: _extends({}, inputProps, {
      controls: {
        type: Object,
        default: function _default() {
          return defaultControls;
        }
      },
      minLength: {
        type: Number,
        default: 1
      },
      maxSuggestions: {
        type: Number,
        default: 10
      },
      displayAttribute: {
        type: String,
        default: 'title'
      },
      valueAttribute: {
        type: String,
        default: 'id'
      },
      list: {
        type: [Function, Array],
        default: function _default() {
          return [];
        }
      },
      removeList: {
        type: Boolean,
        default: false
      },
      destyled: {
        type: Boolean,
        default: false
      },
      filterByQuery: {
        type: Boolean,
        default: false
      },
      filter: {
        type: Function,
        default: function _default(el) {
          return value ? ~this.displayProperty(el).toLowerCase().indexOf(value.toLowerCase()) : true;
        }
      },

      debounce: {
        type: Number,
        default: 0
      },
      value: {},
      mode: {
        type: String,
        default: event,
        validator: function validator(value) {
          return !!~Object.keys(modes).indexOf(value.toLowerCase());
        }
      }
    }),
    // Handle run-time mode changes:
    watch: {
      mode: function mode(v) {
        return event = v;
      }
    },
    //
    data: function data() {
      return {
        selected: null,
        hovered: null,
        suggestions: [],
        listShown: false,
        inputElement: null,
        canSend: true,
        timeoutInstance: null,
        text: this.value,
        isPlainSuggestion: false,
        controlScheme: {}
      };
    },

    computed: {
      slotIsComponent: function slotIsComponent() {
        return this.$slots.default && this.$slots.default.length > 0 && !!this.$slots.default[0].componentInstance;
      },
      listIsRequest: function listIsRequest() {
        return typeof this.list === 'function';
      },
      input: function input() {
        return this.slotIsComponent ? this.$slots.default[0].componentInstance : this.inputElement;
      },
      on: function on() {
        return this.slotIsComponent ? '$on' : 'addEventListener';
      },
      off: function off() {
        return this.slotIsComponent ? '$off' : 'removeEventListener';
      },
      hoveredIndex: function hoveredIndex() {
        var _this = this;

        return this.suggestions.findIndex(function (el) {
          return _this.hovered && _this.valueProperty(_this.hovered) == _this.valueProperty(el);
        });
      }
    },
    created: function created() {
      this.controlScheme = _extends({}, defaultControls, this.controls);
      event = this.mode;
    },
    mounted: function mounted() {
      this.inputElement = this.$refs['inputSlot'].querySelector('input');
      this.input[this.on]('blur', this.onBlur);
      this.input[this.on]('focus', this.onFocus);
    },
    beforeDestroy: function beforeDestroy() {
      this.input[this.off]('blur', this.onBlur);
      this.input[this.off]('focus', this.onFocus);
    },

    methods: {
      miscSlotsAreEmpty: function miscSlotsAreEmpty() {
        var _this2 = this;

        var slot = function slot(name) {
          return _this2.$scopedSlots['misc-item-' + name];
        };
        var isFunction = function isFunction(slotName) {
          return slot(slotName) && typeof slot(slotName) === 'function';
        };

        return ['above', 'below'].some(function (slotName) {
          return isFunction(slotName) ? !slot(slotName)(_this2) : !slot(slotName);
        });
      },
      displayProperty: function displayProperty(obj) {
        return (this.isPlainSuggestion ? obj : fromPath(obj, this.displayAttribute)) + '';
      },
      valueProperty: function valueProperty(obj) {
        return this.isPlainSuggestion ? obj : fromPath(obj, this.valueAttribute);
      },
      select: function select(item) {
        this.hovered = null;
        this.selected = item;

        this.$emit('select', item);

        // Ya know, input stuff
        this.$emit('input', this.displayProperty(item));
        this.inputElement.value = this.displayProperty(item);
        this.text = this.displayProperty(item);

        this.inputElement.focus();
      },
      hover: function hover(item, elem) {
        this.hovered = item;
        if (this.hovered != null) {
          this.$emit('hover', item, elem);
        }
      },
      hideList: function hideList() {
        var ignoreSelection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (this.listShown) {
          if (this.hovered && !ignoreSelection) {
            this.select(this.hovered);
          }
          this.listShown = false;
          this.$emit('hide-list');
        }
      },
      showList: function showList() {
        if (!this.listShown && this.text && this.text.length >= this.minLength) {
          if (this.suggestions.length > 0) {
            this.listShown = true;
            this.$emit('show-list');
          }
        }
      },
      onInputClick: function onInputClick(event) {
        var _this3 = this;

        return asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(_this3.minLength === 0 && !_this3.text)) {
                    _context.next = 3;
                    break;
                  }

                  _context.next = 3;
                  return _this3.research();

                case 3:

                  _this3.showList();

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this3);
        }))();
      },
      onArrowKeyDown: function onArrowKeyDown(event) {
        if (hasKeyCode([this.controlScheme.selectionUp, this.controlScheme.selectionDown], event)) {
          event.preventDefault();
          this.showList();

          var isArrowDown = hasKeyCode(this.controlScheme.selectionDown, event);
          var direction = isArrowDown * 2 - 1;
          var listEdge = isArrowDown ? 0 : this.suggestions.length - 1;
          var hoversBetweenEdges = isArrowDown ? this.hoveredIndex < this.suggestions.length - 1 : this.hoveredIndex > 0;

          var item = null;

          if (!this.hovered) {
            item = this.selected || this.suggestions[listEdge];
          } else if (hoversBetweenEdges) {
            item = this.suggestions[this.hoveredIndex + direction];
          } else /* if hovers on edge */{
              item = this.suggestions[listEdge];
            }

          this.hover(item);
        }
      },
      onListKeyUp: function onListKeyUp(event) {
        var select = this.controlScheme.select,
            hideList = this.controlScheme.hideList;

        if (hasKeyCode([select, hideList], event)) {
          event.preventDefault();
          if (this.listShown) {
            this.hideList(hasKeyCode(hideList, event));
          } else if (hasKeyCode(select, event)) {
            this.research();
          }
        }
      },
      onAutocomplete: function onAutocomplete(event) {
        if (hasKeyCode(this.controlScheme.autocomplete, event) && (event.ctrlKey || event.shiftKey)) {
          event.preventDefault();
          this.select(this.suggestions[0]);
          this.hover(this.suggestions[0]);
        }
      },
      onBlur: function onBlur(e) {
        this.hideList();
        this.$emit('blur', e);
      },
      onFocus: function onFocus(e) {
        this.$emit('focus', e);
        this.showList();
      },
      onInput: function onInput(inputEvent) {
        this.text = inputEvent.target.value;
        this.$emit('input', this.text);

        if (this.selected) {
          this.selected = null;
          this.$emit('select', null);
        }

        if (this.debounce) {
          clearTimeout(this.timeoutInstance);
          this.timeoutInstance = setTimeout(this.research, this.debounce);
        } else {
          this.research();
        }
      },
      research: function research() {
        var _this4 = this;

        return asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;

                  if (!_this4.canSend) {
                    _context2.next = 10;
                    break;
                  }

                  _this4.canSend = false;
                  _context2.t0 = _this4;
                  _context2.t1 = _this4;
                  _context2.next = 7;
                  return _this4.getSuggestions(_this4.text);

                case 7:
                  _context2.t2 = _context2.sent;

                  _context2.t0.$set.call(_context2.t0, _context2.t1, 'suggestions', _context2.t2);

                  _this4.canSend = true;

                case 10:
                  _context2.next = 16;
                  break;

                case 12:
                  _context2.prev = 12;
                  _context2.t3 = _context2['catch'](0);

                  _this4.clearSuggestions();
                  throw _context2.t3;

                case 16:
                  _context2.prev = 16;

                  _this4.$nextTick(function () {
                    if (_this4.suggestions.length === 0 && _this4.miscSlotsAreEmpty()) {
                      _this4.hideList(true);
                    } else {
                      _this4.showList();
                    }
                  });

                  return _context2.abrupt('return', _this4.suggestions);

                case 20:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this4, [[0, 12, 16, 20]]);
        }))();
      },
      getSuggestions: function getSuggestions() {
        var _this5 = this;

        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        return asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
          var result;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(_this5.listShown && !value)) {
                    _context3.next = 4;
                    break;
                  }

                  _this5.hideList();
                  _this5.clearSuggestions();
                  return _context3.abrupt('return', _this5.suggestions);

                case 4:
                  if (!(_this5.minLength > 0 && value.length < _this5.minLength)) {
                    _context3.next = 6;
                    break;
                  }

                  return _context3.abrupt('return', _this5.suggestions);

                case 6:

                  _this5.selected = null;

                  // Start request if can
                  if (_this5.listIsRequest) {
                    _this5.$emit('request-start', value);
                  }

                  result = [];
                  _context3.prev = 9;

                  if (!_this5.listIsRequest) {
                    _context3.next = 19;
                    break;
                  }

                  _context3.next = 13;
                  return _this5.list(value);

                case 13:
                  _context3.t1 = _context3.sent;

                  if (_context3.t1) {
                    _context3.next = 16;
                    break;
                  }

                  _context3.t1 = [];

                case 16:
                  _context3.t0 = _context3.t1;
                  _context3.next = 20;
                  break;

                case 19:
                  _context3.t0 = _this5.list;

                case 20:
                  result = _context3.t0;


                  // IFF the result is not an array (just in case!) - make it an array
                  if (!Array.isArray(result)) {
                    result = [result];
                  }

                  if (_typeof(result[0]) === 'object' && !Array.isArray(result[0])) {
                    _this5.isPlainSuggestion = false;
                  } else {
                    _this5.isPlainSuggestion = true;
                  }

                  if (_this5.filterByQuery) {
                    result = result.filter(_this5.filter);
                  }

                  if (_this5.listIsRequest) {
                    _this5.$emit('request-done', result);
                  }
                  _context3.next = 34;
                  break;

                case 27:
                  _context3.prev = 27;
                  _context3.t2 = _context3['catch'](9);

                  if (!_this5.listIsRequest) {
                    _context3.next = 33;
                    break;
                  }

                  _this5.$emit('request-failed', _context3.t2);
                  _context3.next = 34;
                  break;

                case 33:
                  throw _context3.t2;

                case 34:
                  _context3.prev = 34;

                  if (_this5.maxSuggestions) {
                    result.splice(_this5.maxSuggestions);
                  }

                  return _context3.abrupt('return', result);

                case 38:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this5, [[9, 27, 34, 38]]);
        }))();
      },
      clearSuggestions: function clearSuggestions() {
        this.suggestions.splice(0);
      }
    }
  };

  return VueSimpleSuggest;

}());
