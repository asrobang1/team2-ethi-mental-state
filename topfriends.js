d3.text("topfriends.csv", function (data) {
  var parsedCSV = d3.csv.parseRows(data); // Array
  //console.log(parsedCSV)
  var container = d3
    .select("#friendtable")
    .append("table")

    .selectAll("tr")
    .data(parsedCSV)
    .enter()
    .append("tr")

    .selectAll("td")
    .data(function (d) {
      return d;
    })
    .enter()
    .append("td")
    .text(function (d) {
      return d;
    });
});
