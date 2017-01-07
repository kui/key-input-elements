/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _keyInput = __webpack_require__(2);
	
	var ki = _interopRequireWildcard(_keyInput);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	ki.register();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.buildValue = buildValue;
	
	
	var MOD_KEYS = new Set(["Shift", "Alt", "Control", "Meta"]);
	
	
	var DEFAULT_OPTIONS = {
	  allowModOnly: false,
	  noMod: false,
	  ignore: undefined
	};
	exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
	class EventMatcher {
	
	  constructor(pattern) {
	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS;
	
	    this.pattern = pattern;
	    this.options = options;
	  }
	
	  test(event) {
	    if (!(event instanceof KeyboardEvent)) return false;
	    if (this.pattern.length === 0) return false;
	    var value = buildValue(event, this.options);
	    return this.pattern === value;
	  }
	
	  testModInsensitive(event) {
	    if (!(event instanceof KeyboardEvent)) return false;
	    if (this.pattern.length === 0) return false;
	    var opts = Object.assign({ noMod: true }, this.options);
	    var value = buildValue(event, opts);
	    return this.pattern === value;
	  }
	}
	
	exports.default = EventMatcher;
	function buildValue(event, options) {
	  var code = event.code;
	  if (!options.allowModOnly && isModKey(event.key)) {
	    return null;
	  }
	
	  var value = void 0;
	  if (options.noMod) {
	    value = code;
	  } else {
	    var a = [code];
	    if (event.shiftKey && !code.startsWith("Shift")) a.unshift("Shift");
	    if (event.altKey && !code.startsWith("Alt")) a.unshift("Alt");
	    if (event.ctrlKey && !code.startsWith("Control")) a.unshift("Control");
	    if (event.metaKey && !code.startsWith("Meta")) a.unshift("Meta");
	    value = a.join(" + ");
	  }
	
	  var ignore = options.ignore;
	  if (ignore && ignore.test(value)) {
	    return null;
	  }
	  return value;
	}
	
	function isModKey(key) {
	  return MOD_KEYS.has(key);
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	exports.KeyupInputElement = exports.KeydownInputElement = undefined;
	exports.mixinKeydownInput = mixinKeydownInput;
	exports.mixinKeyupInput = mixinKeyupInput;
	exports.register = register;
	
	var _eventMatcher = __webpack_require__(1);
	
	var _eventMatcher2 = _interopRequireDefault(_eventMatcher);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function mixinKeyInput(c) {
	  // $FlowFixMe Force cast to returned type
	  return class extends c {
	    get allowModOnly() {
	      return this.hasAttribute("allow-mod-only");
	    }
	    set allowModOnly(b) {
	      markAttr(this, "allow-mod-only", b);
	    }
	
	    get noMod() {
	      return this.hasAttribute("no-mod");
	    }
	    set noMod(b) {
	      markAttr(this, "no-mod", b);
	    }
	
	    get ignore() {
	      var v = this.getAttribute("ignore");
	      return v == null ? null : new RegExp(v);
	    }
	    set ignore(pattern) {
	      if (pattern != null) this.setAttribute("ignore", pattern.toString());
	    }
	
	    get value() {
	      return super.value;
	    }
	    set value(v) {
	      super.value = v;
	      this.select();
	    }
	
	    constructor() {
	      super();
	    }
	
	    createdCallback() {
	      this.type = "text";
	      this.addEventListener("keypress", ev => ev.preventDefault(), true);
	      this.addEventListener("focus", () => this.select());
	    }
	
	    attachedCallback() {}
	
	    static get observedAttributes() {
	      return ["type"];
	    }
	    attributeChangedCallback(attrName) {
	      switch (attrName) {
	        case "type":
	          this.type = "text";
	          break;
	      }
	    }
	
	    buildMatcher() {
	      return new _eventMatcher2.default(this.value, generateOptions(this));
	    }
	  };
	}
	function mixinKeydownInput(c) {
	  // $FlowFixMe Force cast to returned type
	  return class extends mixinKeyInput(c) {
	    constructor() {
	      super();
	    }
	
	    createdCallback() {
	      super.createdCallback();
	      this.addEventListener("keydown", e => handleEvent(this, e));
	    }
	  };
	}
	
	class KeydownInputElement extends mixinKeydownInput(HTMLInputElement) {
	  static get extends() {
	    return "input";
	  }
	}
	
	exports.KeydownInputElement = KeydownInputElement;
	function mixinKeyupInput(c) {
	  // $FlowFixMe Force cast to returned type
	  return class extends mixinKeyInput(c) {
	    constructor() {
	      super();
	    }
	
	    createdCallback() {
	      super.createdCallback();
	      this.addEventListener("keyup", e => handleEvent(this, e));
	      this.addEventListener("keydown", e => {
	        var ignore = this.ignore;
	        if (!ignore) {
	          e.preventDefault();
	          return;
	        }
	
	        var v = (0, _eventMatcher.buildValue)(e, this);
	        if (v && ignore.test(v)) {
	          return;
	        }
	
	        e.preventDefault();
	      });
	    }
	  };
	}
	
	class KeyupInputElement extends mixinKeyupInput(HTMLInputElement) {
	  static get extends() {
	    return "input";
	  }
	}
	
	exports.KeyupInputElement = KeyupInputElement;
	function register() {
	  document.registerElement("keydown-input", KeydownInputElement);
	  document.registerElement("keyup-input", KeyupInputElement);
	}
	
	//
	
	function generateOptions(self) {
	  var o = {};
	  for (var _iterator = Object.entries(_eventMatcher.DEFAULT_OPTIONS), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
	    var _ref2;
	
	    if (_isArray) {
	      if (_i >= _iterator.length) break;
	      _ref2 = _iterator[_i++];
	    } else {
	      _i = _iterator.next();
	      if (_i.done) break;
	      _ref2 = _i.value;
	    }
	
	    var _ref = _ref2;
	    var name = _ref[0];
	    var defaultValue = _ref[1];
	
	    var value = self[name];
	    o[name] = value == null ? defaultValue : value;
	  }
	  return o;
	}
	
	function handleEvent(self, event) {
	  if (self.readOnly) return;
	  var v = (0, _eventMatcher.buildValue)(event, self);
	  console.log(event);
	  if (v != null) self.value = v;
	  if (v) event.preventDefault();
	}
	
	function markAttr(self, name, b) {
	  if (b) {
	    self.setAttribute(name, "");
	  } else {
	    self.removeAttribute(name);
	  }
	}

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTM3YjUzZDEwZjc0OWQ4ZTg2ZTMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleS1pbnB1dC1yZWdpc3RlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudC1tYXRjaGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9rZXktaW5wdXQuanMiXSwibmFtZXMiOlsia2kiLCJyZWdpc3RlciIsImJ1aWxkVmFsdWUiLCJNT0RfS0VZUyIsIlNldCIsIkRFRkFVTFRfT1BUSU9OUyIsImFsbG93TW9kT25seSIsIm5vTW9kIiwiaWdub3JlIiwidW5kZWZpbmVkIiwiRXZlbnRNYXRjaGVyIiwiY29uc3RydWN0b3IiLCJwYXR0ZXJuIiwib3B0aW9ucyIsInRlc3QiLCJldmVudCIsIktleWJvYXJkRXZlbnQiLCJsZW5ndGgiLCJ2YWx1ZSIsInRlc3RNb2RJbnNlbnNpdGl2ZSIsIm9wdHMiLCJPYmplY3QiLCJhc3NpZ24iLCJjb2RlIiwiaXNNb2RLZXkiLCJrZXkiLCJhIiwic2hpZnRLZXkiLCJzdGFydHNXaXRoIiwidW5zaGlmdCIsImFsdEtleSIsImN0cmxLZXkiLCJtZXRhS2V5Iiwiam9pbiIsImhhcyIsIm1peGluS2V5ZG93bklucHV0IiwibWl4aW5LZXl1cElucHV0IiwibWl4aW5LZXlJbnB1dCIsImMiLCJoYXNBdHRyaWJ1dGUiLCJiIiwibWFya0F0dHIiLCJ2IiwiZ2V0QXR0cmlidXRlIiwiUmVnRXhwIiwic2V0QXR0cmlidXRlIiwidG9TdHJpbmciLCJzZWxlY3QiLCJjcmVhdGVkQ2FsbGJhY2siLCJ0eXBlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2IiwicHJldmVudERlZmF1bHQiLCJhdHRhY2hlZENhbGxiYWNrIiwib2JzZXJ2ZWRBdHRyaWJ1dGVzIiwiYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrIiwiYXR0ck5hbWUiLCJidWlsZE1hdGNoZXIiLCJnZW5lcmF0ZU9wdGlvbnMiLCJlIiwiaGFuZGxlRXZlbnQiLCJLZXlkb3duSW5wdXRFbGVtZW50IiwiSFRNTElucHV0RWxlbWVudCIsImV4dGVuZHMiLCJLZXl1cElucHV0RWxlbWVudCIsImRvY3VtZW50IiwicmVnaXN0ZXJFbGVtZW50Iiwic2VsZiIsIm8iLCJlbnRyaWVzIiwibmFtZSIsImRlZmF1bHRWYWx1ZSIsInJlYWRPbmx5IiwiY29uc29sZSIsImxvZyIsInJlbW92ZUF0dHJpYnV0ZSJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3JDQTs7S0FBWUEsRTs7OztBQUVaQSxJQUFHQyxRQUFILEc7Ozs7Ozs7OztTQ3NDZ0JDLFUsR0FBQUEsVTs7O0FBbENoQixLQUFNQyxXQUFXLElBQUlDLEdBQUosQ0FBUSxDQUFDLE9BQUQsRUFBVSxLQUFWLEVBQWlCLFNBQWpCLEVBQTRCLE1BQTVCLENBQVIsQ0FBakI7OztBQUVBLEtBQU1DLGtCQUFrQjtBQUN0QkMsaUJBQWMsS0FEUTtBQUV0QkMsVUFBTyxLQUZlO0FBR3RCQyxXQUFRQztBQUhjLEVBQXhCO1NBS1NKLGUsR0FBQUEsZTtBQUVNLE9BQU1LLFlBQU4sQ0FBbUI7O0FBSWhDQyxlQUFZQyxPQUFaLEVBQThFO0FBQUEsU0FBakRDLE9BQWlELHVFQUFqQlIsZUFBaUI7O0FBQzVFLFVBQUtPLE9BQUwsR0FBZUEsT0FBZjtBQUNBLFVBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNEOztBQUVEQyxRQUFLQyxLQUFMLEVBQW1CO0FBQ2pCLFNBQUksRUFBRUEsaUJBQWlCQyxhQUFuQixDQUFKLEVBQXVDLE9BQU8sS0FBUDtBQUN2QyxTQUFJLEtBQUtKLE9BQUwsQ0FBYUssTUFBYixLQUF3QixDQUE1QixFQUErQixPQUFPLEtBQVA7QUFDL0IsU0FB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aWxlIjoia2V5LWlucHV0LWVsZW1lbnRzLWRlYnVnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTM3YjUzZDEwZjc0OWQ4ZTg2ZTMiLCIvLyBAZmxvd1xuaW1wb3J0ICogYXMga2kgZnJvbSBcIi4va2V5LWlucHV0XCI7XG5cbmtpLnJlZ2lzdGVyKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMva2V5LWlucHV0LXJlZ2lzdGVyZXIuanMiLCIvLyBAZmxvd1xuZXhwb3J0IGludGVyZmFjZSBFdmVudE1hdGNoZXJPcHRpb25zIHtcbiAgYWxsb3dNb2RPbmx5PzogYm9vbGVhbjtcbiAgbm9Nb2Q/OiBib29sZWFuO1xuICBpZ25vcmU/OiA/UmVnRXhwO1xufVxuXG5jb25zdCBNT0RfS0VZUyA9IG5ldyBTZXQoW1wiU2hpZnRcIiwgXCJBbHRcIiwgXCJDb250cm9sXCIsIFwiTWV0YVwiXSk7XG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgYWxsb3dNb2RPbmx5OiBmYWxzZSxcbiAgbm9Nb2Q6IGZhbHNlLFxuICBpZ25vcmU6IHVuZGVmaW5lZCxcbn07XG5leHBvcnQgeyBERUZBVUxUX09QVElPTlMgfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNYXRjaGVyIHtcbiAgcGF0dGVybjogc3RyaW5nO1xuICBvcHRpb25zOiBFdmVudE1hdGNoZXJPcHRpb25zO1xuXG4gIGNvbnN0cnVjdG9yKHBhdHRlcm46IHN0cmluZywgb3B0aW9ucz86IEV2ZW50TWF0Y2hlck9wdGlvbnMgPSBERUZBVUxUX09QVElPTlMpIHtcbiAgICB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICB0ZXN0KGV2ZW50OiBFdmVudCkge1xuICAgIGlmICghKGV2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAodGhpcy5wYXR0ZXJuLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IHZhbHVlID0gYnVpbGRWYWx1ZSgoZXZlbnQ6IEtleWJvYXJkRXZlbnQpLCB0aGlzLm9wdGlvbnMpO1xuICAgIHJldHVybiB0aGlzLnBhdHRlcm4gPT09IHZhbHVlO1xuICB9XG5cbiAgdGVzdE1vZEluc2Vuc2l0aXZlKGV2ZW50OiBFdmVudCkge1xuICAgIGlmICghKGV2ZW50IGluc3RhbmNlb2YgS2V5Ym9hcmRFdmVudCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAodGhpcy5wYXR0ZXJuLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlO1xuICAgIGNvbnN0IG9wdHMgPSBPYmplY3QuYXNzaWduKCh7IG5vTW9kOiB0cnVlIH06IGFueSksIHRoaXMub3B0aW9ucyk7XG4gICAgY29uc3QgdmFsdWUgPSBidWlsZFZhbHVlKChldmVudDogS2V5Ym9hcmRFdmVudCksIG9wdHMpO1xuICAgIHJldHVybiB0aGlzLnBhdHRlcm4gPT09IHZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFZhbHVlKGV2ZW50OiBLZXlib2FyZEV2ZW50LCBvcHRpb25zOiBFdmVudE1hdGNoZXJPcHRpb25zKTogP3N0cmluZyB7XG4gIGNvbnN0IGNvZGUgPSBldmVudC5jb2RlO1xuICBpZiAoIW9wdGlvbnMuYWxsb3dNb2RPbmx5ICYmIGlzTW9kS2V5KGV2ZW50LmtleSkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCB2YWx1ZTtcbiAgaWYgKG9wdGlvbnMubm9Nb2QpIHtcbiAgICB2YWx1ZSA9IGNvZGU7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYSA9IFtjb2RlXTtcbiAgICBpZiAoZXZlbnQuc2hpZnRLZXkgJiYgIWNvZGUuc3RhcnRzV2l0aChcIlNoaWZ0XCIpKSAgIGEudW5zaGlmdChcIlNoaWZ0XCIpO1xuICAgIGlmIChldmVudC5hbHRLZXkgICAmJiAhY29kZS5zdGFydHNXaXRoKFwiQWx0XCIpKSAgICAgYS51bnNoaWZ0KFwiQWx0XCIpO1xuICAgIGlmIChldmVudC5jdHJsS2V5ICAmJiAhY29kZS5zdGFydHNXaXRoKFwiQ29udHJvbFwiKSkgYS51bnNoaWZ0KFwiQ29udHJvbFwiKTtcbiAgICBpZiAoZXZlbnQubWV0YUtleSAgJiYgIWNvZGUuc3RhcnRzV2l0aChcIk1ldGFcIikpICAgIGEudW5zaGlmdChcIk1ldGFcIik7XG4gICAgdmFsdWUgPSBhLmpvaW4oXCIgKyBcIik7XG4gIH1cblxuICBjb25zdCBpZ25vcmUgPSBvcHRpb25zLmlnbm9yZTtcbiAgaWYgKGlnbm9yZSAmJiBpZ25vcmUudGVzdCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGlzTW9kS2V5KGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBNT0RfS0VZUy5oYXMoa2V5KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9ldmVudC1tYXRjaGVyLmpzIiwiLy8gQGZsb3dcbmltcG9ydCBFdmVudE1hdGNoZXIsIHsgYnVpbGRWYWx1ZSwgREVGQVVMVF9PUFRJT05TIH0gZnJvbSBcIi4vZXZlbnQtbWF0Y2hlclwiO1xuaW1wb3J0IHR5cGUgRXZlbnRNYXRjaGVyT3B0aW9ucyBmcm9tIFwiLi9ldmVudC1tYXRjaGVyXCI7XG5cbmRlY2xhcmUgaW50ZXJmYWNlIEtleUlucHV0IGV4dGVuZHMgSFRNTElucHV0RWxlbWVudCB7XG4gIGFsbG93TW9kT25seTogYm9vbGVhbjtcbiAgbm9Nb2Q6IGJvb2xlYW47XG4gIGlnbm9yZTogP1JlZ0V4cDtcbn1cbmV4cG9ydCBpbnRlcmZhY2UgS2V5dXBJbnB1dCBleHRlbmRzIEtleUlucHV0IHt9XG5leHBvcnQgaW50ZXJmYWNlIEtleWRvd25JbnB1dCBleHRlbmRzIEtleUlucHV0IHt9XG5cbmZ1bmN0aW9uIG1peGluS2V5SW5wdXQ8VDogSFRNTElucHV0RWxlbWVudD4oYzogQ2xhc3M8VD4pOiBDbGFzczxUICYgS2V5SW5wdXQ+IHtcbiAgLy8gJEZsb3dGaXhNZSBGb3JjZSBjYXN0IHRvIHJldHVybmVkIHR5cGVcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgYyB7XG4gICAgZ2V0IGFsbG93TW9kT25seSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKFwiYWxsb3ctbW9kLW9ubHlcIik7IH1cbiAgICBzZXQgYWxsb3dNb2RPbmx5KGI6IGJvb2xlYW4pOiB2b2lkIHsgbWFya0F0dHIodGhpcywgXCJhbGxvdy1tb2Qtb25seVwiLCBiKTsgfVxuXG4gICAgZ2V0IG5vTW9kKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoXCJuby1tb2RcIik7IH1cbiAgICBzZXQgbm9Nb2QoYjogYm9vbGVhbik6IHZvaWQgeyBtYXJrQXR0cih0aGlzLCBcIm5vLW1vZFwiLCBiKTsgfVxuXG4gICAgZ2V0IGlnbm9yZSgpOiA/UmVnRXhwIHtcbiAgICAgIGNvbnN0IHYgPSB0aGlzLmdldEF0dHJpYnV0ZShcImlnbm9yZVwiKTtcbiAgICAgIHJldHVybiB2ID09IG51bGwgPyBudWxsIDogbmV3IFJlZ0V4cCh2KTtcbiAgICB9XG4gICAgc2V0IGlnbm9yZShwYXR0ZXJuOiA/UmVnRXhwKTogdm9pZCB7XG4gICAgICBpZiAocGF0dGVybiAhPSBudWxsKSB0aGlzLnNldEF0dHJpYnV0ZShcImlnbm9yZVwiLCBwYXR0ZXJuLnRvU3RyaW5nKCkpO1xuICAgIH1cblxuICAgIGdldCB2YWx1ZSgpOiBzdHJpbmcgeyByZXR1cm4gc3VwZXIudmFsdWU7IH1cbiAgICBzZXQgdmFsdWUodjogc3RyaW5nKTogdm9pZCB7XG4gICAgICBzdXBlci52YWx1ZSA9IHY7XG4gICAgICB0aGlzLnNlbGVjdCgpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgICB0aGlzLnR5cGUgPSBcInRleHRcIjtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIChldjogS2V5Ym9hcmRFdmVudCkgPT4gZXYucHJldmVudERlZmF1bHQoKSwgdHJ1ZSk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCAoKSA9PiB0aGlzLnNlbGVjdCgpKTtcbiAgICB9XG5cbiAgICBhdHRhY2hlZENhbGxiYWNrKCkge31cblxuICAgIHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCkgeyByZXR1cm4gW1widHlwZVwiXTsgfVxuICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhhdHRyTmFtZTogc3RyaW5nKSB7XG4gICAgICBzd2l0Y2ggKGF0dHJOYW1lKSB7XG4gICAgICBjYXNlIFwidHlwZVwiOlxuICAgICAgICB0aGlzLnR5cGUgPSBcInRleHRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYnVpbGRNYXRjaGVyKCk6IEV2ZW50TWF0Y2hlciB7XG4gICAgICByZXR1cm4gbmV3IEV2ZW50TWF0Y2hlcih0aGlzLnZhbHVlLCBnZW5lcmF0ZU9wdGlvbnModGhpcykpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1peGluS2V5ZG93bklucHV0PFQ6IEhUTUxJbnB1dEVsZW1lbnQ+KGM6IENsYXNzPFQ+KTogQ2xhc3M8VCAmIEtleWRvd25JbnB1dD4ge1xuICAvLyAkRmxvd0ZpeE1lIEZvcmNlIGNhc3QgdG8gcmV0dXJuZWQgdHlwZVxuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBtaXhpbktleUlucHV0KGMpIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuY3JlYXRlZENhbGxiYWNrKCk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlOiBLZXlib2FyZEV2ZW50KSA9PiBoYW5kbGVFdmVudCh0aGlzLCBlKSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgS2V5ZG93bklucHV0RWxlbWVudCBleHRlbmRzIG1peGluS2V5ZG93bklucHV0KEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgc3RhdGljIGdldCBleHRlbmRzKCkgeyByZXR1cm4gXCJpbnB1dFwiOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbktleXVwSW5wdXQ8VDogSFRNTElucHV0RWxlbWVudD4oYzogQ2xhc3M8VD4pOiBDbGFzczxUICYgS2V5dXBJbnB1dD4ge1xuICAvLyAkRmxvd0ZpeE1lIEZvcmNlIGNhc3QgdG8gcmV0dXJuZWQgdHlwZVxuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBtaXhpbktleUlucHV0KGMpIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgICAgc3VwZXIuY3JlYXRlZENhbGxiYWNrKCk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gaGFuZGxlRXZlbnQodGhpcywgZSkpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xuICAgICAgICBjb25zdCBpZ25vcmUgPSB0aGlzLmlnbm9yZTtcbiAgICAgICAgaWYgKCFpZ25vcmUpIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdiA9IGJ1aWxkVmFsdWUoZSwgdGhpcyk7XG4gICAgICAgIGlmICh2ICYmIGlnbm9yZS50ZXN0KHYpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgS2V5dXBJbnB1dEVsZW1lbnQgZXh0ZW5kcyBtaXhpbktleXVwSW5wdXQoSFRNTElucHV0RWxlbWVudCkge1xuICBzdGF0aWMgZ2V0IGV4dGVuZHMoKSB7IHJldHVybiBcImlucHV0XCI7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJrZXlkb3duLWlucHV0XCIsIEtleWRvd25JbnB1dEVsZW1lbnQpO1xuICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJrZXl1cC1pbnB1dFwiLCBLZXl1cElucHV0RWxlbWVudCk7XG59XG5cbi8vXG5cbmZ1bmN0aW9uIGdlbmVyYXRlT3B0aW9ucyhzZWxmOiBLZXlJbnB1dCk6IEV2ZW50TWF0Y2hlck9wdGlvbnMge1xuICBjb25zdCBvOiBhbnkgPSB7fTtcbiAgZm9yIChjb25zdCBbbmFtZSwgZGVmYXVsdFZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhERUZBVUxUX09QVElPTlMpKSB7XG4gICAgY29uc3QgdmFsdWUgPSAoc2VsZjogYW55KVtuYW1lXTtcbiAgICBvW25hbWVdID0gdmFsdWUgPT0gbnVsbCA/IGRlZmF1bHRWYWx1ZSA6IHZhbHVlO1xuICB9XG4gIHJldHVybiBvO1xufVxuXG5mdW5jdGlvbiBoYW5kbGVFdmVudChzZWxmOiBLZXlJbnB1dCwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcbiAgaWYgKHNlbGYucmVhZE9ubHkpIHJldHVybjtcbiAgY29uc3QgdiA9IGJ1aWxkVmFsdWUoZXZlbnQsIHNlbGYpO1xuICBjb25zb2xlLmxvZyhldmVudCk7XG4gIGlmICh2ICE9IG51bGwpIHNlbGYudmFsdWUgPSB2O1xuICBpZiAodikgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbn1cblxuZnVuY3Rpb24gbWFya0F0dHIoc2VsZjogSFRNTEVsZW1lbnQsIG5hbWU6IHN0cmluZywgYjogYm9vbGVhbik6IHZvaWQge1xuICBpZiAoYikge1xuICAgIHNlbGYuc2V0QXR0cmlidXRlKG5hbWUsIFwiXCIpO1xuICB9IGVsc2Uge1xuICAgIHNlbGYucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMva2V5LWlucHV0LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==