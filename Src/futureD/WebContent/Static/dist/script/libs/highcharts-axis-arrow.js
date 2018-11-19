/**
 * Highcharts Axis arrow v 1.0.1 (2017-04-25)
 *
 * (c) john@jianshukeji.com
 *  
 * License: MIT
 */
(function(HC) {
  var axisProto = HC.Axis.prototype;

  // rewrite Axis.renderLine method
  axisProto.renderLine = function() {
    if (!this.axisLine) {

      this.axisLine = this.chart.renderer.path()
        .addClass('highcharts-axis-line')
        .add(this.axisGroup);

      var axisLineAttr = {
        stroke: this.options.lineColor,
        'stroke-width': this.options.lineWidth,
        fill: this.options.lineColor,
        zIndex: 7
      };

      // add Makrer-end Attr
      if (this.options.lineWidth > 0 && (this.userOptions.arrow || this.userOptions.arrow === undefined)) {

        var isXAxis = this.isXAxis,
          reversed = !isXAxis,
          uniqueKey = this.options.lineColor,
          arrowId = null;

        if (this.userOptions.reversed) {
          reversed = !reversed;
        }

        // deal with linkedTo Option
        if (this.userOptions.linkedTo !== undefined) {
          var linkedAxis = typeof this.userOptions.linkedTo === 'number' ?
            this.chart[isXAxis ? 'xAxis' : 'yAxis'][this.userOptions.linkedTo] :
            this.chart[isXAxis ? 'xAxis' : 'yAxis'][this.index - 1];

          if (linkedAxis && linkedAxis.userOptions.reversed) {
            reversed = !reversed;
          }
        }

        if (reversed) {
          uniqueKey += 'r';
        }
        arrowId = this.chart.arrows && this.chart.arrows[uniqueKey];

        // and marker to defs
        if (!arrowId) {
          var chart = this.chart,
            renderer = chart.renderer,
            arrowId = HC.uniqueKey(),
            path = ['M', '2', '2', 'L', '10', '6', 'L', '2', '10', 'L', '6', '6', 'L', '2', '2'],
            arrow = renderer.createElement('marker').attr({
              id: arrowId,
              markerUnits: "strokeWidth",
              markerWidth: 12,
              markerHeight: 12,
              viewBox: '0 0 12 12',
              refX: 6,
              refY: 6,
              orient: 'auto'
            }).add(renderer.defs);

          if (reversed) {
            path = ['M', '10', '2', 'L', '2', '6', 'L', '10', '10', 'L', '6', '6', 'L', '10', '2'];
          }

          renderer.path(path)
            .attr({
              fill: this.options.lineColor,
            }).add(arrow);

          if (!this.chart.arrows) {
            this.chart.arrows = {};
          }
          this.chart.arrows[uniqueKey] = arrowId;
        }

        axisLineAttr[reversed ? 'marker-start' : 'marker-end'] = 'url(#' + arrowId + ')';
      }

      this.axisLine.attr(axisLineAttr);
    }
  };
}(Highcharts));