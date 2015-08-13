var Backbone = require('backbone');

var Edge = Backbone.Model.extend({
  initialize: function(){},

  validate: function(attrs, options){
    if(!attrs.source || !attrs.target){ 
      return Error('Edge must have a source node and target node'); 
    }
  }

});

module.exports = Edge;
