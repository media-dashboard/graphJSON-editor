var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');

var NodeListItem = require('../views/nodeLi');

var SideView = Backbone.D3View.extend({
  el: '#sidebar',

  namespace: d3.ns.prefix.xhtml,

  initialize: function(){
    // for debugging
    this.d3el = d3.select(this.el);
    this.listenTo(this.model, 'sync', function(graph, json, options){
      if( options.loading ){ this.render(); }
    });
  },

  // template: _.template(['<div class="row">', '</div>']);

  render: function(){
    this.model.nodes.forEach(function(node){
      this.d3el.select('#graph-elements').select(function(){
        // appending html elements that already exist is tricky: https://groups.google.com/forum/#!topic/d3-js/AsbOTQskipU
        return this.appendChild( new NodeListItem({ model: node }).render() );
      });
    }, this);

    return this.el;
  }
});

module.exports = SideView;
