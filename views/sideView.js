var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');

var NodeListItem = require('../views/nodeLi');

var SideView = Backbone.View.extend({
  el: '#sidebar',

  initialize: function(){
    // for debugging
    this.NodeListItem = NodeListItem;
    this.listenTo(this.model, 'load', this.render );
  },

  template: function(){

  },

  render: function(){
    this.model.get('nodes').forEach(function(node){
      this.$el.append( new NodeListItem({ model: node }).render() );
    }, this);

    return this.el;
  }
});

module.exports = SideView;
