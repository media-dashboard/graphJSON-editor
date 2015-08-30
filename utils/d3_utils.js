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
  },
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

  setStyle: function(elements, style){
    // check if elements is empty
    var n = 0;
    elements.each(function(){ ++n; });
    if(n === 0){
      console.warn('setStyle on empty selection'); 
      return;
    }

    var duration = 200;
    if(elements.attr('class') === 'node' && style === 'highlight'){
      elements.transition().duration(duration)
        .style({
          "stroke": "#7D122D",
          "stroke-width": 1,
          "fill": "#FF3B4B"
        })
        .attr({
          "r": 6
        });
    }else if(elements.attr('class') === 'node' && style === 'dark'){
      elements.transition().duration(duration)
        .style({
          "stroke": "#CCC",
          "stroke-width": 1,
          "fill": "#444"
        })
        .attr({
          "r": 5
        });
    }else if(elements.attr('class') === 'link' && style === 'highlight'){
      elements.transition().duration(duration)
        .style({
          "stroke": "#FF3B4B",
          "stroke-width": 1.6,
        });
    }else if(elements.attr('class') === 'link' && style === 'dark'){
      elements.transition().duration(duration)
        .style({
          "stroke": "#444",
          "stroke-width": 1,
        });
    }
    return elements;
  } 

};
