var Backbone = require('backbone');
var Edges = require('../collections/edges');
var _ = require('underscore');

var Node = Backbone.Model.extend({
  initialize: function(){
    if(! this.get('id') ){
      this.set('id', this.constructor.generateId());
    }
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

  // traverseGraph: function(fn, options){
  //   fn = fn || _.noop;
  //   options = _.defaults(options, {
  //     depth: 1,
  //     callOnEdges: false,
  //     collect: true
  //   });

  //   var nodes = function recursiveWalk(root, depth){
  //     // TODO: allow users to specify DFS vs BFS
  //     // TODO: this can be optimized by not running full lookups every time -- backbone.relational might help
  //     if(root.get('walked')){
  //       return [];
  //     }
  //     if(depth === options.depth){ 
  //       return options.collect ? root : []; 
  //     }
      
  //     root.set('walked', true);

  //     return root.getNeighbors().reduce(function(accumulatedNodes, node){
  //       fn.apply(node, [depth, 'node']);
        
  //       var nodes = recursiveWalk(node, depth + 1);
  //       // node.set('walked', false);

  //       return accumulatedNodes.concat(nodes);
  //     }, []);

  //     return nodes;
  //   }.apply(null, [this, 0]);
    
  //   // reset all nodes.walked property
  //   nodes.forEach(function(node){ node.set('walked', false); });
  //   return nodes;

  // },

  // traverseGraph: function(fn, options, _currentDepth){
  //   // TODO: allow users to specify DFS vs BFS
  //   // TODO: allow users to specify direction: upstream/downstream
  //   // TODO: this can be optimized by not running full lookups every time -- backbone.relational might help
  //   fn = fn || _.noop;
  //   options = _.defaults(options, {
  //     depth: 1,
  //     collect: true,
  //   });
  //   _currentDepth = _currentDepth || 0;

  //   if(this.get('walked')){
  //     return [];
  //   }
  //   if(_currentDepth === options.depth){ 
  //     return options.collect ? this : []; 
  //   }

  //   fn.apply(this, [_currentDepth, 'node']);

  //   this.set('walked', true);

  //   // TODO: test if faster via non-functional approach
  //   var nodesEdges = this.getEdges().reduce(function(accumulatedNodesEdges, edge){
  //     if(edge.get('walked')){
  //       return accumulatedNodesEdges;
  //     }

  //     fn.apply(edge, [_currentDepth, 'edge']);
  //     edge.set('walked', true);

  //     var sourceSubNodes = app.graph.nodes
  //       .findWhere({ id: edge.get('source') })
  //       .traverseGraph(fn, _.clone(options), _currentDepth + 1);
      
  //     var targetSubNodes = app.graph.nodes
  //       .findWhere({ id: edge.get('target') })
  //       .traverseGraph(fn, _.clone(options), _currentDepth + 1);

  //     return accumulatedNodesEdges.concat(edge, sourceSubNodes, targetSubNodes);
  //   }, []);

  //   // reset node.walked before exiting
  //   if(_currentDepth === 0){
  //     function resetWalked(nodeEdge){ nodeEdge.set('walked', false); }
  //     app.graph.nodes.each(resetWalked);
  //     app.graph.edges.each(resetWalked);
  //   }
  //   return nodesEdges;
  // },

  // traverseGraph: function(fn, options, _results, _currentDepth){
  //   // TODO: allow users to specify DFS vs BFS
  //   // TODO: allow users to specify direction: upstream/downstream
  //   // TODO: this can be optimized by not running full lookups every time -- backbone.relational might help
  //   fn = fn || _.noop;
  //   options = _.defaults(options, {
  //     depth: 1,
  //     collect: true,
  //   });
  //   _results = _results || [];
  //   _currentDepth = _currentDepth || 0;

  //   if( this.get('walked') || _currentDepth === options.depth ){
  //     return;
  //   }

  //   fn.apply(this, [_currentDepth, 'node']);
  //   this.set('walked', true);
  //   _results.push(this);

  //   var edges = this.getEdges();
  //   for(var i=0; i<edges.length; i++){
  //     var edge = edges[i];
  //     if(edge.get('walked')){ continue; }

  //     fn.apply(edge, [_currentDepth, 'edge']);
  //     edge.set('walked', true);
  //     _results.push(edge);

  //     app.graph.nodes
  //       .findWhere({ id: edge.get('source') })
  //       .traverseGraph(fn, _results, _.clone(options), _currentDepth + 1);
      
  //     app.graph.nodes
  //       .findWhere({ id: edge.get('target') })
  //       .traverseGraph(fn, _results, _.clone(options), _currentDepth + 1);
  //   }

  //   // reset node.walked before exiting
  //   if(_currentDepth === 0){
  //     function resetWalked(nodeEdge){ nodeEdge.set('walked', false); }
  //     app.graph.nodes.each(resetWalked);
  //     app.graph.edges.each(resetWalked);
  //   }
  //   return _results;
  // },

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
      
      if(currentDepth < options.depth){
        var edges = node.getEdges();
        for(var i=0; i<edges.length; i++){
          if( !edges[i].get('walked') ){
            // walk edge
            fn.apply(edges[i], [currentDepth, 'edge']);
            edges[i].set('walked', true);
            results.edges.push(edges[i]);
            
            // add all of edge's nodes to queue
            var sourceNode = app.graph.nodes.findWhere({ id: edges[i].get('source') }),
                targetNode = app.graph.nodes.findWhere({ id: edges[i].get('target') });

            if(!sourceNode.get('walked')){
              sourceNode.set('walked', true);
              sourceNode.set('depth', currentDepth + 1);
              nodeQueue.push(sourceNode);
            }
            if(!targetNode.get('walked')){
              targetNode.set('walked', true);
              targetNode.set('depth', currentDepth + 1);
              nodeQueue.push(targetNode);
            }

          }
        }
      }

    }

    // reset node.walked before exiting
    function resetWalkedAndDepth(nodeEdge){ 
      nodeEdge.set('walked', false);
      nodeEdge.set('depth', null);
    }
    results.nodes.forEach(resetWalked);
    results.edges.forEach(resetWalked);
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
