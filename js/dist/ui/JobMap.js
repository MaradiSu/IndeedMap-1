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

	var JobMap = exports.JobMap = function () {
		function JobMap(jobMapElem) {
			_classCallCheck(this, JobMap);

			this.mapContainer = jobMapElem;
			console.log(this.mapContainer);
			this.initMap();
		}

		_createClass(JobMap, [{
			key: "initMap",
			value: function initMap() {
				this.map = new Map(this.mapContainer[0], {
					center: [-98.35, 39.5],
					zoom: 4,
					basemap: "streets"
				});
			}
		}]);

		return JobMap;
	}();
});