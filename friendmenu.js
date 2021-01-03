// Builds a dropdown menu for you to select a friend from,
// and passes the other data fields for that friend to be displayed
// on that friend.html page
d3.csv("df.csv", function (error, data) {
  var select = d3.select("#friendmenu").append("div").append("select");

  select.on("change", function (d) {
    var fields = d3.select(this).property("value").split(",");

    var name = fields[0];
    var daysSinceBeingFriends = fields[1];
    var numMessages = fields[2];
    var daysSinceLastCommunication = fields[3];
    var tieStrength = fields[4];
    var angerScore = fields[5];
    var fearScore = fields[6];
    var joyScore = fields[7];
    var sadnessScore = fields[8];
    var analyticalScore = fields[9];
    var confidentScore = fields[10];
    var tentativeScore = fields[11];
    var tone = fields[12];
    var score = fields[13];

    localStorage.clear(); // gets rid of residual variables

    localStorage.setItem("name", name);
    localStorage.setItem("numMessages", numMessages);
    localStorage.setItem("daysSinceBeingFriends", daysSinceBeingFriends);
    localStorage.setItem(
      "daysSinceLastCommunication",
      daysSinceLastCommunication
    );
    localStorage.setItem("fearScore", fearScore);
    localStorage.setItem("joyScore", joyScore);
    localStorage.setItem("sadnessScore", sadnessScore);
    localStorage.setItem("tentativeScore", tentativeScore);
    localStorage.setItem("analyticalScore", analyticalScore);
    localStorage.setItem("angerScore", angerScore);
    localStorage.setItem("confidentScore", confidentScore);
    localStorage.setItem("tone", tone);
    localStorage.setItem("tieStrength", tieStrength);

    window.location = "friend.html";
  });

  select
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .attr("value", function (d) {
      res = [
        d.name,
        d["days since being friends"],
        d["number of messages"],
        d["days since last communication"],
        d["tie strength"],
        d.Anger,
        d.Fear,
        d.Joy,
        d.Sadness,
        d.Analytical,
        d.Confident,
        d.Tentative,
        d.tone, // overall tone
        d.score, // overall tone score
      ];
      return res;
    })
    .text(function (d) {
      return d.name;
    });
});
