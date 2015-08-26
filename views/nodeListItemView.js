var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');

var NodeListItemView = Backbone.View.extend({
  
  className: 'nodeItem',

  initialize: function(){
  },

  template: function(){
    // return _.template('<span><%= id %></span> : <em><%= attributes %></em>')
    return _.template('<span>id</span> : <em>attributes</em>')
  },

  render: function(){
    console.log(this.model.cid);
    this.$el.html( this.template({ id: this.model.cid, attributes: this.model.toJSON() }) );
    return this.el;
  }
});

module.exports = NodeListItemView;
