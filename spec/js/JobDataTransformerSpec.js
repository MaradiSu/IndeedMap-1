import JobDataTransformer from '../../src/js/JobDataTransformer.js'
import {DATA} from '../data/jobData.js'

describe('Job data transformer', () => {
	var transformer = new JobDataTransformer(DATA)

	it('should return 5 unique jobs', () => {
		var uniqueJobs = transformer.getUniqueJobs()
	   	expect(uniqueJobs.length).toBe(5);
	})

	it('should return 5 unique job keys', () => {
		var uniqueJobKeys = transformer.getUniqueJobKeys()
	   	expect(uniqueJobKeys.length).toBe(5);
	})

	it('should return 3 unique locations', () => {
		var uniqueCoords = transformer.getUniqueCoordinates() 
	   	expect(uniqueCoords.length).toBe(3);
	})

	it('all location jobs should sum to 5', () => {
		var numJobs = 0;
		transformer.locations.forEach((location) => {
			numJobs = numJobs + location.jobs.length
		})
	   	expect(numJobs).toBe(5);
	})

	it('should only include these job titles', () => {
		var jobTitles = [
			'Gas Pipeline Engineer',
			'Geospatial/Geographic Information Systems Analyst',
			'Geospatial Operations Manager',
			'Network Engineer',
			'Geospatial Software Developer'
		]

		var isJobTitle = true;

		transformer.jobs.forEach((job) => {
			if (jobTitles.indexOf(job.jobtitle) == -1) {
				isJobTitle = false
			}
		}) 

		expect(isJobTitle).toBe(true);
	})

	it('should only include these latitudes', () => {
		var latitudes = [38.540073, 38.59066, 37.73185]

		var isLatitude = true
		transformer.locations.forEach((location) => {
			if (latitudes.indexOf(location.latitude) == -1) {
				isLatitude = false
			}
		})

		expect(isLatitude).toBe(true);
	})

	it('should only include these longitudes', () => {
		var longitudes = [-89.98394, -89.90659, -88.92555]

		var isLongitude = true
		transformer.locations.forEach((location) => {
			if (longitudes.indexOf(location.longitude) == -1) {
				isLongitude = false
			}
		})

		expect(isLongitude).toBe(true);
	})

	it('should only include these cities', () => {
		var cities = ["Belleville", "O'Fallon", "Marion"]

		var isCity = true
		transformer.locations.forEach((location) => {
			if (cities.indexOf(location.city) == -1) {
				isCity = false
			}
		})

		expect(isCity).toBe(true);
	})

	it('should only include these states', () => {
		var states = ["IL"]
		
		var isState = true
		transformer.locations.forEach((location) => {
			if (states.indexOf(location.state) == -1) {
				isState = false
			}
		})

		expect(isState).toBe(true);
	})

})