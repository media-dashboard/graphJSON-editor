var Backbone = require('backbone');
var Edge = require('../models/edge');

var Edges = Backbone.Collection.extend({
  model: Edge,

  asLinks: function(){
    return this.models.map(function(model){
      return model.omit('sourceNode', 'targetNode');
    });
  }
});

module.exports = Edges;
