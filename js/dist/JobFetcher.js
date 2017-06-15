define(['exports', './IpFetcher'], function (exports, _IpFetcher) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _IpFetcher2 = _interopRequireDefault(_IpFetcher);

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

					_this.searchData = {
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
					data: this.searchData,
					success: function success(results) {
						var requestParams = _this2.getRequestParameters(results);
						if (_this2.totalJobsFound > 20000) {
							var errorMessage = "Your search returned greater than 20,000 results! Please use more specific search criteria to limit the jobs returned.";
							$(document).trigger('search-error', [errorMessage]);
						} else {
							_this2.fetchJobs(requestParams);
						}
					},
					error: function error() {
						var errorMessage = "Your search returned greater than 20,000 results! Please use more specific search criteria to limit the jobs returned.";
						_this2.triggerSearchError(message);
					}
				});
			}
		}, {
			key: 'triggerSearchError',
			value: function triggerSearchError(message) {
				$(document).trigger('search-error', [message]);
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
					this.searchData.start = page * this.jobsPerPage;
					if (page == lastPage) {
						this.searchData.limit = requestParams.numResultsLastPage;
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
					data: this.searchData,
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
					this.triggerJobFetchComplete();
				}
			}
		}, {
			key: 'triggerJobFetchComplete',
			value: function triggerJobFetchComplete() {
				$(document).trigger("search-complete", [this.jobs]);
			}
		}]);

		return JobFetcher;
	}();

	exports.default = JobFetcher;
});