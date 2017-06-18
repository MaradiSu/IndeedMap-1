var locationPath = location.pathname.replace(/\/[^\/]+$/, '');
console.log(locationPath)
var dojoConfig = {
  packages: [
  	{
    	name: 'app',
    	location: locationPath + '/static/jobsite/js/dist'
  	},
  	{
    	name: 'jquery',
    	location: "https://code.jquery.com",
    	main: 'jquery-2.2.4'
  	},
  	{
    	name: 'd3',
    	location: "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17",
    	main: 'd3.min'
  	}
  ]
};