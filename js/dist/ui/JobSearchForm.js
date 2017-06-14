define(['exports'], function (exports) {
	'use strict';

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

	var JobSearchForm = exports.JobSearchForm = function () {
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

				$(document).on('search-complete', function () {
					_this4.formElems.each(function (_, elem) {
						$(elem).prop('disabled', false);
					});
				});
			}
		}]);

		return JobSearchForm;
	}();
});