export class IpFetcher {
	constructor(ip) {
		this.fetchIp()
	}
	
	fetchIp() {
		$.get("https://api.ipify.org?format=json")
		.done((result) => this.ip = result.ip)
		.fail(() => this.ip = undefined)
	}
}