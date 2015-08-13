var Backbone = require('backbone');

var Edge = Backbone.Model.extend({
  initialize: function(){},

  validate: function(attrs, options){
    if(!attrs.startNode || !attrs.endNode){ 
      return 'Edge must have a startNode and endNode'; 
    }
  },

  addToGraph: function(graph){
    graph.addEdge(this);
    return this;
  }
});

module.exports = Edge;

// var Edge = function(startNode, endNode, attrs){
//   if(!startNode || !endNode){ throw Error('Edge must have a startNode and endNode'); }
//   this._attributes = attrs || {};
//   this._startNode = startNode;
//   this._endNode = endNode;
// };
// Edge.prototype.get = function(key){
//   return this._attributes[key];
// };
// Edge.prototype.set = function(key, value){
//   this._attributes[key] = value;
//   return this;
// };
// Edge.prototype.getStartNode = function(){
//   return this._startNode;
// };
// Edge.prototype.getEndNode = function(){
//   return this._endNode;
// };
// Edge.prototype.addToGraph = function(graph){
//   graph.addEdge(this);
//   return this;
// };

