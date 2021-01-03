// Modified from the following open-source resource:
// https://bl.ocks.org/ctufts/f38ef0187f98c537d791d24fda4a6ef9

var padding = 1.5, // separation between same-color nodes
  clusterPadding = 24, // separation between different-color nodes
  maxRadius = 500,
  width = 500,
  height = 400;

d3.text("df.csv", function (error, text) {
  if (error) throw error;
  var data = d3.csv.parse(text);

  data.forEach(function (d) {
    d.size = +d["tie strength"];
  });

  //unique cluster/group id
  var cs = [];
  data.forEach(function (d) {
    if (cs.contains(d.tone) == false) {
      cs.push(d.tone);
    }
  });

  var n = data.length, // total number of nodes
    m = cs.length; // number of distinct clusters

  //create clusters and nodes
  var clusters = new Array(m);
  var nodes = [];
  for (var i = 0; i < n; i++) {
    nodes.push(create_nodes(data, i));
  }

  var force = d3.layout
    .force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0.02)
    .charge(0)
    .on("tick", tick)
    .start();

  var svgContainer = d3.select("#chart");

  var svg = svgContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Define the div for the tooltip
  var tooltip = svgContainer
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var node = svg
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("g")
    .call(force.drag); //allows you to drag the nodes

  node
    .append("circle")
    .style("fill", function (d) {
      //return color(d.cluster);
      if (d.tone == "Fear") {
        if (d.score < 0.5) {
          return "#abc593";
        } else if (d.score >= 0.5 && d.score <= 0.75) {
          return "#88b063";
        } else {
          // > 0.75
          return "#3d5c31";
        }
      } else if (d.tone == "Sadness") {
        if (d.score < 0.5) {
          return "#b8dfef";
        } else if (d.score >= 0.5 && d.score <= 0.75) {
          return "#7ec1de";
        } else {
          // > 0.75
          return "#2d6dad";
        }
      } else if (d.tone == "Analytical") {
        if (d.score < 0.5) {
          return "#a4d3fb";
        } else if (d.score >= 0.5 && d.score <= 0.75) {
          return "#49a3f0";
        } else {
          // > 0.75
          return "#235fd0";
        }
      } else if (d.tone == "Joy") {
        if (d.score < 0.5) {
          return "#fff9c9";
        } else if (d.score >= 0.5 && d.score <= 0.75) {
          return "#fdf086";
        } else {
          // > 0.75
          return "#f9d653";
        }
      } else if (d.tone == "Tentative") {
        if (d.score < 0.5) {
          return "#e0fffa";
        } else if (d.score >= 0.5 && d.score <= 0.75) {
          return "#adfcef";
        } else {
          // > 0.75
          return "#6ae2cd";
        }
      } else if (d.tone == "Confident") {
        if (d.score < 0.5) {
          return "#dbcdef";
        } else if (d.score >= 0.5 && d.score <= 0.75) {
          return "#9f7dd2";
        } else {
          // > 0.75
          return "#532d7f";
        }
      } else if (d.tone == "Anger") {
        if (d.score < 0.5) {
          return "#f9d5d0";
        } else if (d.score >= 0.5 && d.score <= 0.75) {
          return "#f2a59a";
        } else {
          // > 0.75
          return "#d52f2e";
        }
      } else {
        // tone is neutral (or other)
        return "#cecece";
      }
    })
    .attr("r", function (d) {
      return d.radius;
    })
    .on("mouseover", function (d) {
      tooltip.transition().duration(100).style("opacity", 0.9);
      tooltip
        // this is the text that will display on the div
        .html(
          d.name +
            "<br/>" +
            "<b>Tie strength</b>: " +
            d.tieStrength +
            "<br/>" +
            "<b>Overall tone</b>: " +
            d.tone +
            " " +
            d.score
        )

        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      tooltip.transition().duration(500).style("opacity", 0);
    });

  function create_nodes(data, node_counter) {
    var i = cs.indexOf(data[node_counter].tone),
      r = Math.sqrt(((i + 1) / m) * -Math.log(Math.random())) * maxRadius,
      d = {
        cluster: i,
        radius: data[node_counter].size * 30, // scale size of node
        // below is where we needed to change the name field
        name: data[node_counter].name,
        tone: data[node_counter].tone,
        score: data[node_counter].score,
        tieStrength: data[node_counter].size,
        x: Math.cos((i / m) * 2 * Math.PI) * 200 + width / 2 + Math.random(),
        y: Math.sin((i / m) * 2 * Math.PI) * 200 + height / 2 + Math.random(),
      };
    if (!clusters[i] || r > clusters[i].radius) clusters[i] = d;
    return d;
  }

  function tick(e) {
    node
      .each(cluster(2 * e.alpha * e.alpha))
      .each(collide(0.2))
      .attr("transform", function (d) {
        var k = "translate(" + d.x + "," + d.y + ")";
        return k;
      });
  }

  // Move d to be adjacent to the cluster node.
  function cluster(alpha) {
    return function (d) {
      var cluster = clusters[d.cluster];
      if (cluster === d) return;
      var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
      if (l != r) {
        l = ((l - r) / l) * alpha;
        d.x -= x *= l;
        d.y -= y *= l;
        cluster.x += x;
        cluster.y += y;
      }
    };
  }

  // Resolves collisions between d and all other circles.
  function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function (d) {
      var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
      quadtree.visit(function (quad, x1, y1, x2, y2) {
        if (quad.point && quad.point !== d) {
          var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r =
              d.radius +
              quad.point.radius +
              (d.cluster === quad.point.cluster ? padding : clusterPadding);
          if (l < r) {
            l = ((l - r) / l) * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.point.x += x;
            quad.point.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    };
  }
});

Array.prototype.contains = function (v) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === v) return true;
  }
  return false;
};
