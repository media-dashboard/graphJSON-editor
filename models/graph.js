var Backbone = require('backbone');
var _ = require('underscore');
var Node = require('./node');
var Edge = require('./edge');
var Nodes = require('../collection/nodes');
var Edges = require('../collection/edges');

var Graph = Backbone.Model.extend({
  initialize: function(){
    this.set('nodes', new Nodes());
    this.set('edges', new Edges());
    raw.nodes.forEach(this.addNode.bind(this));
    raw.edges.forEach(this.addEdge.bind(this));
    this.summarize();
  },

  addNode: function(nodeJSON){
    var newNode = new Node(nodeJSON);
    this.get('nodes').add(newNode);
    return newNode;
  },

  addEdge: function(edgeJSON){
    var newEdge = new Edge(edgeJSON),
        // TODO: collection.findWhere() vs. collection.get()
        sourceNode = this.get('nodes').findWhere({ id: edgeJSON.source }),
        targetNode = this.get('nodes').findWhere({ id: edgeJSON.target });
        
    newEdge.set('sourceNode', sourceNode);
    newEdge.set('targetNode', targetNode);
    
    // adding newEdge to sourceNode allows for 'forward tracking':
      // track a node to any node it connects to
    sourceNode.get('edges').add(newEdge);
    // NOTE: adding newEdge to targetNode would allow for 'backtracking' (currently disabled): 
      // track a node to any node that connects to it
    // targetNode.get('edges').add(newEdge);
    this.get('edges').add(newEdge);
    return newEdge;
  },

  summarize: function(){
    this.get('nodes').each(function(node){
      function getAttractions(node, attractionVal){ 
        return node.get('edges')
          .filter(function(edge){ 
            return edge.get('attraction') === attractionVal; 
          }).map(function(edge){
            return edge.get('targetNode').get('id');
          });
      }

      var lovers = getAttractions(node, 1),
          haters = getAttractions(node, -1);

      if(lovers.length > 0){
        console.log("Node " + node.get('id') + " loves " + lovers.join());
      }else{
        console.log("Node " + node.get('id') + " is loveless");
      }
      if(haters.length > 0){
        console.log("Node " + node.get('id') + " hates " + haters.join());
      }else{
        console.log("Node " + node.get('id') + " is free of hate");
      }
    });    
  }

});

module.exports = Graph;
