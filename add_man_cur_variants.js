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
              feat.description = feat.mutationType + " : " + feat.mutationEffect + " @ " + feat.genomicPosition;
              feat.type = feat.mutationEffect;
              if (track.reference) {
                feat.reference = track.reference;
              };
              if (track.fav_icon) {
                feat.refIcon = track.fav_icon;
              };
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
  tooltip.addSimpleRow('Genomic data', annot.originalGenomic + " muted to " + annot.newGenomic);
  // Protein effect
  tooltip.addSimpleRow('Protein data', annot.wildtype + " muted to " + annot.variation + " :" + annot.reportedProtChange);
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
      icon.src(annot.refIcon);
      icon.width(16);
      icon.height(16);
    }
    var link = valueTd.append("a");
    link.href(annot.reference);
    link._target("_blank");
    link.text(annot.reference);

  }
}

module.exports = add_man_cur_variants;