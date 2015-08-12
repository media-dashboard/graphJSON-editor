var g = require('./graph');
var _ = require('underscore');

// build classroom
var raw = [
  // [id, [lovers], [haters]]
  { id: 1, lovers: [2], haters: [] },
  { id: 2, lovers: [1], haters: [] },
  { id: 3, lovers: [ ], haters: [1,4] },
  { id: 4, lovers: [3], haters: [] },
  { id: 5, lovers: [2], haters: [4] },
  { id: 6, lovers: [2], haters: [] },
];

var classRoom = new g.Graph();

raw.map(function(rawStudent){
  // create student, unless otherwise exists
  var student = classRoom.hasNode(rawStudent.id) ? classRoom.getNode(rawStudent.id) : new g.Node({ id: rawStudent.id }).addToGraph(classRoom);
  
  rawStudent.lovers.forEach(function(loverId){
    // get lover if exists, otherwise create
    var lover = classRoom.hasNode(loverId) ? classRoom.getNode(loverId) : new g.Node({ id: loverId }).addToGraph(classRoom);
    var edge = new g.Edge(this, lover, {attraction: 1}).addToGraph(classRoom);
    student.addEdge(edge);
  });
  rawStudent.haters.forEach(function(haterId){
    // get lover if exists, otherwise create
    var hater = classRoom.hasNode(haterId) ? classRoom.getNode(haterId) : new g.Node({ id: haterId }).addToGraph(classRoom);
    var edge = new g.Edge(this, hater, {attraction: -1}).addToGraph(classRoom);
    student.addEdge(edge);
  });
});


var summarize = function(){
  _.chain(classRoom.getNodes()).each(function(student, id){
    function getAttractions(student, attractionVal){
      return _.chain(student.getEdges()).filter(function(edge){ 
          return edge.get('attraction') === attractionVal;
        }).map(function(edge){
          return edge.getEndNode().get('id');
        }).value();
    }

    var lovers = getAttractions(student, 1),
        haters =  getAttractions(student, -1);

    if(lovers.length > 0){
      console.log("Student " + id + " loves " + lovers.join());
    }else{
      console.log("Student " + id + " is loveless");
    }
    if(haters.length > 0){
      console.log("Student " + id + " hates " + haters.join());
    }else{
      console.log("Student " + id + " is free of hate");
    }
  });
};
summarize();
