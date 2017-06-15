import JobDataTransformer from "app/JobDataTransformer"

import Map from "esri/map"
import Color from "esri/Color"
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol"
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol"
import Graphic from "esri/graphic"
import GraphicsLayer from "esri/layers/GraphicsLayer"
import Point from "esri/geometry/Point" 
import InfoWindowLite from "esri/dijit/InfoWindowLite"
import InfoTemplate from "esri/InfoTemplate"
import domConstruct from "dojo/dom-construct"

export default class JobMap {
	constructor(jobMapElem) {
		this.jobMapContainer = jobMapElem
		this.createMap()
		this.createInfoWindow()
		this.createLayers()
		this.createSymbols()
		this.addPointsOnSearchEvent()
	}
	
	createMap() {
		this.map = new Map(this.jobMapContainer[0], {
			center: [-98.35, 39.5],
			zoom: 4,
			basemap: "streets"
		});
	}
	
	createInfoWindow() {
		this.infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, map.root))
      	this.infoWindow.startup()
      	this.map.setInfoWindow(this.infoWindow)
	}
	
	createLayers() {
		this.jobsGraphicsLayer = new GraphicsLayer({
			id: "Jobs"
		});
		this.map.addLayer(this.jobsGraphicsLayer)
	}
	
	createSymbols() {
		var blue = new Color([49, 99, 242])
		var transparentBlue = new Color([49, 99, 242, 0.25])
		
		this.symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
        	new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,blue, 1),
        	transparentBlue)
        
		this.selectSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
        	new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,blue, 1),
        	blue)
	}
	
	addPointsOnSearchEvent() {
		$(document).on('search-complete', (event, searchResults) => {
			this.jobsGraphicsLayer.clear()
			var transformedData = new JobDataTransformer(searchResults)
			this.addPointsToJobsLayer(transformedData.locations)
		})
	}
	
	addPointsToJobsLayer(locations) {
		locations.forEach((location) => {
			var pointGraphic = this.createPointGraphic(location)
			this.jobsGraphicsLayer.add(pointGraphic)
		})
	}
	
	createPointGraphic(location) {
        var point = new Point(location.longitude, location.latitude)
        var attributes = {
        	longitude: location.longitude,
        	latitude: location.latitude,
        	city: location.city,
        	state: location.state,
        	jobs: location.jobs.length
        }
        
        var graphic = new Graphic(point, this.symbol, attributes, this.createInfoTemplate(location))
        
        return graphic
	}
	
	createInfoTemplate(location) {
		return new InfoTemplate({
			title: "<b>${jobs} job in ${city}, ${state} (${latitude}, ${longitude})</b>",
			content: this.generateInfoTemplateContent(location)
		})
	}
	
	generateInfoTemplateContent(location) {
		var content = ""
		for (let job of location.jobs) {
			content += "<b><a href='" + job.url + "' target='_blank'>" + job.jobtitle + "</a></b><br>" + job.company + "<hr>"
		}
		return content
	}
}