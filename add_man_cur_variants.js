"use strict";

var add_man_cur_variants = function (data) {

  let resItems = [];
  let resCat = ["Genomic_Variants", resItems];

  // check if we can load annotations for this accession
  if (__cvData == null) return;

  if (__cvData.forEach) {
    __cvData.forEach(function (track) {
      if (track != null)
        if (track.track_name === "Cncb_variants") {
          if (track.data.forEach) {
            track.data.forEach(function (feat) {
              feat.description = feat.mutationType + " : " + feat.mutationEffect;
              feat.type = feat.mutationEffect;
              if (track.reference) {
                feat.reference = track.reference;
              };
              if (track.fav_icon) {
                feat.refIcon = track.fav_icon;
              };
              // Color based on occurences
              feat.color = feat.numberOfViruses > 5 ? "red" : "grey";
              // Extend tooltip
              feat.extendTooltip = customizeVariants;

              resItems.push(feat);
            });
          };
        };
    });
  };

  data.push(resCat);

};

function customizeVariants(tooltip) {
  let annot = tooltip.data;

  // Add a Genomic data:
  tooltip.addSimpleRow('Genomic data',"Position " + annot.genomicPosition + " --> " + annot.originalGenomic + " " + annot.newGenomic);
  // Protein effect
  tooltip.addSimpleRow('Protein data',annot.reportedProtChange + " --> " + annot.wildtype + " mutated to " + annot.variation);
  // Reported cases
  tooltip.addSimpleRow('Reported cases', annot.numberOfViruses);
  // Data source
  if (annot.reference) {

    var refRow = tooltip.table.append('tr');
    refRow.append('td').text('Data source');
    var reference = "";
    var icon = '';
    var valueTd = refRow.append('td');
    if (annot.refIcon) {
      var icon = valueTd.append("img");
      icon.attr("src",annot.refIcon);
      icon.attr("width",16);
      icon.attr("height",16);
    }
    var link = valueTd.append("a");
    link.attr("href",annot.reference);
    link.attr("_target","_blank");
    link.text(annot.reference);

  }
}

module.exports = add_man_cur_variants;