export default class SearchError {
	constructor() {
		this.alertOnErrorEvent()
	}
	
	alertOnErrorEvent() {
		$(document).on('search-error', (event, message) => {
			alert(message)
		})
	}
	
}	