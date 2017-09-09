import JobDataTransformer from "../JobDataTransformer"
import ModuleLoader from "./ModuleLoader"

export default class JobMap {
	constructor(jobMapElem) {
		this.jobMapContainer = jobMapElem
		this.modules = new ModuleLoader()
		this.initMapOnModulesLoadedEvent()
	}

	initMapOnModulesLoadedEvent() {
		$(document).on("esri-modules-loaded", () => this.initMap())
	}
 
	initMap() {
	    this.createMap()
		this.createInfoWindow()
		this.createLayers()
		this.createSymbols()
		this.addPointsOnSearchEvent()
	}
	
	createMap() {
		this.map = new this.modules.Map(this.jobMapContainer[0], {
			center: [-98.35, 39.5],
			zoom: 4,
			basemap: "streets"
		});
	}
	
	createInfoWindow() {
		this.infoWindow = new this.modules.InfoWindowLite(null, this.modules.domConstruct.create("div", null, null, this.map.root))
      	this.infoWindow.startup()
      	this.map.setInfoWindow(this.infoWindow)
	}
	
	createLayers() {
		this.jobsGraphicsLayer = new this.modules.GraphicsLayer({
			id: "Jobs"
		});
		this.map.addLayer(this.jobsGraphicsLayer)
	}
	
	createSymbols() {
		var blue = new this.modules.Color([49, 99, 242])
		var transparentBlue = new this.modules.Color([49, 99, 242, 0.25])
		
		this.symbol = new this.modules.SimpleMarkerSymbol(this.modules.SimpleMarkerSymbol.STYLE_CIRCLE, 15,
        	new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID,blue, 1),
        	transparentBlue)
        
		this.selectSymbol = new this.modules.SimpleMarkerSymbol(this.modules.SimpleMarkerSymbol.STYLE_CIRCLE, 15,
        	new this.modules.SimpleLineSymbol(this.modules.SimpleLineSymbol.STYLE_SOLID,blue, 1),
        	blue)
	}
	
	addPointsOnSearchEvent() {
		$(document).on('search-complete', (event, transformedData) => {
			this.jobsGraphicsLayer.clear()
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
        var point = new this.modules.Point(location.longitude, location.latitude)
        var attributes = {
        	longitude: location.longitude,
        	latitude: location.latitude,
        	city: location.city,
        	state: location.state,
        	jobs: location.jobs.length
        }
        
        var graphic = new this.modules.Graphic(point, this.symbol, attributes, this.createInfoTemplate(location))
        
        return graphic
	}
	
	createInfoTemplate(location) {
		return new this.modules.InfoTemplate({
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