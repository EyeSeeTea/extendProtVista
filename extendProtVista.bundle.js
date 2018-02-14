require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var add_asa_residues = function (_n){
  var asa_res = null;
  if( !imported_flag && top.asa_residues ){
    var n_model = top.n_model_main_frame-1;
    if(_n)n_model = _n-1;
    var asa_res = ["RESIDUE_ASA",[]]; 
    var n = 1;
    for(var i = 0;i<__alignment.uniprotLength+1;i++){
      var __f = { type: "VARIANT", pos: i, variants: [] };
      asa_res[1].push(__f);
      n++;     
    }
    var chain = JSON.parse(  getParameterByName('alignment') )['chain'];
    if(top.asa_residues[n_model][chain]){
      var n = 0;
      top.asa_residues[n_model][chain].forEach(function(i){
        var r = parseInt(i[1]*255);
        if(r>255)r=255;
        var b = 255-r;
        if(b<0)b = 0;
        var color = 'rgb('+r+',0,'+b+')';
        var rasa = parseFloat(i[1]*100).toFixed(2);
        if(asa_res[1][ parseInt(i[0]) ]){
          asa_res[1][ parseInt(i[0]) ].variants = [{ color:color, 
                                                     alternativeSequence:'', 
                                                     type:'measure', 
                                                     begin: i[0], 
                                                     end: i[0], 
                                                     score:i[1], 
                                                     internalId:'asa_'+n, 
                                                     description:'<b style=\"color:grey;\">Relative accessible surface area</b><br/>Residue accesibility '+rasa+'%'
          }];
        }
        n++;
      });
    }
  }
  return asa_res;
};

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

