"use strict";

var add_man_cur_ppifuncmap = function (data) {

  let resItems = [];
  let resCat = ["FUNCTIONAL_MAPPING_PPI", resItems];

  let accession = __alignment.uniprot;
  // let dataset = ["P0DTC1", "P0DTD1", "P0DTC2", "P0DTC3", "P0DTC4", "P0DTC5", "P0DTC6", "P0DTC7", "P0DTD8", "P0DTC8", "P0DTC9", "P0DTD2", "P0DTD3", "A0A663DJA2"]
  // if (!dataset.includes(accession)) return;

  // chech if we can load annotations for this accession
  if (__cvData == null) return;

  if (__cvData.forEach) {
    __cvData.forEach(function (track) {
      if (track != null)
      if (track.track_name == "Functional_mapping_PPI") {
        var data = track.data;
        console.log("->>> add_man_cur_ppifuncmap reading .__cvData.track");
        if (track.data.forEach) {
          track.data.forEach(function (feat) {
            // console.log("->>> add_man_cur_ppifuncmap reading .__cvData.track.data.feat");
            resItems.push(feat);
          });
        };
      };
    });
  };

  data.push(resCat);

};

module.exports = add_man_cur_ppifuncmap;