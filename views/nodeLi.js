var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');

var NodeListItem = Backbone.View.extend({
  
  className: 'nodeItem',

  initialize: function(){
    this.d3el = d3.select(this.el);

    this.d3el.on('click', function(){
      // remove node
      // TODO: hijack BB destroy to destroy model w/o actually syncing w/ server
        // possibly by setting model.isNew = true
      // this.model.trigger('remove', this.model);
      this.model.trigger('destroy', this.model);
    }.bind(this));

    this.d3el.on('mouseenter', function(){
      this.model.trigger('lihoverenter', this.model);
    }.bind(this));

    this.d3el.on('mouseleave', function(){
      this.model.trigger('lihoverleave', this.model);
    }.bind(this));

    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'nodehoverenter', this.highlightNodeLi)
    this.listenTo(this.model, 'nodehoverleave', this.removeHighlightNodeLi)
  },

  template: _.template('<span><%= id %></span> : <em><%= attr %></em>'),

  highlightNodeLi: function(node){
    this.d3el.classed('hover', true);
  },

  removeHighlightNodeLi: function(node){
    this.d3el.classed('hover', false);
  },

  render: function(){ 
    var listItem = this.template({ id: this.model.id, attr: this.model.get('name') });
    // TODO: replace d3el.html(...) w/ d3 templating fn
    this.d3el.html(listItem);
    return this.el;
  },

  remove: function(){
    this.d3el.remove();
  }
});

module.exports = NodeListItem;
