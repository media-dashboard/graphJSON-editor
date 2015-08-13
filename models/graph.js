var Backbone = require('backbone');
var _ = require('underscore');

var Graph = Backbone.Model.extend({
  defaults: {
    "nodes": {},
    "edges": []
  },

  initialize: function(){},

  addNode: function(newNode){
    // HACK! using get to set an attribute
    this.get('nodes')[newNode.get('id')] = newNode;
    return this;
  },

  addEdge: function(newEdge){
    // HACK! using get to set an attribute
    // this.get('edges').push(newEdge);
    this.set('edges', this.get('edges').concat(newEdge));
    return this;
  },

  hasNode: function(id){
    return !!this.get('nodes')[id];
  },

  getNode: function(id){
    return this.get('nodes')[id];
  },

});

module.exports = Graph;

// var Graph = function(){
//   this._nodes = {};
//   this._edges = [];
// };
// Graph.prototype.addNode = function(node){
//   this._nodes[node.get('id')] = node;
//   return this;
// };
// Graph.prototype.addEdge = function(edge){
//   this._edges.push(edge);
//   return this;
// };
// Graph.prototype.hasNode = function(id){
//   // return _.contains(_.pluck(this._nodes, 'id'), id);
//   return !!this._nodes[id];
// };
// Graph.prototype.getNode = function(id){
//   return this._nodes[id];
// };
// Graph.prototype.getNodes = function(){
//   return this._nodes;
// };
// Graph.prototype.getEdges = function(){
//   return this._edges;
// };


