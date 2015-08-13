var Backbone = require('backbone');
var Edges = require('../collections/edges');

var Node = Backbone.Model.extend({
  initialize: function(){
    // outEdges originate from this node and lead to another node
      // to allow for forward tracking
    this.set('outEdges', new Edges());
    // inEdges originate from other nodes and lead to this one
      // to allow for back tracking
    this.set('inEdges', new Edges());
  },

  validate: function(attrs, options){
    if(!attrs.id){ 
      // TODO: serialize and incirement id?
      return Error('Node must have an id'); 
    }
  },
});

module.exports = Node;
