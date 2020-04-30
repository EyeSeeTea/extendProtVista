"use strict";

var add_em_res = function (data){
  // Adds em resolution. "data" coming from @asyncURL  or @allURL at frames_annotations_controller
  // Coming data should be at __external_data['emlr']
  // It should be like:
  // {"data":[ { "begin": 10, "value":2.234},...]}
  if(__external_data['emlr']){
    let __lr = ["EM_VALIDATION",[]];
    let n = 1;
    __external_data['emlr'].forEach(function(item){

      item.type = "DEEPRES";
      item.color = getColorFromResolution(Math.round(item.value*100)/100);
      item.description = "Xmipp deepres value: " + item.value;
      item.internalId= 'emres_' + n;

      __lr[1].push(item);
      n++;
    });

    data.push(__lr);
  }
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