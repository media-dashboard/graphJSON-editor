var Backbone = require('backbone');
var _ = require('underscore');
var d3 = require('d3');
require('backbone.d3view');
var GraphView = require('../views/graphView');
var SideView = require('../views/sideView');


var AppView = Backbone.D3View.extend({
  el: '#app',

  initialize: function(){
    this.render();
  },

  render: function(){
    this.graphView = new GraphView({ model: this.model.graph });
    this.sideView = new SideView({ model: this.model.graph });

    // add graphView to page

    this.el.querySelector('#graph').appendChild(this.graphView.render());
  }
});

module.exports = AppView;
