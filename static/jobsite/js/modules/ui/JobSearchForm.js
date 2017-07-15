export default class JobSearchForm {
	constructor(jobSearchFormElem) {
		this.jobSearchFormElem = jobSearchFormElem
		this.formElems = this.jobSearchFormElem.find("select, input, button")
		this.keywordsInput = this.jobSearchFormElem.find('#keywords')
		this.locationInput = this.jobSearchFormElem.find('#city-state')
		this.radiusSelect = this.jobSearchFormElem.find('#radius')
		this.jobTypeSelect = this.jobSearchFormElem.find('#jobtype')
		this.searchButton = this.jobSearchFormElem.find('#search-button')
		
		this.searchJobsOnClickEvent()
		this.searchJobsOnFormEnterEvent()
		this.disableFormOnSearchEvent()
		this.enableFormOnSearchCompleteEvent()
	}
	
	searchJobsOnClickEvent() {
		this.searchButton.click(()=> this.triggerJobSearch())
	}
	
	searchJobsOnFormEnterEvent() {
		this.jobSearchFormElem.keypress((event) => {
			if(event.which == 13) {
				this.triggerJobSearch()
			}
		})
	}
	
	triggerJobSearch() {
		var searchParams = {
			keywords: this.keywordsInput.val(),
			location: this.locationInput.val(),
			radius: this.radiusSelect.val(),
			jobType: this.jobTypeSelect.val()
			
		}
		
		$(document).trigger('search', [searchParams])
	}
	
	disableFormOnSearchEvent() {
		$(document).on('search', () => {
			this.formElems.each((_,elem) => {
				$(elem).prop('disabled', true)
			})
		})
	}
	
	enableFormOnSearchCompleteEvent() {
		$(document).on('search-complete search-error', () => {
			this.formElems.each((_,elem) => {
				$(elem).prop('disabled', false)
			})
		})
	}
}