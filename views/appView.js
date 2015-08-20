var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var GraphView = require('../views/graphView');

var AppView = Backbone.View.extend({
  el: '#app',

  initialize: function(){
    this.render();
  },

  render: function(){
    this.graphView = new GraphView({ model: this.model.graph });
    this.$el.append(this.graphView.el);
  }
});

module.exports = AppView;
