import {JobSearchForm} from '../ui/JobSearchForm'

export class TabbedPanes {
	constructor(tabbedPaneElem) {
		this.tabbedPaneElem = tabbedPaneElem
		this.tabs = this.tabbedPaneElem.find(".tab")
		this.panes = this.tabbedPaneElem.find(".pane")
		
		this.createJobSearchForm()
		this.displayPaneOnClickEvent()
	}
	
	createJobSearchForm() {
		var searchPane = this.tabbedPaneElem.find("#search-pane")
		this.jobSearchForm = new JobSearchForm(searchPane)
	}
	
	displayPaneOnClickEvent() {
		this.tabs.click((event) => {
			var clickedTab = $(event.target)
			this.reassignTabSelectStyle(clickedTab)
			this.displayTargetPane(clickedTab)
		})
	}
	
	displayTargetPane(clickedTab) {
		var paneId = clickedTab.attr('data-target')
		this.hidePanes()
		this.showPane(paneId)
	}
	
	showPane(paneId) {
		this.hidePanes()
		this.panes.each((_,pane) => {
			if ($(pane).attr('id') == paneId) {
				$(pane).show()
			}
		})
	}
	
	hidePanes() {
		this.panes.hide()
	}
	
	reassignTabSelectStyle(clickedTab) {
		this.tabs.each((_,tab) => {
			$(tab).removeClass('tab-selected')
		})
		clickedTab.addClass('tab-selected')
	}
}