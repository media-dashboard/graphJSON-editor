var _ = require('underscore');
var Graph = require('./models/graph');
var Node = require('./models/node');
var Edge = require('./models/edge');
var Nodes = require('./collections/nodes');
var Edges = require('./collections/edges');

// DEV
_.extend(window, {
  app: new Graph(),
  '_': _,
  Node: Node,
  Edge: Edge,
  Graph: Graph,
  Nodes: Nodes,
  Edges: Edges
});

// PRODUCTION
// window.app = new Graph();