module.exports = add_asa_residues;

},{}],2:[function(require,module,exports){
"use strict";

var add_binding_residues = function(_n){
  var b_res = null;
  if( !imported_flag && top.binding_residues && top.binding_residues[0] > 0 ){
    var n_model = top.n_model_main_frame;
    if(_n) n_model = _n;
    b_res = ["INTERACTING_RESIDUES",[]]; 
    var n = 1;
    for(var i = 0;i<top.binding_residues[0];i++){
      var __f = {begin:(-100-1*i),end:(-100-1*i),internalId:'bs_'+n,type:'INTERACTING_RESIDUES',description:'<b style=\"color:grey;\">Binding Site</b><br/>Region that interacts with other proteins in the complex'};
      b_res[1].push(__f)
      n++;     
    }
    var chain = JSON.parse(  getParameterByName('alignment') )['chain'];
    var n = 0;
    if(top.binding_residues[n_model][chain]){
      top.binding_residues[n_model][chain].forEach(function(i){
        b_res[1][n].begin = i.begin;
        b_res[1][n].end = i.end;
        n++;
      });
    }else{
      b_res = null;
    }
  }
  return b_res;
};

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

module.exports = add_binding_residues;

},{}],3:[function(require,module,exports){
"use strict";

var add_biomuta  =  function(__d){
	var d = __d[0][1];
	var n = 1;
	if(__external_data['biomuta']){
		__external_data['biomuta'].forEach(function(i){
			if( !d[ i['start'] ] ) return;
			var __aux = jQuery.grep(d[ i['start'] ]['variants'],function(j){ return(j['alternativeSequence']==i['variation']) });
			var __mut = __aux[0];
			if( __mut ){
                                if(__mut.sourceType=="large_scale_study") __mut["color"] = "#FF0000";
				if(!__mut['association'])__mut['association']=[];
				var __src = __mut['association'];
				var __pubmed = i['evidence'][0]['references'][0].substr(7);
				var __name = i['disease'];
				if(i['disease'].indexOf("/")>-1){
					__name = i['disease'].substr(i['disease'].indexOf("/")+2).split(" \[")[0]
				}
				__name = __name.charAt(0).toUpperCase() + __name.slice(1);

				var __polyphen = " - Polyphen: "+i['polyphen'].replace("possibly","probably");

				var __aux = jQuery.grep(__src,function(k){return(k['name']==__name)});
				if(__aux.length==0 && __pubmed.indexOf(';')<0 ) __src.push({
					disease:true,
					name:__name,
					xrefs:[{id:__pubmed,name:'BioMuta DB'+__polyphen,url:'http://www.ncbi.nlm.nih.gov/pubmed/'+__pubmed}]
				});
				if(__mut['association'].length == 0) __mut['association'] = null;
			}else{
                                variants_extended = true;
				var __new_mut = {
					internalId:"bm_"+n,
					type: "VARIANT",
					sourceType:"large_scale_study",
					wildType: i['original'],
					alternativeSequence:i['variation'],
					begin:i['start'],
					end:i['start'],
					association:[],
                                        color:"#FF0000"
				};

				var __src = __new_mut['association'];
				var __pubmed = i['evidence'][0]['references'][0].substr(7);
				var __name = i['disease'];

				if(i['disease'].indexOf("/")>-1){
					__name = i['disease'].substr(i['disease'].indexOf("/")+2).split(" \[")[0]
				}
				__name = __name.charAt(0).toUpperCase() + __name.slice(1);

				var __polyphen = " - Polyphen: "+i['polyphen'].replace("possibly","probably");

				var __aux = jQuery.grep(__src,function(k){return(k['name']==__name)});
				if(__aux.length==0 && __pubmed.indexOf(';')<0 ) __src.push({
					disease:true,
					name:__name,
					xrefs:[{id:__pubmed,name:'BioMuta DB'+__polyphen,url:'http://www.ncbi.nlm.nih.gov/pubmed/'+__pubmed}]
				});
				if( __pubmed.indexOf(';')<0 ) d[ i['start'] ]['variants'].push( __new_mut );
				n++;
			}
		});
	}
};

module.exports = add_biomuta;

},{}],4:[function(require,module,exports){
"use strict";

var add_coverage = function(d){
	var n = 1;
	if(__external_data['coverage'] && __external_data['coverage']['Structure coverage']){
		var __coverage = ["STRUCTURE_COVERAGE",[]]
		__external_data['coverage']['Structure coverage'].forEach(function(i){
			__coverage[1].push({begin:i['start'],end:i['end'],description:'Sequence segment covered by the structure',internalId:'coverage_'+n,type:'region'});
			n++;
		});
		d.push( __coverage );
	}
};

module.exports = add_coverage;

},{}],5:[function(require,module,exports){
"use strict";

var add_dbptm  =  function(d){
	var n = 1;
	if(__external_data['dbptm']){
		var __ptm = ["PTM",[]];
		var __ptm_flag = 1;
		d.forEach(function(i){
			if(i[0]=="PTM"){
				__ptm = i;
				__ptm_flag = 0;
			}
		});
		__external_data['dbptm'].forEach(function(i){
			var __aux = jQuery.grep(__ptm[1],function(e){ return (e.begin == i['start'] && e.end == i['end']); });
			if( __aux.length > 0 ){
				var __flag = null;
				__aux.forEach(function(j){
					var i_t = i['type'].toLowerCase();
					var j_t = j['description'].toLowerCase();
					if( 	
						( i_t == j_t ) || 
						( i_t.indexOf("phospho")>-1 && j_t.indexOf("phospho")>-1 ) || 
						( i_t.indexOf("nitros")>-1 && j_t.indexOf("nitros")>-1 ) ||
						( i_t.indexOf("palmi")>-1 && j_t.indexOf("palmi")>-1 ) ||
						( i_t.indexOf("methyl")>-1 && j_t.indexOf("methyl")>-1 ) ||
						( i_t.indexOf("ubiquit")>-1 && j_t.indexOf("ubiquit")>-1 ) ||
						( i_t.indexOf("acetyl")>-1 && j_t.indexOf("acetyl")>-1 ) ||
                                                ( i_t.indexOf("glyco")>-1 && j_t.indexOf("glcnac")>-1 ) ||
                                                ( i_t.indexOf("sumo")>-1 && j_t.indexOf("sumo")>-1 )||
						( (i_t.indexOf("prenyl")>-1 || i_t.indexOf("farnesyl")>-1) && (j_t.indexOf("prenyl")>-1 || j_t.indexOf("farnesyl")>-1) )
					){
						__flag = j;
					}
				});
				if(__flag){
					var __aux = jQuery.grep(__ptm[1],function(e){ return (e.begin == i['start'] && e.end == i['end']); });
                                        if( ! __flag['evidences'] ) __flag['evidences']={};
					if( ! __flag['evidences']['ECO:0000269'] ) __flag['evidences']['ECO:0000269']=[];
					var __evs = __flag['evidences']['ECO:0000269'];
					var pubmed_ids = i['evidences'].split(";");
					pubmed_ids.forEach(function(ii){
						var __ids =  jQuery.grep(__evs,function(e){ return ( ii == e['id'] ); });
						if(__ids.length == 0) __evs.push({
							id:ii,
							name:'PubMed',
							url:'http://www.ncbi.nlm.nih.gov/pubmed/'+ii,
							alternativeUrl:'http://europepmc.org/abstract/MED/'+ii
						});
					});
				}else{
					var __d = {
						begin:i['start'],
						end:i['end'],
						description:i['type'],
						internalId:'dbptm_'+n,
						type:'MOD_RES',
						evidences:{
							'ECO:0000269':[]
						}
					};
					var __evs = __d['evidences']['ECO:0000269'];
					var pubmed_ids = i['evidences'].split(";");
					pubmed_ids.forEach(function(ii){
						var __ids =  jQuery.grep(__evs,function(e){ return ( ii == e['id'] ); });
						if(__ids.length == 0) {
                                                  __d['evidences']['ECO:0000269'].push({
								id:i['evidences'],
								name:'PubMed',
								url:'http://www.ncbi.nlm.nih.gov/pubmed/'+i['evidences'],
								alternativeUrl:'http://europepmc.org/abstract/MED/'+i['evidences']
						  });
                                                }
					});
					__ptm[1].push(
						__d
					);
					n++;
				}
			}else{
				var __d = {
					begin:i['start'],
					end:i['end'],
					description:i['type'],
					internalId:'dbptm_'+n,
					type:'MOD_RES',
					evidences:{
						'ECO:0000269':[]
					}
				};
				var __evs = __d['evidences']['ECO:0000269'];
				var pubmed_ids = i['evidences'].split(";");
				pubmed_ids.forEach(function(ii){
					var __ids =  jQuery.grep(__evs,function(e){ return ( ii == e['id'] ); });
					if(__ids.length == 0) __d['evidences']['ECO:0000269'].push({
							id:i['evidences'],
							name:'PubMed',
							url:'http://www.ncbi.nlm.nih.gov/pubmed/'+i['evidences'],
							alternativeUrl:'http://europepmc.org/abstract/MED/'+i['evidences']
					});
				});
				__ptm[1].push(
					__d
				);
				n++;
			}
		});
		if(__ptm_flag)d.push( __ptm );
	}
};

module.exports = add_dbptm;


},{}],6:[function(require,module,exports){
"use strict";

var add_dsysmap = function (data,d){
  data.forEach(function(i){
  	if( !d[ i['start'] ] ) return;
  	var _aux = jQuery.grep(d[ i['start']] ['variants'],function(j){ return(j['alternativeSequence']==i['variation']) });
  	var _mut = _aux[0];
  	if( _mut ){
                  if(_mut.sourceType=="large_scale_study") _mut["color"] = "#FF0000";
  		if(!_mut['association'])_mut['association']=[];
  		var _src = _mut['association'];
  		var _name = i['disease']['text'];
  		_src.push({
  			disease:true,
  			name:_name,
  			xrefs:[{id:__accession,name:'dSysMap DB',url:'http://dsysmap.irbbarcelona.org/results.php?type=proteins&neigh=0&value='+__accession}]
  		});
  	}
  });
};

module.exports = add_dsysmap;

},{}],7:[function(require,module,exports){
"use strict;"

var add_elmdb = function(data){
  var n = 1;
  var _elm = [];
  data.forEach(function(i){
  	var _description = 'Short linear motif ('+i['description'][0]['Regex']+')';
  	var _ext_des = {};
  	i['interactions'].forEach(function(j){
  		var key = '<b>Interactor:</b> '+j['interactorDomain']+' <b>Domain:</b> '+j['Domain'];
  		if(j['StartDomain'] != 'None' && j['StopDomain'] != 'None'){
  			key += ' <b>Start:</b> '+j['StartDomain']+' <b>End:</b> '+j['StopDomain']+'<br/>';
  		}else{
  			key += '<br/>'
  		}
  		_ext_des[key] = true;
  	});
  	var _ext = Object.keys(_ext_des);
  	if(_ext.length>0)_description = _description+'<br/>'+_ext.join("");
  	
  	var _f = {begin:i['Start'],end:i['End'],description:_description,internalId:'elm_'+n,type:'region',evidences:
  		{
  			"Imported information":[{url:'http://elm.eu.org/elms/'+i['ELMIdentifier'],id:i['ELMIdentifier'],name:'Imported from ELM'}]
  		}
  	}
  	_f['evidences']['ECO:0000269'] = [];
  	i['References'].split(" ").forEach(function(j){
  		_f['evidences']['ECO:0000269'].push({
  			id:j,
  			name:'PubMed',url:'http://www.ncbi.nlm.nih.gov/pubmed/'+j,
  			alternativeUrl:'http://europepmc.org/abstract/MED/'+j
  		});
  	});
  	_f['type'] = 'LINEAR_MOTIF'
  	_elm.push(_f);
  	n++;
  });
  return _elm;
};

module.exports = add_elmdb;

},{}],8:[function(require,module,exports){
"use strict";

var uniprot_link = {
  'DOMAINS_AND_SITES':'family_and_domains',
  'MOLECULE_PROCESSING':'ptm_processing',
  'DOMAIN':'domainsAnno_section',
  'REGION':'Region_section',
  'BINDING':'sitesAnno_section',
  'PROPEP':'peptides_section',
  'CHAIN':'peptides_section',
  'CARBOHYD':'aaMod_section',
  'DISULFID':'aaMod_section',
  'MOD_RES':'aaMod_section',
  'CROSSLNK':'aaMod_section',
  'LIPID':'aaMod_section',
  'CONFLICT':'Sequence_conflict_section',
  'NP_BIND':'regionAnno_section',
  'MOTIF':'Motif_section',
  'REPEAT':'domainsAnno_section',
  'METAL':'sitesAnno_section',
  'DNA_BIND':'regionAnno_section',
  'SITE':'Site_section',
  'SIGNAL':'sitesAnno_section',
  'ACT_SITE':'sitesAnno_section'
};

var add_evidences = function(d){
  d.forEach(function(i){
    i[1].forEach(function(j){
      if( !('evidences' in j) ){
        //console.log( j['type']+"=>"+uniprot_link[ j['type'] ]);
        j['evidences'] =  {"Imported information":[{url:'http://www.uniprot.org/uniprot/'+__accession+'#'+uniprot_link[ j['type'] ],id:__accession,name:'Imported from UniProt'}]};
      }else{
        for(var k in j['evidences']){
          j['evidences'][k].forEach(function(l){
             //console.log( j['type']+"=>"+uniprot_link[ j['type'] ]);
             if( l == undefined ){
               j['evidences'][k] = [{url:'http://www.uniprot.org/uniprot/'+__accession+'#'+uniprot_link[ j['type'] ],id:__accession,name:'Imported from UniProt'}];
             }
          });
        }
      }
    });
  });
};

module.exports = add_evidences;

},{}],9:[function(require,module,exports){
"use strict";

var add_iedb = function(d){
	var n = 1;
	if(__external_data['iedb']){
		var __epitopes = ["EPITOPES",[]];
		__external_data['iedb'].forEach(function(i){
			__epitopes[1].push({type:'LINEAR_EPITOPE',begin:i['start'],end:i['end'],description:'Linear epitope',internalId:'iedb_'+n,evidences:
				{
					"Imported information":[{url:'http://www.iedb.org/epitope/'+i['evidence'],id:i['evidence'],name:'Imported from IEDB'}]
				}
			});
			n++;
		});
		d.push( __epitopes );
	}
};

module.exports =  add_iedb;


},{}],10:[function(require,module,exports){
"use strict";

var add_interpro = function (data){
  var n = 1;
  var _interpro = [];
  
  data.forEach(function(i){
  	var k = i['description']['name'];
  	var _description = '<b>'+k+'</b>';
  	var _ext = '';
  	if( i['description']['go'] ){
  		_ext = '<b style="color:grey;">GO terms</b><br/>'
  		i['description']['go'].forEach(function(j){
  			var r = j.split(' ; ');
  			var go = r[0].replace("GO:","");
  			go = go[0].toUpperCase() + go.slice(1);
  			_ext += "<a href=\"http://amigo.geneontology.org/amigo/term/"+r[1]+"\" target=\"_blank\">"+go+"</a><br/>";
  		});
  	}
  	if( _ext.length > 0 ) _description += '<br/>'+_ext;
  	var _f = {begin:i['start'],end:i['end'],description:_description,internalId:'interpro_'+n,type:'INTERPRO_DOMAIN',evidences:
  		{
  			"Imported information":[{url:'https://www.ebi.ac.uk/interpro/protein/'+__accession,id:__accession,name:'Imported from InterPro'}]
  		}
  	}
  	_interpro.push(_f);
  	n++;
  });
  return _interpro;
};


module.exports = add_interpro;

},{}],11:[function(require,module,exports){
"use strict";

var add_mobi =  function(data){
  var n = 1;
  var _disorder = [];
  var _flag = false;
  for(var i in data){
  	var _type = i.toUpperCase();
  	data[i].forEach(function(j){
  		_disorder.push({type:_type,begin:j['start'],end:j['end'],description:'Disordered region',internalId:'mobi_'+n,evidences:
  			{
  				"Imported information":[{url:'http://mobidb.bio.unipd.it/entries/'+__accession, id:__accession, name:'Imported from MobyDB'}]
  			}
  		});
  		n++;
                  _flag = true;
  	});
  }
   return _disorder;
};

module.exports = add_mobi;

},{}],12:[function(require,module,exports){
"use strict";
var highlight_all = require('./highlight_all');
var add_highlight_all = highlight_all.add_highlight_all;


var add_molprobity = function(){

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
  if( top.$COMPUTED_FEATURES[pdb] && top.$COMPUTED_FEATURES[pdb]['molprobity'] ){

      var n_model = top.n_model_main_frame-1;
      var chain = JSON.parse(  getParameterByName('alignment') )['chain'];

      var data = [];
      var rama = top.$COMPUTED_FEATURES[pdb]['molprobity']['rama'][n_model][chain]
      if(rama && rama.length >0) data =  data.concat(rama);
      var omega = top.$COMPUTED_FEATURES[pdb]['molprobity']['omega'][n_model][chain]
      if(omega && omega.length >0) data =  data.concat(omega);
      var rota= top.$COMPUTED_FEATURES[pdb]['molprobity']['rota'][n_model][chain]
      if(rota && rota.length >0) data =  data.concat(rota);

      if(data && data.length >0){
        var molprobity = ["MOLPROBITY",data];
        feature_viewer.drawCategories([molprobity],feature_viewer);
        feature_viewer.data.push(molprobity);
        add_highlight_all();       
      }

      if("n_sources" in $LOG.protein){
        $LOG.protein['n_sources']--;
        if($LOG.protein['n_sources']==0)remove_loading_icon();
      }

  }else{
    var url = "/compute/molprobity/"+pdb;
    if(path){
      url = "/compute/molprobity/"+path;
    }
    $LOG.protein['molprobity'] = {
      'description':'Computing ASA and binding sites data',
      'command':'GET '+url,
      'statuns':'running'
    };
    url = encodeURI(url);
    console.log("Loading "+url);
    var t1 = performance.now();
    var recursive_get = function(){
      $j.ajax({
        url: url,
        dataType: 'json',
        success: function(data){
          if(data['status']=='complete'){
            if(!top.$COMPUTED_FEATURES[pdb]) top.$COMPUTED_FEATURES[pdb] = {};
            top.$COMPUTED_FEATURES[pdb]['molprobity'] = data;
            var n_model = top.n_model_main_frame-1;
            var chain = JSON.parse(  getParameterByName('alignment') )['chain'];
            var data =[];
            var rama = top.$COMPUTED_FEATURES[pdb]['molprobity']['rama'][n_model][chain]
            if(rama && rama.length >0) data =  data.concat(rama);
            var omega = top.$COMPUTED_FEATURES[pdb]['molprobity']['omega'][n_model][chain]
            if(omega && omega.length >0) data =  data.concat(omega);
            var rota= top.$COMPUTED_FEATURES[pdb]['molprobity']['rota'][n_model][chain]
            if(rota && rota.length >0) data =  data.concat(rota);
            if(data && data.length >0){
              var molprobity = ["MOLPROBITY",data];
              try{
                feature_viewer.drawCategories([molprobity],feature_viewer);
                feature_viewer.data.push(molprobity);
                add_highlight_all();
                $LOG.protein['molprobity']['status'] = 'success';
              }catch(err){
                console.log(err);
                $LOG.protein['molprobity']['status'] = 'error';
              }
            }
            var t2 = performance.now();
            var time_ = (t2-t1)/1000;
            console.log("Finished "+url+" "+time_.toString().substring(0,4)+"s");
            if("n_sources" in $LOG.protein){
              $LOG.protein['n_sources']--;
              if($LOG.protein['n_sources']==0)remove_loading_icon();
            }
          }else{
            setTimeout(function(){ recursive_get(); }, 5000);
          }
        },
        error: function(){
          $LOG.protein['molprobity']['status'] = 'error';
          var t2 = performance.now();
          var time_ = (t2-t1)/1000;
          console.log("Finished "+url+" "+time_.toString().substring(0,4)+"s");
          if("n_sources" in $LOG.protein){
            $LOG.protein['n_sources']--;
            if($LOG.protein['n_sources']==0)remove_loading_icon();
          }
        }
      });
    }
    recursive_get();
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

module.exports = add_molprobity;


},{"./highlight_all":27}],13:[function(require,module,exports){
"use strict";

var add_pdb_redo = new function(){
  var self = this;
  self.load = function(data){
    return data;
  };

  self.save = function(data,pdb_chain,global_external_pdb_chain){
    var pdb = pdb_chain.slice(0, -2);
    var ch = pdb_chain.substr(pdb_chain.length - 1);
    if( !(pdb+":"+ch in global_external_pdb_chain) )global_external_pdb_chain[pdb+":"+ch]={};
    global_external_pdb_chain[pdb+":"+ch]['pdb_redo'] = data[ch];
    return global_external_pdb_chain[pdb_chain]['pdb_redo'];
  };

};

module.exports = add_pdb_redo;

},{}],14:[function(require,module,exports){
"use strict";

var add_pfam = function(data){
  var n = 1;
  var _pfam = [];
  
  data.forEach(function(i){
  	var _description = '<b>'+i['info']['description']+'</b>';
         _description += '<br/><b style="color:grey;">Family</b>: '+i['acc']
  	var _ext = '';
  	for(var k in i['info']['go']){
  		_ext += '<b style="color:grey;">'+k[0].toUpperCase() + k.slice(1)+'</b>: ';
  		i['info']['go'][k].forEach(function(j){
  			_ext += j+', '; 
  		});
  		_ext = _ext.slice(0, -2)+'<br/>';
  	}
  	if( _ext.length > 0 ) _description += '<br/>'+_ext;
  	var _f = {begin:i['start'],end:i['end'],description:_description,internalId:'pfam_'+n,type:'PFAM_DOMAIN',evidences:
  		{
  			"Imported information":[{url:'http://pfam.xfam.org/protein/'+__accession,id:__accession,name:'Imported from Pfam'}]
  		}
  	}
  	_pfam.push(_f);
  	n++;
  });
  return _pfam;
};

module.exports = add_pfam;

},{}],15:[function(require,module,exports){
"use strict";

var add_phosphosite = function(d){
	var n = 1;
	if(__external_data['phosphosite']){
		var __ptm = ["PTM",[]];
		var __sites = ["DOMAINS_AND_SITES",[]];
		var __ptm_flag = 1;
		var __sites_flag = 1;
		d.forEach(function(i){
			if(i[0]=="PTM"){
				__ptm = i;
				__ptm_flag = 0;
			}
			if(i[0]=="DOMAINS_AND_SITES"){
				__sites = i;
				__sites_flag = 0;
			}
		});
		__external_data['phosphosite'].forEach(function(i){
			if( i['subtype'] == "Regulatory site" || i['subtype'] == "Sustrate-Kinase interaction" || i['subtype'] == "Diseases-associated site" ){
				var __aux = i['description'].split(";;");
				var __description = "<b style=\"color:grey;\">"+i['subtype']+"</b> <br>";
				__aux.forEach(function(k){
					var __r = k.split(":");
					if( __r[1] && __r[1].length>1 )__description += "<b style=\"color:grey;\">"+ __r[0]+"</b>: "+__r[1].replace("("," (")+". <br>";
				});
				__description.substring(0, __description.length - 4);
				var __label = 'SITE';
				if(i['subtype'] == "Sustrate-Kinase interaction"){
					__label = 'BINDING';
				}

                                var __aux = jQuery.grep(__sites[1],function(e){ return (e.begin == i['start'] && e.end == i['end']); });
                                if( __aux.length > 0 ){
                                  __aux[0]['description'] += "<hr/>"+__description;
                                  var __evd = [];
                                  try{
                                    var import_inf = __aux[0]['evidences']['Imported information'];
                                    __evd = jQuery.grep(import_inf,function(e){return (e["name"].indexOf("PhosphoSitePlus")!=-1);});
                                  }catch(err){
                                    if(!'evidences' in __aux[0]){
                                      __aux[0]['evidences'] = {};
                                      __aux[0]['evidences']['Imported information']=[];
                                    }else{
                                      __aux[0]['evidences']['Imported information']=[];
                                    }
                                    console.log(err);
                                  }
                                  if(__evd.length == 0){
                                    __aux[0]['evidences']["Imported information"].push({
						url:'http://www.phosphosite.org/uniprotAccAction.do?id='+__accession,id:__accession,name:'Imported from PhosphoSitePlus'
				    });
                                  }
                                }else{
				  __sites[1].push({begin:i['start'],end:i['end'],description:__description,internalId:'ppsp_'+n,type:__label,evidences:
					{
						"Imported information":[{url:'http://www.phosphosite.org/uniprotAccAction.do?id='+__accession,id:__accession,name:'Imported from PhosphoSitePlus'}]
					}
				  });
                                }
				n++;
			}else{
				var __aux = jQuery.grep(__ptm[1],function(e){ return (e.begin == i['start'] && e.end == i['end']); });
				if( __aux.length > 0 ){
					var __flag = null;
					__aux.forEach(function(j){
					        var i_t = i['subtype'].toLowerCase();
					        var j_t = j['description'].toLowerCase();

						if( (i_t == j_t) ||
                                                    (i_t.indexOf("phospho")>-1 && j_t.indexOf("phospho")>-1)||
                                                    (i_t.indexOf("glcnac")>-1 && j_t.indexOf("glcnac")>-1)||
						    (i_t.indexOf("nitros")>-1 && j_t.indexOf("nitros")>-1)||
						    (i_t.indexOf("palmi")>-1 && j_t.indexOf("palmi")>-1)||
						    (i_t.indexOf("methyl")>-1 && j_t.indexOf("methyl")>-1)||
						    (i_t.indexOf("ubiquit")>-1 && j_t.indexOf("ubiquit")>-1)||
						    (i_t.indexOf("acetyl")>-1 && j_t.indexOf("acetyl")>-1)||
                                                    (i_t.indexOf("glyco")>-1 && j_t.indexOf("glcnac")>-1)||
                                                    (i_t.indexOf("sumo")>-1 && j_t.indexOf("sumo")>-1)||
						    ((i_t.indexOf("prenyl")>-1 || i_t.indexOf("farnesyl")>-1) && (j_t.indexOf("prenyl")>-1 || j_t.indexOf("farnesyl")>-1))

                                                  ){
							__flag = j;
						}
					});
					if(__flag){
						var __aux = jQuery.grep(__ptm[1],function(e){ return (e.begin == i['start'] && e.end == i['end']); });
                                                if( ! __flag['evidences']) __flag['evidences'] = {};
						if( ! __flag['evidences']["Imported information"] ) __flag['evidences']["Imported information"]=[];
						__flag['evidences']["Imported information"].push(
								{url:'http://www.phosphosite.org/uniprotAccAction.do?id='+__accession,id:__accession,name:'Imported from PhosphoSitePlus'}
							);
					}else{
						__ptm[1].push({begin:i['start'],end:i['end'],description:i['subtype'],internalId:'ppsp_'+n,type:'MOD_RES',evidences:
							{
								"Imported information":[{url:'http://www.phosphosite.org/uniprotAccAction.do?id='+__accession,id:__accession,name:'Imported from PhosphoSitePlus'}]
							}
						});
						n++;
					}
				}else{
					__ptm[1].push({begin:i['start'],end:i['end'],description:i['subtype'],internalId:'ppsp_'+n,type:'MOD_RES',evidences:
						{
							"Imported information":[{url:'http://www.phosphosite.org/uniprotAccAction.do?id='+__accession,id:__accession,name:'Imported from PhosphoSitePlus'}]
						}
					});
					n++;
				}
			}
		});
		if(__ptm_flag)d.push( __ptm );
		if(__sites_flag)d.push( __sites );
	}
};

module.exports = add_phosphosite;

},{}],16:[function(require,module,exports){
"use strict";
var add_asa_residues = require('./add_asa_residues');
var add_binding_residues = require('./add_binding_residues');
var highlight_all = require('./highlight_all');
var add_molprobity = require('./add_molprobity');
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
    if( top.$COMPUTED_FEATURES[pdb]['molprobity'] )add_molprobity();
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
        if(!top.$COMPUTED_FEATURES[pdb])top.$COMPUTED_FEATURES[pdb] = {};

        top.binding_residues = data['interface'];
        top.$COMPUTED_FEATURES[pdb]['binding_residues'] = top.binding_residues;

        top.asa_residues = data['asa'];
        top.$COMPUTED_FEATURES[pdb]['asa_residues'] = top.asa_residues;

        top.rri_residues = data['rri'];
        top.$COMPUTED_FEATURES[pdb]['rri'] = data['rri'];

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
      add_molprobity();
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


},{"./add_asa_residues":1,"./add_binding_residues":2,"./add_molprobity":12,"./highlight_all":27}],17:[function(require,module,exports){
"use strict";

var add_sequence_coverage = function(d){
	var n = 1;
	if( imported_flag ){
		var __coverage = ["SEQUENCE_COVERAGE",[]]
		imported_alignment.coverage.forEach(function(i){
			__coverage[1].push({begin:i['begin'],end:i['end'],description:'Segment covered by the original protein <a target="_blank" href="http://www.uniprot.org/uniprot/'+__alignment.original_uniprot+'">'+__alignment.original_uniprot+'</a>',internalId:'seq_coverage_'+n,type:'region'});
			n++;
		});
		d.push( __coverage );
	}
};

module.exports = add_sequence_coverage;

},{}],18:[function(require,module,exports){
"use strict";

var add_smart = function(data){
  var n = 1;
  var _smart = [];
  
  data.forEach(function(i){
  	var k = i['domain'].replace("_"," ");
  	k = k[0].toUpperCase() + k.slice(1);
  	var _description = '<b>'+k+'</b>';
  	var _ext = '<b style="color:grey;">Type</b>: '+i['type'][0]+i['type'].slice(1).toLowerCase();
  
  	if( _ext.length > 0 ) _description += '<br/>'+_ext;
  	var _f = {begin:i['start'],end:i['end'],description:_description,internalId:'smart_'+n,type:'SMART_DOMAIN',evidences:
  		{
  			"Imported information":[{url:'http://smart.embl.de/smart/batch.pl?INCLUDE_SIGNALP=1&IDS='+__accession,id:__accession,name:'Imported from SMART'}]
  		}
  	}
  	_smart.push(_f);
  	n++;
  });
  return _smart;
};

module.exports = add_smart;

},{}],19:[function(require,module,exports){
"use strict";

var continuous_data = require("./continuous_data");

var uploaded_data = null;
if(top.upload_flag && !imported_flag){
  uploaded_data = true;
}

var add_uploaded_data = function(d){
  if(uploaded_data){
    prepare_uploaded_data();
    $j.each(uploaded_data,function( track_name, data ) {
      d.push( [track_name,data] );
    });
  }
};

function prepare_uploaded_data(){
  var PDBchain = __alignment.pdb+":"+__alignment.chain;
  PDBchain = PDBchain.replace("_dot_",".");
  var uniprot = __alignment.uniprot;
  uploaded_data = {};

  var aux = [ ["PDBchain",PDBchain], ["acc",uniprot]  ];

  aux.forEach(function( i ){
    if( top.$UPLOADED_DATA[ i[0] ][ i[1] ] ){
      $j.each( top.$UPLOADED_DATA[ i[0] ][ i[1] ], function( track_name, info ) {
        if(info.visualization_type=="continuous"){
          uploaded_data[ track_name ] = continuous_data(info.data);
        }else{
          if(!uploaded_data[track_name]){
            uploaded_data[track_name] = info.data;
          }else{
            uploaded_data[track_name] = uploaded_data[track_name].concat( info.data );
          }
        }
      });
    }
  });
} 

module.exports = { add_uploaded_data:add_uploaded_data, uploaded_data:uploaded_data };

},{"./continuous_data":21}],20:[function(require,module,exports){
"use strict";

var variant_menu = function (){
  $j('.up_pftv_icon-location').remove();
  $j('.up_pftv_inner-icon-container a').css('cursor','pointer');
  $j('.up_pftv_inner-icon-container a').click(function(i){
    $j('.active_disease').each(function(i){
      $j(this).removeClass("active_disease");
      $j(this).addClass("unactive_disease");
      var k = $j(this).attr("title");
      $j(this).html("&#9675; "+k);
      my_variant_viewer.reset();
    });
  });
  $j('.up_pftv_inner-icon-container a').before("<a class=\"up_pftv_icon-button up_pftv_icon-location variant_std_menu\" style=\"cursor:pointer;\" title=\"Change filter: disease/cosequence\"></a>");
  $j(".variant_std_menu").click(function(i){
    if( $j(this).hasClass("variant_std_menu") ){
      $j(this).removeClass("variant_std_menu");
      $j(this).addClass("variant_disease_menu");
      $j(".up_pftv_diseases").css("display","inline-block");
    }else if( $j(this).hasClass("variant_disease_menu") ){
      $j(this).removeClass("variant_disease_menu");
      $j(this).addClass("variant_std_menu");
      $j('.active_disease').each(function(i){
        $j(this).removeClass("active_disease");
        $j(this).addClass("unactive_disease");
        var k = $j(this).attr("title");
        $j(this).html("&#9675; "+k);
      });
      my_variant_viewer.reset();
      $j(".up_pftv_diseases").css("display","none");
    }
  });
  $j(".up_pftv_category_VARIATION .up_pftv_track-header").css('position','relative')
  $j(".up_pftv_category_VARIATION .up_pftv_track-header").append("<div class=\"up_pftv_diseases\"><h4>Diseases</h4><div></div></div>");
  Object.keys(diseases_table).sort().forEach(function(k){
    if(k!="none")$j('.up_pftv_diseases div').append("<span class=\"disease_item unactive_disease\" title=\""+k+"\">&#9675; "+k+"</span><br/>");
  });
  $j('.disease_item').click(function(){show_diseases(this)});
};

var update_diseases = function(){
  var D = [];
  $j('.active_disease').each(function(){
    D.push( $j(this).attr('title') );
  }); 
  if( D.length == 0 ) return;
  var keep_variants = {}
  D.forEach( function(i){
    diseases_table[i].forEach(function(j){
      keep_variants[ j.internalId ] = true;
    });
  });
  $j('.up_pftv_category_VARIATION .up_pftv_variant').each(function(i){
    if(!keep_variants[ $j(this).attr("name") ])$j(this).remove();
  });
};

function show_diseases(d){
  if(d){
    var k = $j(d).attr("title");
    if( $j(d).hasClass("unactive_disease") ){
      $j(d).removeClass("unactive_disease");
      $j(d).addClass("active_disease");
      $j(d).html("&#9679; "+k);
    }else if( $j(d).hasClass("active_disease") ){
      $j(d).removeClass("active_disease");
      $j(d).addClass("unactive_disease");
      $j(d).html("&#9675; "+k);
    }
  }
  
  var D = [];
  $j('.active_disease').each(function(){
    D.push( $j(this).attr('title') );
  });
  filter_by_disease( D );

}

var add_disease_menu = function(__d){
  var d = __d[0][1]; 
  d.forEach(function(i){
    i.variants.forEach(function(j){
      if(j.association){
        j.association.forEach(function(k){
          if(!diseases_table[k.name]) diseases_table[k.name]=[];
          diseases_table[k.name].push(j);
        });
      }else{
        diseases_table['none'].push(j);
      }
    });
  });
};

function filter_by_disease( D ){
  my_variant_viewer.reset();
  if( D.length == 0 ) return;
  var keep_variants = {}
  D.forEach( function(i){
    diseases_table[i].forEach(function(j){
      keep_variants[ j.internalId ] = true;
    });
  });
  $j('.up_pftv_category_VARIATION .up_pftv_variant').each(function(i){
    if(!keep_variants[ $j(this).attr("name") ])$j(this).remove();
  });
}

module.exports = { variant_menu:variant_menu, update_diseases:update_diseases, add_disease_menu:add_disease_menu };

},{}],21:[function(require,module,exports){
"use strict";

var n = 1;
var continuous_data = function (d){
    var out = [];
    for(var i = 0;i<__alignment.uniprotLength+1;i++){
      var __f = { type: "VARIANT", pos: i, variants: [] };
      out.push(__f);
      n++;     
    }
    var n = 0;
    var max = -1000000000;
    var min = 1000000000;
    d.forEach(function(i){
      var x = parseFloat(i.value);
      if(x>max)max=x;
      if(x<min)min=x;
    });
    d.forEach(function(i){
      var x = parseFloat(i.value);
      var r = parseInt( 255*(x-min)/(max-min) );
      if(r>255)r=255;
      var b = 255-r;
      if(b<0)b = 0;
      var color = 'rgb('+r+',0,'+b+')';
      if(out[ i.begin ])out[ i.begin ].variants = [{color:color, alternativeSequence:'', type:'measure', begin: i.begin, end:i.begin, score:i.value, internalId:'measure_'+n, description:'' }];
      n++;
    });
    return out;
};

module.exports = continuous_data;

},{}],22:[function(require,module,exports){
"use strict";

var extend_categories = function(categories){
  var PDBchain = __alignment.pdb+":"+__alignment.chain;
  PDBchain = PDBchain.replace("_dot_",".");
  var uniprot = __alignment.uniprot;
   if(uploaded_data){
     var aux = [ ["PDBchain",PDBchain], ["acc",uniprot]  ];
     aux.forEach(function( i ){
       if( top.$UPLOADED_DATA[ i[0] ][ i[1] ] ){
         $j.each( top.$UPLOADED_DATA[ i[0] ][ i[1] ], function( track_name, info ) {
           if(info.visualization_type=="continuous") categories.unshift({name:track_name, label:track_name, visualizationType:"continuous"});
         });
       }
     });
  } 
};

module.exports = extend_categories;

},{}],23:[function(require,module,exports){
"use strict";
var handle_async_data = require('./handle_async_data');
var add_psa_interface = require('./add_psa_interface');
//var add_molprobity = require('./add_molprobity');

var listURL;
var $EXTERNAL_DATA = null;

if(top.$EXTERNAL_DATA && !imported_flag){
  $EXTERNAL_DATA = top.$EXTERNAL_DATA;
}else if(top.$IMPORTED_DATA && imported_flag){
  $EXTERNAL_DATA = top.$IMPORTED_DATA;
}else{
  $EXTERNAL_DATA = {'PDBchain':{},'acc':{}};
}

var $LOG = { 'protein':{}, 'gene':{}, 'interaction:':{} };
if(top.$LOG){
  $LOG = top.$LOG;
}


function get_async_data( URL, d ){
  var query = URL.shift();

  var url = query[1];
  var key = query[0];
  var save_flag = query[2];

  var acc = __alignment.uniprot;
  var external_data_key = 'acc';
  if(!save_flag){
    acc = key;
    key = __alignment.pdb+":"+__alignment.chain;
    external_data_key = 'PDBchain';
  }

  if( key in $EXTERNAL_DATA[external_data_key] && acc in $EXTERNAL_DATA[external_data_key][key] ){
    var async_data = $EXTERNAL_DATA[external_data_key][key][acc];
    if(key in handle_async_data)handle_async_data[key](async_data);
    if("n_sources" in $LOG.protein){
      $LOG.protein['n_sources']--;
      if($LOG.protein['n_sources']==0)remove_loading_icon();
    }
    if(URL.length > 0){
      get_async_data(URL);
      return;
    }
  }else{
    $LOG.protein[key] = {
      'description':'Loading '+key.toUpperCase(),
      'command':'GET '+url,
      'status':'running'
    };
    var t1 = performance.now();
    console.log("Loading "+url);
    $j.ajax({
      url: url,
      dataType: 'json',
      timeout:30000,
      success: function(async_data){
        if( !(key in $EXTERNAL_DATA[external_data_key]) )$EXTERNAL_DATA[external_data_key][key] = {};
        if(save_flag){
          $EXTERNAL_DATA[external_data_key][key][acc] = async_data;
          if(key in handle_async_data) handle_async_data[key](async_data);
        }else{
          if(acc in handle_async_data) handle_async_data[acc](async_data,key,$EXTERNAL_DATA[external_data_key]);
        }
        $LOG.protein[key]['status'] = 'success';
      },
      error: function(e){
        console.log("ajax error");
        console.log(e);
        $LOG.protein[key]['status'] = 'error';
      }
    }).always(function(){
      if(URL.length > 0){
        get_async_data( URL, d );
      }
      var t2 = performance.now();
      var time_ = (t2-t1)/1000;
      $LOG.protein[key]['cost'] = time_.toString().substring(0,4);
      console.log("Finished "+url+" "+time_.toString().substring(0,4)+"s");
      if("n_sources" in $LOG.protein){
        $LOG.protein['n_sources']--;
        if($LOG.protein['n_sources']==0)remove_loading_icon();
      }
    });
  }
}

function add_loading_icon(){
  $j($j(".up_pftv_buttons").get(0)).prepend("<img title=\"LOADING DATA\" id=\"annotations_loading_icon\"src=\"/images/loading_em.gif\" style=\"cursor:help;position:absolute;left:10px;top:10px;\"/>");
}

function remove_loading_icon(){
  $j("#annotations_loading_icon").remove();
}


var get_all_async_soruces = function(){
  var acc = __accession;
  var key = __alignment.pdb+":"+__alignment.chain;

  add_loading_icon();
  $LOG.protein['n_sources'] = asyncURL.length;

  listURL = asyncURL;
  var __allURL = listURL.slice(0);
  if(!imported_flag){
    $LOG.protein['n_sources'] += 2;
    add_psa_interface();
    //add_molprobity();
  }
  get_async_data(__allURL, __external_data);
};

module.exports = get_all_async_soruces;

},{"./add_psa_interface":16,"./handle_async_data":25}],24:[function(require,module,exports){
"use strict";

var listURL;
var $EXTERNAL_DATA = null;

if(top.$EXTERNAL_DATA && !imported_flag){
  $EXTERNAL_DATA = top.$EXTERNAL_DATA;
}else if(top.$IMPORTED_DATA && imported_flag){
  $EXTERNAL_DATA = top.$IMPORTED_DATA;
}else{
  $EXTERNAL_DATA = {'PDBchain':{},'acc':{}};
}

function wait_message(message){
    if($j(".jsonp_info").length){
    $j('.jsonp_info').html("<div>"+message+"<br/>PLEASE WAIT<br/><br/><img src=\"/images/loading_em.gif\"/></div>");
  }else{
    $j('body').append("<div class=\"filter_screen\"></div><div class=\"jsonp_info\" ><div>"+message+"<br/>PLEASE WAIT<br/><br/><img src=\"/images/loading_em.gif\"/></div></div>");
  }
}

function clear_wm(){
  $j(".filter_screen").remove();
  $j(".jsonp_info").remove();
}

function get_external_data( URL, d ){
  var query = URL.shift();
  var url = query[1];
  var key = query[0];
  var save_flag = query[2];
  wait_message( "COLLECTING <span style=\"color:black\">"+key.toUpperCase()+"</span> "+(listURL.length-URL.length)+" / "+listURL.length );
  if( $EXTERNAL_DATA && key in $EXTERNAL_DATA['acc'] && __alignment.uniprot in $EXTERNAL_DATA['acc'][key] ){
    d[key] = $EXTERNAL_DATA['acc'][key][__alignment.uniprot];
    if(URL.length > 0){
      get_external_data( URL, d );
      return;
    }else{
      clear_wm();
      var key = __alignment.pdb+":"+__alignment.chain;
      if(imported_flag)key += ":"+__accession;
      $EXTERNAL_DATA['PDBchain'][ key ] = d;
      build_ProtVista();
      return;
    }
  }else{
    $j.ajax({
      url: url,
      dataType: 'json',
      timeout:30000,
      success: function(data){
        d[key] = data;
        if( save_flag ){
          if(!$EXTERNAL_DATA['acc'][key])$EXTERNAL_DATA['acc'][key] = {};
          $EXTERNAL_DATA['acc'][key][__alignment.uniprot] = data;
        }
      },
      error: function(e){
        console.log("ajax error");
        console.log(e);
      }
    }).always(function(){
      if(URL.length > 0){
        get_external_data( URL, d );
        return;
      }else{
        clear_wm();
        var key = __alignment.pdb+":"+__alignment.chain;
        if(imported_flag)key += ":"+__accession;
        $EXTERNAL_DATA['PDBchain'][ key ] = d;
        build_ProtVista();
        return;
      }
    });
  }
}

var get_all_external_soruces = function( ){
  var acc = __accession;
  var key = __alignment.pdb+":"+__alignment.chain;
  listURL = allURL;
  if(imported_flag)key += ":"+acc
  if( $EXTERNAL_DATA && key in $EXTERNAL_DATA['PDBchain'] ){
    __external_data = $EXTERNAL_DATA['PDBchain'][ key ];
    clear_wm();
    build_ProtVista();
  }else{
    var __allURL = listURL.slice(0);
    get_external_data(__allURL, __external_data);
  }
};

module.exports = get_all_external_soruces;

},{}],25:[function(require,module,exports){
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

},{"./add_dsysmap":6,"./add_elmdb":7,"./add_interpro":10,"./add_mobi":11,"./add_pdb_redo":13,"./add_pfam":14,"./add_smart":18,"./highlight_all":27}],26:[function(require,module,exports){
"use strict";
var highlight_all = require('./highlight_all');
var add_highlight_all = highlight_all.add_highlight_all;
var get_all_async_soruces = require('./get_all_async_soruces');

var add_highlight = function(d){
	var __fake= ['__fake',[{
				'begin':1,
				'end':1,
				'internalId':'fake_0',
				'type': 'region'
		}]];
	d.push(__fake);
};

var setup_highlight  =  function(fv){

	fv.__highlight = function(e){
                if(!e['begin'] || !e['end']){
                  return;
                }
		fv.data.forEach(function(i){
			if(i[0]=="__fake"){
				i[1][0]['begin']=e['begin'];
				i[1][0]['end']=e['end'];
			}
		});

		var fake_click = new MouseEvent("click");
		if (fv.selectedFeature && fv.selectedFeature.internalId == "fake_0"){
			if( document.getElementsByName("fake_0").lentgh>0){
			  document.getElementsByName("fake_0")[0].dispatchEvent(fake_click);
			}else if( $j("[name=fake_0]").get(0) ){
			  $j("[name=fake_0]").get(0).dispatchEvent(fake_click);
			}
		}

		if( document.getElementsByName("fake_0").lentgh>0){
			document.getElementsByName("fake_0")[0].dispatchEvent(fake_click);
                        document.getElementsByName("fake_0")[0].style.fill = e['color'];
		}else if( $j("[name=fake_0]").get(0) ){
                        $j("[name=fake_0]").css("fill",e['color']);
			$j("[name=fake_0]").get(0).dispatchEvent(fake_click);
		}
                //instance.highlightRegion(e['begin'],e['end'])

	}

	fv.getDispatcher().on("ready", function(obj) {
		__hide_fake();
                $j('#loading').css('display','none');
                variant_menu();
                add_highlight_all();
                if(obj == "load_ready"){
		  setTimeout(function(){ check_global_selection(); }, 600);
                  setTimeout(function(){ get_all_async_soruces(); }, 300);
                }
	});
};

function __hide_fake(){
	var aTags = document.getElementsByTagName("a");
	var searchText = "__fake";
	var found;
	for (var i=0;i<aTags.length;i++) {
  		if (aTags[i].title == searchText) {
    			found = aTags[i];
    			break;
  		}
	}
	if( found != undefined ) found.parentNode.style.display = "none";
	var classDOM = document.getElementsByClassName("up_pftv_buttons");
	var observer = new MutationObserver(__hide_eye);
	observer.observe(classDOM[0],{childList:true});
}

function __hide_eye(a,b,c) {
	var aTags = a[0]['target'].getElementsByTagName("label");
	var searchText = "__fake";
	var found;
	for (var i=0;i<aTags.length;i++) {
  		if (aTags[i].innerHTML == searchText) {
    			found = aTags[i];
    			break;
  		}
	}
	if( found != undefined ) found.parentNode.style.display = "none";
}

var check_coordinates = function(){

  var left_css = parseFloat($j(".up_pftv_tooltip-container").css('left'));
  if (left_css > 300)$j(".up_pftv_tooltip-container").css('left','300px');
  
  var tooltip_height = parseFloat($j(".up_pftv_tooltip-container").height())+6+2;
  var frame_x  = parseFloat( $j(".up_pftv_tooltip-container").parent().offset().top );
  var top_css = parseFloat($j(".up_pftv_tooltip-container").css('top'));
  var tooltip_x = frame_x + top_css + tooltip_height;

  var scroll_x = parseFloat( $j(window).scrollTop() );
  var screen_height = parseFloat( document.body.clientHeight );
  var screen_x = scroll_x + screen_height;

  var delta = tooltip_x - screen_x;
  if( delta > 0 ){
    top_css -= delta;
    $j(".up_pftv_tooltip-container").css('top', top_css+'px');
  }

}

module.exports = {add_highlight:add_highlight, setup_highlight:setup_highlight, check_coordinates:check_coordinates};

},{"./get_all_async_soruces":23,"./highlight_all":27}],27:[function(require,module,exports){
"use strict";

function add_highlight_all(){
  $j(".up_pftv_track-header").each(function(i){
    if( $j( $j(".up_pftv_track-header").get(i) ).children(".highlight_all").length == 0 && $j( $j(".up_pftv_track-header").get(i) ).children(".up_pftv_buttons").length == 0 ){
      var text =  $j( $j(".up_pftv_track-header").get(i) ).html();
      $j( $j(".up_pftv_track-header").get(i) ).html("<span style=\"cursor:pointer;\" class=\"highlight_all\">"+text+"</span>");

      $j( $j(".up_pftv_track-header").get(i) ).children(".highlight_all").mouseover(function(){
        $j(this).css('color','#1293B3');
        $j(this).append('<span class=\"nbsp\">&nbsp;</span><span class=\"fa fa-eye\"></span>');
      });

      $j( $j(".up_pftv_track-header").get(i) ).children(".highlight_all").mouseout(function(){
        $j(this).css('color','');
        $j(this).children('.fa-eye').remove();
        $j(this).children('.nbsp').remove();
      });

      $j( $j(".up_pftv_track-header").get(i) ).children(".highlight_all").click(function(){
        var track = $j( this ).parent().parent().parent().find(".up_pftv_category-name").attr("title");
        var features = $j.grep( feature_viewer.data, function( n, i){
          if(n[0]==track)return true;
          return false;
        })[0][1];
        var lane = $j( this ).parent().next().find(".up_pftv_feature");
        var display = []
        lane.each(function(i){
          var name = $j(lane.get(i)).attr("name");
          var color = $j(lane.get(i)).css("fill");
          var grep = $j.grep( features, function(n,i){
            if(n['internalId'] == name)return true;
            return false;
          })[0];
          grep['color'] = color;
          display.push(grep);
        });
        trigger_event(display);
      });
    }
  });

}

function trigger_event(selection){
  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent("highlight_all",true,true,selection);
  top.window.dispatchEvent(evt);
}

module.exports = {add_highlight_all:add_highlight_all};

},{}],28:[function(require,module,exports){
"use strict";

var max_zoom = function (fv){
	fv.maxZoomSize = 59;
};

module.exports = max_zoom;


},{}],29:[function(require,module,exports){
"use strict";

var rebuild_ptm = function(d){
	var __ptm = ["",[]];
	d.forEach(function(i){
			if(i[0]=="PTM"){
				__ptm = i;
			}

	});
	__ptm[1].forEach(function(i){
		var i_t = i['description'].toLowerCase();

		if( i_t.indexOf("methyl")>-1 ){
			i['type'] = 'MOD_RES_MET';

		}else if( i_t.indexOf("acetyl")>-1 ){
			i['type'] = 'MOD_RES_ACE';

		}else if( i_t.indexOf("crotonyl")>-1 ){
			i['type'] = 'MOD_RES_CRO';

		}else if( i_t.indexOf("citrul")>-1 ){
			i['type'] = 'MOD_RES_CIT';

		}else if( i_t.indexOf("phospho")>-1 ){
			i['type'] = 'MOD_RES_PHO';

		}else if( i_t.indexOf("ubiq")>-1 ){
			i['type'] = 'MOD_RES_UBI';

		}else if( i_t.indexOf("sumo")>-1 ){
			i['type'] = 'MOD_RES_SUM';
		}else if( i_t.indexOf("glcnac")>-1 ){
			i['type'] = 'CARBOHYD';
		}
	});
};

module.exports = rebuild_ptm;


},{}],30:[function(require,module,exports){
"use strict";

var rename_structural_features = function(d){
	if( "structural" in d){
		d['structural']['label'] = "UniProt Secondary Structure Data";
	}
};

module.exports = rename_structural_features;

},{}],"extendProtVista":[function(require,module,exports){
"use strict";

var max_zoom = require('./max_zoom');
var extend_categories = require('./extend_categories');
var __add_uploaded_data = require('./add_uploaded_data');
var add_uploaded_data = __add_uploaded_data.add_uploaded_data;
var uploaded_data = __add_uploaded_data.uploaded_data;
var get_all_external_soruces = require('./get_all_external_soruces');
var build_variant_menu = require('./build_variant_menu');
var variant_menu = build_variant_menu.variant_menu;
var update_diseases = build_variant_menu.update_diseases;
var add_disease_menu = build_variant_menu.add_disease_menu;
var add_evidences = require('./add_evidences');
var add_asa_residues = require('./add_asa_residues');
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

var extend_features =  function(features){
        features_extended = true;
	add_evidences(features);
	add_iedb(features);
	add_coverage(features);
        add_sequence_coverage(features);
	add_phosphosite(features);
	add_dbptm(features);
	rebuild_ptm(features);
        add_uploaded_data(features);
	add_highlight(features);
};

var extend_variants = function(features){
	add_biomuta(features);
        add_disease_menu(features);
};

module.exports = { 
  upgrade_fv:upgrade_fv, 
  extend_features:extend_features, 
  extend_variants:extend_variants, 
  get_all_external_soruces:get_all_external_soruces,
  variant_menu:variant_menu,
  update_diseases:update_diseases,
  extend_categories:extend_categories,
  add_disease_menu:add_disease_menu,
  uploaded_data:uploaded_data,
  check_coordinates:check_coordinates,
  add_binding_residues:add_binding_residues,
  add_asa_residues:add_asa_residues
};


},{"./add_asa_residues":1,"./add_binding_residues":2,"./add_biomuta":3,"./add_coverage":4,"./add_dbptm":5,"./add_evidences":8,"./add_iedb":9,"./add_phosphosite":15,"./add_sequence_coverage":17,"./add_uploaded_data":19,"./build_variant_menu":20,"./extend_categories":22,"./get_all_external_soruces":24,"./highlight":26,"./max_zoom":28,"./rebuild_ptm":29,"./rename_structural_features":30}]},{},[]);
