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

	var JobDataTransformer = function () {
		function JobDataTransformer(searchResults) {
			_classCallCheck(this, JobDataTransformer);

			this.jobsNoCoords = [];

			this.transformData(searchResults);
		}

		_createClass(JobDataTransformer, [{
			key: "transformData",
			value: function transformData(searchResults) {
				var uniqueJobs = this.getUniqueJobs(searchResults);
				var uniqueCoords = this.extractUniqueCoordinates(uniqueJobs);
				this.locations = this.parseLocations(uniqueCoords);
				this.addJobsToLocations(searchResults);
				this.addCityStateToLocations();
				console.log(this.locations);
				console.log(this.jobsNoCoords);
			}
		}, {
			key: "getUniqueJobs",
			value: function getUniqueJobs(searchResults) {
				var uniqueJobKeys = this.getUniqueJobKeys(searchResults);
				var uniqueJobs = [];
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = uniqueJobKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var key = _step.value;

						var jobs = searchResults.filter(function (job) {
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

				console.log("total jobs found: " + searchResults.length);
				console.log("total unique jobs found: " + uniqueJobs.length);
				return uniqueJobs;
			}
		}, {
			key: "getUniqueJobKeys",
			value: function getUniqueJobKeys(searchResults) {
				var jobKeys = new Set();
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = searchResults[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
			key: "extractUniqueCoordinates",
			value: function extractUniqueCoordinates(searchResults) {
				var uniqueCoords = new Set();
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = searchResults[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
			key: "parseLocations",
			value: function parseLocations(uniqueCoords) {
				var locations = [];
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = uniqueCoords[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
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
			value: function addJobsToLocations(searchResults) {
				this.locations.forEach(function (location) {
					location.jobs = searchResults.filter(function (result) {
						return result.latitude == location.latitude && result.longitude == location.longitude;
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
});