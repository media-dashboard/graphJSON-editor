var Backbone = require('backbone');
var D3View = require('backbone.d3view');
var _ = require('underscore');
var d3 = require('d3');
var Handlebars = require('handlebars');

var NodeListItem = Backbone.D3View.extend({

  tagName: 'li',

  className: 'node-li',

  namespace: d3.ns.prefix.xhtml,

  initialize: function(){
    this.d3el = d3.select(this.el);
    this.d3el.on('click', function(){
      this.d3el.classed('expand', !this.d3el.classed('expand'));
    }.bind(this));
    this.d3el.select('i.remove').on('click', function(){
      // remove node
      // TODO: hijack BB destroy to destroy model w/o actually syncing w/ server
        // possibly by setting model.isNew = true
      // this.model.trigger('remove', this.model);
      this.model.trigger('destroy', this.model);
    }.bind(this));

    this.d3el.on('mouseenter', function(){
      this.model.trigger('hoverenter', this.model);
    }.bind(this));

    this.d3el.on('mouseleave', function(){
      this.model.trigger('hoverleave', this.model);
    }.bind(this));

    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'hoverenter', this.highlightNodeLi)
    this.listenTo(this.model, 'hoverleave', this.removeHighlightNodeLi)
  },

  // template: Handlebars.compile( $('#nodeLi').html() ),
  template: _.template(d3.select('#node-li').html()),

  highlightNodeLi: function(node){
    this.d3el.classed('hover', true);
  },

  removeHighlightNodeLi: function(node){
    this.d3el.classed('hover', false);
  },

  render: function(){
    var listItem = this.template(this.model.toJSON());
    // TODO: replace d3el.html(...) w/ d3 templating fn
    this.d3el.html(listItem);
    return this.el;
  },

  remove: function(){
    this.d3el.remove();
  }
});

module.exports = NodeListItem;
