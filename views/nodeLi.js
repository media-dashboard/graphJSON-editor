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

    this.listenTo(this.model, 'destroy', this.remove);
  },

  template: _.template('<span><%= id %></span> : <em><%= attr %></em>'),

  render: function(){ 
    var listItem = this.template({ id: this.model.cid, attr: this.model.get('name') });
    // TODO: replace d3el.html(...) w/ d3 templating fn
    this.d3el.html(listItem);
    return this.el;
  },

  remove: function(){
    this.d3el.remove();
  }
});

module.exports = NodeListItem;
