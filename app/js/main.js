import ProgressBar from "./ui/ProgressBar"
import JobFetcher from "./JobFetcher"
import SearchError from "./ui/SearchError"
import TabbedPanes from "./ui/TabbedPanes"
import JobMap from "./ui/JobMap"

$(document).ready(() => {
	new ProgressBar($("#progress-bar-container")) 
	new JobFetcher()
	new SearchError()
	new TabbedPanes($(".tabbed-panes"))
	new JobMap($("#map-pane"))
})




