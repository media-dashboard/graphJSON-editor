var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');
var d3Util = require('../utils/d3_utils');

var GraphView = Backbone.View.extend({
  el: '#graph',

  initialize: function(){
    this.d3el = d3.select(this.el);
    
    this.listenTo(this.model, 'sync', function(graph, json, options){
      if( options.loading ){ 
        this.clearGraph(); 
        this.render(); 
      }
    });
    this.listenTo(this.model.nodes, 'add', function(){
      if(! this.model.loading ){ this.render(); } // don't render when loading data
    });
    this.listenTo(this.model.edges, 'add', function(){
      if(! this.model.loading ){ this.render(); } // don't render when loading data
    });
    this.listenTo(this.model, 'alter', function(){
      this.render();
    });


    this.DIMENSIONS = {
      height: d3.select('#app').style('height'),
      width: d3.select('#app').style('width')
    };

    
    this.svg = this.d3el
      .append('svg')
      .attr({
        'class': 'svgraph',
        'viewBox': "0 0 1000 1000", 
        'preserveAspectRatio': "xMinYMin meet"
      });

    this.buildGraph();
  },

  buildGraph: function(){
    this.svg.append("g");

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 6])
        .on("zoom", d3Util.zoom.bind(this.svg.select('g')) );
    this.svg.call(zoom);

    this.force = d3.layout.force()
      .size([
        parseInt(this.DIMENSIONS.width), 
        parseInt(this.DIMENSIONS.height)
      ])
      .linkStrength(0.1)
      .friction(0.9)
      .linkDistance(80)
      .charge(-100)
      .gravity(0.1)
      .theta(0.8)
      .alpha(0.1);
  },

  clearGraph: function(){
    this.d3el.select('g').selectAll('*').remove();
  },

  render: function(){
    var svgCenterX = parseInt(this.DIMENSIONS.width) / 2,
        svgCenterY = parseInt(this.DIMENSIONS.height) / 2,
        nodes = this.model.nodes.toJSON(),
        links = this.model.edges.toJSON();

    // update d3.force object
    this.force.nodes(nodes).links(links);

    // update node and link SVGs
    this.linkSVGs = this.d3el.select('g').selectAll(".link")
        .data(links, function(d,i){ return i; });
    this.linkSVGs.enter().append("line")
        .attr("class", "link")
        .style("stroke", '#666')
        .style("stroke-width", 1);
    this.linkSVGs.exit().remove();

    this.nodeSVGs = this.d3el.select('g').selectAll(".node")
        .data(nodes, function(d,i){ return i; });
    this.nodeSVGs.enter().append("circle")
        .attr("class", "node")
        .attr("r", 5)
        .style("fill", '#444')
        .call(this.force.drag);
    this.nodeSVGs.exit().remove();

    // Initialize all nodes' location to the center of the graph window
    // Why in the fuck doesn't this work?
    // nodes.forEach(function(d, i){
    //   d.x = 0; //svgCenterX;
    //   d.y = 0; //svgCenterY;
    // }.bind(this));

    this.force.start();

    this.force.on("tick", this.forceTick.bind(this));

    return this.el;
  },

  forceTick: function(){
    this.linkSVGs
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    this.nodeSVGs
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }
});

module.exports = GraphView;
