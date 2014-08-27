Template.postPage.rendered = function () {

  var scores = this.data.scores;
  var post = this.data.post;

  if (scores && scores.length > 1 && post.votes > 1) {

    var map = {
      x: "created_at",
      y: "votes"
    };

    var minX = Math.min.apply(Math, scores.map(function (score) {return score[map.x];})),
        maxX = Math.max.apply(Math, scores.map(function (score) {return score[map.x];})),
        maxY = Math.max.apply(Math, scores.map(function (score) {return score[map.y];})),
        lastY = scores[scores.length - 1][map.y];

    var x = d3.time.scale().domain([minX, maxX]).range([0, 7]),
        y = d3.scale.linear().domain([maxY, 1]).range([0, 7]);

    var svgContainer = d3.select(".petition-svg")
                         .append("svg")
                         .attr("class", "petition-graph hidden-xs")
                         .attr("viewBox", "0 0.5 7 7")
                         .attr("preserveAspectRatio", "xMinYMid")
                         .attr("data-toggle", "tooltip")
                         .attr("data-placement", "right")
                         .attr("title", "Number of signatures in the past week.");

    $(".petition-graph").tooltip();

    var path = d3.svg.line().x(function (score) { return x(score[map.x]); })
                            .y(function (score) { return y(score[map.y]); })
                            .interpolate("linear");

    var lineGraph = svgContainer.append("g")
                                .append("path")
                                .attr("class", "graph-path")
                                .attr("d", path(scores));

    var circle = svgContainer.append("circle")
                             .attr("class", "graph-circle")
                             .attr("cx", x(maxX))
                             .attr("cy", y(lastY))
                             .attr("r", 0.25);

  }

};
