var Backbone = require('backbone');
var _ = require('underscore');

var GraphView = Backbone.View.extend({
  className: 'graph',

  initialize: function(){},

  template: _.template('All nodes: <%= nodes.pluck(\'id\') %>'),

  render: function(){
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});

module.exports = GraphView;
