var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');

var NodeListItem = require('../views/nodeLi');

var SideView = Backbone.View.extend({
  el: '#sidebar',

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
      // TODO: handle views via D3
      // this.d3el.select('#graph-elements').append( new NodeListItem({ model: node }) );
      this.$el.append( new NodeListItem({ model: node }).render() );
    }, this);

    return this.el;
  }
});

module.exports = SideView;
