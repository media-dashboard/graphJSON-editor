var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');

var NodeListItem = Backbone.View.extend({
  
  className: 'nodeItem',

  initialize: function(){
  },

  template: _.template('<span><%= id %></span> : <em><%= attr %></em>'),

  render: function(){ 
    var listItem = this.template({ id: this.model.cid, attr: this.model.get('name') });
    this.$el.html(listItem);
    return this.el;
  }
});

module.exports = NodeListItem;
