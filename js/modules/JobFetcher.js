import IpFetcher from './IpFetcher'
 
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
			
			this.searchData = {
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
          data: this.searchData,
          success: (results) => {
          	var requestParams = this.getRequestParameters(results)
          	if(this.totalJobsFound > 20000) {
          		var errorMessage = "Your search returned greater than 20,000 results! Please use more specific search criteria to limit the jobs returned."
          		$(document).trigger('search-error', [errorMessage])
          	} else {
          		this.fetchJobs(requestParams)
          	}
          },
          error: () => {
          	var errorMessage = "Your search returned greater than 20,000 results! Please use more specific search criteria to limit the jobs returned."
          	this.triggerSearchError(message)
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
			this.searchData.start = page * this.jobsPerPage
			if (page == lastPage) {
				this.searchData.limit = requestParams.numResultsLastPage
			}
			this.fetchPage(requestParams)
		}
	}
	
	fetchPage(requestParams) {
		$.ajax({
			url: "https://api.indeed.com/ads/apisearch",
			dataType: "jsonp",
			data: this.searchData,
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
			this.triggerJobFetchComplete()
		}
	}
	
	triggerJobFetchComplete() {
		$(document).trigger("search-complete", [this.jobs])
	}
}	