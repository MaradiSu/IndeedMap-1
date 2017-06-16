import JobSearchForm from '../ui/JobSearchForm'

export default class TabbedPanes {
	constructor(tabbedPaneElem) {
		this.tabbedPaneElem = tabbedPaneElem
		this.tabs = this.tabbedPaneElem.find(".tab")
		this.panes = this.tabbedPaneElem.find(".pane")
		this.searchPane = this.panes.filter("#search-pane")
		
		this.detailsPane = this.panes.filter("#details-pane")
		this.totalJobsElem = this.detailsPane.find("#total-jobs")
		this.totalJobsNoCoordsElem = this.detailsPane.find("#total-jobs-no-coords")
		this.jobsNoCoordsContainer = this.detailsPane.find("#jobs-no-coords")
		
		this.createJobSearchForm()
		this.displayPaneOnClickEvent()
		this.changeDetailsOnSearchCompleteEvent()
	}
	
	createJobSearchForm() {
		this.jobSearchForm = new JobSearchForm(this.searchPane)
	}
	
	displayPaneOnClickEvent() {
		this.tabs.click((event) => {
			var clickedTab = $(event.target)
			this.reassignTabSelectStyle(clickedTab)
			this.displayTargetPane(clickedTab)
		})
	}
	
	displayTargetPane(clickedTab) {
		var paneId = clickedTab.attr('data-target')
		this.hidePanes()
		this.showPane(paneId)
	}
	
	showPane(paneId) {
		this.hidePanes()
		this.panes.each((_,pane) => {
			if ($(pane).attr('id') == paneId) {
				$(pane).show()
			}
		})
	}
	
	hidePanes() {
		this.panes.hide()
	}
	
	reassignTabSelectStyle(clickedTab) {
		this.tabs.each((_,tab) => {
			$(tab).removeClass('tab-selected')
		})
		clickedTab.addClass('tab-selected')
	}
	
	changeDetailsOnSearchCompleteEvent() {
		$(document).on('search-complete',(event, transformedData, searchParams) => {
			this.changeSearchDetails(transformedData, searchParams)
		})
	}
	
	changeSearchDetails(transformedData, searchParams) {
		this.changeTotalJobsHtml(transformedData, searchParams)
		if (transformedData.jobsNoCoords.length > 0) {
			this.changeTotalJobsNoCoordsHtml(transformedData.jobsNoCoords)
			this.changeJobsNoCoordsHtml(transformedData.jobsNoCoords)
		} else {
			this.clearJobsNoCoordsHtml()
		}
	}
	
	changeTotalJobsHtml(transformedData, searchParams) {
		var totalJobs = this.getTotalJobs(transformedData.locations)
		var text = `${totalJobs} jobs found for "${searchParams.keywords}" in "${searchParams.location}".`
		this.totalJobsElem.html(text)
	}
	
	getTotalJobs(locations) {
		var totalJobs = 0
		for (let location of locations) {
			totalJobs += location.jobs.length
		}
		return totalJobs
	}
	
	changeTotalJobsNoCoordsHtml(jobsNoCoords) {
		var text = `${jobsNoCoords.length} jobs did not have location information, but are displayed below.`
		this.totalJobsNoCoordsElem.html(text)
	}
	
	changeJobsNoCoordsHtml(jobsNoCoords) {
		var jobHtml = ""
		for (let job of jobsNoCoords) {
			jobHtml += `<b><a href="${job.url}" target="_blank">${job.jobtitle}</a></b><br>${job.company}<hr>`
		}
		this.jobsNoCoordsContainer.html(jobHtml)
	}
	
	clearJobsNoCoordsHtml() {
		this.totalJobsNoCoordsElem.html("")
		this.jobsNoCoordsContainer.html("")
	}
}