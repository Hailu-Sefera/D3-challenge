// @TODO: YOUR CODE HERE!
//define margins and area for graph
var svgWidth = 1000;
var svgHeight = 700;
var margin = { top: 30, right: 40, bottom: 100, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var chartGroup = svg.append("g")
  // .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Append a div to the body to create tooltips, assign it a class
var div = d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from CSV file and execute everything below

d3.csv("assets/data/data.csv", function(err, censusData) {
    if(err) throw err;
     console.log(censusData)
    censusData.forEach(function(data) {
      data.state = data.state;
      data.abbr = data.abbr;
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    //.domain([d3.min(healthdata, data => data.healthcare)-1, d3.max(healthdata, data => data.healthcare)+1.1])
    
    var xLinearScale = d3.scaleLinear().range([0, width]);
    //.domain([d3.min(healthdata, data => data.poverty)-0.5, d3.max(healthdata, data => data.poverty)+0.5, 30])
    
    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //scaling
    // variables to store the min and max values of csv file
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(censusData, function(data) {
        return +data.poverty* 0.85;
    });

    xMax = d3.max(censusData, function(data) {
        return +data.poverty* 1;
    });

    yMin = d3.min(censusData, function(data) {
        return +data.healthcare * 0.85;
    });

    yMax = d3.max(censusData, function(data) {
        return +data.healthcare * 1;
    });

    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);
    //console.log(xMin);
    //console.log(yMax);

    var state_text = "State: "
    var pov_perc = "In Poverty(%): "
    var healthcare_perc = "healthcare(%): "
    
    // create chart
    var circlesGroup = chartGroup.selectAll("circle")
    
    //chart.selectAll("chart")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.poverty);
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.healthcare);
        })
        .attr("r", 12)
        .attr("fill", "#69b3a2")
        // display tooltip on click
        circlesGroup.on("click", function(data) {
          toolTip.show(data);
        })
        .on("mouseover", function (data) {
            div.transition()
                .duration(100)
                .style("opacity", .9);
            div.html(state_text.bold() + data.state + "<br/>" + pov_perc.bold() + data.poverty + "<text>%</text>" + "<br/>" + Healthcare_perc.bold() + data.Healthcare + "<text>%</text>")
                .style("left", (d3.event.pageX)+ 10 + "px")
                .style("top", (d3.event.pageY - 0) + "px");
        })
        // hide tooltip on mouseout
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
            div.transition()
                .duration(500)
                .style("opacity",0);
        });

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", "bold")
        .style("font-family", "arial")
        .selectAll("tspan")
        .data(censusData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.healthcare - 0.1);
            })
            .text(function(data) {
                return data.abbr
                });

    // Append an SVG group for the xaxis, then display x-axis 
    chartGroup
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    chartGroup
        .append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 20)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text(" Lacks Health Care (%)");
  
    // Append x-axis labels
    chartGroup
        .append("text")
        .style("font-family", "arial")
        .style("text-anchor", "middle")
        .style("font-size", "10px")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("In Poverty (%)");



});

