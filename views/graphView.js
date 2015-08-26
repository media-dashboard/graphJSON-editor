var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');
var d3Util = require('../utils/d3_utils');

var GraphView = Backbone.View.extend({
  el: '#graph',
  // tagName: 'div',

  // id: 'graph',

  initialize: function(){
    var height = d3.select('#app').style('height'),
        width = d3.select('#app').style('width');

    this.d3el = d3.select(this.el);

    this.svg = this.d3el
      .append('svg')
      .style({
        height: height,
        width: width
      });
    
    this.svg.append("g");

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 6])
        .on("zoom", d3Util.zoom.bind(this.svg.select('g')) );
    this.svg.call(zoom);

    this.force = d3.layout.force()
      .size([parseInt(width), parseInt(height)])
      .linkStrength(0.1)
      .friction(0.9)
      .linkDistance(80)
      .charge(-100)
      .gravity(0.1)
      .theta(0.8)
      .alpha(0.1);

    // whenever loading new data (or data for the first time), clear graph and render
    this.listenTo(this.model, 'load', this.reRender );

    // NOTE: this doesn't work, b/c the graph model doesn't register changes to it's nodes/edges collections
      // how to have these events propagate?
    // this.listenTo(this.model, 'update', function(graph){
    // this.listenTo(this.model.get('nodes'), 'update', _.throttle(this.render, 500, { leading: false }) );
    // this.listenTo(this.model.get('edges'), 'update', _.throttle(this.render, 500, { leading: false }) );
  },

  reRender: function(){
    this.d3el.select('g').selectAll('*').remove();
    this.render();
  },

  render: function(){
    var n = 0,
        svgCenterX = parseInt(this.d3el.style('width')) / 2,
        svgCenterY = parseInt(this.d3el.style('height')) / 2,
        nodes = this.model.get('nodes').asNodes(),
        links = this.model.get('edges').asLinks();

    

    // this.force.start();
    // for (var i = 0; i < 100; ++i){ this.force.tick(); }
    // this.force.stop();
    this.force.nodes(nodes).links(links);


    var link = this.d3el.select('g').selectAll(".link")
        .data(links)
      .enter().append("line")
        .attr("class", "link")
        .style("stroke", '#666')
        .style("stroke-width", 1);

    var node = this.d3el.select('g').selectAll(".node")
        .data(nodes)
      .enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", '#444')
        .call(this.force.drag);


    this.force.start();
        // nodes.forEach(function(d, i){
        //   d.x = svgCenterX;
        //   d.y = svgCenterY;
        // }.bind(this));

    this.force.on("tick", function() {
      // if(n === 0){ 
      // }else if(n === 1){
      // }else{
        link.attr("x1", function(d) { 
          return d.source.x; 
        })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { 
          return d.x; 
        })
            .attr("cy", function(d) { return d.y; });
      // }

      n++;
    }.bind(this));

    return this.el;
  }
});

module.exports = GraphView;
