require(["app/ui/ProgressBar", "app/JobFetcher", "app/ui/SearchError", "app/ui/TabbedPanes", "app/ui/JobMap", "jquery", "d3", "dojo/domReady"], function (_ProgressBar, _JobFetcher, _SearchError, _TabbedPanes, _JobMap, _jquery, _d) {
	"use strict";

	var _ProgressBar2 = _interopRequireDefault(_ProgressBar);

	var _JobFetcher2 = _interopRequireDefault(_JobFetcher);

	var _SearchError2 = _interopRequireDefault(_SearchError);

	var _TabbedPanes2 = _interopRequireDefault(_TabbedPanes);

	var _JobMap2 = _interopRequireDefault(_JobMap);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _d2 = _interopRequireDefault(_d);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	new _ProgressBar2.default((0, _jquery2.default)("#progress-bar-container"));
	new _JobFetcher2.default();
	new _SearchError2.default();
	new _TabbedPanes2.default((0, _jquery2.default)(".tabbed-panes"));
	new _JobMap2.default((0, _jquery2.default)("#map-pane"));
});