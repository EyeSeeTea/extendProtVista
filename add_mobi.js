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
