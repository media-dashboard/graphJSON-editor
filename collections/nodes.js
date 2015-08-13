var Backbone = require('backbone');
var Node = require('../models/node');

var Nodes = Backbone.Collection.extend({
  model: Node
});

module.exports = Nodes;
