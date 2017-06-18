define(['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var SearchError = function () {
		function SearchError() {
			_classCallCheck(this, SearchError);

			this.alertOnErrorEvent();
		}

		_createClass(SearchError, [{
			key: 'alertOnErrorEvent',
			value: function alertOnErrorEvent() {
				$(document).on('search-error', function (event, message) {
					alert(message);
				});
			}
		}]);

		return SearchError;
	}();

	exports.default = SearchError;
});