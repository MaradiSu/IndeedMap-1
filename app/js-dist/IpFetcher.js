define(["exports"], function (exports) {
	"use strict";

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

	var IpFetcher = function () {
		function IpFetcher(ip) {
			_classCallCheck(this, IpFetcher);

			this.fetchIp();
		}

		_createClass(IpFetcher, [{
			key: "fetchIp",
			value: function fetchIp() {
				var _this = this;

				$.get("https://api.ipify.org?format=json").done(function (result) {
					return _this.ip = result.ip;
				}).fail(function () {
					return _this.ip = undefined;
				});
			}
		}]);

		return IpFetcher;
	}();

	exports.default = IpFetcher;
});