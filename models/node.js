var Backbone = require('backbone');
var Edges = require('../collections/edges');

var Node = Backbone.Model.extend({
  initialize: function(){
    if(! this.get('id') ){
      this.set('id', this.constructor.generateId());
    }
    // this.on('destroy', this.destroy);
    // this.on('destroy', function(){
    //   this.destroy({sync: false});
    // });
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

  // destroy: function(options){
  //   // overwrite model.destroy to prevent model from trying to sync w/ server
  //   if(options.sync){ 
  //     // TODO: blow away history
  //     this.constructor.destroy(); 
  //   }else{
  //     this.stopListening();
  //     this.trigger('destroy', this, this.collection, options);
  //   }
  // },

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
