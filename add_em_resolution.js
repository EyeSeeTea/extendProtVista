"use strict";

var add_em_resolution = function (_n){
  // returns asa_res, a collection to hold protvista like data:[EM_RESOLUTION, [{type:"VARIANT", pos:0, variants:[]})
  // variants are filled with top.em_resolution coming from an ajax request
  //   EXAMPLE
  //   ["EM_RESOLUTION",[
  //       {"type":"VARIANT","pos":18,"variants":[{"color":"rgb(224,0,31)","alternativeSequence":"","type":"measure","begin":18,"end":18,"score":0.88,"internalId":"asa_0","description":"<b style='color:grey;'>Relative accessible surface area</b><br/>Residue accesibility 88.00%"}]},
  //       {"type":"VARIANT","pos":19,"variants":[{"color":"rgb(94,0,161)","alternativeSequence":"","type":"measure","begin":19,"end":19,"score":0.37,"internalId":"asa_1","description":"<b style='color:grey;'>Relative accessible surface area</b><br/>Residue accesibility 37.00%"}]},
  //       {"type":"VARIANT","pos":20,"variants":[{"color":"rgb(112,0,143)","alternativeSequence":"","type":"measure","begin":20,"end":20,"score":0.44,"internalId":"asa_2","description":"<b style='color:grey;'>Relative accessible surface area</b><br/>Residue accesibility 44.00%"}]}
  //   ]
  //   ]

  // How asa is querying:
  // url      --> "/compute/biopython/interface/6crv" (pdb varible)
  // response --> complex structure!
  // Try local static data
  var sData = '{"sequence": "MLPGLALLLLAAWTARALEVPTDGNAGLLAEPQIAMFCGRLNMHMNVQNGKWDS", "features": [ { "category": "MAP_RESOLUTION", "type": "LOCAL_RESOLUTION", "begin": "723", "end": "723", "value": 3.35 },{ "category": "MAP_RESOLUTION", "type": "LOCAL_RESOLUTION", "begin": "725", "end": "725", "value": 4.21 }, { "category": "MAP_RESOLUTION", "type": "LOCAL_RESOLUTION", "description": "primary tissue(s): large intestine", "begin": "727", "end": "727", "value": 3.75 } ]}';
  var resData = JSON.parse(sData)

  var em_res = null;
  if( !imported_flag ){
    var n_model = top.n_model_main_frame-1; //Model index: 1, 2, 3
    if(_n)n_model = _n-1;
    var em_res = ["EM_RESOLUTION",[]];
    var n = 1;

    // Prepares the collection for a later completion
    for(var i = 0;i<__alignment.uniprotLength+1;i++){
      var __f = { type: "VARIANT", pos: i, variants: [] };
      em_res[1].push(__f);
      n++;     
    }
    // alignment has:
    // {  "pdbList":["6crv"],
    //    "origin":"EMDB",
    //    "pdb":"6crv",
    //    "chain":"A",
    //    "uniprot":"P59594",
    //    "uniprotLength":1255,
    //    "uniprotTitle": "Spike glycoprotein",
    //    "organism": "Human SARS coronavirus",
    //    "gene_symbol":"S",
    //    "emdb":"EMD-7573"
    //  }

    // overcomplicated?? var chain = JSON.parse(  getParameterByName('alignment') )['chain']; // Get the chain A, B, C. A for the example.
    var chain = __alignment.chain ; // Get the chain A, B, C. A for the example.

    // If data from server has the chain: ASK data proposed has a sequence  but not a chain name (A)
    if(true || top.em_resolution[n_model][chain]){
      var n = 0;
      // For each em_resolution (added by the caller of this function) from an ajax request.
      resData["features"].forEach(function(i){

        var pos = i.begin

        // var r = parseInt(i[1]*255);
        // if(r>255)r=255;
        // var b = 255-r;
        // if(b<0)b = 0;
        // var color = 'rgb('+r+',0,'+b+')';
        var color = "red";
        var resolution = i.value;
        // Fill empty variants
        em_res[1][ parseInt(pos) ].variants = [{ color:color,
                                                     alternativeSequence:'', 
                                                     type:'measure', 
                                                     begin: pos,
                                                     end: pos,
                                                     score:i[1], 
                                                     internalId:'res_'+n,
                                                     description:'<b style=\"color:grey;\">Local resolution value:</b><br/>'+resolution
        }];

        n++;
      });
    }
  }
  return em_res;
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
