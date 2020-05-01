"use strict";

var add_man_cur_variants = function (data) {

  let resItems = [];
  let sourceurl = "https://bigd.big.ac.cn/ncov/variation/annotation";
  let resCat = ["CNCB_VARIANTS", resItems];
  let accession = __alignment.uniprot;

  // chech if we can load annotations for this accession
  if (__cvData == null) return;

  if (__cvData.forEach) {
    __cvData.forEach(function (track) {
      if (track != null)
        if (track.track_name == "Cncb_variants") {
          var data = track.data;
          // console.log("->>> CNCB_VARIANTS reading .__cvData.track");
          if (track.data.forEach) {
            track.data.forEach(function (feat) {
              feat.description = feat.mutationType + " : " + feat.mutationEffect + " @ " + feat.genomicPosition
                + "<br>" + feat.originalGenomic + " " + feat.newGenomic
                + "<br>" + "Prot. change: " + feat.reportedProtChange
                + "<br>" + feat.wildtype + " " + feat.variation
                + "<br>" + "Reported cases: " + feat.numberOfViruses;
              feat.type = feat.mutationEffect;
              // console.log("->>> CNCB_VARIANTS writing .__cvData.track.data.feat", feat);
              if (track.reference) {
                feat.description = feat.description + '<br><br><b>Data source:</b>'
                  + '&nbsp;&nbsp;<img src="' + track.fav_icon + '" width="16" height="16">'
                  + '&nbsp;&nbsp;<a href="' + track.reference + '" target="_blank">' + track.reference + '</a>'
              };
              resItems.push(feat);
            });
          };
        };
    });
  };

  data.push(resCat);

};

module.exports = add_man_cur_variants;