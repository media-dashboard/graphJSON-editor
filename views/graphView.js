var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');
var $ = require('jquery');
var d3Util = require('../utils/d3_utils');

var GraphView = Backbone.D3View.extend({
  tagName: 'svg',

  initialize: function(){
    this.highlightDiffusion = 2;
    this.buildGraph();

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
    this.listenTo(this.model.nodes, 'hoverenter', this.highlightNode);
    this.listenTo(this.model.nodes, 'hoverleave', this.removeHighlightNode);
    this.listenTo(this.model.nodes, 'clicked', this.clickNode);
  },

  graphRenderCallback: function(){
    // called after the graph has been successfully rendered
    this.delegate('mouseenter', '.node', function(e,d,i){
      var node = this.model.nodes.findWhere({ id: d.id })
      node.trigger('hoverenter', node);
    }.bind(this));
    this.delegate('mouseleave', '.node', function(e,d,i){
      var node = this.model.nodes.findWhere({ id: d.id })
      node.trigger('hoverleave', node);
    }.bind(this));

    this.delegate('mousedown', '.node', function(e,d,i){
      var node = this.model.nodes.findWhere({id: d.id})
      var node = node.trigger('clicked', node);
    }.bind(this));
  },

  clickNode: function(node){
    this.d3el.selectAll('.node')
      .filter(function(d, i){
        return d.id === this.id;
      }.bind(node))
      .call(d3Util.setStyle, 'highlight');
  },

  highlightNode: function(node){
    this.d3el.selectAll('.node')
      .filter(function(d, i){
        return d.id === this.id;
      }.bind(node))
      .call(d3Util.setStyle, 'highlight')

    this.d3el.selectAll('.link')
      .filter(function(d, i){
        return d.source.id === this.id || d.target.id === this.id;
      }.bind(node))
      .call(d3Util.setStyle, 'highlight');
  },

  removeHighlightNode: function(node){
    this.d3el.selectAll('.link')
      .filter(function(d, i){
        return d.source.id === this.id || d.target.id === this.id;
      }.bind(node))
      .call(d3Util.setStyle, 'dark');

    if(node.get('clicked')){ return; }

    this.d3el.selectAll('.node')
      .filter(function(d, i){
        return d.id === this.id;
      }.bind(node))
      .call(d3Util.setStyle, 'dark');
  },

  buildGraph: function(){
    this.DIMENSIONS = {
      height: d3.select('#graph').style('height'),
      width: d3.select('#graph').style('width')
    };

    this.d3el.attr({
      'class': 'svgraph',
      'viewBox': "0 0 1000 1000",
      'preserveAspectRatio': "xMinYMin meet"
    }).append("g");

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.1, 6])
        .on("zoom", d3Util.zoom.bind(this.d3el.select('g')) );
    this.d3el.call(zoom);

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
        nodes = this.model.nodes.toJSON();

    // point each link to its source and target nodes
    var links = this.model.edges.toJSON().map(function(link){
      link.source = _.find(nodes, function(node){ return node.id === link.source; });
      link.target = _.find(nodes, function(node){ return node.id === link.target; });
      return link;
    }, this);

    // update d3.force object
    this.force.nodes(nodes).links(links).start();

    this.linkSVGs = this.d3el.select('g').selectAll(".link")
        // .data(links, function(d,i){ return d.source.id + "-" + d.target.id; });
        .data(links);

    this.linkSVGs.enter().append("line")
        .attr("class", "link");

    this.nodeSVGs = this.d3el.select('g').selectAll(".node")
        // .data(nodes, function(d,i){ return d.id; });
        .data(nodes);

    this.nodeSVGs.enter().append("circle")
        .attr("class", "node")
        .call(this.force.drag().on('dragstart', function(d){
          d3.event.sourceEvent.stopPropagation();
        }.bind(this)).on('dragend', function(d){
          // var node = this.model.nodes.findWhere({ id: d.id });
          // node.trigger('hoverleave', node);
        }.bind(this)));

    d3Util.setStyle(this.linkSVGs, 'dark');
    d3Util.setStyle(this.nodeSVGs, 'dark');

    this.linkSVGs.exit().remove();
    this.nodeSVGs.exit().remove();



    // Initialize all nodes' location to the center of the graph window
    // Why in the fuck doesn't this work?
    // nodes.forEach(function(d, i){
    //   d.x = 0; //svgCenterX;
    //   d.y = 0; //svgCenterY;
    // }.bind(this));

    // this.force.on("start", function(type, alpha){});
    this.force.on("tick", this.forceTick.bind(this));
    this.force.on("end", function(type, alpha){
      // UPDATE graph.nodes collection
      // d3.force stores calculated node attributes in each node object
      // in order for subsequent calls to graph.render() to work, the nodes
      // collection must remember these computed values
      // see: https://github.com/mbostock/d3/wiki/Force-Layout#nodes
      this.nodeSVGs.data().forEach(function(node){
        ['x', 'y', 'px', 'py', 'fixed', 'weight'].forEach(function(attr){
          var nodeModel = this.model.nodes.findWhere( {id: node.id} ).set(attr, node[attr]);
        }, this);

      }, this)
    }.bind(this));

    this.graphRenderCallback();

    return this.el;
  },

  forceTick: function(type, alpha){
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
