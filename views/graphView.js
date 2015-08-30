var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');
var $ = require('jquery');
var d3Util = require('../utils/d3_utils');

var GraphView = Backbone.View.extend({
  el: '#graph',

  initialize: function(){
    this.d3el = d3.select(this.el);
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
    this.listenTo(this.model.nodes, 'lihoverenter', this.highlightNode);
    this.listenTo(this.model.nodes, 'lihoverleave', this.removeHighlightNode);


    // Events

    // TODO, rewrite this in D3 (accessing the node's data would be cleaner in D3)
    this.$el.on('mouseenter', '.node', function(e){
      var node = this.model.nodes.get(e.target.__data__.id);
      node.trigger('nodehoverenter', node);
      this.highlightNode(node);
    }.bind(this));
    this.$el.on('mouseleave', '.node', function(e){
      var node = this.model.nodes.get(e.target.__data__.id);
      node.trigger('nodehoverleave', node);
      this.removeHighlightNode(node);
    }.bind(this));

    //////////////////////////////
    // this works
    // setTimeout(function(){
    //   this.d3el.selectAll('.node')
    //     .on('mouseenter', function(){
    //       console.log('mouseenter')
    //     })
    // }.bind(this), 2000)

    //////////////////////////////
    // this doesn't
    // this.d3el.on('mouseenter', function(){
    //   // delegate mouseenter event to all nodes
    //   console.log(d3.event.target.classList);
    //   var target = d3.event.target;
    //   d3.select(target).selectAll('.node')
    //   // if(d3.event.target.tagName === 'circle'){
    //   //   console.log(this);
    //   // }
    // });

    //////////////////////////////
    // NOR DOES THIS
    // var delegate = function(el, type, selector, callback){
    //   el = typeof el === 'string' ? document.querySelector(el) : el;
    //   if(!el){ return; }
    //   el.addEventListener(type, function(e){
    //     var node = e.target;
    //     while(node && node !== el){
    //       if(node.matches(selector)){
    //         callback.call(node, event);
    //       }
    //       node = node.parentNode;
    //     }
    //   })
    // };
    //
    // delegate(this.el, 'mouseenter', '.node', function(e){
    //   console.log(e);
    // });

    //////////////////////////////
    // NOR DOES THIS
    // EVENT DELEGATION D3: https://groups.google.com/forum/#!topic/d3-js/lpezER89BOc
    // delegate an event handler to only fire for specific elements
    // var delegate = function(target, handler) {
    //   return function() {
    //     var evtTarget = d3.event.target;
    //     if ($(evtTarget).is(target)) {
    //       handler.call(evtTarget, evtTarget.__data__);
    //     }
    //   };
    // };
    // // add to selection prototype
    // d3.selection.prototype.delegate = function(evt, target, handler) {
    //     return this.on(evt, delegate(handler, target));
    // };
  
    // this.d3el.select('g').on('mouseenter', delegate('.node' , function(){
    //   console.log('mouseenter')
    // }));

  },

  highlightNode: function(node){
    var nodeEl = this.d3el
      .selectAll('.node')
      .filter(function(d, i){
        return d.id === this.id;
      }.bind(node));

    d3Util.setStyle(nodeEl, 'highlight');

    var edgeEls = this.d3el
      .selectAll('.link')
      .filter(function(d, i){
        return d.source.id === this.id || d.target.id === this.id;
      }.bind(node));

    d3Util.setStyle(edgeEls, 'highlight');
  },

  removeHighlightNode: function(node){
    var nodeEl = this.d3el
      .selectAll('.node')
      .filter(function(d, i){
        return d.id === this.id;
      }.bind(node))

    d3Util.setStyle(nodeEl, 'dark');

    var edgeEls = this.d3el
      .selectAll('.link')
      .filter(function(d, i){
        return d.source.id === this.id || d.target.id === this.id;
      }.bind(node));

    d3Util.setStyle(edgeEls, 'dark');
  },

  buildGraph: function(){
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
        .attr("class", "link");

    d3Util.setStyle(this.linkSVGs, 'dark');

    this.linkSVGs.exit().remove();

    this.nodeSVGs = this.d3el.select('g').selectAll(".node")
        .data(nodes, function(d,i){ return i; });
    this.nodeSVGs.enter().append("circle")
        .attr("class", "node")
        .call(this.force.drag);

    d3Util.setStyle(this.nodeSVGs, 'dark');

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
