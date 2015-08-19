var Backbone = require('backbone');
var Node = require('../models/node');

var Nodes = Backbone.Collection.extend({
  model: Node,

  asNodes: function(){
    return this.models.map(function(model){
      return model.omit('inEdges', 'outEdges');
    });
  }
});

module.exports = Nodes;
