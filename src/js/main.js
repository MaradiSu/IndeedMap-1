import ProgressBar from "./ui/ProgressBar"
import JobFetcher from "./JobFetcher"
import AppError from "./ui/Error"
import TabbedPanes from "./ui/TabbedPanes"
import JobMap from "./ui/JobMap"

$(document).ready(() => {
	new ProgressBar($("#progress-bar-container")) 
	new JobFetcher()
	new AppError()
	new TabbedPanes($(".tabbed-panes"))
	new JobMap($("#map-pane"))
})




