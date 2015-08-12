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
Graph.prototype.getNodes = function(){
  return this._nodes;
};
Graph.prototype.getEdges = function(){
  return this._edges;
};


module.exports = Graph;
