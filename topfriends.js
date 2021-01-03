/* Generates the code for the top friend leaderboard table */
d3.text("df_ten.csv", function (data) {
  var parsedCSV = d3.csv.parseRows(data); // Array

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
    /* If the table cell is a certain tone, we assign its color to match the IBM tone analyzer color */
    .style("color", function (d) {
      if (d == "Fear") {
        return "#3D5C31";
      } else if (d == "Sadness") {
        return "#2D6DAD";
      } else if (d == "Analytical") {
        return "#235FD0";
      } else if (d == "Joy") {
        return "#F9D653";
      } else if (d == "Tentative") {
        return "#6AE2CD";
      } else if (d == "Confident") {
        return "#532D7F";
      } else if (d == "Anger") {
        return "#D52F2E";
      }
    })
    .text(function (d) {
      return d;
    });
});
