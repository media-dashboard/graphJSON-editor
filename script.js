var _ = require('underscore');
var $ = require('jquery');
var Graph = require('./models/graph');
var Node = require('./models/node');
var Edge = require('./models/edge');
var Nodes = require('./collections/nodes');
var Edges = require('./collections/edges');
var App = require('./models/app');
var AppView = require('./views/appView');

// DEV
_.extend(window, {
  appView: new AppView({ model: new App() }),
  _: _,
  $:$, 
  Node: Node,
  Edge: Edge,
  Graph: Graph,
  Nodes: Nodes,
  Edges: Edges
});

window.app = window.appView.model;

// PRODUCTION
// window.appView = new AppView({ model: new App(); });
