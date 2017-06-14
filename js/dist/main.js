require(['app/ui/ProgressBar', 'app/JobFetcher', 'app/ui/SearchError', 'app/JobDataTransformer', 'app/ui/TabbedPanes', 'esri/map', 'jquery', 'd3'], function (_ProgressBar, _JobFetcher, _SearchError, _JobDataTransformer, _TabbedPanes, _map, _jquery, _d) {
	'use strict';

	var _map2 = _interopRequireDefault(_map);

	var _jquery2 = _interopRequireDefault(_jquery);

	var _d2 = _interopRequireDefault(_d);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	(0, _jquery2.default)(document).ready(function () {

		new _ProgressBar.ProgressBar((0, _jquery2.default)("#progress-bar-container"));
		new _JobFetcher.JobFetcher();
		new _SearchError.SearchError();
		new _JobDataTransformer.JobDataTransformer();
		new _TabbedPanes.TabbedPanes((0, _jquery2.default)(".tabbed-panes"));
		var map = new _map2.default("map", {
			center: [-98.35, 39.5],
			zoom: 4,
			basemap: "streets"
		});
		console.log(map);
	});
});