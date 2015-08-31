var Backbone = require('backbone');
var Edges = require('../collections/edges');
var _ = require('underscore');

var Node = Backbone.Model.extend({
  initialize: function(){
    if(! this.get('id') ){
      this.set('id', this.constructor.generateId());
    }
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

  getNeighbors: function(options){
    options = options || {};

    return this.getEdges({ direction: options.direction }).reduce(function(neighbors, edge){
      return neighbors.concat(this.collection.filter(function(node){
        if(options.direction === 'upstream'){
          return node.id === edge.get('source');
        }else if(options.direction === 'downstream'){
          return node.id === edge.get('target');
        }else{
          return node.id !== this.id && ( node.id === edge.get('source') || node.id === edge.get('target') );
        }
      }, this));
    }.bind(this), []);
  },

  getEdges: function(options){
    // get all inEdges, outEdges, or all edges
    options = options || {};

    return this.collection.edges.filter(function(edge){
      if(options.direction === 'upstream'){
        return edge.get('target') === this.get('id');
      }else if(options.direction === 'downstream'){
        return edge.get('source') === this.get('id');
      }else{
        return edge.get('source') === this.get('id') || edge.get('target') === this.get('id');
      }
    }, this);
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
