var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var _ = require('underscore');
var d3 = require('d3');
var GraphView = require('../views/graphView');
var SideView = require('../views/sideView');

var AppView = Backbone.View.extend({
  el: '#app',

  initialize: function(){
    this.render();
  },

  render: function(){
    this.graphView = new GraphView({ model: this.model.graph });
    this.sideView = new SideView({ model: this.model.graph });
  }
});

module.exports = AppView;
