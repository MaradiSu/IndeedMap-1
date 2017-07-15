define(["exports", "../utils/D3Utils"], function (exports, _D3Utils) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var D3Utils = _interopRequireWildcard(_D3Utils);

	function _interopRequireWildcard(obj) {
		if (obj && obj.__esModule) {
			return obj;
		} else {
			var newObj = {};

			if (obj != null) {
				for (var key in obj) {
					if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
				}
			}

			newObj.default = obj;
			return newObj;
		}
	}

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

	var ProgressBar = function () {
		function ProgressBar(progressBarContainerElem) {
			_classCallCheck(this, ProgressBar);

			this.progressBarContainer = progressBarContainerElem;
			this.progressBar = d3.select(this.progressBarContainer.find("#progress-bar").get(0));
			this.width = 150;
			this.height = 150;
			this.twoPi = 2 * Math.PI;
			this.formatPercent = d3.format(".0%");
			this.backgroundArc = D3Utils.createArc(0, this.twoPi, 50, 60);
			this.foregroundArc = D3Utils.createArc(0, 0, 50, 60);
			this.progressPercent = 0;

			this.createProgressBar();
			this.displayOnSearchEvent();
			this.updateOnRequestEvent();
			this.hideOnSearchCompleteEvent();
		}

		_createClass(ProgressBar, [{
			key: "createProgressBar",
			value: function createProgressBar() {
				this.progressBar = this.progressBar.append("svg").attr("width", this.width).attr("height", this.height).attr("top", "50%").attr("left", "50%");

				this.appendCenteringGroup();
				this.appendProgressText();
			}
		}, {
			key: "appendCenteringGroup",
			value: function appendCenteringGroup() {
				this.progressMeter = this.progressBar.append("g").attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")").attr("class", "progress-meter");

				this.appendBackgroundPath();
				this.appendForegroundPath();
			}
		}, {
			key: "appendBackgroundPath",
			value: function appendBackgroundPath() {
				this.progressMeter.append("path").attr("class", "background").attr("d", this.backgroundArc);
			}
		}, {
			key: "appendForegroundPath",
			value: function appendForegroundPath() {
				this.foregroundPath = this.progressMeter.append("path").attr("class", "foreground").attr("d", this.foregroundArc);
			}
		}, {
			key: "appendProgressText",
			value: function appendProgressText() {
				this.progressText = this.progressMeter.append("text").attr("text-anchor", "middle").attr("dy", ".35em");
			}
		}, {
			key: "updateProgress",
			value: function updateProgress(progressPercent) {
				var arcEndAngle = this.twoPi * progressPercent;
				this.foregroundPath.attr("d", this.foregroundArc.endAngle(arcEndAngle));

				var formattedPercent = this.formatPercent(progressPercent);
				this.progressText.text(formattedPercent);
			}
		}, {
			key: "displayOnSearchEvent",
			value: function displayOnSearchEvent() {
				var _this = this;

				$(document).on('search', function () {
					_this.updateProgress(0);
					_this.progressBarContainer.css("display", "flex");
				});
			}
		}, {
			key: "updateOnRequestEvent",
			value: function updateOnRequestEvent() {
				var _this2 = this;

				$(document).on("page-request-complete", function (event, percentComplete) {
					_this2.updateProgress(percentComplete);
				});
			}
		}, {
			key: "hideOnSearchCompleteEvent",
			value: function hideOnSearchCompleteEvent() {
				var _this3 = this;

				$(document).on('search-complete search-error', function () {
					_this3.progressBarContainer.css("display", "none");
				});
			}
		}]);

		return ProgressBar;
	}();

	exports.default = ProgressBar;
});