var Backbone = require('backbone');
var Graph = require('./graph');
var GraphView = require('../views/graphView');

// depending on the shape of things down the line, this might be able to be reincorporated into script.js
var App = Backbone.Model.extend({
  initialize: function(){
    this.graph = new Graph();
    this.graphView = new GraphView({ model: this.graph });
  }

});

module.exports = App;
