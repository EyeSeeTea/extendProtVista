"use strict";

var add_man_cur_ligfuncmap = function (data) {

  let resItems = [];
  let resCat = ["FUNCTIONAL_MAPPING_LIGANDS", resItems];
  let accession = __alignment.uniprot;

  // chech if we can load annotations for this accession
  if (__cvData == null) return;

  if (__cvData.forEach) {
    __cvData.forEach(function (track) {
      if (track != null)
      if (track.track_name == "Functional_mapping_Ligands") {
        var data = track.data;
        console.log("->>> FUNCTIONAL_MAPPING_LIGANDS reading .__cvData.track");
        if (track.data.forEach) {
          track.data.forEach(function (feat) {
            // console.log("->>> FUNCTIONAL_MAPPING_LIGANDS reading .__cvData.track.data.feat");
            resItems.push(feat);
          });
        };
      };
    });
  };

  data.push(resCat);

};

module.exports = add_man_cur_ligfuncmap;