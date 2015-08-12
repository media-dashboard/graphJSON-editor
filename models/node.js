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

module.exports = Node;
