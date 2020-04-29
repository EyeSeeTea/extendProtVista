"use strict";

var add_man_cur_ligands_diamond = function (data) {

  let resItems = [];
  let resCat = ["DRUG_SCREENING", resItems];
  let accession = __alignment.uniprot;

  // chech if we can load annotations for this accession
  if (__cvData == null) return;

  if (__cvData.forEach) {
    __cvData.forEach(function (track) {
      if (track != null)
        if (track.track_name == "Diamond_drug_screening") {
          var data = track.data;
          console.log("->>> DRUG_SCREENING reading .__cvData.track");
          if (track.data.forEach) {
            track.data.forEach(function (feat) {
              // console.log("->>> DRUG_SCREENING reading .__cvData.track.data.feat", feat);
              resItems.push(feat);
            });
          };
        };
    });
  };

  data.push(resCat);

};

module.exports = add_man_cur_ligands_diamond;