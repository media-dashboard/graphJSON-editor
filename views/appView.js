var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var GraphView = Backbone.View.extend({
  el: '#app',

  initialize: function(){
    this.render();
  },

  render: function(){
    this.$el.append(this.model.graphView.render());
  }
});

module.exports = GraphView;
