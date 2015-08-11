var Graph = function(){
  this.nodes = [];
  this.edges = [];
};
Graph.prototype.addNode = function(node){
  this.nodes.push(node);
};
Graph.prototype.addEdge = function(edge){
  this.edges.push(edge);
};


var Node = function(attrs){
  this.attributes = attrs || {};
  this.edges = [];
};
Node.prototype.get = function(key){
  return this.attributes[key];
};
Node.prototype.set = function(key, value){
  this.attributes[key] = value;
  return this;
};
Node.prototype.addEdge = function(edge){
  this.edges.push(edge);
  return this;
}
Node.prototype.getEdges = function(){
  return this.edges;
};


var Edge = function(attrs){
  this.attributes = attrs || {};
  this.startNode = null;
  this.endNode = null;
};
Edge.prototype.get = function(key){
  return this.attributes[key];
};
Edge.prototype.set = function(key, value){
  this.attributes[key] = value;
  return this;
};
Edge.prototype.addStartNode = function(node){
  this.startNode = node;
};
Edge.prototype.addEndNode = function(node){
  this.endNode = node;
};


module.exports = {
  Graph: Graph,
  Node: Node,
  Edge: Edge
};
