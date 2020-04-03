"use strict";
var add_em_resolution = require('./add_em_resolution');
var highlight_all = require('./highlight_all');
var add_highlight_all = highlight_all.add_highlight_all;


var add_s_emres_interface = function(){

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

  // if( top.$COMPUTED_FEATURES[pdb] ){
  //
  //   top.em_resolution = JSON.parse(sData)
  //   var emres = add_em_resolution();
  //   feature_viewer.drawCategories([emres],feature_viewer);
  //   feature_viewer.data.push(emres);
  //
  //   if("n_sources" in $LOG.protein){
  //     $LOG.protein['n_sources']--;
  //     if($LOG.protein['n_sources']===0)remove_loading_icon();
  //   }
  //   add_highlight_all();
  // }else{

  // Query to WS when ready
  var interface_url = "/emresolutionUrl/"+pdb;
  $LOG.protein['emres'] = {
    'description':'Getting EM resolution',
    'command':'GET '+interface_url,
    'status':'running'
  };
  if(path){
    interface_url = "/compute/biopython/interface/"+path+"/"+pdb.replace(/\./g,"__");
  }
  interface_url = encodeURI(interface_url);
  console.log("%c Loading "+interface_url, 'color:#c60;');
  var t1 = performance.now();

  var emres = add_em_resolution();
  feature_viewer.drawCategories([emres],feature_viewer);
  feature_viewer.data.push(emres);

  add_highlight_all();
  $LOG.protein['emres']['status'] = 'success';
  // When WS ready
  // $j.ajax({
  //   url: interface_url,
  //   dataType: 'json',
  //   success: function(data){
  //     if(!top.$COMPUTED_FEATURES[pdb])top.$COMPUTED_FEATURES[pdb] = {};
  //     if("error" in data){
  //       top.em_resolution = null;
  //       $LOG.protein['psa']['status'] = 'error';
  //       var t2 = performance.now();
  //       var time_ = (t2-t1)/1000;
  //       console.log("%c Finished "+interface_url+" "+time_.toString().substring(0,4)+"s", 'color:red;');
  //       return;
  //     }
  //
  //     top.em_resolution = data['asa'];
  //     top.$COMPUTED_FEATURES[pdb]['em_resolution'] = top.em_resolution;
  //
  //     var asa = add_em_resolution();
  //     feature_viewer.drawCategories([asa],feature_viewer);
  //     feature_viewer.data.push(asa);
  //
  //     add_highlight_all();
  //     $LOG.protein['psa']['status'] = 'success';
  //   },
  //   error: function(){
  //     top.em_resolution = null;
  //     $LOG.protein['psa']['status'] = 'error';
  //   }
  // }).always(function(){
  //   var t2 = performance.now();
  //   var time_ = (t2-t1)/1000;
  //   if($LOG.protein['psa']['status'] === 'success')console.log("%c Finished "+interface_url+" "+time_.toString().substring(0,4)+"s", 'color:green;');
  //   $LOG.protein['psa']['cost'] = time_.toString().substring(0,4);
  //   if("n_sources" in $LOG.protein){
  //     $LOG.protein['n_sources']--;
  //     if($LOG.protein['n_sources']===0)remove_loading_icon();
  //   }
  // })
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

module.exports = add_s_emres_interface;

