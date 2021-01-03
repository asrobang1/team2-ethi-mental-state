/* These functions set the css for the various communication tone results to be rendered on the friend.html page */
var render = function (template, node) {
  if (!node) return;
  node.innerHTML = typeof template === "function" ? template() : template;
};

var divider = '<div style="height:10px"></div>';

var neutral = function () {
  if (
    localStorage.getItem("tone") == "" ||
    localStorage.getItem("tone") == "-1" ||
    localStorage.getItem("tone") == "-1.0" ||
    localStorage.getItem("tone") == "neutral"
  ) {
    neutral =
      '<div class="circle" style="background-color: #cecece">' +
      "</div><span>Neutral</span>" +
      divider;
  } else {
    neutral = "";
  }
  return neutral;
};

var fear = function () {
  if (
    localStorage.getItem("fearScore") != "-1" &&
    localStorage.getItem("fearScore") != "-1.0"
  ) {
    tooltipText =
      "<b>Fear:</b> A response to impending danger. It is a survival mechanism that is a reaction to some negative stimulus. It may be a mild caution or any extreme phobia";

    fear =
      '<div class="tooltipbox">' +
      '<div class="circle" style="background-color: #3d5c31">' +
      '</div><span>Fear</span><span style="color: #3d5c31" id="fearScoreResult"></span>' +
      '<span class="tooltiptext">' +
      tooltipText +
      "</span></div>" +
      divider;
  } else {
    fear = "";
  }
  return fear;
};

var joy = function () {
  if (
    localStorage.getItem("joyScore") != "-1" &&
    localStorage.getItem("joyScore") != "-1.0"
  ) {
    tooltipText =
      "<b>Joy:</b> Joy or happiness has shades of enjoyment, satisfaction and pleasure. There is a sense of well-being, inner peace, love, safety and contentment.";

    joy =
      '<div class="tooltipbox">' +
      '<div class="circle" style="background-color: #f9d653">' +
      '</div><span>Joy</span><span style="color: #f9d653" id="joyScoreResult"></span>' +
      '<span class="tooltiptext">' +
      tooltipText +
      "</span></div>" +
      divider;
  } else {
    joy = "";
  }

  return joy;
};

var sadness = function () {
  if (
    localStorage.getItem("sadnessScore") != "-1" &&
    localStorage.getItem("sadnessScore") != "-1.0"
  ) {
    tooltipText =
      "<b>Sadness:</b> Indicates a feeling of loss and disadvantage. When a person can be observed to be quiet, less energetic and withdrawn, it may be inferred that sadness exists.";

    sadness =
      '<div class="tooltipbox">' +
      '<div class="circle" style="background-color: #2d6dad">' +
      '</div><span>Sadness</span><span style="color: #2d6dad" id="sadnessScoreResult"></span>' +
      '<span class="tooltiptext">' +
      tooltipText +
      "</span></div>" +
      divider;
  } else {
    sadness = "";
  }
  return sadness;
};

var analytical = function () {
  if (
    localStorage.getItem("analyticalScore") != "-1" &&
    localStorage.getItem("analyticalScore") != "-1.0"
  ) {
    tooltipText =
      "<b>Analytical:</b> A person's reasoning and analytical attitude about things.";

    analytical =
      '<div class="tooltipbox">' +
      '<div class="circle" style="background-color: #235fd0">' +
      '</div><span>Analytical</span><span style="color: #235fd0" id="analyticalScoreResult"></span>' +
      '<span class="tooltiptext">' +
      tooltipText +
      "</span></div>" +
      divider;
  } else {
    analytical = "";
  }
  return analytical;
};

var tentative = function () {
  if (
    localStorage.getItem("tentativeScore") != "-1" &&
    localStorage.getItem("tentativeScore") != "-1.0"
  ) {
    tooltipText = "<b>Tentative:</b> A person's degree of inhibition.";

    tentative =
      '<div class="tooltipbox">' +
      '<div class="circle" style="background-color: #6ae2cd">' +
      '</div><span>Tentative</span><span style="color: #6ae2cd" id="tentativeScoreResult"></span>' +
      '<span class="tooltiptext">' +
      tooltipText +
      "</span></div>" +
      divider;
  } else {
    tentative = "";
  }
  return tentative;
};

var confident = function () {
  if (
    localStorage.getItem("confidentScore") != "-1" &&
    localStorage.getItem("confidentScore") != "-1.0"
  ) {
    tooltipText = "<b>Confident:</b> A person's degree of certainty.";

    confident =
      '<div class="tooltipbox">' +
      '<div class="circle" style="background-color: #532d7f">' +
      '</div><span>Confident</span><span style="color: #532d7f" id="confidentScoreResult"></span>' +
      '<span class="tooltiptext">' +
      tooltipText +
      "</span></div>" +
      divider;
  } else {
    confident = "";
  }
  return confident;
};

var anger = function () {
  if (
    localStorage.getItem("angerScore") != "-1" &&
    localStorage.getItem("angerScore") != "-1.0"
  ) {
    tooltipText =
      "<b>Anger:</b> Evoked due to injustice, conflict, humiliation, negligence or betrayal. If anger is active, the individual attacks the target, verbally or physically. If anger is passive, the person silently sulks and feels tension and hostility.";

    anger =
      '<div class="tooltipbox">' +
      '<div class="circle" style="background-color: #d52f2e">' +
      '</div><span>Anger</span><span style="color: #d52f2e" id="angerScoreResult"></span>' +
      '<span class="tooltiptext">' +
      tooltipText +
      "</span></div>" +
      divider;
  } else {
    anger = "";
  }
  return anger;
};

/* Sets the tooltip and tie strength percentage for the "progress bar" on the friend.html page */
var tiestrength = function () {
  tooltipOne =
    "<b>Weak ties</b> are merely acquaintances. They often provide access to novel information, information not circulating in the closely knit network of strong ties.<br><br>Weak ties are less likely to provide empathetic support, but instead provide access to new opportunities and ideas. Receiving communication from weak ties is not associated with improvements in wellbeing.";
  tooltipTwo =
    "<b>Strong ties</b> are the people you really trust, people whose social circles tightly overlap with your own. Often, they are also the people most like you!<br><br>Strong ties provide more effortful, empathic support; everyday support received from strong ties is what promotes well-being. More specifically, receiving direct communication from strong ties was linked to improvements in well-being.";
  var tiestrengthscore = localStorage.getItem("tieStrength") * 100;
  let root = document.documentElement;
  root.style.setProperty("--progressscore", tiestrengthscore + "%");
  result =
    divider +
    "<div class='progress'>" +
    "<p class='alignleft bottomtooltip'>0<span class='bottomtooltiptext'>" +
    tooltipOne +
    "</p><p class='alignright bottomtooltip'>1<span class='bottomtooltiptext'>" +
    tooltipTwo;
  ("</p></div>");
  return result;
};

render(neutral, document.querySelector("#neutral"));
render(fear, document.querySelector("#fear"));
render(joy, document.querySelector("#joy"));
render(sadness, document.querySelector("#sadness"));
render(analytical, document.querySelector("#analytical"));
render(tentative, document.querySelector("#tentative"));
render(confident, document.querySelector("#confident"));
render(anger, document.querySelector("#anger"));
render(tiestrength, document.querySelector("#tiestrength"));
