// helpers
_ = {};
_.flatten = function(nestedArray, result) {
  result = result || [];

  if(! Array.isArray(nestedArray)){ return nestedArray; }
  nestedArray.forEach(function(item){
    result = result.concat(flatten(item));
  });
  return result;
};
_.contains = function(list, value){
  return list.indexOf(value) !== -1;
}

// Objects
var Student = function(id, lovers, haters, classroom){
  this.id = id;
  this.lovers = lovers || [];
  this.haters = haters || [];
  this.classroom = classroom;
};
Student.prototype.loves = function(){
  var loverIds = Array.prototype.slice.call(arguments);
  var lovers = loverIds.map(function(loverId){
    if(ClassRoom.hasStudent(loverId)){
      return this.classroom.getStudent(loverId);
    }
    // if loverId doesn't exist, add a new Student to ClassRoom and return it
    var newStudent = new Student(loverId, [], [], this.classroom);
      // TOFIX: this creates a new classroom for this student, but all other students will have the old classroom
    this.classroom = this.classroom.addStudent(newStudent);
    return newStudent;
  });
  return new Student(this.id, lovers, this.haters);
};
Student.prototype.hates = function(){
  var haterIds = Array.prototype.slice.call(arguments);
  var haters = haterIds.map(function(haterId){
    if(ClassRoom.hasStudent(haterId)){
      return this.classroom.getStudent(haterId);
    }
    // if haterId doesn't exist, add a new Student to ClassRoom and return it
    var newStudent = new Student(haterId, [], [], this.classroom);
      // TOFIX: this creates a new classroom for this student, but all other students will have the old classroom
    this.classroom = this.classroom.addStudent(newStudent);
    return newStudent;
  });
  return new Student(this.id, this.lovers, haters);
};


var Pair = function(student1, student2){
  var score = 0;
  if( _.contains(student1.haters, student2) || _.contains(student2.haters, student1)){ 
    score = -1;
  }else{
    if( _.contains(student1.lovers, student2) ){ score++; }
    if( _.contains(student2.lovers, student1) ){ score++; }
  }
  this.score = score;
};

// TODO: Group should be a subclass of ClassRoom
var Group = function(){
  this.students = Array.prototype.slice.call(arguments);
};
Group.prototype.addStudents = function(){
  // takes one or more students
  // returns a new Group with new student(s) added
  return new Group(this.students.concat(Array.prototype.slice.call(arguments)));
};
Group.prototype.calcScore = function(){
  var pairScores = _.flatten(this.students.map(function(s1, idx){
    return students.slice(idx).map(function(s2){
      return new Pair(s1, s2).score;
    });
  }));

  return pairScores.reduce(function(totalScore, score){
    if(score === -1){ return -1; }
    return totalScore + score;
  }, 0);
};


var ClassRoom = function(body){
  this.body = body || {};
};
ClassRoom.prototype.hasStudent = function(id){
  return _.contains(this.body(id));
};
ClassRoom.prototype.getStudent = function(id){
  return this.body[id];
};
ClassRoom.prototype.addStudent = function(raw){
  // return a new ClassRoom with student added
  var id = raw[0],
      lovers = raw[1],
      haters = raw[2];

  // create all lovers and haters that don't yet exist (they won't yet have lovers/haters of their own)
  var nonExistantLoversHaters = lovers.concat(haters)
    .filter(function(loverHater){
      return ! _.contains(this.body, loverHater);
    }).map(function(loverHater){
      return new Student(loverHater)
    });

  // create an object of all nonExistantLoversHaters and merge with the existing student body
  var newStudents = _.object(_.pluck(nonExistantLoversHaters, 'id'), nonExistantLoversHaters);
  var allStudents = _.extend(this.body, newStudents);

  // add newStudent with links to lovers and haters, creating it if it doesn't yet exist
  if(allStudents[id]){
    allStudents[id].lovers = lovers;
    allStudents[id].haters = haters;
  }else{
    var allStudents = _.extend(allStudents, {
      id: new Student(id, lovers, haters)
    });
  }
  return new ClassRoom(allStudents);
}


// build classroom
var raw = [
  // [id, [lovers], [haters]]
  [1, [2], []],
  [2, [1], []],
  [3, [], [1,4]],
  [4, [3], []],
  [5, [2], [4]],
  [6, [2], []],
];



