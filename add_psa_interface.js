"use strict";
var add_asa_residues = require('./add_asa_residues');
var add_binding_residues = require('./add_binding_residues');
var highlight_all = require('./highlight_all');
var add_highlight_all = highlight_all.add_highlight_all;


var add_psa_interface = function(){

  var $LOG = { 'protein':{}, 'gene':{}, 'interaction:':{} };
  if(top.$LOG){
    $LOG = top.$LOG;
  }

  var alignment = JSON.parse(getParameterByName("alignment"));
  var pdb = alignment['pdb'];
  var path = null;
  if('path' in alignment){
    path = alignment['path'];
  }
  if( top.$COMPUTED_FEATURES[pdb] ){
    top.binding_residues = top.$COMPUTED_FEATURES[pdb]['binding_residues'];
    top.asa_residues = top.$COMPUTED_FEATURES[pdb]['asa_residues'];
    var asa = add_asa_residues();
    var bs = add_binding_residues();
    if(bs){
      feature_viewer.drawCategories([asa,bs],feature_viewer);
      feature_viewer.data.push(asa);
      feature_viewer.data.push(bs);
    }else{
      feature_viewer.drawCategories([asa],feature_viewer);
      feature_viewer.data.push(asa);
    }
    if("n_sources" in $LOG.protein){
      $LOG.protein['n_sources']--;
      if($LOG.protein['n_sources']==0)remove_loading_icon();
    }
    add_highlight_all();
  }else{
    var interface_url = "/compute/biopython/interface/"+pdb;
    $LOG.protein['psa'] = {
      'description':'Computing ASA and binding sites data',
      'command':'GET '+interface_url,
      'statuns':'running'
    };
    if(path){
      interface_url = "/compute/biopython/interface/"+path+"/"+pdb.replace(".","__");
    }
    interface_url = encodeURI(interface_url);
    console.log("Loading "+interface_url);
    var t1 = performance.now();
    $j.ajax({
      url: interface_url,
      dataType: 'json',
      success: function(data){
        top.$COMPUTED_FEATURES[pdb] = {};
        top.binding_residues = data['interface'];
        top.$COMPUTED_FEATURES[pdb]['binding_residues'] = top.binding_residues;
        top.asa_residues = data['asa'];
        top.$COMPUTED_FEATURES[pdb]['asa_residues'] = top.asa_residues;
        var asa = add_asa_residues();
        var bs = add_binding_residues();
        if(bs){
          feature_viewer.drawCategories([asa,bs],feature_viewer);
          feature_viewer.data.push(asa);
          feature_viewer.data.push(bs);
        }else{
          feature_viewer.drawCategories([asa],feature_viewer);
          feature_viewer.data.push(asa);
        }
        add_highlight_all();
        $LOG.protein['psa']['status'] = 'success';
      },
      error: function(){
        top.binding_residues = null;
        top.asa_residues = null;
        $LOG.protein['psa']['status'] = 'error';
      }
    }).always(function(){
      var t2 = performance.now();
      var time_ = (t2-t1)/1000;
      console.log("Finished "+interface_url+" "+time_.toString().substring(0,4)+"s");
      if("n_sources" in $LOG.protein){
        $LOG.protein['n_sources']--;
        if($LOG.protein['n_sources']==0)remove_loading_icon();
      }
    });
  }
};

function remove_loading_icon(){
  $j("#annotations_loading_icon").remove();
}

function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

module.exports = add_psa_interface;

