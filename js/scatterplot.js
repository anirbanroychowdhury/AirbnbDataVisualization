


//Read the data
d3.csv("cleaned_boston_data.csv", function(data) { 


    //add to package renderer for scatterplot
    AirBnB.scatterplotRenderer = (function(){
        //Init variables
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;



        // append the svg object to the body of the page
        var svg_scatterplot = d3.select("#scatterplot")
        .append("svg")
        .attr("id","scatterplot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

        var x_attr_scatter = "cleaning_fee";
        var y_attr_scatter = "price";

        var x_scatterplot = d3.scaleLinear()
        .domain([x_scale_min,x_scale_max])
        .range([ 0, width ]);
        var y_scatterplot =d3.scaleLinear()
        .domain([y_scale_min,y_scale_max])
        .range([ height, 0]);

        var xAxis=svg_scatterplot.append("g").attr("class","axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x_scatterplot));
        var yAxis=svg_scatterplot.append("g").attr("class","axis")
        .call(d3.axisLeft(y_scatterplot));

        var y_scale_min = Math.min.apply(null, data.map(function(obj) { return obj[y_attr_scatter]; }));
        var y_scale_max = Math.max.apply(null,data.map(function(obj) { return obj[y_attr_scatter]; }));

        var x_scale_min = Math.min.apply(null, data.map(function(obj) { return obj[x_attr_scatter]; }));
        var x_scale_max = Math.max.apply(null,data.map(function(obj) { return obj[x_attr_scatter]; }));

        //function to update scale on new attributes being passed.
        function update_scales_scatterplot(x_attr_scatter,y_attr_scatter) {
            y_scale_min = Math.min.apply(null, data.map(function(obj) { return obj[y_attr_scatter]; }));
            y_scale_max = Math.max.apply(null,data.map(function(obj) { return obj[y_attr_scatter]; }));

            x_scale_min = Math.min.apply(null, data.map(function(obj) { return obj[x_attr_scatter]; }));
            x_scale_max = Math.max.apply(null,data.map(function(obj) { return obj[x_attr_scatter]; }));

        }


        // Scale for price and bedrooms
        function updated_scatterplot(x_attr_scatter,y_attr_scatter){

            update_scales_scatterplot(x_attr_scatter,y_attr_scatter);

            // Add domain for scatter plot and transition axis.
            x_scatterplot.domain([x_scale_min,x_scale_max])
            xAxis.transition().duration(1000).call(d3.axisBottom(x_scatterplot));

            y_scatterplot.domain([y_scale_min,y_scale_max])

            yAxis.transition().duration(1000).call(d3.axisLeft(y_scatterplot));

            //add tooltip
            var tooltip = d3.select("body")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")

            //Events
            var mouseover_scatterplot = function(d) {
                tooltip
                    .style("opacity", 1)
            }

            var mousemove_scatterplot = function(d) {
                tooltip
                    .html(y_attr_scatter+":"+d[y_attr_scatter]+"<br>"+x_attr_scatter+":"+d[x_attr_scatter])
                    .style("left", (d3.event.pageX+20) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
                    .style("top", (d3.event.pageY-20 ) + "px")
            }

            // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
            var mouseleave_scatterplot = function(d) {
                tooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
            }

            //Adding & Removing Labels for Axis
            svg_scatterplot.selectAll(".x_attr_scatter").remove().exit();
            svg_scatterplot.selectAll(".y_attr_scatter").remove().exit();
            svg_scatterplot.append("text")
                .attr("class","x_attr_scatter")
                .attr("transform",
                      "translate(" + (width/2) + " ," + 
                      (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text(x_attr_scatter)
                .attr("fill","antiquewhite") ;

            svg_scatterplot.append("text")
                .attr("class","y_attr_scatter")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - margin.left)
                .attr("x",0 - (height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text(y_attr_scatter)
                .attr("fill","antiquewhite");   
            //remove and add new data.
            svg_scatterplot.selectAll(".scatter-circle").remove().exit()
                .data(data)
                .enter()
                .append("circle")
                .attr("class","scatter-circle")
                .attr("cx", function (d) {
                return x_scatterplot(d[x_attr_scatter]); 
            } )
                .attr("cy", function (d) {  return y_scatterplot(d[y_attr_scatter]);} ) 
                .attr("r", 1.5)
                .style("fill", "#69b3a2")
                .on("mouseover", mouseover_scatterplot )
                .on("mousemove", mousemove_scatterplot )
                .on("mouseleave", mouseleave_scatterplot );


        }
        //Init call
        updated_scatterplot(x_attr_scatter,y_attr_scatter,5);
        //Returned functions
        return{
            updated_scatterplot:updated_scatterplot
        }
    }());
})

