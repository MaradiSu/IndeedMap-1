export default class Error {
	constructor() {
		this.alertOnErrorEvent()
	}
	
	alertOnErrorEvent() {
		$(document).on('error', (event, message) => {
			alert(message)
		})
	}
	
}	