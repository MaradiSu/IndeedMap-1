import * as esriLoader from "esri-loader"

export default class ModuleLoader {
	constructor() {
		esriLoader.bootstrap((err) => {
		  if (err) {
		    console.error("error loading esri modules!")
		  } else {
		    this.loadModules()
		  }
		},{
    		// use a specific version instead of latest 4.x
    		url: 'https://js.arcgis.com/3.21/'
  		})
	}

	loadModules() {
        esriLoader.dojoRequire([
            "esri/map",
            "esri/Color",
            "esri/graphic",
            "esri/InfoTemplate",

            "esri/symbols/SimpleMarkerSymbol",
            "esri/symbols/SimpleLineSymbol",

            "esri/layers/GraphicsLayer",
            
            "esri/geometry/Point",

            "esri/dijit/InfoWindowLite",

            "dojo/dom-construct",

            "dojo/domReady!"
        ], (
            Map,
            Color,
            Graphic,
            InfoTemplate,

            SimpleMarkerSymbol,
            SimpleLineSymbol,

            GraphicsLayer,

            Point,

            InfoWindowLite,

            domConstruct
        ) => {
            this.Map = Map
            this.Color = Color
            this.Graphic = Graphic
            this.InfoTemplate = InfoTemplate

            this.SimpleMarkerSymbol = SimpleMarkerSymbol
            this.SimpleLineSymbol = SimpleLineSymbol

            this.GraphicsLayer = GraphicsLayer

            this.Point = Point

            this.InfoWindowLite = InfoWindowLite

            this.domConstruct = domConstruct

            $(document).trigger("esri-modules-loaded")
        })
	}
}