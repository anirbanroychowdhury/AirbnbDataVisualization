//create package
window.AirBnB = window.AirBnB || {};


// set the dimensions and margins of the graph



// get the data
d3.csv("cleaned_boston_data.csv", function(data) {
    //Add to package renderer for histogram
    AirBnB.histogramRenderer = (function(){
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;


        // append the svg object to the body of the page
        var svg = d3.select("#histogram")
        .append("svg")
        .attr("id","histogram_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

        //initial attributes
        var x_attr_hist = "cleaning_fee";
        var x_attr_hist_temp = "";
        var y_attr_hist = "price";
        var y_attr_hist_temp = "";
        var y_scale_min = Math.min.apply(null, data.map(function(obj) { return obj[y_attr_hist]; }));
        var y_scale_max = Math.max.apply(null,data.map(function(obj) { return obj[y_attr_hist]; }));

        var x_scale_min = Math.min.apply(null, data.map(function(obj) { return obj[x_attr_hist]; }));
        var x_scale_max = Math.max.apply(null,data.map(function(obj) { return obj[x_attr_hist]; }));

        //define scales
        var x = d3.scaleLinear().range([0,width]).domain([x_scale_min,x_scale_max]);
        var y = d3.scaleLinear().range([height,0]);
        var yAxis = svg.append("g").attr("class","axis");
        var xAxis = svg.append("g").attr("transform", "translate(0," + height + ")").attr("class","axis").call(d3.axisBottom(x));


        //function to update scale on new attributes being passed.
        function update_scales_histogram(x_attr_hist,y_attr_hist) {
            y_scale_min = Math.min.apply(null, data.map(function(obj) { return obj[y_attr_hist]; }));
            y_scale_max = Math.max.apply(null,data.map(function(obj) { return obj[y_attr_hist]; }));

            x_scale_min = Math.min.apply(null, data.map(function(obj) { return obj[x_attr_hist]; }));
            x_scale_max = Math.max.apply(null,data.map(function(obj) { return obj[x_attr_hist]; }));

        }

        // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
        // Its opacity is set to 0: we don't see it by default.
        var tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("id","tooltip-histogram")
        .attr("class", "tooltip")

        //     A function that change this tooltip when the user hover a point.
        //     Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
        var showTooltip = function(d) {
            console.log(d);
            tooltip
                .transition()
                .duration(100)
                .style("opacity", 1)
            tooltip
                .html("Range: " + d.x0 + " - " + d.x1+"<br>Count:"+d.length)
                .style("left", (d3.event.pageX+20) + "px")
                .style("top", (d3.event.pageY-20 ) + "px")
        }
        var moveTooltip = function(d) {
            tooltip
                .style("left", (d3.event.pageX+20)  + "px")
                .style("top", (d3.event.pageY-20 ) + "px")
        }
        // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
        var hideTooltip = function(d) {
            tooltip
                .transition()
                .duration(100)
                .style("opacity", 0)
        }


        function update_hist(x_attr_hist,y_attr_hist,nBin){
            x_attr_hist_temp=x_attr_hist;
            y_attr_hist_temp=y_attr_hist; update_scales_histogram(x_attr_hist,y_attr_hist);

            // set the parameters for the histogram
            var histogram = d3.histogram()
            .value(function(d) { return d[y_attr_hist]; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(nBin)); // then the numbers of bins

            // And apply this function to data to get the bins
            var bins = histogram(data);

            //set domains for our s and y axis.
            y.domain([y_scale_min,y_scale_max]);
            x.domain([x_scale_min,x_scale_max]);
            //console.log(x);
            //transition our axis.
            yAxis
                .transition()
                .duration(1000)
                .call(d3.axisLeft(y));
            xAxis
                .transition()
                .duration(1000)
                .call(d3.axisBottom(x))
                .attr("transform", "translate(0," + height + ")");
            
            
            svg.selectAll(".x_attr_hist").remove().exit();
            svg.selectAll(".y_attr_hist").remove().exit();
            svg.append("text")
                .attr("class","x_attr_hist")
                .attr("transform",
                      "translate(" + (width/2) + " ," + 
                      (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text(x_attr_hist)
                .attr("fill","antiquewhite") ;
            
              svg.append("text")
                .attr("class","y_attr_hist")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(y_attr_hist)
                .attr("fill","antiquewhite");   


            var u = svg.selectAll("rect").data(bins)
            //add react
            u.enter().append("rect")
                .merge(u).transition().duration(1000)
                .attr("x",1)
                .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
                .attr("width", function(d) { return Math.abs(x(d.x1) - x(d.x0) -1) ; })
                .attr("height", function(d) { return Math.abs(height - y(d.length)); })
                .style("fill", "#69b3a2")

            //remove react
            u.exit().remove();
            //add hover functionality
            d3.selectAll("#histogram rect")
                .on("mouseover", showTooltip )
                .on("mousemove", moveTooltip )
                .on("mouseleave", hideTooltip )

        }

        //init call
        update_hist(x_attr_hist,y_attr_hist,21);
        //change value from input bar
        d3.select("#nBin").on("input",function(){
            update_hist(x_attr_hist_temp,y_attr_hist_temp,+this.value);
        })
        //return packaged function
        return {
            update_hist: update_hist
        }
    }());

})