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
	
	var _keyInput = __webpack_require__(1);
	
	var ki = _interopRequireWildcard(_keyInput);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	ki.register();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.mixinKeydownInput = mixinKeydownInput;
	exports.mixinKeyupInput = mixinKeyupInput;
	exports.register = register;
	
	
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
	      return new EventMatcher(this.value, generateOptions(this));
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
	
	var DEFAULT_OPTIONS = {
	  allowModOnly: false,
	  noMod: false,
	  ignore: undefined
	};
	
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
	}
	
	//
	
	function generateOptions(self) {
	  var o = {};
	  for (var _iterator = Object.entries(DEFAULT_OPTIONS), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
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
	  var v = buildValue(event, self);
	  console.log(event);
	  if (v != null) self.value = v;
	  if (v) event.preventDefault();
	}
	
	var MOD_KEYS = new Set(["Shift", "Alt", "Control", "Meta"]);
	
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
	
	function markAttr(self, name, b) {
	  if (b) {
	    self.setAttribute(name, "");
	  } else {
	    self.removeAttribute(name);
	  }
	}

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjRhOTQ0ZGExYThmZDZiNDRjMjkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleS1pbnB1dC1yZWdpc3RlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9rZXktaW5wdXQuanMiXSwibmFtZXMiOlsia2kiLCJyZWdpc3RlciIsIm1peGluS2V5ZG93bklucHV0IiwibWl4aW5LZXl1cElucHV0IiwibWl4aW5LZXlJbnB1dCIsImMiLCJhbGxvd01vZE9ubHkiLCJoYXNBdHRyaWJ1dGUiLCJiIiwibWFya0F0dHIiLCJub01vZCIsImlnbm9yZSIsInYiLCJnZXRBdHRyaWJ1dGUiLCJSZWdFeHAiLCJwYXR0ZXJuIiwic2V0QXR0cmlidXRlIiwidG9TdHJpbmciLCJ2YWx1ZSIsInNlbGVjdCIsImNvbnN0cnVjdG9yIiwiY3JlYXRlZENhbGxiYWNrIiwidHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJldiIsInByZXZlbnREZWZhdWx0IiwiYXR0YWNoZWRDYWxsYmFjayIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsImF0dHJOYW1lIiwiYnVpbGRNYXRjaGVyIiwiRXZlbnRNYXRjaGVyIiwiZ2VuZXJhdGVPcHRpb25zIiwiZSIsImhhbmRsZUV2ZW50IiwiS2V5ZG93bklucHV0RWxlbWVudCIsIkhUTUxJbnB1dEVsZW1lbnQiLCJleHRlbmRzIiwiS2V5dXBJbnB1dEVsZW1lbnQiLCJkb2N1bWVudCIsInJlZ2lzdGVyRWxlbWVudCIsIkRFRkFVTFRfT1BUSU9OUyIsInVuZGVmaW5lZCIsIm9wdGlvbnMiLCJ0ZXN0IiwiZXZlbnQiLCJLZXlib2FyZEV2ZW50IiwibGVuZ3RoIiwiYnVpbGRWYWx1ZSIsInNlbGYiLCJvIiwiT2JqZWN0IiwiZW50cmllcyIsIm5hbWUiLCJkZWZhdWx0VmFsdWUiLCJyZWFkT25seSIsImNvbnNvbGUiLCJsb2ciLCJNT0RfS0VZUyIsIlNldCIsImNvZGUiLCJpc01vZEtleSIsImtleSIsImEiLCJzaGlmdEtleSIsInN0YXJ0c1dpdGgiLCJ1bnNoaWZ0IiwiYWx0S2V5IiwiY3RybEtleSIsIm1ldGFLZXkiLCJqb2luIiwiaGFzIiwicmVtb3ZlQXR0cmlidXRlIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7O0FDdENBOztLQUFZQSxFOzs7O0FBRVpBLElBQUdDLFFBQUgsRzs7Ozs7Ozs7O1NDd0RnQkMsaUIsR0FBQUEsaUI7U0FrQkFDLGUsR0FBQUEsZTtTQWtCQUYsUSxHQUFBQSxROzs7QUF0RmhCLFVBQVNHLGFBQVQsQ0FBNENDLENBQTVDLEVBQThFO0FBQzVFO0FBQ0EsVUFBTyxjQUFjQSxDQUFkLENBQWdCO0FBQ3JCLFNBQUlDLFlBQUosR0FBNEI7QUFBRSxjQUFPLEtBQUtDLFlBQUwsQ0FBa0IsZ0JBQWxCLENBQVA7QUFBNkM7QUFDM0UsU0FBSUQsWUFBSixDQUFpQkUsQ0FBakIsRUFBbUM7QUFBRUMsZ0JBQVMsSUFBVCxFQUFlLGdCQUFmLEVBQWlDRCxDQUFqQztBQUFzQzs7QUFFM0UsU0FBSUUsS0FBSixHQUFxQjtBQUFFLGNBQU8sS0FBS0gsWUFBTCxDQUFrQixRQUFsQixDQUFQO0FBQXFDO0FBQzVELFNBQUlHLEtBQUosQ0FBVUYsQ0FBVixFQUE0QjtBQUFFQyxnQkFBUyxJQUFULEVBQWUsUUFBZixFQUF5QkQsQ0FBekI7QUFBOEI7O0FBRTVELFNBQUlHLE1BQUosR0FBc0I7QUFDcEIsV0FBTUMsSUFBSSxLQUFLQyxZQUFMLENBQWtCLFFBQWxCLENBQVY7QUFDQSxjQUFPRCxLQUFLLElBQUwsR0FBWSxJQUFaLEdBQW1CLElBQUlFLE1BQUosQ0FBV0YsQ0FBWCxDQUExQjtBQUNE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QUFhVCxHQUFiLENBQVA7QUFDRDs7QUFFRCxVQUFTckQsUUFBVCxDQUFrQndDLElBQWxCLEVBQXFDSSxJQUFyQyxFQUFtRDdDLENBQW5ELEVBQXFFO0FBQ25FLE9BQUlBLENBQUosRUFBTztBQUNMeUMsVUFBS2pDLFlBQUwsQ0FBa0JxQyxJQUFsQixFQUF3QixFQUF4QjtBQUNELElBRkQsTUFFTztBQUNMSixVQUFLdUIsZUFBTCxDQUFxQm5CLElBQXJCO0FBQ0Q7QUFDRixFIiwiZmlsZSI6ImtleS1pbnB1dC1lbGVtZW50cy1kZWJ1Zy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY0YTk0NGRhMWE4ZmQ2YjQ0YzI5IiwiaW1wb3J0ICogYXMga2kgZnJvbSBcIi4va2V5LWlucHV0XCI7XG5cbmtpLnJlZ2lzdGVyKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMva2V5LWlucHV0LXJlZ2lzdGVyZXIuanMiLCJkZWNsYXJlIGludGVyZmFjZSBLZXlJbnB1dCBleHRlbmRzIEhUTUxJbnB1dEVsZW1lbnQge1xuICBhbGxvd01vZE9ubHk6IGJvb2xlYW47XG4gIG5vTW9kOiBib29sZWFuO1xuICBpZ25vcmU6ID9SZWdFeHA7XG59XG5leHBvcnQgaW50ZXJmYWNlIEtleXVwSW5wdXQgZXh0ZW5kcyBLZXlJbnB1dCB7fVxuZXhwb3J0IGludGVyZmFjZSBLZXlkb3duSW5wdXQgZXh0ZW5kcyBLZXlJbnB1dCB7fVxuXG5mdW5jdGlvbiBtaXhpbktleUlucHV0PFQ6IEhUTUxJbnB1dEVsZW1lbnQ+KGM6IENsYXNzPFQ+KTogQ2xhc3M8VCAmIEtleUlucHV0PiB7XG4gIC8vICRGbG93Rml4TWUgRm9yY2UgY2FzdCB0byByZXR1cm5lZCB0eXBlXG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGMge1xuICAgIGdldCBhbGxvd01vZE9ubHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc0F0dHJpYnV0ZShcImFsbG93LW1vZC1vbmx5XCIpOyB9XG4gICAgc2V0IGFsbG93TW9kT25seShiOiBib29sZWFuKTogdm9pZCB7IG1hcmtBdHRyKHRoaXMsIFwiYWxsb3ctbW9kLW9ubHlcIiwgYik7IH1cblxuICAgIGdldCBub01vZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzQXR0cmlidXRlKFwibm8tbW9kXCIpOyB9XG4gICAgc2V0IG5vTW9kKGI6IGJvb2xlYW4pOiB2b2lkIHsgbWFya0F0dHIodGhpcywgXCJuby1tb2RcIiwgYik7IH1cblxuICAgIGdldCBpZ25vcmUoKTogP1JlZ0V4cCB7XG4gICAgICBjb25zdCB2ID0gdGhpcy5nZXRBdHRyaWJ1dGUoXCJpZ25vcmVcIik7XG4gICAgICByZXR1cm4gdiA9PSBudWxsID8gbnVsbCA6IG5ldyBSZWdFeHAodik7XG4gICAgfVxuICAgIHNldCBpZ25vcmUocGF0dGVybjogP1JlZ0V4cCk6IHZvaWQge1xuICAgICAgaWYgKHBhdHRlcm4gIT0gbnVsbCkgdGhpcy5zZXRBdHRyaWJ1dGUoXCJpZ25vcmVcIiwgcGF0dGVybi50b1N0cmluZygpKTtcbiAgICB9XG5cbiAgICBnZXQgdmFsdWUoKTogc3RyaW5nIHsgcmV0dXJuIHN1cGVyLnZhbHVlOyB9XG4gICAgc2V0IHZhbHVlKHY6IHN0cmluZyk6IHZvaWQge1xuICAgICAgc3VwZXIudmFsdWUgPSB2O1xuICAgICAgdGhpcy5zZWxlY3QoKTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlZENhbGxiYWNrKCkge1xuICAgICAgdGhpcy50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCAoZXY6IEtleWJvYXJkRXZlbnQpID0+IGV2LnByZXZlbnREZWZhdWx0KCksIHRydWUpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKCkgPT4gdGhpcy5zZWxlY3QoKSk7XG4gICAgfVxuXG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHt9XG5cbiAgICBzdGF0aWMgZ2V0IG9ic2VydmVkQXR0cmlidXRlcygpIHsgcmV0dXJuIFtcInR5cGVcIl07IH1cbiAgICBhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2soYXR0ck5hbWU6IHN0cmluZykge1xuICAgICAgc3dpdGNoIChhdHRyTmFtZSkge1xuICAgICAgY2FzZSBcInR5cGVcIjpcbiAgICAgICAgdGhpcy50eXBlID0gXCJ0ZXh0XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkTWF0Y2hlcigpOiBFdmVudE1hdGNoZXIge1xuICAgICAgcmV0dXJuIG5ldyBFdmVudE1hdGNoZXIodGhpcy52YWx1ZSwgZ2VuZXJhdGVPcHRpb25zKHRoaXMpKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbktleWRvd25JbnB1dDxUOiBIVE1MSW5wdXRFbGVtZW50PihjOiBDbGFzczxUPik6IENsYXNzPFQgJiBLZXlkb3duSW5wdXQ+IHtcbiAgLy8gJEZsb3dGaXhNZSBGb3JjZSBjYXN0IHRvIHJldHVybmVkIHR5cGVcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgbWl4aW5LZXlJbnB1dChjKSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmNyZWF0ZWRDYWxsYmFjaygpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZTogS2V5Ym9hcmRFdmVudCkgPT4gaGFuZGxlRXZlbnQodGhpcywgZSkpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEtleWRvd25JbnB1dEVsZW1lbnQgZXh0ZW5kcyBtaXhpbktleWRvd25JbnB1dChIVE1MSW5wdXRFbGVtZW50KSB7XG4gIHN0YXRpYyBnZXQgZXh0ZW5kcygpIHsgcmV0dXJuIFwiaW5wdXRcIjsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5LZXl1cElucHV0PFQ6IEhUTUxJbnB1dEVsZW1lbnQ+KGM6IENsYXNzPFQ+KTogQ2xhc3M8VCAmIEtleXVwSW5wdXQ+IHtcbiAgLy8gJEZsb3dGaXhNZSBGb3JjZSBjYXN0IHRvIHJldHVybmVkIHR5cGVcbiAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgbWl4aW5LZXlJbnB1dChjKSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgIH1cblxuICAgIGNyZWF0ZWRDYWxsYmFjaygpIHtcbiAgICAgIHN1cGVyLmNyZWF0ZWRDYWxsYmFjaygpO1xuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGU6IEtleWJvYXJkRXZlbnQpID0+IGhhbmRsZUV2ZW50KHRoaXMsIGUpKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBLZXl1cElucHV0RWxlbWVudCBleHRlbmRzIG1peGluS2V5dXBJbnB1dChIVE1MSW5wdXRFbGVtZW50KSB7XG4gIHN0YXRpYyBnZXQgZXh0ZW5kcygpIHsgcmV0dXJuIFwiaW5wdXRcIjsgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXIoKSB7XG4gIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImtleWRvd24taW5wdXRcIiwgS2V5ZG93bklucHV0RWxlbWVudCk7XG4gIGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudChcImtleXVwLWlucHV0XCIsIEtleXVwSW5wdXRFbGVtZW50KTtcbn1cblxuLy9cblxuaW50ZXJmYWNlIEV2ZW50TWF0Y2hlck9wdGlvbnMge1xuICBhbGxvd01vZE9ubHk/OiBib29sZWFuO1xuICBub01vZD86IGJvb2xlYW47XG4gIGlnbm9yZT86ID9SZWdFeHA7XG59XG5cbmNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgYWxsb3dNb2RPbmx5OiBmYWxzZSxcbiAgbm9Nb2Q6IGZhbHNlLFxuICBpZ25vcmU6IHVuZGVmaW5lZCxcbn07XG5cbmNsYXNzIEV2ZW50TWF0Y2hlciB7XG4gIHBhdHRlcm46IHN0cmluZztcbiAgb3B0aW9uczogRXZlbnRNYXRjaGVyT3B0aW9ucztcblxuICBjb25zdHJ1Y3RvcihwYXR0ZXJuOiBzdHJpbmcsIG9wdGlvbnM/OiBFdmVudE1hdGNoZXJPcHRpb25zID0gREVGQVVMVF9PUFRJT05TKSB7XG4gICAgdGhpcy5wYXR0ZXJuID0gcGF0dGVybjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgdGVzdChldmVudDogRXZlbnQpIHtcbiAgICBpZiAoIShldmVudCBpbnN0YW5jZW9mIEtleWJvYXJkRXZlbnQpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHRoaXMucGF0dGVybi5sZW5ndGggPT09IDApIHJldHVybiBmYWxzZTtcbiAgICBjb25zdCB2YWx1ZSA9IGJ1aWxkVmFsdWUoKGV2ZW50OiBLZXlib2FyZEV2ZW50KSwgdGhpcy5vcHRpb25zKTtcbiAgICByZXR1cm4gdGhpcy5wYXR0ZXJuID09PSB2YWx1ZTtcbiAgfVxufVxuXG4vL1xuXG5mdW5jdGlvbiBnZW5lcmF0ZU9wdGlvbnMoc2VsZjogS2V5SW5wdXQpOiBFdmVudE1hdGNoZXJPcHRpb25zIHtcbiAgY29uc3QgbzogYW55ID0ge307XG4gIGZvciAoY29uc3QgW25hbWUsIGRlZmF1bHRWYWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMoREVGQVVMVF9PUFRJT05TKSkge1xuICAgIGNvbnN0IHZhbHVlID0gKHNlbGY6IGFueSlbbmFtZV07XG4gICAgb1tuYW1lXSA9IHZhbHVlID09IG51bGwgPyBkZWZhdWx0VmFsdWUgOiB2YWx1ZTtcbiAgfVxuICByZXR1cm4gbztcbn1cblxuZnVuY3Rpb24gaGFuZGxlRXZlbnQoc2VsZjogS2V5SW5wdXQsIGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gIGlmIChzZWxmLnJlYWRPbmx5KSByZXR1cm47XG4gIGNvbnN0IHYgPSBidWlsZFZhbHVlKGV2ZW50LCBzZWxmKTtcbiAgY29uc29sZS5sb2coZXZlbnQpO1xuICBpZiAodiAhPSBudWxsKSBzZWxmLnZhbHVlID0gdjtcbiAgaWYgKHYpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG59XG5cbmNvbnN0IE1PRF9LRVlTID0gbmV3IFNldChbXCJTaGlmdFwiLCBcIkFsdFwiLCBcIkNvbnRyb2xcIiwgXCJNZXRhXCJdKTtcblxuZnVuY3Rpb24gYnVpbGRWYWx1ZShldmVudDogS2V5Ym9hcmRFdmVudCwgb3B0aW9uczogRXZlbnRNYXRjaGVyT3B0aW9ucyk6ID9zdHJpbmcge1xuICBjb25zdCBjb2RlID0gZXZlbnQuY29kZTtcbiAgaWYgKCFvcHRpb25zLmFsbG93TW9kT25seSAmJiBpc01vZEtleShldmVudC5rZXkpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBsZXQgdmFsdWU7XG4gIGlmIChvcHRpb25zLm5vTW9kKSB7XG4gICAgdmFsdWUgPSBjb2RlO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IGEgPSBbY29kZV07XG4gICAgaWYgKGV2ZW50LnNoaWZ0S2V5ICYmICFjb2RlLnN0YXJ0c1dpdGgoXCJTaGlmdFwiKSkgICBhLnVuc2hpZnQoXCJTaGlmdFwiKTtcbiAgICBpZiAoZXZlbnQuYWx0S2V5ICAgJiYgIWNvZGUuc3RhcnRzV2l0aChcIkFsdFwiKSkgICAgIGEudW5zaGlmdChcIkFsdFwiKTtcbiAgICBpZiAoZXZlbnQuY3RybEtleSAgJiYgIWNvZGUuc3RhcnRzV2l0aChcIkNvbnRyb2xcIikpIGEudW5zaGlmdChcIkNvbnRyb2xcIik7XG4gICAgaWYgKGV2ZW50Lm1ldGFLZXkgICYmICFjb2RlLnN0YXJ0c1dpdGgoXCJNZXRhXCIpKSAgICBhLnVuc2hpZnQoXCJNZXRhXCIpO1xuICAgIHZhbHVlID0gYS5qb2luKFwiICsgXCIpO1xuICB9XG5cbiAgY29uc3QgaWdub3JlID0gb3B0aW9ucy5pZ25vcmU7XG4gIGlmIChpZ25vcmUgJiYgaWdub3JlLnRlc3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBpc01vZEtleShrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gTU9EX0tFWVMuaGFzKGtleSk7XG59XG5cbmZ1bmN0aW9uIG1hcmtBdHRyKHNlbGY6IEhUTUxFbGVtZW50LCBuYW1lOiBzdHJpbmcsIGI6IGJvb2xlYW4pOiB2b2lkIHtcbiAgaWYgKGIpIHtcbiAgICBzZWxmLnNldEF0dHJpYnV0ZShuYW1lLCBcIlwiKTtcbiAgfSBlbHNlIHtcbiAgICBzZWxmLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgfVxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2tleS1pbnB1dC5qcyJdLCJzb3VyY2VSb290IjoiIn0=