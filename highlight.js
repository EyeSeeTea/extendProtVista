"use strict";

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
        fv.ready_flag = true;

	fv.__highlight = function(e){
		var fake_click = new MouseEvent("click");
		if (fv.selectedFeature && fv.selectedFeature.internalId == "fake_0"){
			if( document.getElementsByName("fake_0").lentgh>0){
				document.getElementsByName("fake_0")[0].dispatchEvent(fake_click);
			}else if( jQuery("[name=fake_0]").get(0) ){
				jQuery("[name=fake_0]").get(0).dispatchEvent(fake_click);
			}
		}
                if(!e['begin'] || !e['end']){
                  return;
                }
		fv.data.forEach(function(i){
			if(i[0]=="__fake"){
				i[1][0]['begin']=e['begin'];
				i[1][0]['end']=e['end'];
			}
		});
		if( document.getElementsByName("fake_0").lentgh>0){
			document.getElementsByName("fake_0")[0].dispatchEvent(fake_click);
                        document.getElementsByName("fake_0")[0].style.fill = e['color'];
		}else if( jQuery("[name=fake_0]").get(0) ){
                        $j("[name=fake_0]").css("fill",e['color']);
			$j("[name=fake_0]").get(0).dispatchEvent(fake_click);
		}

	}

	fv.getDispatcher().on("ready", function(o) {
		__hide_fake();
                $j(".up_pftv_icon-reset").click(function(){
                  trigger_aa_cleared();
                });
                fv.data.forEach(function(i){
                  if(i[0]=="INTERACTING_RESIDUES"){
                    IRD = i[1];
                  }else if(i[0]=="RESIDUE_ASA"){
                    ASA = i[1];
                  }
                });
                $j('#loading').css('display','none');
                variant_menu();
                if(fv.n_source == 4 && fv.ready_flag){
                  fv.ready_flag = false;
		  setTimeout(function(){ check_global_selection(); }, 300);
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

  console.log("tooltip_height "+tooltip_height);
  console.log("tooltip_x "+tooltip_x);

  var scroll_x = parseFloat( $j(window).scrollTop() );
  console.log("scroll_x "+scroll_x);
  var screen_height = parseFloat( document.body.clientHeight );
  console.log("screen_height "+screen_height);
  var screen_x = scroll_x + screen_height;
  console.log("screen_x "+screen_x);

  var delta = tooltip_x - screen_x;
  console.log("delta "+delta);
  if( delta > 0 ){
    top_css -= delta;
    $j(".up_pftv_tooltip-container").css('top', top_css+'px');
  }

}

module.exports = {add_highlight:add_highlight, setup_highlight:setup_highlight, check_coordinates:check_coordinates};
