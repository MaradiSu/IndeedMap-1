import {ProgressBar} from './ui/ProgressBar'
import {JobFetcher} from './JobFetcher'
import {SearchError} from './ui/SearchError'
import {JobDataTransformer} from './JobDataTransformer'
import {TabbedPanes} from './ui/TabbedPanes'
import {JobMap} from './ui/JobMap'

$(document).ready(() => {
	
	new ProgressBar($("#progress-bar-container")) 
	new JobFetcher()
	new SearchError()
	new JobDataTransformer()
	new TabbedPanes($(".tabbed-panes"))
	new JobMap($("#map"))
})




