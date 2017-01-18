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
	
	var MOD_CODES = new Set([...Array.from(META_CODES), ...Array.from(CTRL_CODES), ...Array.from(ALT_CODES), ...Array.from(SHIFT_CODES)]);
	
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
	      if (document.activeElement === this) {
	        this.select();
	      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMGY4OWNjNWFmNjNmMTY0YmU5YTAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleS1pbnB1dC1yZWdpc3RlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudC1tYXRjaGVyLmpzIiwid2VicGFjazovLy8uL3NyYy9rZXktaW5wdXQuanMiXSwibmFtZXMiOlsia2kiLCJyZWdpc3RlciIsImJ1aWxkVmFsdWUiLCJNRVRBX0NPREVTIiwiU2V0IiwiQ1RSTF9DT0RFUyIsIkFMVF9DT0RFUyIsIlNISUZUX0NPREVTIiwiTU9EX0NPREVTIiwiQXJyYXkiLCJmcm9tIiwiREVGQVVMVF9PUFRJT05TIiwiYWxsb3dNb2RPbmx5Iiwibm9Nb2QiLCJpZ25vcmUiLCJ1bmRlZmluZWQiLCJFdmVudE1hdGNoZXIiLCJjb25zdHJ1Y3RvciIsInBhdHRlcm4iLCJrZXkiLCJwYXJzZVZhbHVlIiwidGVzdCIsImsiLCJzaGlmdEtleSIsImFsdEtleSIsImN0cmxLZXkiLCJtZXRhS2V5IiwidGVzdE1vZEluc2Vuc2l0aXZlIiwiY29kZSIsInNwbGl0dGVkIiwic3BsaXQiLCJsZW5ndGgiLCJtIiwic2hpZnQiLCJFcnJvciIsIm9wdGlvbnMiLCJpc01vZEtleSIsInZhbHVlIiwiYSIsImlzTWV0YUtleSIsInVuc2hpZnQiLCJpc0N0cmxLZXkiLCJpc0FsdEtleSIsImlzU2hpZnRLZXkiLCJqb2luIiwiaGFzIiwibWl4aW5LZXlkb3duSW5wdXQiLCJtaXhpbktleXVwSW5wdXQiLCJtaXhpbktleUlucHV0IiwiYyIsImhhc0F0dHJpYnV0ZSIsImIiLCJtYXJrQXR0ciIsInYiLCJnZXRBdHRyaWJ1dGUiLCJSZWdFeHAiLCJzZXRBdHRyaWJ1dGUiLCJ0b1N0cmluZyIsImRvY3VtZW50IiwiYWN0aXZlRWxlbWVudCIsInNlbGVjdCIsImNyZWF0ZWRDYWxsYmFjayIsInR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXYiLCJwcmV2ZW50RGVmYXVsdCIsImF0dGFjaGVkQ2FsbGJhY2siLCJvYnNlcnZlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2siLCJhdHRyTmFtZSIsImJ1aWxkTWF0Y2hlciIsImdlbmVyYXRlT3B0aW9ucyIsImUiLCJoYW5kbGVFdmVudCIsIktleWRvd25JbnB1dEVsZW1lbnQiLCJIVE1MSW5wdXRFbGVtZW50IiwiZXh0ZW5kcyIsIktleXVwSW5wdXRFbGVtZW50IiwicmVnaXN0ZXJFbGVtZW50Iiwic2VsZiIsIm8iLCJPYmplY3QiLCJlbnRyaWVzIiwibmFtZSIsImRlZmF1bHRWYWx1ZSIsImV2ZW50IiwicmVhZE9ubHkiLCJjb25zb2xlIiwibG9nIiwicmVtb3ZlQXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDckNBOztLQUFZQSxFOzs7O0FBRVpBLElBQUdDLFFBQUgsRzs7Ozs7Ozs7O1NDb0VnQkMsVSxHQUFBQSxVOzs7QUFoRWhCLEtBQU1DLGFBQWMsSUFBSUMsR0FBSixDQUFRLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsV0FBckIsQ0FBUixDQUFwQjs7QUFDQSxLQUFNQyxhQUFjLElBQUlELEdBQUosQ0FBUSxDQUFDLFNBQUQsRUFBWSxhQUFaLEVBQTJCLGNBQTNCLENBQVIsQ0FBcEI7QUFDQSxLQUFNRSxZQUFjLElBQUlGLEdBQUosQ0FBUSxDQUFDLEtBQUQsRUFBUSxTQUFSLEVBQW1CLFVBQW5CLENBQVIsQ0FBcEI7QUFDQSxLQUFNRyxjQUFjLElBQUlILEdBQUosQ0FBUSxDQUFDLE9BQUQsRUFBVSxXQUFWLEVBQXVCLFlBQXZCLENBQVIsQ0FBcEI7O0FBRUEsS0FBTUksWUFBWSxJQUFJSixH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QyxJQUFJLDhCQUFXZ0MsS0FBWCxFQUFrQk4sSUFBbEIsQ0FBVjtBQUNBUSxXQUFRQyxHQUFSLENBQVlILEtBQVo7QUFDQSxPQUFJaEMsS0FBSyxJQUFULEVBQWUwQixLQUFLMUMsS0FBTCxHQUFhZ0IsQ0FBYjtBQUNmLE9BQUlBLENBQUosRUFBT2dDLE1BQU1wQixjQUFOO0FBQ1I7O0FBRUQsVUFBU2IsUUFBVCxDQUFrQjJCLElBQWxCLEVBQXFDSSxJQUFyQyxFQUFtRGhDLENBQW5ELEVBQXFFO0FBQ25FLE9BQUlBLENBQUosRUFBTztBQUNMNEIsVUFBS3ZCLFlBQUwsQ0FBa0IyQixJQUFsQixFQUF3QixFQUF4QjtBQUNELElBRkQsTUFFTztBQUNMSixVQUFLVSxlQUFMLENBQXFCTixJQUFyQjtBQUNEO0FBQ0YsRSIsImZpbGUiOiJrZXktaW5wdXQtZWxlbWVudHMtZGVidWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwZjg5Y2M1YWY2M2YxNjRiZTlhMCIsIi8vIEBmbG93XG5pbXBvcnQgKiBhcyBraSBmcm9tIFwiLi9rZXktaW5wdXRcIjtcblxua2kucmVnaXN0ZXIoKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9rZXktaW5wdXQtcmVnaXN0ZXJlci5qcyIsIi8vIEBmbG93XG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50TWF0Y2hlck9wdGlvbnMge1xuICBhbGxvd01vZE9ubHk/OiBib29sZWFuO1xuICBub01vZD86IGJvb2xlYW47XG4gIGlnbm9yZT86ID9SZWdFeHA7XG59XG5cbmNvbnN0IE1FVEFfQ09ERVMgID0gbmV3IFNldChbXCJNZXRhXCIsIFwiTWV0YUxlZnRcIiwgXCJNZXRhUmlnaHRcIl0pO1xuY29uc3QgQ1RSTF9DT0RFUyAgPSBuZXcgU2V0KFtcIkNvbnRyb2xcIiwgXCJDb250cm9sTGVmdFwiLCBcIkNvbnRyb2xSaWdodFwiXSk7XG5jb25zdCBBTFRfQ09ERVMgICA9IG5ldyBTZXQoW1wiQWx0XCIsIFwiQWx0TGVmdFwiLCBcIkFsdFJpZ2h0XCJdKTtcbmNvbnN0IFNISUZUX0NPREVTID0gbmV3IFNldChbXCJTaGlmdFwiLCBcIlNoaWZ0TGVmdFwiLCBcIlNoaWZ0UmlnaHRcIl0pO1xuXG5jb25zdCBNT0RfQ09ERVMgPSBuZXcgU2V0KFtcbiAgLi4uQXJyYXkuZnJvbShNRVRBX0NPREVTKSxcbiAgLi4uQXJyYXkuZnJvbShDVFJMX0NPREVTKSxcbiAgLi4uQXJyYXkuZnJvbShBTFRfQ09ERVMpLFxuICAuLi5BcnJheS5mcm9tKFNISUZUX0NPREVTKSxcbl0pO1xuXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIGFsbG93TW9kT25seTogZmFsc2UsXG4gIG5vTW9kOiBmYWxzZSxcbiAgaWdub3JlOiB1bmRlZmluZWQsXG59O1xuZXhwb3J0IHsgREVGQVVMVF9PUFRJT05TIH07XG5cbmV4cG9ydCBpbnRlcmZhY2UgS2V5IHtcbiAgbWV0YUtleTogYm9vbGVhbjtcbiAgY3RybEtleTogYm9vbGVhbjtcbiAgYWx0S2V5OiBib29sZWFuO1xuICBzaGlmdEtleTogYm9vbGVhbjtcbiAgY29kZTogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudE1hdGNoZXIge1xuICBrZXk6IEtleTtcblxuICBjb25zdHJ1Y3RvcihwYXR0ZXJuOiBzdHJpbmcpIHtcbiAgICB0aGlzLmtleSA9IHBhcnNlVmFsdWUocGF0dGVybik7XG4gIH1cblxuICB0ZXN0KGs6IEtleSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBrLnNoaWZ0S2V5ID09PSB0aGlzLmtleS5zaGlmdEtleVxuICAgICAgJiYgay5hbHRLZXkgID09PSB0aGlzLmtleS5hbHRLZXlcbiAgICAgICYmIGsuY3RybEtleSA9PT0gdGhpcy5rZXkuY3RybEtleVxuICAgICAgJiYgay5tZXRhS2V5ID09PSB0aGlzLmtleS5tZXRhS2V5XG4gICAgICAmJiB0aGlzLnRlc3RNb2RJbnNlbnNpdGl2ZShrKTtcbiAgfVxuXG4gIHRlc3RNb2RJbnNlbnNpdGl2ZShrOiBLZXkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5rZXkuY29kZSA9PT0gay5jb2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlVmFsdWUocGF0dGVybjogc3RyaW5nKTogS2V5IHtcbiAgY29uc3Qgc3BsaXR0ZWQgPSBwYXR0ZXJuLnNwbGl0KFwiICsgXCIpO1xuICBjb25zdCBrZXkgPSB7IGFsdEtleTogZmFsc2UsIHNoaWZ0S2V5OiBmYWxzZSwgY3RybEtleTogZmFsc2UsIG1ldGFLZXk6IGZhbHNlLCBjb2RlOiBcIlwiIH07XG4gIHdoaWxlIChzcGxpdHRlZC5sZW5ndGggIT09IDEpIHtcbiAgICBjb25zdCBtID0gc3BsaXR0ZWQuc2hpZnQoKTtcbiAgICBzd2l0Y2ggKG0pIHtcbiAgICBjYXNlIFwiTWV0YVwiOiAga2V5Lm1ldGFLZXkgID0gdHJ1ZTsgYnJlYWs7XG4gICAgY2FzZSBcIkN0cmxcIjogIGtleS5jdHJsS2V5ICA9IHRydWU7IGJyZWFrO1xuICAgIGNhc2UgXCJBbHRcIjogICBrZXkuYWx0S2V5ICAgPSB0cnVlOyBicmVhaztcbiAgICBjYXNlIFwiU2hpZnRcIjoga2V5LnNoaWZ0S2V5ID0gdHJ1ZTsgYnJlYWs7XG4gICAgZGVmYXVsdDogdGhyb3cgRXJyb3IoYFVuZXhwZWN0ZWQgbW9kOiAke219YCk7XG4gICAgfVxuICB9XG4gIGtleS5jb2RlID0gc3BsaXR0ZWRbMF07XG4gIHJldHVybiBrZXk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZFZhbHVlKGtleTogS2V5LCBvcHRpb25zOiBFdmVudE1hdGNoZXJPcHRpb25zKTogP3N0cmluZyB7XG4gIGNvbnN0IGNvZGUgPSBrZXkuY29kZTtcbiAgaWYgKCFvcHRpb25zLmFsbG93TW9kT25seSAmJiBpc01vZEtleShrZXkuY29kZSkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxldCB2YWx1ZTtcbiAgaWYgKG9wdGlvbnMubm9Nb2QpIHtcbiAgICB2YWx1ZSA9IGNvZGU7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYSA9IFtjb2RlXTtcbiAgICBpZiAoa2V5Lm1ldGFLZXkgICYmICFpc01ldGFLZXkoY29kZSkpICBhLnVuc2hpZnQoXCJNZXRhXCIpO1xuICAgIGlmIChrZXkuY3RybEtleSAgJiYgIWlzQ3RybEtleShjb2RlKSkgIGEudW5zaGlmdChcIkN0cmxcIik7XG4gICAgaWYgKGtleS5hbHRLZXkgICAmJiAhaXNBbHRLZXkoY29kZSkpICAgYS51bnNoaWZ0KFwiQWx0XCIpO1xuICAgIGlmIChrZXkuc2hpZnRLZXkgJiYgIWlzU2hpZnRLZXkoY29kZSkpIGEudW5zaGlmdChcIlNoaWZ0XCIpO1xuICAgIHZhbHVlID0gYS5qb2luKFwiICsgXCIpO1xuICB9XG5cbiAgY29uc3QgaWdub3JlID0gb3B0aW9ucy5pZ25vcmU7XG4gIGlmIChpZ25vcmUgJiYgaWdub3JlLnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpc01vZEtleShjb2RlOiBzdHJpbmcpOiBib29sZWFuICAgeyByZXR1cm4gTU9EX0NPREVTLmhhcyhjb2RlKTsgfVxuZnVuY3Rpb24gaXNNZXRhS2V5KGNvZGU6IHN0cmluZyk6IGJvb2xlYW4gIHsgcmV0dXJuIE1FVEFfQ09ERVMuaGFzKGNvZGUpOyB9XG5mdW5jdGlvbiBpc0N0cmxLZXkoY29kZTogc3RyaW5nKTogYm9vbGVhbiAgeyByZXR1cm4gQ1RSTF9DT0RFUy5oYXMoY29kZSk7IH1cbmZ1bmN0aW9uIGlzQWx0S2V5KGNvZGU6IHN0cmluZyk6IGJvb2xlYW4gICB7IHJldHVybiBBTFRfQ09ERVMuaGFzKGNvZGUpOyB9XG5mdW5jdGlvbiBpc1NoaWZ0S2V5KGNvZGU6IHN0cmluZyk6IGJvb2xlYW4geyByZXR1cm4gU0hJRlRfQ09ERVMuaGFzKGNvZGUpOyB9XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZXZlbnQtbWF0Y2hlci5qcyIsIi8vIEBmbG93XG5pbXBvcnQgRXZlbnRNYXRjaGVyLCB7IGJ1aWxkVmFsdWUsIERFRkFVTFRfT1BUSU9OUyB9IGZyb20gXCIuL2V2ZW50LW1hdGNoZXJcIjtcbmltcG9ydCB0eXBlIEV2ZW50TWF0Y2hlck9wdGlvbnMgZnJvbSBcIi4vZXZlbnQtbWF0Y2hlclwiO1xuXG5kZWNsYXJlIGludGVyZmFjZSBLZXlJbnB1dCBleHRlbmRzIEhUTUxJbnB1dEVsZW1lbnQge1xuICBhbGxvd01vZE9ubHk6IGJvb2xlYW47XG4gIG5vTW9kOiBib29sZWFuO1xuICBpZ25vcmU6ID9SZWdFeHA7XG59XG5leHBvcnQgaW50ZXJmYWNlIEtleXVwSW5wdXQgZXh0ZW5kcyBLZXlJbnB1dCB7fVxuZXhwb3J0IGludGVyZmFjZSBLZXlkb3duSW5wdXQgZXh0ZW5kcyBLZXlJbnB1dCB7fVxuXG5mdW5jdGlvbiBtaXhpbktleUlucHV0PFQ6IEhUTUxJbnB1dEVsZW1lbnQ+KGM6IENsYXNzPFQ+KTogQ2xhc3M8VCAmIEtleUlucHV0PiB7XG4gIC8vICRGbG93Rml4TWUgRm9yY2UgY2FzdCB0byByZXR1cm5lZCB0eXBlXG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGMge1xuICAgIGdldCBhbGxvd01vZE9ubHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShcImFsbG93LW1vZC1vbmx5XCIpOyB9XG4gICAgc2V0IGFsbG93TW9kT25seShiOiBib29sZWFuKTogdm9pZCB7IG1hcmtBdHRyKHRoaXMsIFwiYWxsb3ctbW9kLW9ubHlcIiwgYik7IH1cblxuICAgIGdldCBub01vZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKFwibm8tbW9kXCIpOyB9XG4gICAgc2V0IG5vTW9kKGI6IGJvb2xlYW4pOiB2b2lkIHsgbWFya0F0dHIodGhpcywgXCJuby1tb2RcIiwgYik7IH1cblxuICAgIGdldCBpZ25vcmUoKTogP1JlZ0V4cCB7XG4gICAgICBjb25zdCB2ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJpZ25vcmVcIik7XG4gICAgICByZXR1cm4gdiA9PSBudWxsID8gbnVsbCA6IG5ldyBSZWdFeHAodik7XG4gICAgfVxuICAgIHNldCBpZ25vcmUocGF0dGVybjogP1JlZ0V4cCk6IHZvaWQge1xuICAgICAgaWYgKHBhdHRlcm4gIT0gbnVsbCkgdGhpcy5zZXRBdHRyaWJ1dGUoXCJpZ25vcmVcIiwgcGF0dGVybi50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKTogc3RyaW5nIHsgcmV0dXJuIHN1cGVyLnZhbHVlOyB9XG4gICAgc2V0IHZhbHVlKHY6IHN0cmluZyk6IHZvaWQge1xuICAgICAgc3VwZXIudmFsdWUgPSB2O1xuICAgICAgaWYgKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgPT09IHRoaXMpIHtcbiAgICAgICAgdGhpcy5zZWxlY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgICAgdGhpcy50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZXY6IEtleWJvYXJkRXZlbnQpID0+IGV2LnByZXZlbnREZWZhdWx0KCksIHRydWUpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKCkgPT4gdGhpcy5zZWxlY3QoKSk7XG4gICAgfVxuXG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHt9XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHsgcmV0dXJuIFtcInR5cGVcIl07IH1cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ck5hbWU6IHN0cmluZykge1xuICAgICAgc3dpdGNoIChhdHRyTmFtZSkge1xuICAgICAgY2FzZSBcInR5cGVcIjpcbiAgICAgICAgdGhpcy50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkTWF0Y2hlcigpOiBFdmVudE1hdGNoZXIge1xuICAgICAgcmV0dXJuIG5ldyBFdmVudE1hdGNoZXIodGhpcy52YWx1ZSwgZ2VuZXJhdGVPcHRpb25zKHRoaXMpKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbktleWRvd25JbnB1dDxUOiBIVE1MSW5wdXRFbGVtZW50PihjOiBDbGFzczxUPik6IENsYXNzPFQgJiBLZXlkb3duSW5wdXQ+IHtcbiAgLy8gJEZsb3dGaXhNZSBGb3JjZSBjYXN0IHRvIHJldHVybmVkIHR5cGVcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgbWl4aW5LZXlJbnB1dChjKSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmNyZWF0ZWRDYWxsYmFjaygpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gaGFuZGxlRXZlbnQodGhpcywgZSkpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEtleWRvd25JbnB1dEVsZW1lbnQgZXh0ZW5kcyBtaXhpbktleWRvd25JbnB1dChIVE1MSW5wdXRFbGVtZW50KSB7XG4gIHN0YXRpYyBnZXQgZXh0ZW5kcygpIHsgcmV0dXJuIFwiaW5wdXRcIjsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5LZXl1cElucHV0PFQ6IEhUTUxJbnB1dEVsZW1lbnQ+KGM6IENsYXNzPFQ+KTogQ2xhc3M8VCAmIEtleXVwSW5wdXQ+IHtcbiAgLy8gJEZsb3dGaXhNZSBGb3JjZSBjYXN0IHRvIHJldHVybmVkIHR5cGVcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgbWl4aW5LZXlJbnB1dChjKSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmNyZWF0ZWRDYWxsYmFjaygpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGU6IEtleWJvYXJkRXZlbnQpID0+IGhhbmRsZUV2ZW50KHRoaXMsIGUpKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgaWdub3JlID0gdGhpcy5pZ25vcmU7XG4gICAgICAgIGlmICghaWdub3JlKSB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHYgPSBidWlsZFZhbHVlKGUsIHRoaXMpO1xuICAgICAgICBpZiAodiAmJiBpZ25vcmUudGVzdCh2KSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEtleXVwSW5wdXRFbGVtZW50IGV4dGVuZHMgbWl4aW5LZXl1cElucHV0KEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgc3RhdGljIGdldCBleHRlbmRzKCkgeyByZXR1cm4gXCJpbnB1dFwiOyB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlcigpIHtcbiAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwia2V5ZG93bi1pbnB1dFwiLCBLZXlkb3duSW5wdXRFbGVtZW50KTtcbiAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwia2V5dXAtaW5wdXRcIiwgS2V5dXBJbnB1dEVsZW1lbnQpO1xufVxuXG4vL1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU9wdGlvbnMoc2VsZjogS2V5SW5wdXQpOiBFdmVudE1hdGNoZXJPcHRpb25zIHtcbiAgY29uc3QgbzogYW55ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlZmF1bHRWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoREVGQVVMVF9PUFRJT05TKSkge1xuICAgIGNvbnN0IHZhbHVlID0gKHNlbGY6IGFueSlbbmFtZV07XG4gICAgb1tuYW1lXSA9IHZhbHVlID09IG51bGwgPyBkZWZhdWx0VmFsdWUgOiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gbztcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXZlbnQoc2VsZjogS2V5SW5wdXQsIGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gIGlmIChzZWxmLnJlYWRPbmx5KSByZXR1cm47XG4gIGNvbnN0IHYgPSBidWlsZFZhbHVlKGV2ZW50LCBzZWxmKTtcbiAgY29uc29sZS5sb2coZXZlbnQpO1xuICBpZiAodiAhPSBudWxsKSBzZWxmLnZhbHVlID0gdjtcbiAgaWYgKHYpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmZ1bmN0aW9uIG1hcmtBdHRyKHNlbGY6IEhUTUxFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGI6IGJvb2xlYW4pOiB2b2lkIHtcbiAgaWYgKGIpIHtcbiAgICBzZWxmLnNldEF0dHJpYnV0ZShuYW1lLCBcIlwiKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2tleS1pbnB1dC5qcyJdLCJzb3VyY2VSb290IjoiIn0=