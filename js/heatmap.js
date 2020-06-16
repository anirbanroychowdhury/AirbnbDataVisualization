// set the dimensions and margins of the graph
    var margin = {top: 50, right: 25, bottom: 80, left: 170},
width = 1400 - margin.left - margin.right - 100,
height = 790 - margin.top - margin.bottom - 100;

// append the svg object to the body of the page
var svg_heatmap = d3.select("#heatmap")
.append("svg")
//.attr("viewbox","0 0 960 500")
.on("mouseleave",function(d){
    tooltip_heatmap
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.8)
})
.attr("id","heatmap")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

var tooltip_heatmap = d3.select("body")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.attr("id","tooltip_heatmap");

//Read the data
//d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv", function(data) {
d3.csv("reformatted_heatmap_data.csv", function(data) {


    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    var myGroups = d3.map(data, function(d){return d.group;}).keys();
    var myVars = d3.map(data, function(d){return d.variable;}).keys();

    // Build X scales and axis:
    var x_heatmap = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);

        //Adding label for x axis
//          svg_heatmap.append("g")
//            .style("font-size", 15)
//            .attr("transform", "translate(0," + height + ")")
//            .call(d3.axisBottom(x_heatmap).tickSize(0))
//            .selectAll("text")
//            .attr("y",0)
//            .attr("x",-100)
//            .attr("dy",".35rem")
//            .attr("transform","rotate(-90)")
//            .select(".domain").remove();

    // Build Y scales and axis:
    var y_heatmap = d3.scaleBand()
    .range([ height, 0 ])
    .domain(myVars)
    .padding(0.05);
    // Adding label for y axis
    svg_heatmap.append("g")
        .attr("class","axis")
        .style("font-size", 15)
        .call(d3.axisLeft(y_heatmap).tickSize(0))
        .select(".domain").remove();

    // Build color scale
    var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateCool)
    .domain([0,1]);


    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover_heatmap = function(d) {
        tooltip_heatmap.transition()
            .duration(200)
            .style("opacity", 1);
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
    }
    var mousemove_heatmap = function(d) {
        tooltip_heatmap
            .html("For Attributes:<br><br><b>"+d.group+" , "+d.variable+"</b><br><br> The Correlation value of this pair is: <b><u>" + d.value+"</u></b>")
            .style("left", (d3.event.pageX+20) + "px")
            .style("top", (d3.event.pageY-20 ) + "px");
    }
    var mouseleave_heatmap = function(d) {
        tooltip_heatmap
            .style("opacity", 0);
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8);
    }

    var save_attr = function(d){
        AirBnB.histogramRenderer.update_hist(d.group,d.variable,5);
        AirBnB.scatterplotRenderer.updated_scatterplot(d.group,d.variable);
    }

    // add the squares
    svg_heatmap.selectAll()
        .data(data, function(d) {return d.group+':'+d.variable;})
        .enter()
        .append("rect")
        .attr("x", function(d) { return x_heatmap(d.group) })
        .attr("y", function(d) { return y_heatmap(d.variable) })
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("width", x_heatmap.bandwidth() )
        .attr("height", y_heatmap.bandwidth() )
        .style("fill", function(d) { return myColor(d.value)} )
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover_heatmap)
        .on("mousemove", mousemove_heatmap)
        .on("mouseleave", mouseleave_heatmap)
        .on("click",save_attr)
})

//// Add title to graph
//svg_heatmap.append("text")
//        .attr("x", 0)
//        .attr("y", -50)
//        .attr("color","white")
//        .attr("text-anchor", "left")
//        .style("font-size", "22px")
//        .text("A d3.js heatmap");
//
//// Add subtitle to graph
//svg_heatmap.append("text")
//        .attr("x", 0)
//        .attr("y", -20)
//        .attr("color","white")
//        .attr("text-anchor", "left")
//        .style("font-size", "14px")
//        .style("fill", "grey")
//        .style("max-width", 400)
//        .text("A short description of the take-away message of this chart.");
