var render = function (template, node) {
  if (!node) return;
  node.innerHTML = typeof template === "function" ? template() : template;
};

var divider = '<div style="height:10px"></div>';

var neutral = function () {
  if (
    localStorage.getItem("tone") == "" ||
    localStorage.getItem("tone") == "-1" ||
    localStorage.getItem("tone") == "-1.0"
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
    // valid fear score value
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
    // valid
    // analytical =
    //   '<div><div class="circle" style="background-color: #235fd0"></div><span>Analytical</span><span style="color: #235fd0" id="analyticalScoreResult"></span></div><div style="height:10px"></div>';

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
    // valid
    // tentative =
    //   '<div><div class="circle" style="background-color: #6ae2cd"></div><span>Tentative</span><span style="color: #6ae2cd" id="tentativeScoreResult"></span></div><div style="height:10px"></div>';

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
    // valid
    // confident =
    //   '<div><div class="circle" style="background-color: #532d7f"></div><span>Confident</span><span style="color: #532d7f" id="confidentScoreResult"></span></div><div style="height:10px"></div>';

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
    // valid
    // anger =
    //   '<div><div class="circle" style="background-color: #d52f2e"></div><span>Anger</span><span style="color: #d52f2e" id="angerScoreResult"></span></div><div style="height:10px"></div>';

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

render(neutral, document.querySelector("#neutral"));
render(fear, document.querySelector("#fear"));
render(joy, document.querySelector("#joy"));
render(sadness, document.querySelector("#sadness"));
render(analytical, document.querySelector("#analytical"));
render(tentative, document.querySelector("#tentative"));
render(confident, document.querySelector("#confident"));
render(anger, document.querySelector("#anger"));
