define(["exports", "app/JobDataTransformer", "esri/map", "esri/Color", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/graphic", "esri/layers/GraphicsLayer", "esri/geometry/Point", "esri/dijit/InfoWindowLite", "esri/InfoTemplate", "dojo/dom-construct"], function (exports, _JobDataTransformer, _map, _Color, _SimpleMarkerSymbol, _SimpleLineSymbol, _graphic, _GraphicsLayer, _Point, _InfoWindowLite, _InfoTemplate, _domConstruct) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _JobDataTransformer2 = _interopRequireDefault(_JobDataTransformer);

	var _map2 = _interopRequireDefault(_map);

	var _Color2 = _interopRequireDefault(_Color);

	var _SimpleMarkerSymbol2 = _interopRequireDefault(_SimpleMarkerSymbol);

	var _SimpleLineSymbol2 = _interopRequireDefault(_SimpleLineSymbol);

	var _graphic2 = _interopRequireDefault(_graphic);

	var _GraphicsLayer2 = _interopRequireDefault(_GraphicsLayer);

	var _Point2 = _interopRequireDefault(_Point);

	var _InfoWindowLite2 = _interopRequireDefault(_InfoWindowLite);

	var _InfoTemplate2 = _interopRequireDefault(_InfoTemplate);

	var _domConstruct2 = _interopRequireDefault(_domConstruct);

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

	var JobMap = function () {
		function JobMap(jobMapElem) {
			_classCallCheck(this, JobMap);

			this.jobMapContainer = jobMapElem;
			this.createMap();
			this.createInfoWindow();
			this.createLayers();
			this.createSymbols();
			this.addPointsOnSearchEvent();
		}

		_createClass(JobMap, [{
			key: "createMap",
			value: function createMap() {
				this.map = new _map2.default(this.jobMapContainer[0], {
					center: [-98.35, 39.5],
					zoom: 4,
					basemap: "streets"
				});
			}
		}, {
			key: "createInfoWindow",
			value: function createInfoWindow() {
				this.infoWindow = new _InfoWindowLite2.default(null, _domConstruct2.default.create("div", null, null, this.map.root));
				this.infoWindow.startup();
				this.map.setInfoWindow(this.infoWindow);
			}
		}, {
			key: "createLayers",
			value: function createLayers() {
				this.jobsGraphicsLayer = new _GraphicsLayer2.default({
					id: "Jobs"
				});
				this.map.addLayer(this.jobsGraphicsLayer);
			}
		}, {
			key: "createSymbols",
			value: function createSymbols() {
				var blue = new _Color2.default([49, 99, 242]);
				var transparentBlue = new _Color2.default([49, 99, 242, 0.25]);

				this.symbol = new _SimpleMarkerSymbol2.default(_SimpleMarkerSymbol2.default.STYLE_CIRCLE, 15, new _SimpleLineSymbol2.default(_SimpleLineSymbol2.default.STYLE_SOLID, blue, 1), transparentBlue);

				this.selectSymbol = new _SimpleMarkerSymbol2.default(_SimpleMarkerSymbol2.default.STYLE_CIRCLE, 15, new _SimpleLineSymbol2.default(_SimpleLineSymbol2.default.STYLE_SOLID, blue, 1), blue);
			}
		}, {
			key: "addPointsOnSearchEvent",
			value: function addPointsOnSearchEvent() {
				var _this = this;

				$(document).on('search-complete', function (event, transformedData) {
					_this.jobsGraphicsLayer.clear();
					_this.addPointsToJobsLayer(transformedData.locations);
				});
			}
		}, {
			key: "addPointsToJobsLayer",
			value: function addPointsToJobsLayer(locations) {
				var _this2 = this;

				locations.forEach(function (location) {
					var pointGraphic = _this2.createPointGraphic(location);
					_this2.jobsGraphicsLayer.add(pointGraphic);
				});
			}
		}, {
			key: "createPointGraphic",
			value: function createPointGraphic(location) {
				var point = new _Point2.default(location.longitude, location.latitude);
				var attributes = {
					longitude: location.longitude,
					latitude: location.latitude,
					city: location.city,
					state: location.state,
					jobs: location.jobs.length
				};

				var graphic = new _graphic2.default(point, this.symbol, attributes, this.createInfoTemplate(location));

				return graphic;
			}
		}, {
			key: "createInfoTemplate",
			value: function createInfoTemplate(location) {
				return new _InfoTemplate2.default({
					title: "<b>${jobs} job in ${city}, ${state} (${latitude}, ${longitude})</b>",
					content: this.generateInfoTemplateContent(location)
				});
			}
		}, {
			key: "generateInfoTemplateContent",
			value: function generateInfoTemplateContent(location) {
				var content = "";
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = location.jobs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var job = _step.value;

						content += "<b><a href='" + job.url + "' target='_blank'>" + job.jobtitle + "</a></b><br>" + job.company + "<hr>";
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				return content;
			}
		}]);

		return JobMap;
	}();

	exports.default = JobMap;
});