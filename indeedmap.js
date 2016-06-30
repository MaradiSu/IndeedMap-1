$(document).ready(function() {
  require([
      "esri/map",
      "esri/Color",
      "esri/symbols/SimpleMarkerSymbol",
      "esri/symbols/SimpleLineSymbol",
      "esri/graphic",
      "esri/layers/GraphicsLayer",
      "esri/geometry/Point",
      "esri/dijit/InfoWindowLite",
      "esri/InfoTemplate",
      "dojo/dom-construct",
      "dojo/domReady!",
    ],
    function(
      Map,
      Color,
      SimpleMarkerSymbol,
      SimpleLineSymbol,
      Graphic,
      GraphicsLayer,
      Point,
      InfoWindowLite,
      InfoTemplate,
      domConstruct
    ) {

      //Indeed api requests variables	
      var totalJobsFound = 0; //keeps track of the total results found for search
      var jobsNoCoords = 0; //keeps track of the number of jobs w/o coords for search
      var resultsPerPage = 25; //25 is the max return per request
      var userAgent = navigator.userAgent;
      var ip = "";

      //Get the client IP address for sending requests to indeed api
      $.ajax({
        type: "GET",
        url: "https://api.ipify.org?format=json",
        success: function(result) {
          ip = result.ip;
        },
        error: function() {
          console.log("An error occurred retrieving the client IP address!");
        }
      });

      //Map variables
      var map = new Map("map", {
        center: [-98.35, 39.5],
        zoom: 4,
        basemap: "streets"
      });


      var infoWindow = new InfoWindowLite(null, domConstruct.create("div", null, null, map.root));
      infoWindow.startup();
      map.setInfoWindow(infoWindow);

      var template = new InfoTemplate();
      template.setTitle("<b>${jobs} job in ${city}, ${state} (${latitude},${longitude})</b>");
      template.setContent("<b><a href='${url}' target='_blank'>${jobTitle}</a></b><br>${company}<hr>");

      var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([49, 99, 242]), 1),
        new Color([49, 99, 242, 0.25]));

      var selectSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 15,
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
          new Color([49, 99, 242]), 2),
        new Color([49, 99, 242, 1]));

      var gl = new GraphicsLayer();
      gl.id = "Jobs";

      //Progress Bar Variables

      var width = 150,
        height = 150,
        twoPi = 2 * Math.PI,
        progress = 0,
        percent = 0,
        formatPercent = d3.format(".0%");

      var arc = d3.svg.arc()
        .startAngle(0)
        .innerRadius(50)
        .outerRadius(60);

      var svg = d3.select('#progress-container').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("top", "50%")
        .attr("left", "50%")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var meter = svg.append("g")
        .attr("class", "progress-meter");

      meter.append("path")
        .attr("class", "background")
        .attr("d", arc.endAngle(twoPi));

      var foreground = meter.append("path")
        .attr("class", "foreground");

      foreground.attr("d", arc.endAngle(0))

      var progressText = meter.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em");

      //Create a point graphic for a singe point where the attributes are the data returned for the result
      function createPointGraphic(searchResult, symbol) {
        var point = new Point(searchResult.longitude, searchResult.latitude);
        var attr = {
          jobKey: searchResult.jobkey,
          jobTitle: searchResult.jobtitle,
          company: searchResult.company,
          city: searchResult.city,
          state: searchResult.state,
          timeSincePost: searchResult.formattedRelativeTime,
          summary: searchResult.snippet,
          url: searchResult.url,
          latitude: searchResult.latitude,
          longitude: searchResult.longitude,
          jobs: 1
        };
        var graphic = new Graphic(point, symbol, attr);
        return graphic;
      }

      //Increments the text and the foreground path of the progress bar.
      function incrementProgressBar() {
        progress++;

        if (pages > 0) {
          percent = progress / pages;
        }

        foreground.attr("d", arc.endAngle(twoPi * percent));
        progressText.text(formatPercent(percent));

        //Check if the progress bar is at 100% or if there are no results
        if (percent == 1 | pages == 0) {
          //Force the progress bar to 100%
          foreground.attr("d", arc.endAngle(twoPi));
          progressText.text(formatPercent(1));

          //if jobs w/o coordinates were found, display how many and the jobs in the #jobs-no-coords div
          if (jobsNoCoords > 0) {
            $("#total-jobs-no-coords").html(jobsNoCoords + " job(s) found without coordinates will not be displayed on the map, but are listed below:");
            $("#jobs-no-coords").css("display", "block");
          }
          $("#progress-container").css("display", "none");
          $("#progress-overlay").css("display", "none");
        }
      }

      function displayResults(results, gl, map) {
        for (var i = 0; i < results.length; i++) {
          //First, check if result has lat/long data
          if (results[i].hasOwnProperty("latitude") && results[i].hasOwnProperty("longitude")) {
            //if there are no graphics, add this one to the jobs graphic layer, 
            //else check to see if a graphic with same lat/long exists
            if (gl.graphics.length == 0) {
              var graphic = createPointGraphic(results[i], symbol);
              graphic.infoTemplate = template;
              gl.add(graphic);
            } else {
              var existingGraphic; //empty variable for the graphic that contains the same lat/long as result
              var graphicExists = false; //graphics exists flag

              //iterate over graphics to see if they contain the same lat/long as result
              for (var j = 0; j < gl.graphics.length; j++) {
                var pt = gl.graphics[j].geometry;
                //if result does include same lat/long, set the graphicExists flag to true
                //and pass the graphic to the existingGrahic variable
                if (results[i].latitude == pt.y && results[i].longitude == pt.x) {
                  graphicExists = true;
                  existingGraphic = gl.graphics[j];
                  break;
                }
              }

              //If graphic w/ same lat/long does not exist, create one with the result lat/long
              //and add to the jobs graphic layer
              if (!graphicExists) {
                var graphic = createPointGraphic(results[i], symbol);
                graphic.infoTemplate = template;
                gl.add(graphic);

                //if a graphic with same lat/long does exist, append job info to the graphics info template
              } else {
                var newTemplate = new InfoTemplate();
                newTemplate.setTitle("<b>${jobs} jobs in ${city}, ${state} (${latitude},${longitude})</b>");
                var content = existingGraphic.infoTemplate.content;
                var newContent = content + "<b><a href='" + results[i].url + "' target='_blank'>" + results[i].jobtitle + "</a></b><br>" + results[i].company + "<hr>";
                newTemplate.setContent(newContent);
                existingGraphic.attributes.jobs = existingGraphic.attributes.jobs + 1;
                existingGraphic.infoTemplate = newTemplate;
              }
            }
            //If no lat/long data, append the job data to the #job-no-coords div
          } else {
            var job = "<b><a href='" + results[i].url + "' target='_blank'>" + results[i].jobtitle + "</a></b><br>" + results[i].company + "<hr>";
            $("#jobs-no-coords").append(job);
            jobsNoCoords++; //increment the jobsNoCoord variable
          }
        }
        map.addLayer(gl);
      }

      //Request the next page of jobs
      function getNextPage(startResults, numResults) {
        $.ajax({
          type: "GET",
          url: "http://api.indeed.com/ads/apisearch",
          dataType: "jsonp",
          cache: false,
          crossDomain: true,
          data: {
            publisher: 2916132883457866,
            format: "json",
            v: 2,
            latlong: 1,
            co: "us",
            limit: numResults, //max is 25
            start: startResults,
            q: $("#q").val(),
            l: $("#city-state").val(),
            radius: $("#radius").val(),
            jt: $("#jobtype").val(),
            userip: ip,
            useragent: userAgent
          },
          success: function(result) {
            displayResults(result.results, gl, map);
            incrementProgressBar();
          },
          error: function() {
            console.log("error");
            incrementProgressBar();
            $("#search-error").css("display", "block");
          }
        });
      }

      //Takes the users search input, performs search, and displays results on map
      $("#search-button").click(function() {
        //initiate the progress bar
        $("#progress-container").css("display", "block");
        $("#progress-overlay").css("display", "flex");
        $("#search-error").css("display", "none");
        foreground.attr("d", arc.endAngle(0));
        progressText.text(formatPercent(0));

        //for responsive design where map is tab in navigation bar, display map pane
        if ($("#map").css("display") == "none") {
          $("#map-btn").trigger("click");
        }

        //send an initial request to get total jobs found
        $.ajax({
          type: "GET",
          url: "http://api.indeed.com/ads/apisearch",
          dataType: "jsonp",
          cache: false,
          crossDomain: true,
          data: {
            publisher: 2916132883457866,
            format: "json",
            v: 2,
            latlong: 1,
            co: "us",
            limit: resultsPerPage, //max is 25,
            q: $("#q").val(),
            l: $("#city-state").val(),
            radius: $("#radius").val(),
            jt: $("#jobtype").val(),
            userip: ip,
            useragent: userAgent
          },
          success: function(result) {
            gl.clear();
            totalJobsFound = result.totalResults;
            //Limited to 20000 to prevent long load times and large data transfers
            if (totalJobsFound > 20000) {
              alert("Your search returned greater than 20,000 results! Please use more specific search criteria to limit the jobs returned.");
              $("#progress-container").css("display", "none");
              $("#progress-overlay").css("display", "none");
            } else {
              //reset and hide jobs with no coords information
              jobsNoCoords = 0;
              $("#jobs-no-coords").html("");
              $("#total-jobs-no-coords").html("");
              $("#jobs-no-coords").css("display", "none");

              //set and display the total of jobs found in the details pane
              var searchString = totalJobsFound.toLocaleString() + ' job(s) found for "' + $("#q").val() + '" in "' + $("#city-state").val() + '".';
              $("#total-jobs").html(searchString);

              //determine the number of pages needed to be retrieved
              pages = Math.ceil((totalJobsFound) / resultsPerPage);
              progress = 0; //reset
              //pages-1 so we save the last page and call the remaining results
              for (var i = 0; i < pages - 1; i++) {
                var next = i * resultsPerPage;
                getNextPage(next, resultsPerPage);
              }
              //get last page results
              var lastResultsStart = (pages - 1) * resultsPerPage;
              //total results - last page of results start = results remaining
              getNextPage(lastResultsStart, result.totalResults - lastResultsStart);
            }
          },
          error: function() {
            alert("An error has occurred! Refreshing your browser may help solve this issue.");
            $("#progress-container").css("display", "none");
            $("#progress-overlay").css("display", "none");
          }
        });
      });

      //Handles the navigation bar button styles and which div is displayed when clicked
      $(".nav-btn").click(function() {
        $(".nav-btn").css("border-style", "none");
        $(".nav-btn").css("padding-bottom", "1px");
        $(".nav-btn").css("color", "#3163f2");

        $(this).css("border-left-style", "solid");
        $(this).css("border-right-style", "solid");
        $(this).css("border-top-style", "solid");
        $(this).css("padding-bottom", "2px");
        $(this).css("color", "black");

        $(".pane").css("display", "none");
        var btnid = $(this).attr("id");
        var id = btnid.split("-")[0];
        $("#" + id).css("display", "block");
      });

      //Resets the symbol for the previous selected graphic and sets the symbol for the newly
      //selected graphic
      gl.on("click", function(evt) {
        for (var i = 0; i < gl.graphics.length; i++) {
          gl.graphics[i].setSymbol(symbol);
        }
        evt.graphic.setSymbol(selectSymbol);
      });

      //for responsive design purposes 
      if ($("#map").css("display") == "none") {
        $("#map").insertBefore("#details");
        $("#map").addClass("pane");
      }

      $(window).resize(function() {
        if ($("#map-btn").css("display") == "inline-block") {
          $("#map").insertBefore("#details");
          $("#map").addClass("pane");
        } else {
          $("#map").insertAfter("#main");
          $("#map").removeClass("pane");
        }
      });
    });
});
