"use strict";

var add_man_cur_variants = function (data) {

  let resItems = [];
  let sourceurl = "https://bigd.big.ac.cn/ncov/variation/annotation";
  let resCat = ["Genomic_Variants", resItems];
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
                + "<br>" + "Prot. change: " + feat.reportedProtChange
                + "<br>" + feat.wildtype + " " + feat.variation
                + "<br>" + "Reported cases: " + feat.numberOfViruses;
              feat.type = feat.mutationEffect;
              // console.log("->>> CNCB_VARIANTS writing .__cvData.track.data.feat", feat);
              if (track.reference) {
                var icon_link = "";
                if (track.fav_icon) {
                  var icon_link = '&nbsp;&nbsp;<img src="' + track.fav_icon + '" width="16" height="16">'
                };
                feat.description = feat.description + '<br><br><b>Data source:</b>'
                  + icon_link
                  + '&nbsp;&nbsp;<a href="' + track.reference + '" target="_blank">' + track.reference + '</a>'
              };

              // Extend tooltip
              feat.extentTooltip = customizeVariants;

              resItems.push(feat);
            });
          };
        };
    });
  };

  data.push(resCat);

};

function customizeVariants(tooltip){
  let annot = tooltip.data;

  // Add a Genomic info line:
  let genRow = tooltip.table.append('tr');
  genRow.append('td').text('Genomic data');
  genRow.append('td').text(annot.originalGenomic + " muted to " + annot.newGenomic);

};

module.exports = add_man_cur_variants;