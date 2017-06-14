import {ProgressBar} from 'app/ui/ProgressBar'
import {JobFetcher} from 'app/JobFetcher'
import {SearchError} from 'app/ui/SearchError'
import {JobDataTransformer} from 'app/JobDataTransformer'
import {TabbedPanes} from 'app/ui/TabbedPanes'
import Map from "esri/map"
import $ from "jquery"
import d3 from "d3"

$(document).ready(() => {
	
	new ProgressBar($("#progress-bar-container")) 
	new JobFetcher()
	new SearchError()
	new JobDataTransformer()
	new TabbedPanes($(".tabbed-panes"))
	var map = new Map("map", {
        center: [-98.35, 39.5],
        zoom: 4,
        basemap: "streets"
      })
    console.log(map)
      
})




