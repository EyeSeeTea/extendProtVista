"use strict";

var add_pdb_redo = new function(){
  var self = this;
  self.load = function(data){
    return data;
  };

  self.save = function(data,pdb_chain,global_external_pdb_chain){
    var pdb = pdb_chain.slice(0, -2);
    for(var i in data){
      if( !(pdb+":"+i in global_external_pdb_chain) )global_external_pdb_chain[pdb+":"+i]={};
      global_external_pdb_chain[pdb+":"+i]['pdb_redo'] = data[i];
    }
    return global_external_pdb_chain[pdb_chain]['pdb_redo'];
  };

};

module.exports = add_pdb_redo;
