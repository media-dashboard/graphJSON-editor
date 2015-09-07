var Backbone = require('backbone');
var Edges = require('../collections/edges');
var _ = require('underscore');

var Node = Backbone.Model.extend({
  initialize: function(){
    if(! this.get('id') ){
      this.set('id', this.constructor.generateId());
    }
    this.on('clicked', function(){
      this.set('clicked', !this.get('clicked'));
      console.log(this.get('clicked'));
    });
  },

  parse: function(json, xhr){
    json.id = this.generateId(); // doesn't work
    return json;
  },

  validate: function(attrs, options){
    if(!attrs.id){
      // TODO: serialize and incirement id?
      return Error('Node must have an id');
    }
  },

  getNeighbors: function(options){
    options = options || {};

    return this.getEdges({ direction: options.direction }).reduce(function(neighbors, edge){
      return neighbors.concat(this.collection.filter(function(node){
        if(options.direction === 'upstream'){
          return node.id === edge.get('source');
        }else if(options.direction === 'downstream'){
          return node.id === edge.get('target');
        }else{
          return node.id !== this.id && ( node.id === edge.get('source') || node.id === edge.get('target') );
        }
      }, this));
    }.bind(this), []);
  },

  getEdges: function(options){
    // get all inEdges, outEdges, or all edges
    options = options || {};

    return this.collection.edges.filter(function(edge){
      if(options.direction === 'upstream'){
        return edge.get('target') === this.get('id');
      }else if(options.direction === 'downstream'){
        return edge.get('source') === this.get('id');
      }else{
        return edge.get('source') === this.get('id') || edge.get('target') === this.get('id');
      }
    }, this);
  },

  traverseGraph: function(fn, options){
    // TODO: allow users to specify DFS vs BFS
    // TODO: allow users to specify direction: upstream/downstream
    fn = fn || _.noop;
    options = options || {};
    _.defaults(options, {
      depth: 1,
      collect: true,
    });

    // TODO: build more efficient nodeQueue structure
    var nodeQueue = [this],
        results = { nodes: [], edges: [] };
    this.set('depth', 0);
    this.set('walked', true);

    while( nodeQueue.length > 0 ){
      var node = nodeQueue.shift(),
          currentDepth = node.get('depth');

      // walk node
      fn.apply(node, [currentDepth, 'node']);
      results.nodes.push(node);

      if(currentDepth === options.depth){
        continue; // reached depth, don't continue to walk edges
      }

      var edges = node.getEdges();
      for(var i=0; i<edges.length; i++){
        if( !!edges[i].get('walked') ){ continue; }

        // walk edge
        fn.apply(edges[i], [currentDepth, 'edge']);
        results.edges.push(edges[i]);
        edges[i].set('walked', true);

        // add all of edge's nodes to queue
        node.collection.filter(function(neighborNode){
          return !neighborNode.get('walked') && ( neighborNode.get('id') === edges[i].get('source') || neighborNode.get('id') === edges[i].get('target') );
        }).forEach(function(neighborNode){
          neighborNode.set('walked', true);
          neighborNode.set('depth', currentDepth + 1);
          nodeQueue.push(neighborNode);
        });
      }

    }

    // reset node.walked before exiting
    function resetWalkedAndDepth(nodeEdge){
      nodeEdge.set('walked', false);
      nodeEdge.set('depth', null);
    }
    results.nodes.forEach(resetWalkedAndDepth);
    results.edges.forEach(resetWalkedAndDepth);
    return results;
  },

}, {
  // Class Properties
  generateId: function(){
    var id = 0;
    return function(){ return id++; };
  }.call(this)
});

module.exports = Node;
