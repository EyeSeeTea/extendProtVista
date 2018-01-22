"use strict";
var add_mobi = require('./add_mobi');
var add_dsysmap = require('./add_dsysmap');
var add_elmdb = require('./add_elmdb');
var add_interpro = require('./add_interpro');
var add_smart = require('./add_smart');
var add_pfam = require('./add_pfam');
var add_pdb_redo = require('./add_pdb_redo');
var highlight_all = require('./highlight_all');
var add_highlight_all = highlight_all.add_highlight_all;

var handle_async_data = {};

handle_async_data.dsysmap = function(data){
  var variations = $j.grep(feature_viewer.data,function(n,i){
    if(n[0]=="VARIATION")return true;
    return false;
  });
  if(variations.length > 0)add_dsysmap(data,variations[0][1]);
};

handle_async_data.elmdb = function(data){
  var category = $j.grep(feature_viewer.categories, function(n,i){if(n.name=="DOMAINS_AND_SITES")return true});
  var elm = add_elmdb(data);
  if( category.length>0 && elm.length>0){
    category[0].repaint(elm);
    add_highlight_all();
    $j.map(feature_viewer.data, function(n,i){
      if(n[0]=="DOMAINS_AND_SITES"){
        feature_viewer.data[i][1] = feature_viewer.data[i][1].concat(elm);
      }
    });
  }
};

handle_async_data.mobi = function(data){
    var disorder = add_mobi(data);
    feature_viewer.drawCategories([["DISORDERED_REGIONS",disorder]],feature_viewer);
    add_highlight_all();
    feature_viewer.data.push(["DISORDERED_REGIONS",disorder]);
};

handle_async_data.pdb_redo = function(data,pdb_chain,global_external_pdb_chain){
    var pdb_redo_data = null;
    if( !pdb_chain ){
      pdb_redo_data = add_pdb_redo.load(data);
    }else{
      pdb_redo_data = add_pdb_redo.save(data,pdb_chain,global_external_pdb_chain);
    }
    if(pdb_redo_data){
      feature_viewer.drawCategories([["PDB_REDO",pdb_redo_data]],feature_viewer);
      add_highlight_all();
      feature_viewer.data.push(["PDB_REDO",pdb_redo_data]);
    }
};

handle_async_data.Pfam = function(data){
  add_domain_family(data,"Pfam");
};

handle_async_data.smart = function(data){
  add_domain_family(data,"smart");
};

handle_async_data.interpro = function(data){
  add_domain_family(data,"interpro");
};

function add_domain_family(data,family){
  var _add_function = {
    'Pfam':function(d){
       return add_pfam(d);
     },
     'smart':function(d){
       return add_smart(d);
     },
     'interpro':function(d){
       return add_interpro(d);
     }
  };
  var category = $j.grep(feature_viewer.categories, function(n,i){if(n.name=="DOMAIN_FAMILIES")return true});
  var domains = _add_function[family](data);
  if( category.length>0 && domains.length>0){
    category[0].repaint(domains);
    add_highlight_all();
    $j.map(feature_viewer.data, function(n,i){
      if(n[0]=="DOMAIN_FAMILIES"){
        feature_viewer.data[i][1] = feature_viewer.data[i][1].concat(domains);
      }
    });
  }else if(domains.length>0){
    feature_viewer.drawCategories([["DOMAIN_FAMILIES",domains]],feature_viewer);
    add_highlight_all();
    feature_viewer.data.push(["DOMAIN_FAMILIES",domains]);
  }
};

module.exports = handle_async_data;
