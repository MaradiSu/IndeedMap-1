import * as D3Utils from '../utils/D3Utils'

export default class ProgressBar {
	constructor(progressBarContainerElem) {
		this.progressBarContainer = progressBarContainerElem
		this.progressBar = d3.select(this.progressBarContainer.find("#progress-bar").get(0))
		this.width = 150
		this.height = 150
		this.twoPi = 2 * Math.PI
		this.formatPercent = d3.format(".0%")
		this.backgroundArc = D3Utils.createArc(0, this.twoPi, 50, 60)
		this.foregroundArc = D3Utils.createArc(0, 0, 50, 60)
		this.progressPercent = 0
		
		this.createProgressBar()
		this.displayOnSearchEvent()
		this.updateOnRequestEvent()
		this.hideOnSearchCompleteEvent()
	}
	
	createProgressBar() {
		this.progressBar = this.progressBar.append("svg")
        .attr("width", this.width)
        .attr("height", this.height)
        .attr("top", "50%")
        .attr("left", "50%")
        
        this.appendCenteringGroup()
		this.appendProgressText()
	}
	
	appendCenteringGroup() {
		this.progressMeter = this.progressBar.append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")")
        .attr("class", "progress-meter")
        
        this.appendBackgroundPath()
        this.appendForegroundPath()
	}
	
	appendBackgroundPath() {
		this.progressMeter.append("path")
        .attr("class", "background")
        .attr("d", this.backgroundArc)
	}
	
	appendForegroundPath() {
		this.foregroundPath = this.progressMeter.append("path")
        .attr("class", "foreground")
        .attr("d", this.foregroundArc)
	}
	
	appendProgressText() {
		this.progressText = this.progressMeter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
	}
	
	updateProgress(progressPercent) {
		var arcEndAngle = this.twoPi * progressPercent
		this.foregroundPath.attr("d", this.foregroundArc.endAngle(arcEndAngle))
		
		var formattedPercent = this.formatPercent(progressPercent)
        this.progressText.text(formattedPercent)
	}
	
	displayOnSearchEvent() {
		$(document).on('search', () => {
			this.updateProgress(0)
			this.progressBarContainer.css("display", "flex")
		})
	}
	
	updateOnRequestEvent() {
		$(document).on("page-request-complete", (event, percentComplete) => {
			this.updateProgress(percentComplete)
		})
	}
	
	hideOnSearchCompleteEvent() {
		$(document).on('search-complete search-error', () => {
			this.progressBarContainer.css("display", "none")
		})
	}
}