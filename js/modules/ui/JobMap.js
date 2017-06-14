export class JobMap {
	constructor(jobMapElem) {
		this.mapContainer = jobMapElem
		console.log(this.mapContainer)
		this.initMap()
	}
	
	initMap() {
		this.map = new Map(this.mapContainer[0], {
        center: [-98.35, 39.5],
        zoom: 4,
        basemap: "streets"
      });
	}
	
}