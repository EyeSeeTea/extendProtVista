"use strict";

var add_man_cur_variants = function (data) {

  let resItems = [];
  let sourceurl = "https://bigd.big.ac.cn/ncov/variation/annotation";
  let resCat = ["CNCB_VARIANTS", resItems];
  let accession = __alignment.uniprot;

  // chech if we can load annotations for this accession
  if (__cvData == null) return;

  var bfeat = {};
  if (__cvData.forEach) {
    __cvData.forEach(function (track) {
      if (track != null)
        if (track.track_name == "Cncb_variants") {
          var data = track.data;
          // console.log("->>> CNCB_VARIANTS reading .__cvData.track");
          if (track.data.forEach) {
            track.data.forEach(function (feat) {
              // console.log("->>> CNCB_VARIANTS reading .__cvData.track.data.feat", feat);
              bfeat = {
                "begin": feat.begin, "end": feat.end, "color": feat.color,
                "description": feat.mutationType + " : " + feat.mutationEffect + " @ position: " + feat.genomicPosition + " " + feat.originalGenomic + " > " + feat.newGenomic + "; Prot. change: " + feat.reportedProtChange + feat.wildtype + feat.variation + "; reported cases: " + feat.numberOfViruses,
                "type": feat.mutationEffect
              };
              // console.log("->>> CNCB_VARIANTS writing .__cvData.track.data.bfeat", bfeat);
              resItems.push(bfeat);
            });
          };
        };
    });
  };

  data.push(resCat);

};

module.exports = add_man_cur_variants;