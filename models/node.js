var Backbone = require('backbone');
var Edges = require('../collection/edges');

var Node = Backbone.Model.extend({
  initialize: function(){
    this.set('edges', new Edges());
  },

  validate: function(attrs, options){
    if(!attrs.id){ 
      // TODO: serialize and incirement id?
      return Error('Node must have an id'); 
    }
  },
});

module.exports = Node;
