"use strict";

var add_em_res = function (data){
  // Adds em resolution. "data" coming from @asyncURL at frames_annotations_controller
  let n = 1;

  // Tests data: Remove when WS ready:
  const fake_data = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]

  // Add EM_RESOLUTION category
  let resItems = [];
  let resCat = ["EM2_RESOLUTION", resItems];

  fake_data.forEach(function(i){
    let _description = "Em Resolution at position " + 1;
    _description = '<b>' + _description + '</b>';
    const resolution = (Math.random() * 6) + 1;
    const color = getColorFromResolution(resolution);

    const _f = {begin: i, end: i, color: color, description: _description, internalId: 'emres_' + n, type: 'MONORES'};
    resItems.push(_f);
    n++;
  });

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