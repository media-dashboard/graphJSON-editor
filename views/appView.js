var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;

var AppView = Backbone.View.extend({
  el: '#app',

  initialize: function(){
    this.render();
  },

  render: function(){
    this.$el.append(this.model.graphView.el);
  }
});

module.exports = AppView;
