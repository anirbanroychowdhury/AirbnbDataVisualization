var width = 700,
    height = 580;

var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

var neighborhoods = svg.append('g');

ar albersProjection = d3.geoAlbers()
  .scale(190000)
  .rotate([71.057, 0])
  .center([0, 42.313])
  .translate([width/2, height/2]);