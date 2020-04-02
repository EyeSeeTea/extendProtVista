"use strict";

var add_em_resolution = function (_n){
  // returns asa_res, a collection to hold protvista like data:[EM_RESOLUTION, [{type:"VARIANT", pos:0, variants:[]})
  // variants are filled with top.em_resolution coming from an ajax request
  var asa_res = null;
  if( !imported_flag && top.asa_residues ){
    var n_model = top.n_model_main_frame-1;
    if(_n)n_model = _n-1;
    var em_res = ["EM_RESOLUTION",[]];
    var n = 1;
    // Prepares the collection for a later completion
    for(var i = 0;i<__alignment.uniprotLength+1;i++){
      var __f = { type: "VARIANT", pos: i, variants: [] };
      em_res[1].push(__f);
      n++;     
    }
    var chain = JSON.parse(  getParameterByName('alignment') )['chain'];
    if(top.em_resolution[n_model][chain]){
      var n = 0;
      // For each em_resolution (added by the caller of this function) from an ajax request.
      top.em_resolution[n_model][chain].forEach(function(i){
        var r = parseInt(i[1]*255);
        if(r>255)r=255;
        var b = 255-r;
        if(b<0)b = 0;
        var color = 'rgb('+r+',0,'+b+')';
        var rasa = parseFloat(i[1]*100).toFixed(2);
        if(em_res[1][ parseInt(i[0]) ]){
          // Fill empty variants attribute at asa_res[0][pos].variants
          em_res[1][ parseInt(i[0]) ].variants = [{ color:color,
                                                     alternativeSequence:'', 
                                                     type:'measure', 
                                                     begin: i[0], 
                                                     end: i[0], 
                                                     score:i[1], 
                                                     internalId:'asa_'+n, 
                                                     description:'<b style=\"color:grey;\">Relative accessible surface area</b><br/>Residue accesibility '+rasa+'%'
          }];
        }
        n++;
      });
    }
  }
  return asa_res;
};

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

module.exports = add_em_resolution;
