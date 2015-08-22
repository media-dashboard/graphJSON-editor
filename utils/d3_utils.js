var d3 = require('d3');
var _ = require('underscore');

module.exports = {
  // zoom: function(){
  //   d3.select(this).attr('transform', 'translate('
  //     + d3.event.translate
  //     + ')scale(' + d3.event.scale + ')');
  // }
  zoom: function(){
    this.attr("transform", "translate(" 
        + d3.event.translate 
        + ")scale(" + d3.event.scale + ")");
  }
  // zoom: function(){
  //   // var svg = this.svg,
  //   //     height = parseInt(svg.style('height')),
  //   //     width = parseInt(svg.style('width'));

  //   var zoomHandler = function(){
  //     var height = _.once(function(){
  //       return parseInt(this.svg.style('height'));
  //     }).bind(this).call();
  //     var width = _.once(function(){
  //       return parseInt(this.svg.style('width'));
  //     }).bind(this).call();

  //     this.svg.style({
  //       // 'transform': 'scale(' + d3.event.scale + ') translate(' + d3.event.translate + ')',
  //       'transform': 'scale(' + d3.event.scale + ')',
  //       'height': height / d3.event.scale,
  //       'width': width / d3.event.scale
  //     });
  //   };

  //   return d3.behavior.zoom().on('zoom', zoomHandler.bind(this));
  // }
};
