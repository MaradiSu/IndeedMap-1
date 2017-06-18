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
});