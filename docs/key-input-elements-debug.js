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
	
	var _keyInput2 = _interopRequireDefault(_keyInput);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_keyInput2.default.register();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports.mixinKeyupInput = mixinKeyupInput;
	exports.mixinKeydownInput = mixinKeydownInput;
	
	
	function mixinKeyInput(c) {
	  // $FlowFixMe Force cast to returned type
	  return class extends c {
	    constructor() {
	      super();
	    }
	
	    createdCallback() {
	      console.log("created", this);
	    }
	
	    attachedCallback() {
	      console.log("attached", this);
	    }
	
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
	  };
	}
	
	function mixinKeyupInput(c) {
	  // $FlowFixMe Force cast to returned type
	  return class extends mixinKeyInput(c) {
	    constructor() {
	      super();
	    }
	  };
	}
	
	function mixinKeydownInput(c) {
	  // $FlowFixMe Force cast to returned type
	  return class extends mixinKeyInput(c) {
	    constructor() {
	      super();
	    }
	  };
	}
	
	class HTMLKeyupInputElement extends mixinKeyupInput(HTMLInputElement) {
	  static get extends() {
	    return "input";
	  }
	}
	exports.HTMLKeyupInputElement = HTMLKeyupInputElement;
	class HTMLKeydownInputElement extends mixinKeydownInput(HTMLInputElement) {
	  static get extends() {
	    return "input";
	  }
	}
	
	exports.HTMLKeydownInputElement = HTMLKeydownInputElement;
	exports.default = {
	  register() {
	    document.registerElement("keyup-input", HTMLKeyupInputElement);
	    document.registerElement("keydown-input", HTMLKeydownInputElement);
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODhhYWY4MTEwOTM0NDEzZGRkYzQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2tleS1pbnB1dC1yZWdpc3RlcmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9rZXktaW5wdXQuanMiXSwibmFtZXMiOlsicmVnaXN0ZXIiLCJtaXhpbktleXVwSW5wdXQiLCJtaXhpbktleWRvd25JbnB1dCIsIm1peGluS2V5SW5wdXQiLCJjIiwiY29uc3RydWN0b3IiLCJjcmVhdGVkQ2FsbGJhY2siLCJjb25zb2xlIiwibG9nIiwiYXR0YWNoZWRDYWxsYmFjayIsIm9ic2VydmVkQXR0cmlidXRlcyIsImF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayIsImF0dHJOYW1lIiwidHlwZSIsIkhUTUxLZXl1cElucHV0RWxlbWVudCIsIkhUTUxJbnB1dEVsZW1lbnQiLCJleHRlbmRzIiwiSFRNTEtleWRvd25JbnB1dEVsZW1lbnQiLCJkb2N1bWVudCIsInJlZ2lzdGVyRWxlbWVudCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7OztBQ3RDQTs7Ozs7O0FBRUEsb0JBQUdBLFFBQUgsRzs7Ozs7Ozs7O1NDaUNnQkMsZSxHQUFBQSxlO1NBU0FDLGlCLEdBQUFBLGlCOzs7QUF4Q2hCLFVBQVNDLGFBQVQsQ0FBNENDLENBQTVDLEVBQThFO0FBQzVFO0FBQ0EsVUFBTyxjQUFjQSxDQUFkLENBQWdCO0FBQ3JCQyxtQkFBYztBQUNaO0FBQ0Q7O0FBRURDLHVCQUFrQjtBQUNoQkMsZUFBUUMsR0FBUixDQUFZLFNBQVosRUFBdUIsSUFBdkI7QUFDRDs7QUFFREMsd0JBQW1CO0FBQ2pCRixlQUFRQyxHQUFSLENBQVksVUFBWixFQUF3QixJQUF4QjtBQUNEOztBQUVELGdCQUFXRSxrQkFBWCxHQUFnQztBQUM5QixjQUFPLENBQ0wsTUFESyxDQUFQO0FBR0Q7O0FBRURDLDhCQUF5QkMsUUFBekIsRUFBMkM7QUFDekMsZUFBUUEsUUFBUjtBQUNBLGNBQUssTUFBTDtBQUNFLGdCQUFLQyxJQUFMLEdBQVksTUFBWjtBQUNBO0FBSEY7QUFLRDtBQXpCb0IsSUFBdkI7QUEyQkQ7O0FBRU0sVUFBU1osZUFBVCxDQUE4Q0csQ0FBOUMsRUFBa0Y7QUFDdkY7QUFDQSxVQUFPLGNBQWNELGNBQWNDLENBQWQsQ0FBZCxDQUErQjtBQUNwQ0MsbUJBQWM7QUFDWjtBQUNEO0FBSG1DLElBQXRDO0FBS0Q7O0FBRU0sVUFBU0gsaUJBQVQsQ0FBZ0RFLENBQWhELEVBQXNGO0FBQzNGO0FBQ0EsVUFBTyxjQUFjRCxjQUFjQyxDQUFkLENBQWQsQ0FBK0I7QUFDcENDLG1CQUFjO0FBQ1o7QUFDRDtBQUhtQyxJQUF0QztBQUtEOztBQUVNLE9BQU1TLHFCQUFOLFNBQW9DYixnQkFBZ0JjLGdCQUFoQixDQUFwQyxDQUFzRTtBQUMzRSxjQUFXQyxPQUFYLEdBQXFCO0FBQUUsWUFBTyxPQUFQO0FBQWlCO0FBRG1DO1NBQWhFRixxQixHQUFBQSxxQjtBQUdOLE9BQU1HLHVCQUFOLFNBQXNDZixrQkFBa0JhLGdCQUFsQixDQUF0QyxDQUEwRTtBQUMvRSxjQUFXQyxPQUFYLEdBQXFCO0FBQUUsWUFBTyxPQUFQO0FBQWlCO0FBRHVDOztTQUFwRUMsdUIsR0FBQUEsdUI7bUJBSUU7QUFDYmpCLGNBQVc7QUFDVGtCLGNBQVNDLGVBQVQsQ0FBeUIsYUFBekIsRUFBd0NMLHFCQUF4QztBQUNBSSxjQUFTQyxlQUFULENBQXlCLGVBQXpCLEVBQTBDRix1QkFBMUM7QUFDRDtBQUpZLEUiLCJmaWxlIjoia2V5LWlucHV0LWVsZW1lbnRzLWRlYnVnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgODhhYWY4MTEwOTM0NDEzZGRkYzQiLCJpbXBvcnQga2kgZnJvbSBcIi4va2V5LWlucHV0XCI7XG5cbmtpLnJlZ2lzdGVyKCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMva2V5LWlucHV0LXJlZ2lzdGVyZXIuanMiLCJkZWNsYXJlIGludGVyZmFjZSBLZXlJbnB1dCBleHRlbmRzIEhUTUxJbnB1dEVsZW1lbnQge31cbmV4cG9ydCBpbnRlcmZhY2UgS2V5dXBJbnB1dCBleHRlbmRzIEtleXVwSW5wdXQge31cbmV4cG9ydCBpbnRlcmZhY2UgS2V5ZG93bklucHV0IGV4dGVuZHMgS2V5dXBJbnB1dCB7fVxuXG5mdW5jdGlvbiBtaXhpbktleUlucHV0PFQ6IEhUTUxJbnB1dEVsZW1lbnQ+KGM6IENsYXNzPFQ+KTogQ2xhc3M8VCAmIEtleUlucHV0PiB7XG4gIC8vICRGbG93Rml4TWUgRm9yY2UgY2FzdCB0byByZXR1cm5lZCB0eXBlXG4gIHJldHVybiBjbGFzcyBleHRlbmRzIGMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgICBjb25zb2xlLmxvZyhcImNyZWF0ZWRcIiwgdGhpcyk7XG4gICAgfVxuXG4gICAgYXR0YWNoZWRDYWxsYmFjaygpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiYXR0YWNoZWRcIiwgdGhpcyk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBcInR5cGVcIixcbiAgICAgIF07XG4gICAgfVxuXG4gICAgYXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGF0dHJOYW1lOiBzdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoYXR0ck5hbWUpIHtcbiAgICAgIGNhc2UgXCJ0eXBlXCI6XG4gICAgICAgIHRoaXMudHlwZSA9IFwidGV4dFwiO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtaXhpbktleXVwSW5wdXQ8VDogSFRNTElucHV0RWxlbWVudD4oYzogQ2xhc3M8VD4pOiBDbGFzczxUICYgS2V5dXBJbnB1dD4ge1xuICAvLyAkRmxvd0ZpeE1lIEZvcmNlIGNhc3QgdG8gcmV0dXJuZWQgdHlwZVxuICByZXR1cm4gY2xhc3MgZXh0ZW5kcyBtaXhpbktleUlucHV0KGMpIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgfVxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWl4aW5LZXlkb3duSW5wdXQ8VDogSFRNTElucHV0RWxlbWVudD4oYzogQ2xhc3M8VD4pOiBDbGFzczxUICYgS2V5ZG93bklucHV0PiB7XG4gIC8vICRGbG93Rml4TWUgRm9yY2UgY2FzdCB0byByZXR1cm5lZCB0eXBlXG4gIHJldHVybiBjbGFzcyBleHRlbmRzIG1peGluS2V5SW5wdXQoYykge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjbGFzcyBIVE1MS2V5dXBJbnB1dEVsZW1lbnQgZXh0ZW5kcyBtaXhpbktleXVwSW5wdXQoSFRNTElucHV0RWxlbWVudCkge1xuICBzdGF0aWMgZ2V0IGV4dGVuZHMoKSB7IHJldHVybiBcImlucHV0XCI7IH1cbn1cbmV4cG9ydCBjbGFzcyBIVE1MS2V5ZG93bklucHV0RWxlbWVudCBleHRlbmRzIG1peGluS2V5ZG93bklucHV0KEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgc3RhdGljIGdldCBleHRlbmRzKCkgeyByZXR1cm4gXCJpbnB1dFwiOyB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgcmVnaXN0ZXIoKSB7XG4gICAgZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KFwia2V5dXAtaW5wdXRcIiwgSFRNTEtleXVwSW5wdXRFbGVtZW50KTtcbiAgICBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoXCJrZXlkb3duLWlucHV0XCIsIEhUTUxLZXlkb3duSW5wdXRFbGVtZW50KTtcbiAgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9rZXktaW5wdXQuanMiXSwic291cmNlUm9vdCI6IiJ9