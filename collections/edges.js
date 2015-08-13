var Backbone = require('backbone');
var Edge = require('../models/edge');

var Edges = Backbone.Collection.extend({
  model: Edge
});

module.exports = Edges;
