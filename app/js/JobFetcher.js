import IpFetcher from './IpFetcher'
import JobDataTransformer from './JobDataTransformer'
 
export default class JobFetcher {
	constructor() {
		this.jobsPerPage = 25
		this.publisherId = 2916132883457866
		this.version = 2
		this.country = "us"
		this.returnLatLong = 1
		this.ipFetcher = new IpFetcher()
		
		this.fetchRequestParamsOnSearchEvent()
	}
	
	fetchRequestParamsOnSearchEvent() {
		$(document).on('search', (event, searchParams) => {
			this.jobs = []
			this.searchParams = searchParams
			
			this.ajaxData = {
				publisher: this.publisherId,
				format: "json",
				v: this.version,
				latlong: this.returnLatLong,
				co: this.country,
				limit: this.jobsPerPage,
				q: searchParams.keywords,
				l: searchParams.location,
				radius: searchParams.radius,
				jt: searchParams.jobType,
				userip: this.ipFetcher.ip,
				useragent: navigator.userAgent
          	}
          	          	
          	this.fetchRequestParams()
		})
	}
	
	fetchRequestParams() {
		$.ajax({
          url: "https://api.indeed.com/ads/apisearch",
          dataType: "jsonp",
          data: this.ajaxData,
          success: (results) => {
          	var requestParams = this.getRequestParameters(results)
          	if(requestParams.totalJobsFound > 20000) {
          		var errorMessage = "Your search returned greater than 20,000 results! Please use more specific search criteria to limit the jobs returned."
          		this.triggerSearchError(errorMessage)
          	} else if(requestParams.totalJobsFound == 0) {
          		var errorMessage = "No jobs were found for your search!"
          		this.triggerSearchError(errorMessage)
          	} else {
          		this.fetchJobs(requestParams)
          	}
          },
          error: () => {
          	var errorMessage = "There was an error contacting the Indeed Job API."
          	this.triggerSearchError(errorMessage)
          }
        })
	}
	
	triggerSearchError(message) {
		$(document).trigger('search-error', [message])
	}
	
	getRequestParameters(results) {
		var totalJobsFound = results.totalResults
		var numPages = Math.ceil((totalJobsFound) / this.jobsPerPage)
		var numResultsLastPage = totalJobsFound - ((numPages - 1) * this.jobsPerPage)
		var requestParameters = {
			totalJobsFound: totalJobsFound,
			numPages: numPages,
			numResultsLastPage: numResultsLastPage,
			pageRequestsFinished: 0
		}
		return requestParameters 
	}
	
	fetchJobs(requestParams) {
		for(var page=0; page<requestParams.numPages; page++) {
			var lastPage = requestParams.numPages - 1
			this.ajaxData.start = page * this.jobsPerPage
			if (page == lastPage) {
				this.ajaxData.limit = requestParams.numResultsLastPage
			}
			this.fetchPage(requestParams)
		}
	}
	
	fetchPage(requestParams) {
		$.ajax({
			url: "https://api.indeed.com/ads/apisearch",
			dataType: "jsonp",
			data: this.ajaxData,
			success: (results) => {
				this.jobs = this.jobs.concat(results.results)
				this.triggerRequestComplete(requestParams)
			},
			error: () => this.triggerRequestComplete(requestParams)
		})
	}
	
	triggerRequestComplete(requestParams) {
		requestParams.pageRequestsFinished++ 
		var percentComplete = requestParams.pageRequestsFinished / requestParams.numPages
		$(document).trigger("page-request-complete", [percentComplete])
		if (requestParams.pageRequestsFinished == requestParams.numPages) {
			this.transformData()
		}
	}
	
	transformData() {
		this.transformedData = new JobDataTransformer(this.jobs)
		this.triggerJobFetchComplete()
	}
	
	triggerJobFetchComplete(transformedData) {
		$(document).trigger("search-complete", [this.transformedData, this.searchParams])
	}
}	