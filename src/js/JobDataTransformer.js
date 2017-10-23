export default class JobDataTransformer {
	constructor(searchResults) {
		this.jobsNoCoords = []
		this.searchResults = searchResults
		
		this.transformData()
	}
	
	transformData() {
		this.jobs = this.getUniqueJobs()
		this.coordinates = this.getUniqueCoordinates()
		this.locations = this.getLocations()

		this.addJobsToLocations()
		this.addCityStateToLocations()
	}
	
	getUniqueJobs() {
		var uniqueJobKeys = this.getUniqueJobKeys()
		var uniqueJobs = []
		for (var key of uniqueJobKeys) {
			var jobs = this.searchResults.filter((job) => job.jobkey == key)
			if (jobs.length > 0) {
				uniqueJobs = uniqueJobs.concat(jobs[0])
			}
		}
		
		return uniqueJobs
	}
	
	getUniqueJobKeys() {
		var jobKeys = new Set()
		for (var result of this.searchResults) {
			jobKeys.add(result.jobkey)
		}
		return Array.from(jobKeys)
	}
	
	getUniqueCoordinates() {
		var uniqueCoords = new Set()
		for (var result of this.searchResults) {
			if (result.latitude && result.longitude) {
				uniqueCoords.add(`${result.latitude},${result.longitude}`)
			} else {
				this.jobsNoCoords.push(result)
			}
		}
		return Array.from(uniqueCoords)
	}
	
	getLocations() {
		var locations = []
		for (var coord of this.coordinates) {
			var latitude = parseFloat(coord.split(",")[0])
			var longitude = parseFloat(coord.split(",")[1])
			locations.push({latitude: latitude, longitude: longitude})
		}
		return locations
	}
	
	addJobsToLocations() {
		this.locations.forEach((location) => {
			location.jobs = this.jobs.filter((job) => job.latitude == location.latitude && job.longitude == location.longitude)
		})
	}
	
	addCityStateToLocations() {
		this.locations.forEach((location) => {
			location.city = location.jobs[0].city
			location.state = location.jobs[0].state
		})
	}
}