Template.postPage.rendered = function () {

  var prod_data = [
    { x: moment().startOf('day').subtract(7, 'days').valueOf(),
      y: 0 
    },
    { x: moment().startOf('day').subtract(6, 'days').valueOf(),
      y: 1
    },
    { x: moment().startOf('day').subtract(5, 'days').valueOf(),
      y: 3 
    },
    { x: moment().startOf('day').subtract(4, 'days').valueOf(),
      y: 3.5
    },
    { x: moment().startOf('day').subtract(3, 'days').valueOf(),
      y: 2
    },
    { x: moment().startOf('day').subtract(2, 'days').valueOf(),
      y: 2.5
    },
    { x: moment().startOf('day').subtract(1, 'days').valueOf(),
      y: 2.25
    },
  ];

  var dev_data = [
    { x:  0, y:  0 },
    { x: 10, y: 10 },
    { x: 20, y: 20 },
    { x: 30, y: 10 },
    { x: 40, y: 40 }
  ];

  var maxX = Math.max.apply(Math,dev_data.map(function(o){return o.x;}));
  var maxY = Math.max.apply(Math,dev_data.map(function(o){return o.y;}));

  var x = d3.scale.linear().domain([0, dev_data.length]).range([0, dev_data.length]);
      y = d3.scale.linear().domain([0, maxY]).range([maxY, 0]);

  var svgContainer = d3.select(".col-sm-8")
                       .append("svg")
                       .attr("class", "hidden-xs hidden-sm")
                       .attr("viewBox", "0 0 " + x(maxX) + " " + maxY)
                       .style("width", "100%")
                       .style("height", "50%")
                       .style("position", "absolute")
                       .style("left", "0")
                       .style("bottom", "0")
                       .style("overflow", "visible")
                       .append("g");

  var path = d3.svg.line().x(function(d) { return x(d.x); })
                          .y(function(d) { return y(d.y); })
                          .interpolate("linear");

  var lineGraph = svgContainer.append("path")
                              .attr("d", path(dev_data))
                              .attr("stroke", "#F36E21")
                              .attr("stroke-width", 0.5)
                              .attr("fill", "none")

  var circle = svgContainer.append("circle")
                            .attr("cx", x(maxX))
                            .attr("cy", y(maxY))
                            .attr("r", 1)
                            .attr("stroke", "#F36E21")
                            .attr("stroke-width", 1)
                            .attr("fill", "#fff");


  // rickshaw example

  // var graph = new Rickshaw.Graph( {
  //         element: document.querySelector(".col-sm-8"),
  //         interpolation: 'linear',
  //         renderer: 'line',
  //         series: [ {
  //                 color: "#F36E21",
  //                 data: data
  //         } ]
  // } );

  // graph.render();

};