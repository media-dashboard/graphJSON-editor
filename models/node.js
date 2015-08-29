var Backbone = require('backbone');
var Edges = require('../collections/edges');

var Node = Backbone.Model.extend({
  initialize: function(){
    if(! this.get('id') ){
      this.set('id', this.constructor.generateId());
    }
    this.on('lihoverenter', function(){
      this.collection.trigger('lihoverenter', this);
    })
  },

  parse: function(json, xhr){
    json.id = this.generateId(); // doesn't work
    return json;
  },

  validate: function(attrs, options){
    if(!attrs.id){ 
      // TODO: serialize and incirement id?
      return Error('Node must have an id'); 
    }
  },

  remove: function(model){
    // removing a node removes the associated views from the DOM, 
    // but does not delete (so it can be undone)
      // don't know why this needs to be specified, as it should be automatic
    this.collection.trigger('remove', this);
  }

}, {
  // Class Properties
  generateId: function(){
    var id = 0;
    return function(){ return id++; };
  }.call(this)
});

module.exports = Node;
