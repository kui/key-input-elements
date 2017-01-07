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
	
	
	var META_CODES = new Set(["Meta", "MetaLeft", "MetaRight"]);
	
	var CTRL_CODES = new Set(["Control", "ControlLeft", "ControlRight"]);
	var ALT_CODES = new Set(["Alt", "AltLeft", "AltRight"]);
	var SHIFT_CODES = new Set(["Shift", "ShiftLeft", "ShiftRight"]);
	
	var MOD_CODES = new Set([...Array.from(META_CODES.values()), ...Array.from(CTRL_CODES.values()), ...Array.from(ALT_CODES.values()), ...Array.from(SHIFT_CODES.values())]);
	
	var DEFAULT_OPTIONS = {
	  allowModOnly: false,
	  noMod: false,
	  ignore: undefined
	};
	exports.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
	class EventMatcher {
	
	  constructor(pattern) {
	    this.key = parseValue(pattern);
	  }
	
	  test(k) {
	    return k.shiftKey === this.key.shiftKey && k.altKey === this.key.altKey && k.ctrlKey === this.key.ctrlKey && k.metaKey === this.key.metaKey && this.testModInsensitive(k);
	  }
	
	  testModInsensitive(k) {
	    return this.key.code === k.code;
	  }
	}
	
	exports.default = EventMatcher;
	function parseValue(pattern) {
	  var splitted = pattern.split(" + ");
	  var key = { altKey: false, shiftKey: false, ctrlKey: false, metaKey: false, code: "" };
	  while (splitted.length !== 1) {
	    var m = splitted.shift();
	    switch (m) {
	      case "Meta":
	        key.metaKey = true;break;
	      case "Ctrl":
	        key.ctrlKey = true;break;
	      case "Alt":
	        key.altKey = true;break;
	      case "Shift":
	        key.shiftKey = true;break;
	      default:
	        throw Error(`Unexpected mod: ${ m }`);
	    }
	  }
	  key.code = splitted[0];
	  return key;
	}
	
	function buildValue(key, options) {
	  var code = key.code;
	  if (!options.allowModOnly && isModKey(key.code)) {
	    return null;
	  }
	
	  var value = void 0;
	  if (options.noMod) {
	    value = code;
	  } else {
	    var a = [code];
	    if (key.metaKey && !isMetaKey(code)) a.unshift("Meta");
	    if (key.ctrlKey && !isCtrlKey(code)) a.unshift("Ctrl");
	    if (key.altKey && !isAltKey(code)) a.unshift("Alt");
	    if (key.shiftKey && !isShiftKey(code)) a.unshift("Shift");
	    value = a.join(" + ");
	  }
	
	  var ignore = options.ignore;
	  if (ignore && ignore.test(value)) {
	    return null;
	  }
	  return value;
	}
	
	function isModKey(code) {
	  return MOD_CODES.has(code);
	}
	function isMetaKey(code) {
	  return META_CODES.has(code);
	}
	function isCtrlKey(code) {
	  return CTRL_CODES.has(code);
	}
	function isAltKey(code) {
	  return ALT_CODES.has(code);
	}
	function isShiftKey(code) {
	  return SHIFT_CODES.has(code);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTlkYmYzMjQ2Mzc1ZjY0N2I0MWEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleS1pbnB1dC1yZWdpc3RlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudC1tYXRjaGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9rZXktaW5wdXQuanMiXSwibmFtZXMiOlsia2kiLCJyZWdpc3RlciIsImJ1aWxkVmFsdWUiLCJNRVRBX0NPREVTIiwiU2V0IiwiQ1RSTF9DT0RFUyIsIkFMVF9DT0RFUyIsIlNISUZUX0NPREVTIiwiTU9EX0NPREVTIiwiQXJyYXkiLCJmcm9tIiwidmFsdWVzIiwiREVGQVVMVF9PUFRJT05TIiwiYWxsb3dNb2RPbmx5Iiwibm9Nb2QiLCJpZ25vcmUiLCJ1bmRlZmluZWQiLCJFdmVudE1hdGNoZXIiLCJjb25zdHJ1Y3RvciIsInBhdHRlcm4iLCJrZXkiLCJwYXJzZVZhbHVlIiwidGVzdCIsImsiLCJzaGlmdEtleSIsImFsdEtleSIsImN0cmxLZXkiLCJtZXRhS2V5IiwidGVzdE1vZEluc2Vuc2l0aXZlIiwiY29kZSIsInNwbGl0dGVkIiwic3BsaXQiLCJsZW5ndGgiLCJtIiwic2hpZnQiLCJFcnJvciIsIm9wdGlvbnMiLCJpc01vZEtleSIsInZhbHVlIiwiYSIsImlzTWV0YUtleSIsInVuc2hpZnQiLCJpc0N0cmxLZXkiLCJpc0FsdEtleSIsImlzU2hpZnRLZXkiLCJqb2luIiwiaGFzIiwibWl4aW5LZXlkb3duSW5wdXQiLCJtaXhpbktleXVwSW5wdXQiLCJtaXhpbktleUlucHV0IiwiYyIsImhhc0F0dHJpYnV0ZSIsImIiLCJtYXJrQXR0ciIsInYiLCJnZXRBdHRyaWJ1dGUiLCJSZWdFeHAiLCJzZXRBdHRyaWJ1dGUiLCJ0b1N0cmluZyIsInNlbGVjdCIsImNyZWF0ZWRDYWxsYmFjayIsInR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXYiLCJwcmV2ZW50RGVmYXVsdCIsImF0dGFjaGVkQ2FsbGJhY2siLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJhdHRyTmFtZSIsImJ1aWxkTWF0Y2hlciIsImdlbmVyYXRlT3B0aW9ucyIsImUiLCJoYW5kbGVFdmVudCIsIktleWRvd25JbnB1dEVsZW1lbnQiLCJIVE1MSW5wdXRFbGVtZW50IiwiZXh0ZW5kcyIsIktleXVwSW5wdXRFbGVtZW50IiwiZG9jdW1lbnQiLCJyZWdpc3RlckVsZW1lbnQiLCJzZWxmIiwibyIsIk9iamVjdCIsImVudHJpZXMiLCJuYW1lIiwiZGVmYXVsdFZhbHVlIiwiZXZlbnQiLCJyZWFkT25seSIsImNvbnNvbGUiLCJsb2ciLCJyZW1vdmVBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBZTtBQUNmO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7QUNyQ0E7O0tBQVlBLEU7Ozs7QUFFWkEsSUFBR0MsUUFBSCxHOzs7Ozs7Ozs7U0NvRWdCQyxVLEdBQUFBLFU7OztBQWhFaEIsS0FBTUMsYUFBYyxJQUFJQyxHQUFKLENBQVEsQ0FBQyxNQUFELEVBQVMsVUFBVCxFQUFxQixXQUFyQixDQUFSLENBQXBCOztBQUNBLEtBQU1DLGFBQWMsSUFBSUQsR0FBSixDQUFRLENBQUMsU0FBRCxFQUFZLGFBQVosRUFBMkIsY0FBM0IsQ0FBUixDQUFwQjtBQUNBLEtBQU1FLFlBQWMsSUFBSUYsR0FBSixDQUFRLENBQUMsS0FBRCxFQUFRLFNBQVIsRUFBbUIsVUFBbkIsQ0FBUixDQUFwQjtBQUNBLEtBQU1HLGNBQWMsSUFBSUgsR0FBSixDQUFRLENBQUMsT0FBRCxFQUFVLFdBQVYsRUFBdUIsWUFBdkIsQ0FBUixDQUFwQjs7QUFFQSxLQUFNSSxZQUFZLElBQUlKLEdBQUosQ0FB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K0IsS0FBWCxFQUFrQk4sSUFBbEIsQ0FBVjtBQUNBUSxXQUFRQyxHQUFSLENBQVlILEtBQVo7QUFDQSxPQUFJL0IsS0FBSyxJQUFULEVBQWV5QixLQUFLekMsS0FBTCxHQUFhZ0IsQ0FBYjtBQUNmLE9BQUlBLENBQUosRUFBTytCLE1BQU1yQixjQUFOO0FBQ1I7O0FBRUQsVUFBU1gsUUFBVCxDQUFrQjBCLElBQWxCLEVBQXFDSSxJQUFyQyxFQUFtRC9CLENBQW5ELEVBQXFFO0FBQ25FLE9BQUlBLENBQUosRUFBTztBQUNMMkIsVUFBS3RCLFlBQUwsQ0FBa0IwQixJQUFsQixFQUF3QixFQUF4QjtBQUNELElBRkQsTUFFTztBQUNMSixVQUFLVSxlQUFMLENBQXFCTixJQUFyQjtBQUNEO0FBQ0YsRSIsImZpbGUiOiJrZXktaW5wdXQtZWxlbWVudHMtZGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA1OWRiZjMyNDYzNzVmNjQ3YjQxYSIsIi8vIEBmbG93XG5pbXBvcnQgKiBhcyBraSBmcm9tIFwiLi9rZXktaW5wdXRcIjtcblxua2kucmVnaXN0ZXIoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9rZXktaW5wdXQtcmVnaXN0ZXJlci5qcyIsIi8vIEBmbG93XG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50TWF0Y2hlck9wdGlvbnMge1xuICBhbGxvd01vZE9ubHk/OiBib29sZWFuO1xuICBub01vZD86IGJvb2xlYW47XG4gIGlnbm9yZT86ID9SZWdFeHA7XG59XG5cbmNvbnN0IE1FVEFfQ09ERVMgID0gbmV3IFNldChbXCJNZXRhXCIsIFwiTWV0YUxlZnRcIiwgXCJNZXRhUmlnaHRcIl0pO1xuY29uc3QgQ1RSTF9DT0RFUyAgPSBuZXcgU2V0KFtcIkNvbnRyb2xcIiwgXCJDb250cm9sTGVmdFwiLCBcIkNvbnRyb2xSaWdodFwiXSk7XG5jb25zdCBBTFRfQ09ERVMgICA9IG5ldyBTZXQoW1wiQWx0XCIsIFwiQWx0TGVmdFwiLCBcIkFsdFJpZ2h0XCJdKTtcbmNvbnN0IFNISUZUX0NPREVTID0gbmV3IFNldChbXCJTaGlmdFwiLCBcIlNoaWZ0TGVmdFwiLCBcIlNoaWZ0UmlnaHRcIl0pO1xuXG5jb25zdCBNT0RfQ09ERVMgPSBuZXcgU2V0KFtcbiAgLi4uQXJyYXkuZnJvbShNRVRBX0NPREVTLnZhbHVlcygpKSxcbiAgLi4uQXJyYXkuZnJvbShDVFJMX0NPREVTLnZhbHVlcygpKSxcbiAgLi4uQXJyYXkuZnJvbShBTFRfQ09ERVMudmFsdWVzKCkpLFxuICAuLi5BcnJheS5mcm9tKFNISUZUX0NPREVTLnZhbHVlcygpKSxcbl0pO1xuXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIGFsbG93TW9kT25seTogZmFsc2UsXG4gIG5vTW9kOiBmYWxzZSxcbiAgaWdub3JlOiB1bmRlZmluZWQsXG59O1xuZXhwb3J0IHsgREVGQVVMVF9PUFRJT05TIH07XG5cbmRlY2xhcmUgaW50ZXJmYWNlIEtleSB7XG4gIG1ldGFLZXk6IGJvb2xlYW47XG4gIGN0cmxLZXk6IGJvb2xlYW47XG4gIGFsdEtleTogYm9vbGVhbjtcbiAgc2hpZnRLZXk6IGJvb2xlYW47XG4gIGNvZGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRNYXRjaGVyIHtcbiAga2V5OiBLZXk7XG5cbiAgY29uc3RydWN0b3IocGF0dGVybjogc3RyaW5nKSB7XG4gICAgdGhpcy5rZXkgPSBwYXJzZVZhbHVlKHBhdHRlcm4pO1xuICB9XG5cbiAgdGVzdChrOiBLZXkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gay5zaGlmdEtleSA9PT0gdGhpcy5rZXkuc2hpZnRLZXlcbiAgICAgICYmIGsuYWx0S2V5ICA9PT0gdGhpcy5rZXkuYWx0S2V5XG4gICAgICAmJiBrLmN0cmxLZXkgPT09IHRoaXMua2V5LmN0cmxLZXlcbiAgICAgICYmIGsubWV0YUtleSA9PT0gdGhpcy5rZXkubWV0YUtleVxuICAgICAgJiYgdGhpcy50ZXN0TW9kSW5zZW5zaXRpdmUoayk7XG4gIH1cblxuICB0ZXN0TW9kSW5zZW5zaXRpdmUoazogS2V5KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMua2V5LmNvZGUgPT09IGsuY29kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVZhbHVlKHBhdHRlcm46IHN0cmluZyk6IEtleSB7XG4gIGNvbnN0IHNwbGl0dGVkID0gcGF0dGVybi5zcGxpdChcIiArIFwiKTtcbiAgY29uc3Qga2V5ID0geyBhbHRLZXk6IGZhbHNlLCBzaGlmdEtleTogZmFsc2UsIGN0cmxLZXk6IGZhbHNlLCBtZXRhS2V5OiBmYWxzZSwgY29kZTogXCJcIiB9O1xuICB3aGlsZSAoc3BsaXR0ZWQubGVuZ3RoICE9PSAxKSB7XG4gICAgY29uc3QgbSA9IHNwbGl0dGVkLnNoaWZ0KCk7XG4gICAgc3dpdGNoIChtKSB7XG4gICAgY2FzZSBcIk1ldGFcIjogIGtleS5tZXRhS2V5ICA9IHRydWU7IGJyZWFrO1xuICAgIGNhc2UgXCJDdHJsXCI6ICBrZXkuY3RybEtleSAgPSB0cnVlOyBicmVhaztcbiAgICBjYXNlIFwiQWx0XCI6ICAga2V5LmFsdEtleSAgID0gdHJ1ZTsgYnJlYWs7XG4gICAgY2FzZSBcIlNoaWZ0XCI6IGtleS5zaGlmdEtleSA9IHRydWU7IGJyZWFrO1xuICAgIGRlZmF1bHQ6IHRocm93IEVycm9yKGBVbmV4cGVjdGVkIG1vZDogJHttfWApO1xuICAgIH1cbiAgfVxuICBrZXkuY29kZSA9IHNwbGl0dGVkWzBdO1xuICByZXR1cm4ga2V5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRWYWx1ZShrZXk6IEtleSwgb3B0aW9uczogRXZlbnRNYXRjaGVyT3B0aW9ucyk6ID9zdHJpbmcge1xuICBjb25zdCBjb2RlID0ga2V5LmNvZGU7XG4gIGlmICghb3B0aW9ucy5hbGxvd01vZE9ubHkgJiYgaXNNb2RLZXkoa2V5LmNvZGUpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgdmFsdWU7XG4gIGlmIChvcHRpb25zLm5vTW9kKSB7XG4gICAgdmFsdWUgPSBjb2RlO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGEgPSBbY29kZV07XG4gICAgaWYgKGtleS5tZXRhS2V5ICAmJiAhaXNNZXRhS2V5KGNvZGUpKSAgYS51bnNoaWZ0KFwiTWV0YVwiKTtcbiAgICBpZiAoa2V5LmN0cmxLZXkgICYmICFpc0N0cmxLZXkoY29kZSkpICBhLnVuc2hpZnQoXCJDdHJsXCIpO1xuICAgIGlmIChrZXkuYWx0S2V5ICAgJiYgIWlzQWx0S2V5KGNvZGUpKSAgIGEudW5zaGlmdChcIkFsdFwiKTtcbiAgICBpZiAoa2V5LnNoaWZ0S2V5ICYmICFpc1NoaWZ0S2V5KGNvZGUpKSBhLnVuc2hpZnQoXCJTaGlmdFwiKTtcbiAgICB2YWx1ZSA9IGEuam9pbihcIiArIFwiKTtcbiAgfVxuXG4gIGNvbnN0IGlnbm9yZSA9IG9wdGlvbnMuaWdub3JlO1xuICBpZiAoaWdub3JlICYmIGlnbm9yZS50ZXN0KHZhbHVlKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gaXNNb2RLZXkoY29kZTogc3RyaW5nKTogYm9vbGVhbiAgIHsgcmV0dXJuIE1PRF9DT0RFUy5oYXMoY29kZSk7IH1cbmZ1bmN0aW9uIGlzTWV0YUtleShjb2RlOiBzdHJpbmcpOiBib29sZWFuICB7IHJldHVybiBNRVRBX0NPREVTLmhhcyhjb2RlKTsgfVxuZnVuY3Rpb24gaXNDdHJsS2V5KGNvZGU6IHN0cmluZyk6IGJvb2xlYW4gIHsgcmV0dXJuIENUUkxfQ09ERVMuaGFzKGNvZGUpOyB9XG5mdW5jdGlvbiBpc0FsdEtleShjb2RlOiBzdHJpbmcpOiBib29sZWFuICAgeyByZXR1cm4gQUxUX0NPREVTLmhhcyhjb2RlKTsgfVxuZnVuY3Rpb24gaXNTaGlmdEtleShjb2RlOiBzdHJpbmcpOiBib29sZWFuIHsgcmV0dXJuIFNISUZUX0NPREVTLmhhcyhjb2RlKTsgfVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2V2ZW50LW1hdGNoZXIuanMiLCIvLyBAZmxvd1xuaW1wb3J0IEV2ZW50TWF0Y2hlciwgeyBidWlsZFZhbHVlLCBERUZBVUxUX09QVElPTlMgfSBmcm9tIFwiLi9ldmVudC1tYXRjaGVyXCI7XG5pbXBvcnQgdHlwZSBFdmVudE1hdGNoZXJPcHRpb25zIGZyb20gXCIuL2V2ZW50LW1hdGNoZXJcIjtcblxuZGVjbGFyZSBpbnRlcmZhY2UgS2V5SW5wdXQgZXh0ZW5kcyBIVE1MSW5wdXRFbGVtZW50IHtcbiAgYWxsb3dNb2RPbmx5OiBib29sZWFuO1xuICBub01vZDogYm9vbGVhbjtcbiAgaWdub3JlOiA/UmVnRXhwO1xufVxuZXhwb3J0IGludGVyZmFjZSBLZXl1cElucHV0IGV4dGVuZHMgS2V5SW5wdXQge31cbmV4cG9ydCBpbnRlcmZhY2UgS2V5ZG93bklucHV0IGV4dGVuZHMgS2V5SW5wdXQge31cblxuZnVuY3Rpb24gbWl4aW5LZXlJbnB1dDxUOiBIVE1MSW5wdXRFbGVtZW50PihjOiBDbGFzczxUPik6IENsYXNzPFQgJiBLZXlJbnB1dD4ge1xuICAvLyAkRmxvd0ZpeE1lIEZvcmNlIGNhc3QgdG8gcmV0dXJuZWQgdHlwZVxuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBjIHtcbiAgICBnZXQgYWxsb3dNb2RPbmx5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNBdHRyaWJ1dGUoXCJhbGxvdy1tb2Qtb25seVwiKTsgfVxuICAgIHNldCBhbGxvd01vZE9ubHkoYjogYm9vbGVhbik6IHZvaWQgeyBtYXJrQXR0cih0aGlzLCBcImFsbG93LW1vZC1vbmx5XCIsIGIpOyB9XG5cbiAgICBnZXQgbm9Nb2QoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShcIm5vLW1vZFwiKTsgfVxuICAgIHNldCBub01vZChiOiBib29sZWFuKTogdm9pZCB7IG1hcmtBdHRyKHRoaXMsIFwibm8tbW9kXCIsIGIpOyB9XG5cbiAgICBnZXQgaWdub3JlKCk6ID9SZWdFeHAge1xuICAgICAgY29uc3QgdiA9IHRoaXMuZ2V0QXR0cmlidXRlKFwiaWdub3JlXCIpO1xuICAgICAgcmV0dXJuIHYgPT0gbnVsbCA/IG51bGwgOiBuZXcgUmVnRXhwKHYpO1xuICAgIH1cbiAgICBzZXQgaWdub3JlKHBhdHRlcm46ID9SZWdFeHApOiB2b2lkIHtcbiAgICAgIGlmIChwYXR0ZXJuICE9IG51bGwpIHRoaXMuc2V0QXR0cmlidXRlKFwiaWdub3JlXCIsIHBhdHRlcm4udG9TdHJpbmcoKSk7XG4gICAgfVxuXG4gICAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7IHJldHVybiBzdXBlci52YWx1ZTsgfVxuICAgIHNldCB2YWx1ZSh2OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgIHN1cGVyLnZhbHVlID0gdjtcbiAgICAgIHRoaXMuc2VsZWN0KCk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHRoaXMudHlwZSA9IFwidGV4dFwiO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgKGV2OiBLZXlib2FyZEV2ZW50KSA9PiBldi5wcmV2ZW50RGVmYXVsdCgpLCB0cnVlKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsICgpID0+IHRoaXMuc2VsZWN0KCkpO1xuICAgIH1cblxuICAgIGF0dGFjaGVkQ2FsbGJhY2soKSB7fVxuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7IHJldHVybiBbXCJ0eXBlXCJdOyB9XG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJOYW1lOiBzdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoYXR0ck5hbWUpIHtcbiAgICAgIGNhc2UgXCJ0eXBlXCI6XG4gICAgICAgIHRoaXMudHlwZSA9IFwidGV4dFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBidWlsZE1hdGNoZXIoKTogRXZlbnRNYXRjaGVyIHtcbiAgICAgIHJldHVybiBuZXcgRXZlbnRNYXRjaGVyKHRoaXMudmFsdWUsIGdlbmVyYXRlT3B0aW9ucyh0aGlzKSk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5LZXlkb3duSW5wdXQ8VDogSFRNTElucHV0RWxlbWVudD4oYzogQ2xhc3M8VD4pOiBDbGFzczxUICYgS2V5ZG93bklucHV0PiB7XG4gIC8vICRGbG93Rml4TWUgRm9yY2UgY2FzdCB0byByZXR1cm5lZCB0eXBlXG4gIHJldHVybiBjbGFzcyBleHRlbmRzIG1peGluS2V5SW5wdXQoYykge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgICBzdXBlci5jcmVhdGVkQ2FsbGJhY2soKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGU6IEtleWJvYXJkRXZlbnQpID0+IGhhbmRsZUV2ZW50KHRoaXMsIGUpKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBLZXlkb3duSW5wdXRFbGVtZW50IGV4dGVuZHMgbWl4aW5LZXlkb3duSW5wdXQoSFRNTElucHV0RWxlbWVudCkge1xuICBzdGF0aWMgZ2V0IGV4dGVuZHMoKSB7IHJldHVybiBcImlucHV0XCI7IH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1peGluS2V5dXBJbnB1dDxUOiBIVE1MSW5wdXRFbGVtZW50PihjOiBDbGFzczxUPik6IENsYXNzPFQgJiBLZXl1cElucHV0PiB7XG4gIC8vICRGbG93Rml4TWUgRm9yY2UgY2FzdCB0byByZXR1cm5lZCB0eXBlXG4gIHJldHVybiBjbGFzcyBleHRlbmRzIG1peGluS2V5SW5wdXQoYykge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgICBzdXBlci5jcmVhdGVkQ2FsbGJhY2soKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIChlOiBLZXlib2FyZEV2ZW50KSA9PiBoYW5kbGVFdmVudCh0aGlzLCBlKSk7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlnbm9yZSA9IHRoaXMuaWdub3JlO1xuICAgICAgICBpZiAoIWlnbm9yZSkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB2ID0gYnVpbGRWYWx1ZShlLCB0aGlzKTtcbiAgICAgICAgaWYgKHYgJiYgaWdub3JlLnRlc3QodikpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBLZXl1cElucHV0RWxlbWVudCBleHRlbmRzIG1peGluS2V5dXBJbnB1dChIVE1MSW5wdXRFbGVtZW50KSB7XG4gIHN0YXRpYyBnZXQgZXh0ZW5kcygpIHsgcmV0dXJuIFwiaW5wdXRcIjsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG4gIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImtleWRvd24taW5wdXRcIiwgS2V5ZG93bklucHV0RWxlbWVudCk7XG4gIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImtleXVwLWlucHV0XCIsIEtleXVwSW5wdXRFbGVtZW50KTtcbn1cblxuLy9cblxuZnVuY3Rpb24gZ2VuZXJhdGVPcHRpb25zKHNlbGY6IEtleUlucHV0KTogRXZlbnRNYXRjaGVyT3B0aW9ucyB7XG4gIGNvbnN0IG86IGFueSA9IHt9O1xuICBmb3IgKGNvbnN0IFtuYW1lLCBkZWZhdWx0VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKERFRkFVTFRfT1BUSU9OUykpIHtcbiAgICBjb25zdCB2YWx1ZSA9IChzZWxmOiBhbnkpW25hbWVdO1xuICAgIG9bbmFtZV0gPSB2YWx1ZSA9PSBudWxsID8gZGVmYXVsdFZhbHVlIDogdmFsdWU7XG4gIH1cbiAgcmV0dXJuIG87XG59XG5cbmZ1bmN0aW9uIGhhbmRsZUV2ZW50KHNlbGY6IEtleUlucHV0LCBldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICBpZiAoc2VsZi5yZWFkT25seSkgcmV0dXJuO1xuICBjb25zdCB2ID0gYnVpbGRWYWx1ZShldmVudCwgc2VsZik7XG4gIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgaWYgKHYgIT0gbnVsbCkgc2VsZi52YWx1ZSA9IHY7XG4gIGlmICh2KSBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xufVxuXG5mdW5jdGlvbiBtYXJrQXR0cihzZWxmOiBIVE1MRWxlbWVudCwgbmFtZTogc3RyaW5nLCBiOiBib29sZWFuKTogdm9pZCB7XG4gIGlmIChiKSB7XG4gICAgc2VsZi5zZXRBdHRyaWJ1dGUobmFtZSwgXCJcIik7XG4gIH0gZWxzZSB7XG4gICAgc2VsZi5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG4gIH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9rZXktaW5wdXQuanMiXSwic291cmNlUm9vdCI6IiJ9