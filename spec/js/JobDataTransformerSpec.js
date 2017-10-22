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
		var uniqueCoords = transformer.extractUniqueCoordinates() 
	   	expect(uniqueCoords.length).toBe(3);
	})

	it('all location jobs should sum to 5', () => {
		var numJobs = 0;
		transformer.locations.forEach((location) => {
			numJobs = numJobs + location.jobs.length
		})
	   	expect(numJobs).toBe(5);
	})

})