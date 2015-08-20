var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');

var GraphView = Backbone.View.extend({
  id: 'graph',

  initialize: function(){
    this.svg = d3.select(this.el)
      .append("svg")
      .attr({
        height: d3.select('#app').style('height'),
        width: d3.select('#app').style('width')
      });

    // NOTE: this doesn't work, b/c the graph model doesn't register changes to it's nodes/edges collections
      // how to have these events propagate?
    // this.listenTo(this.model, 'update', function(graph){
    this.listenTo(this.model.get('nodes'), 'update', _.throttle(this.render, 500, { leading: false }) );
    this.listenTo(this.model.get('edges'), 'update', _.throttle(this.render, 500, { leading: false }) );

  },

  d3el: d3.select(this.el),

  render: function(){
    var nodes = this.model.get('nodes').asNodes(),
        links = this.model.get('edges').asLinks()

    this.force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .size([600, 400])
      // .linkStrength(0.1)
      // .friction(0.9)
      .linkDistance(40)
      .charge(-120)
      // .gravity(0.1)
      // .theta(0.8)
      // .alpha(0.1)
      .start();

    var link = this.svg.selectAll(".link")
        .data(links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke", 'black')
        .style("stroke-width", 1);

    var node = this.svg.selectAll(".node")
        .data(nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", 'black')
        .call(this.force.drag);

    this.force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });
  }
});

module.exports = GraphView;
