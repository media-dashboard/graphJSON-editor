var $ = require('jquery');
var Backbone = require('backbone');  Backbone.$ = $;
var _ = require('underscore');

var Graph = require('./models/graph');
var Node = require('./models/node');
var Edge = require('./models/edge');

var App = Backbone.Model.extend({
  initialize: function(){
    this.classRoom = new Graph();

    rawStudents.map(function(rawStudent){
      var classRoom = this.classRoom;
      // create student, unless otherwise exists
      var student = classRoom.hasNode(rawStudent.id) ? classRoom.getNode(rawStudent.id) : new Node({ id: rawStudent.id }).addToGraph(classRoom);
      
      rawStudent.lovers.forEach(function(loverId){
        // get lover if exists, otherwise create
        var lover = classRoom.hasNode(loverId) ? classRoom.getNode(loverId) : new Node({ id: loverId }).addToGraph(classRoom);
        var edge = new Edge({
          startNode: student, 
          endNode: lover,
          attraction: 1
        }).addToGraph(classRoom);
        student.addEdge(edge);
      });
      rawStudent.haters.forEach(function(haterId){
        // get lover if exists, otherwise create
        var hater = classRoom.hasNode(haterId) ? classRoom.getNode(haterId) : new Node({ id: haterId }).addToGraph(classRoom);
        var edge = new Edge({
          startNode: student, 
          endNode: hater,
          attraction: -1
        }).addToGraph(classRoom);
        student.addEdge(edge);
      });
    }.bind(this));

  },

  summarize: function(){
    _.each(this.classRoom.get('nodes'), function(student, id){
      function getAttractions(student, attractionVal){
        return _.chain(student.get('edges')).filter(function(edge){ 
            return edge.get('attraction') === attractionVal;
          }).map(function(edge){
            return edge.get('endNode').get('id');
          }).value();
      }

      var lovers = getAttractions(student, 1),
          haters = getAttractions(student, -1);

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
    
  }
});

window.app = new App();
window._ = _;
