var Graph = function(){
  this._nodes = {};
  this._edges = [];
};
Graph.prototype.addNode = function(node){
  this._nodes[node.get('id')] = node;
  return this;
};
Graph.prototype.addEdge = function(edge){
  this._edges.push(edge);
  return this;
};
Graph.prototype.hasNode = function(id){
  // return _.contains(_.pluck(this._nodes, 'id'), id);
  return !!this._nodes[id];
};
Graph.prototype.getNode = function(id){
  return this._nodes[id];
};
Graph.prototype.getEdges = function(){
  return this._edges;
};


var Node = function(attrs){
  if(! attrs.id){ throw Error('Node must have an id attribute'); }
  this._attributes = attrs;
  this._edges = [];
};
Node.prototype.get = function(key){
  return this._attributes[key];
};
Node.prototype.set = function(key, value){
  this._attributes[key] = value;
  return this;
};
Node.prototype.addEdge = function(edge){
  this._edges.push(edge);
  return this;
};
Node.prototype.getEdges = function(){
  return this._edges;
};
Node.prototype.addToGraph = function(graph){
  graph.addNode(this);
  return this;
};


var Edge = function(startNode, endNode, attrs){
  if(!startNode || !endNode){ throw Error('Edge must have a startNode and endNode'); }
  this._attributes = attrs || {};
  this._startNode = startNode;
  this._endNode = endNode;
};
Edge.prototype.get = function(key){
  return this._attributes[key];
};
Edge.prototype.set = function(key, value){
  this._attributes[key] = value;
  return this;
};
Edge.prototype.getStartNode = function(){
  return this._startNode;
};
Edge.prototype.getEndNode = function(){
  return this._endNode;
};
Edge.prototype.addToGraph = function(graph){
  graph.addEdge(this);
  return this;
};


module.exports = {
  Graph: Graph,
  Node: Node,
  Edge: Edge
};
