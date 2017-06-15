import ProgressBar from "app/ui/ProgressBar"
import JobFetcher from "app/JobFetcher"
import SearchError from "app/ui/SearchError"
import TabbedPanes from "app/ui/TabbedPanes"
import JobMap from "app/ui/JobMap"
import $ from "jquery"
import d3 from "d3"
import "dojo/domReady"
	
new ProgressBar($("#progress-bar-container")) 
new JobFetcher()
new SearchError()
new TabbedPanes($(".tabbed-panes"))
new JobMap($("#map"))



