define(["exports", "../ui/JobSearchForm"], function (exports, _JobSearchForm) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _JobSearchForm2 = _interopRequireDefault(_JobSearchForm);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
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

	var TabbedPanes = function () {
		function TabbedPanes(tabbedPaneElem) {
			_classCallCheck(this, TabbedPanes);

			this.tabbedPaneElem = tabbedPaneElem;
			this.tabs = this.tabbedPaneElem.find(".tab");
			this.panes = this.tabbedPaneElem.find(".pane");

			this.createJobSearchForm();
			this.displayPaneOnClickEvent();
		}

		_createClass(TabbedPanes, [{
			key: "createJobSearchForm",
			value: function createJobSearchForm() {
				var searchPane = this.tabbedPaneElem.find("#search-pane");
				this.jobSearchForm = new _JobSearchForm2.default(searchPane);
			}
		}, {
			key: "displayPaneOnClickEvent",
			value: function displayPaneOnClickEvent() {
				var _this = this;

				this.tabs.click(function (event) {
					var clickedTab = $(event.target);
					_this.reassignTabSelectStyle(clickedTab);
					_this.displayTargetPane(clickedTab);
				});
			}
		}, {
			key: "displayTargetPane",
			value: function displayTargetPane(clickedTab) {
				var paneId = clickedTab.attr('data-target');
				this.hidePanes();
				this.showPane(paneId);
			}
		}, {
			key: "showPane",
			value: function showPane(paneId) {
				this.hidePanes();
				this.panes.each(function (_, pane) {
					if ($(pane).attr('id') == paneId) {
						$(pane).show();
					}
				});
			}
		}, {
			key: "hidePanes",
			value: function hidePanes() {
				this.panes.hide();
			}
		}, {
			key: "reassignTabSelectStyle",
			value: function reassignTabSelectStyle(clickedTab) {
				this.tabs.each(function (_, tab) {
					$(tab).removeClass('tab-selected');
				});
				clickedTab.addClass('tab-selected');
			}
		}]);

		return TabbedPanes;
	}();

	exports.default = TabbedPanes;
});