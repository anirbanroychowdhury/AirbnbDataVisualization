    
AirBnB.mapRenderer = (function(){
var width = 700;
    var height = 580;

    var svg = d3.select( "#map" )
        .append( "svg" )
        .attr( "width", width )
        .attr( "height", height );

    var g = svg.append( "g" );

    var albersProjection = d3.geoAlbers()
        .scale( 190000 )
        .rotate( [71.057,0] )
        .center( [0, 42.313] )
        .translate( [width/2,height/2] );

    var geoPath = d3.geoPath()
        .projection( albersProjection );

    g.selectAll( "path" )
        .data( neighborhoods_json.features )
        .enter()
        .append( "path" )
        .attr( "fill", "#ccc" )
        .attr( "stroke", "#333")
        .attr( "d", geoPath );

var rodents = svg.append( "g" );

rodents.selectAll( "path" )
	.data( listings_json.features )
	.enter()
	.append( "path" )
	.attr( "fill", "#900" )
	.attr( "stroke", "#999" )
	.attr( "d", geoPath );
}());