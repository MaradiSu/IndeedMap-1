(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.esriLoader = global.esriLoader || {})));
}(this, (function (exports) { 'use strict';

/*
  Copyright 2017 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
// get the script injected by this library
function getScript() {
    return document.querySelector('script[data-esri-loader]');
}
// has ArcGIS API been loaded on the page yet?
function isLoaded() {
    // would like to just use window.require, but fucking typescript
    return typeof window['require'] !== 'undefined' && getScript();
}
// load the ArcGIS API on the page
function bootstrap(callback, options) {
    if (options === void 0) { options = {}; }
    // default options
    if (!options.url) {
        options.url = 'https://js.arcgis.com/4.4/';
    }
    // don't reload API if it is already loaded or in the process of loading
    if (getScript()) {
        callback(new Error('The ArcGIS API for JavaScript is already loaded.'));
        return;
    }
    // create a script object whose source points to the API
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = options.url;
    script.dataset['esriLoader'] = 'loading';
    // once the script is loaded...
    script.onload = function () {
        // update the status of the script
        script.dataset['esriLoader'] = 'loaded';
        // we can now use Dojo's require() to load esri and dojo AMD modules
        var dojoRequire = window['require'];
        if (callback) {
            // let the caller know that the API has been successfully loaded
            // and as a convenience, return the require function
            // in case they want to use it directly
            callback(null, dojoRequire);
        }
    };
    // load the script
    document.body.appendChild(script);
}
function dojoRequire(modules, callback) {
    if (isLoaded()) {
        window['require'](modules, callback);
    }
    else {
        var script_1 = getScript();
        if (script_1) {
            // Not yet loaded but script is in the body - use callback once loaded
            var onScriptLoad_1 = function () {
                window['require'](modules, callback);
                script_1.removeEventListener('load', onScriptLoad_1, false);
            };
            script_1.addEventListener('load', onScriptLoad_1);
        }
        else {
            // Not bootstrapped
            throw new Error('The ArcGIS API for JavaScript has not been loaded. You must first call esriLoader.bootstrap()');
        }
    }
}
var esriLoader = {
    isLoaded: isLoaded,
    bootstrap: bootstrap,
    dojoRequire: dojoRequire
};

exports.isLoaded = isLoaded;
exports.bootstrap = bootstrap;
exports.dojoRequire = dojoRequire;
exports['default'] = esriLoader;

Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JobDataTransformer = function () {
	function JobDataTransformer(searchResults) {
		_classCallCheck(this, JobDataTransformer);

		this.jobsNoCoords = [];
		this.searchResults = searchResults;

		this.transformData();
	}

	_createClass(JobDataTransformer, [{
		key: "transformData",
		value: function transformData() {
			this.jobs = this.getUniqueJobs();
			this.coordinates = this.getUniqueCoordinates();
			this.locations = this.getLocations();

			this.addJobsToLocations();
			this.addCityStateToLocations();
		}
	}, {
		key: "getUniqueJobs",
		value: function getUniqueJobs() {
			var uniqueJobKeys = this.getUniqueJobKeys();
			var uniqueJobs = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = uniqueJobKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var key = _step.value;

					var jobs = this.searchResults.filter(function (job) {
						return job.jobkey == key;
					});
					if (jobs.length > 0) {
						uniqueJobs = uniqueJobs.concat(jobs[0]);
					}
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

			return uniqueJobs;
		}
	}, {
		key: "getUniqueJobKeys",
		value: function getUniqueJobKeys() {
			var jobKeys = new Set();
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = this.searchResults[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var result = _step2.value;

					jobKeys.add(result.jobkey);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return Array.from(jobKeys);
		}
	}, {
		key: "getUniqueCoordinates",
		value: function getUniqueCoordinates() {
			var uniqueCoords = new Set();
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this.searchResults[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var result = _step3.value;

					if (result.latitude && result.longitude) {
						uniqueCoords.add(result.latitude + "," + result.longitude);
					} else {
						this.jobsNoCoords.push(result);
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return Array.from(uniqueCoords);
		}
	}, {
		key: "getLocations",
		value: function getLocations() {
			var locations = [];
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;

			try {
				for (var _iterator4 = this.coordinates[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var coord = _step4.value;

					var latitude = parseFloat(coord.split(",")[0]);
					var longitude = parseFloat(coord.split(",")[1]);
					locations.push({ latitude: latitude, longitude: longitude });
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}

			return locations;
		}
	}, {
		key: "addJobsToLocations",
		value: function addJobsToLocations() {
			var _this = this;

			this.locations.forEach(function (location) {
				location.jobs = _this.jobs.filter(function (job) {
					return job.latitude == location.latitude && job.longitude == location.longitude;
				});
			});
		}
	}, {
		key: "addCityStateToLocations",
		value: function addCityStateToLocations() {
			this.locations.forEach(function (location) {
				location.city = location.jobs[0].city;
				location.state = location.jobs[0].state;
			});
		}
	}]);

	return JobDataTransformer;
}();

exports.default = JobDataTransformer;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _IpFetcher = require('./IpFetcher');

var _IpFetcher2 = _interopRequireDefault(_IpFetcher);

var _JobDataTransformer = require('./JobDataTransformer');

var _JobDataTransformer2 = _interopRequireDefault(_JobDataTransformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JobFetcher = function () {
	function JobFetcher() {
		_classCallCheck(this, JobFetcher);

		this.jobsPerPage = 25;
		this.publisherId = 2916132883457866;
		this.version = 2;
		this.country = "us";
		this.returnLatLong = 1;
		this.ipFetcher = new _IpFetcher2.default();

		this.fetchRequestParamsOnSearchEvent();
	}

	_createClass(JobFetcher, [{
		key: 'fetchRequestParamsOnSearchEvent',
		value: function fetchRequestParamsOnSearchEvent() {
			var _this = this;

			$(document).on('search', function (event, searchParams) {
				_this.jobs = [];
				_this.searchParams = searchParams;

				_this.ajaxData = {
					publisher: _this.publisherId,
					format: "json",
					v: _this.version,
					latlong: _this.returnLatLong,
					co: _this.country,
					limit: _this.jobsPerPage,
					q: searchParams.keywords,
					l: searchParams.location,
					radius: searchParams.radius,
					jt: searchParams.jobType,
					userip: _this.ipFetcher.ip,
					useragent: navigator.userAgent
				};

				_this.fetchRequestParams();
			});
		}
	}, {
		key: 'fetchRequestParams',
		value: function fetchRequestParams() {
			var _this2 = this;

			$.ajax({
				url: "https://api.indeed.com/ads/apisearch",
				dataType: "jsonp",
				data: this.ajaxData,
				success: function success(results) {
					var requestParams = _this2.getRequestParameters(results);
					if (requestParams.totalJobsFound > 20000) {
						var errorMessage = "Your search returned greater than 20,000 results! Please use more specific search criteria to limit the jobs returned.";
						_this2.triggerSearchError(errorMessage);
					} else if (requestParams.totalJobsFound == 0) {
						var errorMessage = "No jobs were found for your search!";
						_this2.triggerSearchError(errorMessage);
					} else {
						_this2.fetchJobs(requestParams);
					}
				},
				error: function error() {
					var errorMessage = "There was an error contacting the Indeed Job API.";
					_this2.triggerSearchError(errorMessage);
				}
			});
		}
	}, {
		key: 'triggerSearchError',
		value: function triggerSearchError(message) {
			$(document).trigger('error', [message]);
		}
	}, {
		key: 'getRequestParameters',
		value: function getRequestParameters(results) {
			var totalJobsFound = results.totalResults;
			var numPages = Math.ceil(totalJobsFound / this.jobsPerPage);
			var numResultsLastPage = totalJobsFound - (numPages - 1) * this.jobsPerPage;
			var requestParameters = {
				totalJobsFound: totalJobsFound,
				numPages: numPages,
				numResultsLastPage: numResultsLastPage,
				pageRequestsFinished: 0
			};
			return requestParameters;
		}
	}, {
		key: 'fetchJobs',
		value: function fetchJobs(requestParams) {
			for (var page = 0; page < requestParams.numPages; page++) {
				var lastPage = requestParams.numPages - 1;
				this.ajaxData.start = page * this.jobsPerPage;
				if (page == lastPage) {
					this.ajaxData.limit = requestParams.numResultsLastPage;
				}
				this.fetchPage(requestParams);
			}
		}
	}, {
		key: 'fetchPage',
		value: function fetchPage(requestParams) {
			var _this3 = this;

			$.ajax({
				url: "https://api.indeed.com/ads/apisearch",
				dataType: "jsonp",
				data: this.ajaxData,
				success: function success(results) {
					_this3.jobs = _this3.jobs.concat(results.results);
					_this3.triggerRequestComplete(requestParams);
				},
				error: function error() {
					return _this3.triggerRequestComplete(requestParams);
				}
			});
		}
	}, {
		key: 'triggerRequestComplete',
		value: function triggerRequestComplete(requestParams) {
			requestParams.pageRequestsFinished++;
			var percentComplete = requestParams.pageRequestsFinished / requestParams.numPages;
			$(document).trigger("page-request-complete", [percentComplete]);
			if (requestParams.pageRequestsFinished == requestParams.numPages) {
				this.transformData();
			}
		}
	}, {
		key: 'transformData',
		value: function transformData() {
			this.transformedData = new _JobDataTransformer2.default(this.jobs);
			this.triggerJobFetchComplete();
		}
	}, {
		key: 'triggerJobFetchComplete',
		value: function triggerJobFetchComplete(transformedData) {
			$(document).trigger("search-complete", [this.transformedData, this.searchParams]);
		}
	}]);

	return JobFetcher;
}();

exports.default = JobFetcher;

},{"./IpFetcher":2,"./JobDataTransformer":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _esriLoader = require("esri-loader");

var esriLoader = _interopRequireWildcard(_esriLoader);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModuleLoader = function () {
    function ModuleLoader() {
        var _this = this;

        _classCallCheck(this, ModuleLoader);

        esriLoader.bootstrap(function (err) {
            if (err) {
                console.error("error loading esri modules!");
            } else {
                _this.loadModules();
            }
        }, {
            url: 'https://js.arcgis.com/3.21/'
        });
    }

    _createClass(ModuleLoader, [{
        key: "loadModules",
        value: function loadModules() {
            var _this2 = this;

            esriLoader.dojoRequire(["esri/map", "esri/Color", "esri/graphic", "esri/InfoTemplate", "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/layers/GraphicsLayer", "esri/geometry/Point", "esri/dijit/InfoWindowLite", "dojo/dom-construct", "dojo/domReady!"], function (Map, Color, Graphic, InfoTemplate, SimpleMarkerSymbol, SimpleLineSymbol, GraphicsLayer, Point, InfoWindowLite, domConstruct) {
                _this2.Map = Map;
                _this2.Color = Color;
                _this2.Graphic = Graphic;
                _this2.InfoTemplate = InfoTemplate;

                _this2.SimpleMarkerSymbol = SimpleMarkerSymbol;
                _this2.SimpleLineSymbol = SimpleLineSymbol;

                _this2.GraphicsLayer = GraphicsLayer;

                _this2.Point = Point;

                _this2.InfoWindowLite = InfoWindowLite;

                _this2.domConstruct = domConstruct;

                $(document).trigger("esri-modules-loaded");
            });
        }
    }]);

    return ModuleLoader;
}();

exports.default = ModuleLoader;

},{"esri-loader":1}],6:[function(require,module,exports){
"use strict";

var _ProgressBar = require("./ui/ProgressBar");

var _ProgressBar2 = _interopRequireDefault(_ProgressBar);

var _JobFetcher = require("./JobFetcher");

var _JobFetcher2 = _interopRequireDefault(_JobFetcher);

var _Error = require("./ui/Error");

var _Error2 = _interopRequireDefault(_Error);

var _TabbedPanes = require("./ui/TabbedPanes");

var _TabbedPanes2 = _interopRequireDefault(_TabbedPanes);

var _JobMap = require("./ui/JobMap");

var _JobMap2 = _interopRequireDefault(_JobMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$(document).ready(function () {
	new _ProgressBar2.default($("#progress-bar-container"));
	new _JobFetcher2.default();
	new _Error2.default();
	new _TabbedPanes2.default($(".tabbed-panes"));
	new _JobMap2.default($("#map-pane"));
});

},{"./JobFetcher":4,"./ui/Error":7,"./ui/JobMap":8,"./ui/ProgressBar":10,"./ui/TabbedPanes":11}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Error = function () {
	function Error() {
		_classCallCheck(this, Error);

		this.alertOnErrorEvent();
	}

	_createClass(Error, [{
		key: 'alertOnErrorEvent',
		value: function alertOnErrorEvent() {
			$(document).on('error', function (event, message) {
				alert(message);
			});
		}
	}]);

	return Error;
}();

exports.default = Error;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _JobDataTransformer = require("../JobDataTransformer");

var _JobDataTransformer2 = _interopRequireDefault(_JobDataTransformer);

var _ModuleLoader = require("../ModuleLoader");

var _ModuleLoader2 = _interopRequireDefault(_ModuleLoader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JobMap = function () {
	function JobMap(jobMapElem) {
		_classCallCheck(this, JobMap);

		this.jobMapContainer = jobMapElem;
		this.modules = new _ModuleLoader2.default();

		this.initMapOnModulesLoadedEvent();
	}

	_createClass(JobMap, [{
		key: "initMapOnModulesLoadedEvent",
		value: function initMapOnModulesLoadedEvent() {
			var _this = this;

			$(document).on("esri-modules-loaded", function () {
				return _this.initMap();
			});
		}
	}, {
		key: "initMap",
		value: function initMap() {
			this.createMap();
			this.createInfoWindow();
			this.createLayers();
			this.createSymbols();
			this.addPointsOnSearchEvent();
		}
	}, {
		key: "createMap",
		value: function createMap() {
			this.map = new this.modules.Map(this.jobMapContainer[0], {
				center: [-98.35, 39.5],
				zoom: 4,
				basemap: "streets"
			});
		}
	}, {
		key: "createInfoWindow",
		value: function createInfoWindow() {
			this.infoWindow = new this.modules.InfoWindowLite(null, this.modules.domConstruct.create("div", null, null, this.map.root));
			this.infoWindow.startup();
			this.map.setInfoWindow(this.infoWindow);
		}
	}, {
		key: "createLayers",
		value: function createLayers() {
			this.jobsGraphicsLayer = new this.modules.GraphicsLayer({
				id: "Jobs"
			});
			this.map.addLayer(this.jobsGraphicsLayer);
		}
	}, {
		key: "createSymbols",
		value: function createSymbols() {
			var blue = new this.modules.Color([49, 99, 242]);
			var transparentBlue = new this.modules.Color([49, 99, 242, 0.25]);

			this.symbol = new this.modules.SimpleMarkerSymbol(this.modules.SimpleMarkerSymbol.STYLE_CIRCLE, 15, new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, blue, 1), transparentBlue);

			this.selectSymbol = new this.modules.SimpleMarkerSymbol(this.modules.SimpleMarkerSymbol.STYLE_CIRCLE, 15, new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID, blue, 1), blue);
		}
	}, {
		key: "addPointsOnSearchEvent",
		value: function addPointsOnSearchEvent() {
			var _this2 = this;

			$(document).on('search-complete', function (event, transformedData) {
				_this2.jobsGraphicsLayer.clear();
				_this2.addPointsToJobsLayer(transformedData.locations);
			});
		}
	}, {
		key: "addPointsToJobsLayer",
		value: function addPointsToJobsLayer(locations) {
			var _this3 = this;

			locations.forEach(function (location) {
				var pointGraphic = _this3.createPointGraphic(location);
				_this3.jobsGraphicsLayer.add(pointGraphic);
			});
		}
	}, {
		key: "createPointGraphic",
		value: function createPointGraphic(location) {
			var point = new this.modules.Point(location.longitude, location.latitude);
			var attributes = {
				longitude: location.longitude,
				latitude: location.latitude,
				city: location.city,
				state: location.state,
				jobs: location.jobs.length
			};

			var graphic = new this.modules.Graphic(point, this.symbol, attributes, this.createInfoTemplate(location));

			return graphic;
		}
	}, {
		key: "createInfoTemplate",
		value: function createInfoTemplate(location) {
			return new this.modules.InfoTemplate({
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

},{"../JobDataTransformer":3,"../ModuleLoader":5}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JobSearchForm = function () {
	function JobSearchForm(jobSearchFormElem) {
		_classCallCheck(this, JobSearchForm);

		this.jobSearchFormElem = jobSearchFormElem;
		this.formElems = this.jobSearchFormElem.find("select, input, button");
		this.keywordsInput = this.jobSearchFormElem.find('#keywords');
		this.locationInput = this.jobSearchFormElem.find('#city-state');
		this.radiusSelect = this.jobSearchFormElem.find('#radius');
		this.jobTypeSelect = this.jobSearchFormElem.find('#jobtype');
		this.searchButton = this.jobSearchFormElem.find('#search-button');

		this.searchJobsOnClickEvent();
		this.searchJobsOnFormEnterEvent();
		this.disableFormOnSearchEvent();
		this.enableFormOnSearchCompleteEvent();
	}

	_createClass(JobSearchForm, [{
		key: 'searchJobsOnClickEvent',
		value: function searchJobsOnClickEvent() {
			var _this = this;

			this.searchButton.click(function () {
				return _this.triggerJobSearch();
			});
		}
	}, {
		key: 'searchJobsOnFormEnterEvent',
		value: function searchJobsOnFormEnterEvent() {
			var _this2 = this;

			this.jobSearchFormElem.keypress(function (event) {
				if (event.which == 13) {
					_this2.triggerJobSearch();
				}
			});
		}
	}, {
		key: 'triggerJobSearch',
		value: function triggerJobSearch() {
			var searchParams = {
				keywords: this.keywordsInput.val(),
				location: this.locationInput.val(),
				radius: this.radiusSelect.val(),
				jobType: this.jobTypeSelect.val()

			};

			$(document).trigger('search', [searchParams]);
		}
	}, {
		key: 'disableFormOnSearchEvent',
		value: function disableFormOnSearchEvent() {
			var _this3 = this;

			$(document).on('search', function () {
				_this3.formElems.each(function (_, elem) {
					$(elem).prop('disabled', true);
				});
			});
		}
	}, {
		key: 'enableFormOnSearchCompleteEvent',
		value: function enableFormOnSearchCompleteEvent() {
			var _this4 = this;

			$(document).on('search-complete error', function () {
				_this4.formElems.each(function (_, elem) {
					$(elem).prop('disabled', false);
				});
			});
		}
	}]);

	return JobSearchForm;
}();

exports.default = JobSearchForm;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _D3Utils = require("../utils/D3Utils");

var D3Utils = _interopRequireWildcard(_D3Utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

			$(document).on('search-complete error', function () {
				_this3.progressBarContainer.css("display", "none");
			});
		}
	}]);

	return ProgressBar;
}();

exports.default = ProgressBar;

},{"../utils/D3Utils":12}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _JobSearchForm = require("./JobSearchForm");

var _JobSearchForm2 = _interopRequireDefault(_JobSearchForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TabbedPanes = function () {
	function TabbedPanes(tabbedPaneElem) {
		_classCallCheck(this, TabbedPanes);

		this.tabbedPaneElem = tabbedPaneElem;

		this.tabs = this.tabbedPaneElem.find(".tab");
		this.mapTap = this.tabs.filter("#map-tab");
		this.searchTab = this.tabs.filter("#search-tab");
		this.detailsTab = this.tabs.filter("#details-tab");

		this.panes = this.tabbedPaneElem.find(".pane");
		this.searchPane = this.panes.filter("#search-pane");
		this.detailsPane = this.panes.filter("#details-pane");
		this.mapPane = this.panes.filter("#map-pane");

		this.totalJobsElem = this.detailsPane.find("#total-jobs");
		this.totalJobsNoCoordsElem = this.detailsPane.find("#total-jobs-no-coords");
		this.jobsNoCoordsContainer = this.detailsPane.find("#jobs-no-coords");

		this.createJobSearchForm();
		this.displayPaneOnClickEvent();
		this.changeDetailsOnSearchCompleteEvent();
		this.showMapOnResizeEvent();
		this.showMapOnSearchEvent();
	}

	_createClass(TabbedPanes, [{
		key: "createJobSearchForm",
		value: function createJobSearchForm() {
			this.jobSearchForm = new _JobSearchForm2.default(this.searchPane);
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
			var pane = this.panes.filter(function (_, pane) {
				return $(pane).attr('id') == paneId;
			});
			if (paneId == 'map-pane') {
				pane.css('display', 'flex');
			} else {
				pane.show();
			}
		}
	}, {
		key: "hidePanes",
		value: function hidePanes() {
			this.panes.each(function (_, pane) {
				var paneId = $(pane).attr('id');
				if (paneId == 'map-pane' && $("#map-tab[data-target=\"" + paneId + "\"]").is(":visible")) {
					$(pane).hide();
				} else if (paneId != 'map-pane') {
					$(pane).hide();
				}
			});
		}
	}, {
		key: "reassignTabSelectStyle",
		value: function reassignTabSelectStyle(clickedTab) {
			this.tabs.each(function (_, tab) {
				$(tab).removeClass('tab-selected');
			});
			clickedTab.addClass('tab-selected');
		}
	}, {
		key: "changeDetailsOnSearchCompleteEvent",
		value: function changeDetailsOnSearchCompleteEvent() {
			var _this2 = this;

			$(document).on('search-complete', function (event, transformedData, searchParams) {
				_this2.changeSearchDetails(transformedData, searchParams);
			});
		}
	}, {
		key: "changeSearchDetails",
		value: function changeSearchDetails(transformedData, searchParams) {
			this.changeTotalJobsHtml(transformedData, searchParams);
			if (transformedData.jobsNoCoords.length > 0) {
				this.changeTotalJobsNoCoordsHtml(transformedData.jobsNoCoords);
				this.changeJobsNoCoordsHtml(transformedData.jobsNoCoords);
			} else {
				this.clearJobsNoCoordsHtml();
			}
		}
	}, {
		key: "changeTotalJobsHtml",
		value: function changeTotalJobsHtml(transformedData, searchParams) {
			var totalJobs = this.getTotalJobs(transformedData.locations);
			var text = totalJobs + " jobs found for \"" + searchParams.keywords + "\" in \"" + searchParams.location + "\".";
			this.totalJobsElem.html(text);
		}
	}, {
		key: "getTotalJobs",
		value: function getTotalJobs(locations) {
			var totalJobs = 0;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = locations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var location = _step.value;

					totalJobs += location.jobs.length;
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

			return totalJobs;
		}
	}, {
		key: "changeTotalJobsNoCoordsHtml",
		value: function changeTotalJobsNoCoordsHtml(jobsNoCoords) {
			var text = jobsNoCoords.length + " jobs did not have location information, but are displayed below.";
			this.totalJobsNoCoordsElem.html(text);
		}
	}, {
		key: "changeJobsNoCoordsHtml",
		value: function changeJobsNoCoordsHtml(jobsNoCoords) {
			var jobHtml = "";
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = jobsNoCoords[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var job = _step2.value;

					jobHtml += "<b><a href=\"" + job.url + "\" target=\"_blank\">" + job.jobtitle + "</a></b><br>" + job.company + "<hr>";
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			this.jobsNoCoordsContainer.html(jobHtml);
		}
	}, {
		key: "clearJobsNoCoordsHtml",
		value: function clearJobsNoCoordsHtml() {
			this.totalJobsNoCoordsElem.html("");
			this.jobsNoCoordsContainer.html("");
		}
	}, {
		key: "showMapOnResizeEvent",
		value: function showMapOnResizeEvent() {
			$(window).resize(function () {
				if (!$("#map-tab").is(":visible")) {
					$("#map-tab").css("display", "flex");
					$("#search-tab").trigger("click");
				}
			});
		}
	}, {
		key: "showMapOnSearchEvent",
		value: function showMapOnSearchEvent() {
			$(document).on('search', function () {
				if ($("#map-tab").is(":visible")) {
					$("#map-tab").trigger("click");
				}
			});
		}
	}]);

	return TabbedPanes;
}();

exports.default = TabbedPanes;

},{"./JobSearchForm":9}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
       value: true
});
exports.createArc = createArc;
function createArc(startAngle, endAngle, innerRadius, outerRadius) {
       var arc = d3.arc().startAngle(startAngle).endAngle(endAngle).innerRadius(innerRadius).outerRadius(outerRadius);

       return arc;
}

},{}]},{},[6]);
