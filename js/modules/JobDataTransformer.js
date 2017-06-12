export class JobDataTransformer {
	constructor() {
		this.jobsNoCoords = []
		this.transformDataOnSearchCompleteEvent()
	}
	
	transformDataOnSearchCompleteEvent() {
		$(document).on('search-complete', (event, searchResults) => {
			var uniqueJobs = this.getUniqueJobs(searchResults)
			var uniqueCoords = this.extractUniqueCoordinates(uniqueJobs)
			this.locations = this.parseLocations(uniqueCoords)
			this.addJobsToLocations(searchResults)
			this.addCityStateToLocations()
			console.log(this.locations)
			console.log(this.jobsNoCoords)
		})
	}
	
	getUniqueJobs(searchResults) {
		var uniqueJobKeys = this.getUniqueJobKeys(searchResults)
		var uniqueJobs = []
		for (var key of uniqueJobKeys) {
			var jobs = searchResults.filter((job) => job.jobkey == key)
			if (jobs.length > 0) {
				uniqueJobs = uniqueJobs.concat(jobs[0])
			}
		}
		
		console.log("total jobs found: " + searchResults.length)
		console.log("total unique jobs found: " + uniqueJobs.length)
		return uniqueJobs
	}
	
	getUniqueJobKeys(searchResults) {
		var jobKeys = new Set()
		for (var result of searchResults) {
			jobKeys.add(result.jobkey)
		}
		return Array.from(jobKeys)
	}
	
	extractUniqueCoordinates(searchResults) {
		var uniqueCoords = new Set()
		for (var result of searchResults) {
			if (result.latitude && result.longitude) {
				uniqueCoords.add(`${result.latitude},${result.longitude}`)
			} else {
				this.jobsNoCoords.push(result)
			}
		}
		return Array.from(uniqueCoords)
	}
	
	parseLocations(uniqueCoords) {
		var locations = []
		for (var coord of uniqueCoords) {
			var latitude = parseFloat(coord.split(",")[0])
			var longitude = parseFloat(coord.split(",")[1])
			locations.push({latitude: latitude, longitude: longitude})
		}
		return locations
	}
	
	addJobsToLocations(searchResults) {
		this.locations.forEach((location) => {
			location.jobs = searchResults.filter((result) => result.latitude == location.latitude && result.longitude == location.longitude)
		})
	}
	
	addCityStateToLocations() {
		this.locations.forEach((location) => {
			location.city = location.jobs[0].city
			location.state = location.jobs[0].state
		})
	}
}