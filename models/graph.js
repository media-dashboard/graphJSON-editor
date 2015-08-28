var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');
var Node = require('./node');
var Edge = require('./edge');
var Nodes = require('../collections/nodes');
var Edges = require('../collections/edges');

var Graph = Backbone.Model.extend({
  initialize: function(){
    this.loading = false;

    this.nodes = new Nodes();
    this.edges = new Edges();

    this.on('request', function(graph, xhr, options){
      if(options.loading){
        console.log('started loading graph data');
        this.loading = true;
      }
    });
    this.on('sync', function(graph, json, options){
      if(options.loading){
        console.log('finished loading graph data'); // TODO: make sure this doesn't run on save
        json.nodes.forEach(this.addNode.bind(this));
        json.links.forEach(this.addEdge.bind(this));
        this.loading = false;
      }
    });

    this.listenTo(this.nodes, 'remove', function(model){
      // remove all edges associated with node
      this.edges.filter(function(edge){
        return edge.source === model.id || edge.target === model.id;
      }).trigger('remove');
      // trigger re-render on graph
      this.trigger('remove')
    });
  },

  addNode: function(nodeJSON){
    var newNode = new Node(nodeJSON);
    this.nodes.add(newNode);
    return newNode;
  },

  addEdge: function(edgeJSON){
    // will try to match edgeJSON.source to node.id, then to node index
    var newEdge = new Edge(edgeJSON),
        nodes = this.nodes,
        sourceNode = nodes.findWhere({ id: edgeJSON.source }) || nodes.at(edgeJSON.source),
        targetNode = nodes.findWhere({ id: edgeJSON.target }) || nodes.at(edgeJSON.target);
        
    // newEdge.set('sourceNode', sourceNode);
    // newEdge.set('targetNode', targetNode);
    
    // DISCUSSION ON ADDING A MODEL TO MULTIPLE COLLECTIONS https://github.com/jashkenas/backbone/issues/604
    // TODO: test whether the duplication of 'outEdges' and 'inEdges' arrays simply to append a newEdge is inefficient
      // and whether it's inefficient for each node to be associated with two collection objects
      // track a node to any node it connects to
    // sourceNode.outEdges = sourceNode.outEdges.concat(newEdge);
      // track a node to any node that connects to it
    // targetNode.inEdges = targetNode.inEdges.concat(newEdge);
    this.edges.add(newEdge);
    return newEdge;
  },

  summarize: function(){
    this.nodes.each(function(node){
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

    function getAttractions(node, attractionVal){
      return node.get('outEdges')
        .filter(function(edge){
          return edge.get('attraction') === attractionVal; 
            return edge.get('attraction') === attractionVal;
        }).map(function(edge){
          return edge.get('targetNode').get('id');
        });
    }
  }

});

module.exports = Graph;
