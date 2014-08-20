Template.postPage.rendered = function () {

  var scores = this.data.scores;

  if (scores && scores.length > 1) {

    var map = {
      x: "created_at",
      y: "score"
    };

    var maxX = Math.max.apply(Math,scores.map(function(o){return o[map.x];})),
        maxY = Math.max.apply(Math,scores.map(function(o){return o[map.y];})),
        lastY = scores[scores.length - 1][map.y];

    var x = d3.time.scale().domain([new Date, new Date]).nice(d3.time.day),
        y = d3.scale.linear().range([maxY, 0]);

    var svgContainer = d3.select(".post-title-graph")
                         .append("svg")
                         .attr("viewBox", "0 0 " + 1 + " " + maxY)
                         .append("g");

    var path = d3.svg.line().x(function(d) { return x(d[map.x]); })
                            .y(function(d) { return y(d[map.y]); })
                            .interpolate("linear");

    var lineGraph = svgContainer.append("path")
                                .attr("class", "graph-path")
                                .attr("d", path(scores));

    var circle = svgContainer.append("circle")
                             .attr("class", "graph-circle")
                             .attr("cx", x(maxX))
                             .attr("cy", y(lastY))
                             .attr("r", 0.25);

  }

};
