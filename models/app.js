var Backbone = require('backbone');
var Graph = require('./graph');

// depending on the shape of things down the line, this might be able to be reincorporated into script.js
var App = Backbone.Model.extend({
  initialize: function(){
    this.graph = new Graph();
  }

});

module.exports = App;
