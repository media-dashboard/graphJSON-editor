var Backbone = require('backbone');
var _ = require('underscore');

var Node = Backbone.Model.extend({
  defaults: { "edges" : [] },

  initialize: function(){},

  validate: function(attrs, options){
    if(!attrs.id){ 
      // TODO: serialize and incirement id?
      return 'Node must have an id'; 
    }
  },

  addEdge: function(newEdge){
    // HACK! using get to set an attribute
    // this.get('edges').push(newEdge);
    this.set('edges', this.get('edges').concat(newEdge));
    return this;
  },

  addToGraph: function(graph){
    graph.addNode(this);
    return this;
  }

});

module.exports = Node;

// var Node = function(attrs){
//   if(! attrs.id){ throw Error('Node must have an id attribute'); }
//   this._attributes = attrs;
//   this._edges = [];
// };
// Node.prototype.get = function(key){
//   return this._attributes[key];
// };
// Node.prototype.set = function(key, value){
//   this._attributes[key] = value;
//   return this;
// };
// Node.prototype.addEdge = function(edge){
//   this._edges.push(edge);
//   return this;
// };
// Node.prototype.getEdges = function(){
//   return this._edges;
// };
// Node.prototype.addToGraph = function(graph){
//   graph.addNode(this);
//   return this;
// };

