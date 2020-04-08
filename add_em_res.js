"use strict";

var add_em_res = function (data){
  // Adds em resolution. "data" coming from @asyncURL at frames_annotations_controller
  let n = 1;

  // Tests data: Remove when WS ready: Data should come populated
  // Add EM_RESOLUTION category
  let resItems = [];
  let resCat = ["EM2_RESOLUTION", resItems];

  let resolution = 3;

  for (let i = 0; i < __alignment.uniprotLength + 1; i++) {
    let _description = "Em Resolution at position " + i;
    _description = '<b>' + _description + '</b>';

    // fake a gradient
    let sign = Math.floor(Math.random() +1);
    if (sign == 0) {
      sign == -1
    }
    resolution = resolution + (sign * 0.2);

    resolution = Math.max(2, resolution)
    resolution = Math.min(7, resolution)

    const color = getColorFromResolution(resolution);

    const _f = {begin: i, end: i, color: color, description: _description, internalId: 'emres_' + n, type: 'MONORES'};
    resItems.push(_f);
    n++;
  };

  data.push(resCat);

};

function getColorFromResolution(resolution){
  /* Return the color that corresponds to resolution value*/
  let stopColors = ["#FFFFFF", "#000080", "#0000FF", "#00FFFF",
    "#00FF00", "#FFFF00", "#FF8800", "#FF0000",
    "#000000"];

  // Get resolution integer boundaries
  let highRes = Math.floor(resolution);
  let lowRes = highRes +1;

  const highResColor = stopColors.length < highRes ? stopColors[stopColors.length-1] : stopColors[highRes];
  const lowResColor = stopColors.length < lowRes ? stopColors[stopColors.length-1] : stopColors[lowRes];

  // get the
  return getColorBetween(highResColor, lowResColor, resolution-highRes)

};

function getColorBetween(bottomColor, topColor, distanceFromBottom){
  // Returns the color between the 2 passed color at a certain distance (decimal value)
  let c = "#";
  for(let i = 0; i<3; i++) {
    const subb = bottomColor.substring(1 + 2 * i, 3 + 2 * i);
    const subt = topColor.substring(1 + 2 * i, 3 + 2 * i);
    const vb = parseInt(subb, 16);
    const vt = parseInt(subt, 16);
    const v = vb + Math.floor((vt - vb) * distanceFromBottom);
    const sub = v.toString(16).toUpperCase();
    const padsub = ('0' + sub).slice(-2);
    c += padsub;
  }
  return c
}

module.exports = add_em_res;