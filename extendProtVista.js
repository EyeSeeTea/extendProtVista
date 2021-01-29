"use strict";

var max_zoom = require('./max_zoom');
var extend_categories = require('./extend_categories');
var __add_uploaded_data = require('./add_uploaded_data');
var add_uploaded_data = __add_uploaded_data.add_uploaded_data;
var uploaded_data = __add_uploaded_data.uploaded_data;
var add_uploaded_variants = __add_uploaded_data.add_uploaded_variants;
var get_all_external_soruces = require('./get_all_external_soruces');
var build_variant_menu = require('./build_variant_menu');
var variant_menu = build_variant_menu.variant_menu;
var update_diseases = build_variant_menu.update_diseases;
var add_disease_menu = build_variant_menu.add_disease_menu;
var add_evidences = require('./add_evidences');
var add_asa_residues = require('./add_asa_residues');
var add_em_res = require('./add_em_res');
var add_man_cur_ppifuncmap = require('./add_man_cur_ppifuncmap');
var add_man_cur_ligfuncmap = require('./add_man_cur_ligfuncmap');
var add_man_cur_ligands_diamond = require('./add_man_cur_ligands_diamond');

var add_binding_residues = require('./add_binding_residues');
var add_coverage = require('./add_coverage');
var add_sequence_coverage = require('./add_sequence_coverage');
var add_biomuta = require('./add_biomuta');
var rename_structural_features = require('./rename_structural_features');
var rebuild_ptm = require('./rebuild_ptm');
var add_iedb = require('./add_iedb');
var add_phosphosite = require('./add_phosphosite');
var add_dbptm = require('./add_dbptm');
var highlight = require('./highlight');
var add_highlight = highlight.add_highlight;
var setup_highlight = highlight.setup_highlight;
var check_coordinates = highlight.check_coordinates;

var upgrade_fv = function(fv){
	max_zoom(fv);
	setup_highlight(fv);
        feature_viewer = fv;
};

var extend_features = function (features) {
  /* features example for pdb=1iyj, chain=A:

      0: (2) ["MOLECULE_PROCESSING", Array(1)]
      1: (2) ["SEQUENCE_INFORMATION", Array(3)]
      2: (2) ["STRUCTURAL", Array(4)]

      Data source: https://www.ebi.ac.uk/proteins/api/features/P60896
  */
  features_extended = true;
  // myProtVista/src/FeaturesViewer.js : fv.extend_features_flag = true;
  if (extend_features_flag) {
    // Adds some fields to features[].evidences (which is used to populate the tooltip)
    add_evidences(features);

    /* Uses __external_data["iedb"]
        http://3dbionotes.cnb.csic.es/api/annotations/IEDB/Uniprot/P60896
          to push track EPITOPES->Linear epitope */
    add_iedb(features);

    /* Uses __external_data["coverage"]["Structure coverage"]
        http://3dbionotes.cnb.csic.es/api/alignments/Coverage/1iyjA
        Add fragments to STRUCTURE_COVERAGE->region
        */
    add_coverage(features);

    /* IF imported_flag (from app/assets/javascripts/main_frame/import_proteins.js),
        use imported_alignment.coverage
        and add fragments to STRUCTURE_COVERAGE->region */
    add_sequence_coverage(features);

    /* From __external_data["phosphosite"]
        http://3dbionotes.cnb.csic.es/api/annotations/Phosphosite/Uniprot/P60896
        Add subtracks to PTM and DOMAINS_AND_SITES */
    add_phosphosite(features);

    /* From __external_data["dbptm"]
        http://3dbionotes.cnb.csic.es/api/annotations/dbptm/Uniprot/P60896
        Add subtracks to PTM */
    add_dbptm(features);

    /* Change property 'type' for PTM subtracks */
    rebuild_ptm(features);

    /* IF uploaded_data set, calls prepare_uploaded_data to add tracks */
    add_uploaded_data(features);

    /* From __external_data["emlr"]
        http://3dbionotes.cnb.csic.es/ws/lrs/pdbAnnotFromMap/all/6zow/A/?format=json
        Add track EM-VALIDATION. Performs some color processing for the legend */
    add_em_res(features);

    /* Uses __cvData
        http://3dbionotes.cnb.csic.es/cv19_annotations/P0DTC2_annotations.json
        On track 'Functional_mapping_PPI', Update fragment description */
    add_man_cur_ppifuncmap(features);

    /* Same, but on track 'Functional_mapping_Ligands' */
    add_man_cur_ligfuncmap(features);

    /* Same, but on track 'Diamond_drug_screening' */
    add_man_cur_ligands_diamond(features);
  }
  add_highlight(features);
};

var extend_variants = function (features) {
  /* Features example: http://3dbionotes.cnb.csic.es/?queryId=6w9c&viewer_type=ngl&button=#query
      0: (2) ["VARIATION", Array(7098)]
      Called twice from FeaturesViewer.js
  */
  /* From __external_data["biomuta"]
      http://3dbionotes.cnb.csic.es/api/annotations/biomuta/Uniprot/P0DTC2
      Perform in-place changes on features */
  add_biomuta(features);

  /* Process variants in the uploaded data (flag: uploaded_data, data: top.$UPLOADED_DATA) */
  add_uploaded_variants(features);

  /* Variant track has a button 'change filter: disease/consequence' (default: consequence)
      On disease mode, there is a list of diseases (global variable: diseases_table).
      This function fills that table.

      We don't have this toggle in protvista-pdb, but we can add a filter section */
  add_disease_menu(features);
  // add_man_cur_variants(features);
};

module.exports = {
  upgrade_fv: upgrade_fv,
  extend_features: extend_features,
  extend_variants: extend_variants,
  get_all_external_soruces: get_all_external_soruces,
  variant_menu: variant_menu,
  update_diseases: update_diseases,
  extend_categories: extend_categories,
  add_disease_menu: add_disease_menu,
  uploaded_data: uploaded_data,
  check_coordinates: check_coordinates,
  add_asa_residues: add_asa_residues,

  /* add_psa_interface. PSA = Protein Structure Analyser.
      Called from extendProtVista/get_all_external_soruces.js

      add_asa_residues:Track RESIDUE_ASA. Data from top.asa_residues. Is this used?
      add_binding_residues: Track INTERACTING_RESIDUES. Data from top.binding_residues. add_psa_interface.js
      add_molprobity: Track MOLPROBITY. Some complex processing of data.
  */

  /* extendProtVista/handle_async_data.js calls:
      add_mobi: Add disorder tracks (LINEAR_INTERACTING_PEPTIDE and others dynamically)
      add_dsysmap: Updates in-place colors and associations on variants data with refs to dSysMap DB
      add_elmdb: Adds track LINEAR_MOTIF
      add_interpro: Adds track INTERPRO_DOMAIN.
      add_smart: Adds track SMART_DOMAIN.
      add_pfam: Adds track PFAM_DOMAIN.
      add_pdb_redo: (example: 6w9c). Just maps the API response to the track. Track PDB-REDO.
  */

  /* Others:
      add_procheck: Adds track PROCHECK. Apparently, it's unused.
  */
};
