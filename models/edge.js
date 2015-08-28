var Backbone = require('backbone');

var Edge = Backbone.Model.extend({
  initialize: function(){
    if(! this.get('id') ){
      this.set('id', this.constructor.generateId());
    }
  },

  validate: function(attrs, options){
    if(!attrs.source || !attrs.target){ 
      return Error('Edge must have a source node and target node'); 
    }
  },

  parse: function(json, xhr){
    json.id = this.generateId();  // doesn't work
    return json;
  }

}, {
  // Class Properties
  generateId: function(){
    var id = 0;
    return function(){ return id++; };
  }.call(this)
});

module.exports = Edge;
